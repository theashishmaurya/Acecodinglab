/**
 * Anti-Cheat Detection System
 * Monitors for suspicious behavior during interviews
 */

export interface AntiCheatConfig {
  enabled: boolean;
  strictMode: boolean;
  tabSwitchThreshold: number; // Max allowed tab switches
  copyPasteAllowed: boolean;
  devToolsDetection: boolean;
  fullscreenRequired: boolean;
  webcamRequired: boolean;
  audioMonitoring: boolean;
  typingAnalysis: boolean;
  onViolation?: (event: AntiCheatEvent) => void;
}

export interface AntiCheatEvent {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  details?: Record<string, any>;
  screenshot?: string;
}

export interface AntiCheatState {
  violations: AntiCheatEvent[];
  trustScore: number;
  isActive: boolean;
  tabSwitches: number;
  copyPasteEvents: number;
  typingPatterns: number[];
}

type AntiCheatEventType = 
  | 'tab_switch'
  | 'copy_paste'
  | 'devtools_open'
  | 'fullscreen_exit'
  | 'right_click'
  | 'keyboard_shortcut'
  | 'window_blur'
  | 'external_paste'
  | 'unusual_typing_pattern';

const DEFAULT_CONFIG: AntiCheatConfig = {
  enabled: true,
  strictMode: false,
  tabSwitchThreshold: 3,
  copyPasteAllowed: false,
  devToolsDetection: true,
  fullscreenRequired: false,
  webcamRequired: false,
  audioMonitoring: false,
  typingAnalysis: true,
};

export class AntiCheatSystem {
  private config: AntiCheatConfig;
  private state: AntiCheatState;
  private cleanupFns: (() => void)[] = [];
  private keystrokeTimestamps: number[] = [];
  private typingTimeout: NodeJS.Timeout | null = null;

  constructor(config: Partial<AntiCheatConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = {
      violations: [],
      trustScore: 100,
      isActive: false,
      tabSwitches: 0,
      copyPasteEvents: 0,
      typingPatterns: [],
    };
  }

  /**
   * Start monitoring for cheat events
   */
  start(): void {
    if (!this.config.enabled) return;

    this.state.isActive = true;
    this.attachEventListeners();
    
    if (this.config.fullscreenRequired) {
      this.requestFullscreen();
    }
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    this.state.isActive = false;
    this.cleanup();
  }

  /**
   * Get current state
   */
  getState(): AntiCheatState {
    return { ...this.state };
  }

  /**
   * Get trust score (0-100)
   */
  getTrustScore(): number {
    return this.state.trustScore;
  }

  /**
   * Get all violations
   */
  getViolations(): AntiCheatEvent[] {
    return [...this.state.violations];
  }

  /**
   * Check if monitoring is active
   */
  isMonitoring(): boolean {
    return this.state.isActive;
  }

  /**
   * Attach all event listeners
   */
  private attachEventListeners(): void {
    // Tab visibility change
    const handleVisibilityChange = () => {
      if (document.hidden && this.state.isActive) {
        this.recordEvent('tab_switch', 'medium', {
          previousUrl: document.referrer,
        });
        this.state.tabSwitches++;
        
        if (this.state.tabSwitches >= this.config.tabSwitchThreshold) {
          this.recordEvent('excessive_tab_switches', 'high', {
            count: this.state.tabSwitches,
          });
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    this.cleanupFns.push(() => 
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    );

    // Copy/Paste detection
    const handleCopy = (e: ClipboardEvent) => {
      if (!this.config.copyPasteAllowed && this.state.isActive) {
        e.preventDefault();
        this.recordEvent('copy_paste', 'medium', {
          type: 'copy',
          content: e.clipboardData?.getData('text')?.substring(0, 100),
        });
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      if (!this.config.copyPasteAllowed && this.state.isActive) {
        e.preventDefault();
        this.recordEvent('copy_paste', 'high', {
          type: 'paste',
          contentLength: e.clipboardData?.getData('text')?.length,
        });
        this.state.copyPasteEvents++;
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    this.cleanupFns.push(() => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    });

    // Right-click prevention
    const handleContextMenu = (e: MouseEvent) => {
      if (this.config.strictMode && this.state.isActive) {
        e.preventDefault();
        this.recordEvent('right_click', 'low', {
          x: e.clientX,
          y: e.clientY,
        });
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    this.cleanupFns.push(() => 
      document.removeEventListener('contextmenu', handleContextMenu)
    );

    // Keyboard shortcuts detection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!this.state.isActive) return;

      // Detect common cheating shortcuts
      const cheatShortcuts = [
        { keys: ['F12'], name: 'devtools_f12' },
        { keys: ['Control', 'Shift', 'I'], name: 'devtools_ctrl_shift_i' },
        { keys: ['Control', 'Shift', 'J'], name: 'devtools_ctrl_shift_j' },
        { keys: ['Control', 'Shift', 'C'], name: 'devtools_ctrl_shift_c' },
        { keys: ['Control', 'U'], name: 'view_source' },
        { keys: ['Control', 'S'], name: 'save_page' },
      ];

      for (const shortcut of cheatShortcuts) {
        if (this.matchesShortcut(e, shortcut.keys)) {
          e.preventDefault();
          this.recordEvent('keyboard_shortcut', 'medium', {
            shortcut: shortcut.name,
            keys: shortcut.keys,
          });
          break;
        }
      }

      // Typing analysis
      if (this.config.typingAnalysis) {
        this.analyzeTyping(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    this.cleanupFns.push(() => 
      document.removeEventListener('keydown', handleKeyDown)
    );

    // Window blur (switching apps)
    const handleBlur = () => {
      if (this.state.isActive) {
        this.recordEvent('window_blur', 'medium', {
          timestamp: Date.now(),
        });
      }
    };
    window.addEventListener('blur', handleBlur);
    this.cleanupFns.push(() => 
      window.removeEventListener('blur', handleBlur)
    );

    // Fullscreen change detection
    const handleFullscreenChange = () => {
      if (this.config.fullscreenRequired && 
          !document.fullscreenElement && 
          this.state.isActive) {
        this.recordEvent('fullscreen_exit', 'high', {
          wasRequired: true,
        });
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    this.cleanupFns.push(() => 
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    );

    // DevTools detection (basic)
    if (this.config.devToolsDetection) {
      this.detectDevTools();
    }
  }

  /**
   * Check if keyboard event matches shortcut
   */
  private matchesShortcut(e: KeyboardEvent, keys: string[]): boolean {
    const pressed: string[] = [];
    if (e.ctrlKey) pressed.push('Control');
    if (e.shiftKey) pressed.push('Shift');
    if (e.altKey) pressed.push('Alt');
    if (e.metaKey) pressed.push('Meta');
    if (e.key && !['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
      pressed.push(e.key.toUpperCase());
    }
    
    return JSON.stringify(pressed.sort()) === JSON.stringify(keys.sort());
  }

  /**
   * Analyze typing patterns for anomalies
   */
  private analyzeTyping(e: KeyboardEvent): void {
    const now = Date.now();
    this.keystrokeTimestamps.push(now);

    // Keep only last 50 keystrokes
    if (this.keystrokeTimestamps.length > 50) {
      this.keystrokeTimestamps.shift();
    }

    // Calculate typing speed
    if (this.keystrokeTimestamps.length >= 10) {
      const intervals = [];
      for (let i = 1; i < this.keystrokeTimestamps.length; i++) {
        intervals.push(this.keystrokeTimestamps[i] - this.keystrokeTimestamps[i - 1]);
      }
      
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((sum, val) => 
        sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;

      // Very consistent typing (low variance) might indicate copy-paste or bot
      // Very inconsistent typing might indicate external help
      if (avgInterval < 30 && variance < 50) {
        // Suspiciously consistent and fast
        this.recordEvent('unusual_typing_pattern', 'high', {
          avgInterval,
          variance,
          indicator: 'suspiciously_consistent',
        });
      }
    }
  }

  /**
   * Detect DevTools (basic detection)
   */
  private detectDevTools(): void {
    const threshold = 160;
    
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        if (this.state.isActive) {
          this.recordEvent('devtools_open', 'high', {
            widthDiff: window.outerWidth - window.innerWidth,
            heightDiff: window.outerHeight - window.innerHeight,
          });
        }
      }
    };

    const interval = setInterval(checkDevTools, 1000);
    this.cleanupFns.push(() => clearInterval(interval));
  }

  /**
   * Request fullscreen mode
   */
  private async requestFullscreen(): Promise<void> {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.warn('Could not enter fullscreen:', err);
    }
  }

  /**
   * Record a violation event
   */
  private recordEvent(
    type: AntiCheatEventType,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details?: Record<string, any>
  ): void {
    const event: AntiCheatEvent = {
      type,
      severity,
      timestamp: new Date(),
      details,
    };

    this.state.violations.push(event);
    this.updateTrustScore(event);
    this.config.onViolation?.(event);
  }

  /**
   * Update trust score based on violation
   */
  private updateTrustScore(event: AntiCheatEvent): void {
    const penalties = {
      low: 2,
      medium: 5,
      high: 15,
      critical: 30,
    };

    this.state.trustScore = Math.max(0, 
      this.state.trustScore - penalties[event.severity]
    );
  }

  /**
   * Cleanup all event listeners
   */
  private cleanup(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
  }
}

/**
 * React hook for anti-cheat
 */
export function useAntiCheat(config: Partial<AntiCheatConfig> = {}) {
  const [state, setState] = React.useState<AntiCheatState>({
    violations: [],
    trustScore: 100,
    isActive: false,
    tabSwitches: 0,
    copyPasteEvents: 0,
    typingPatterns: [],
  });

  const systemRef = React.useRef<AntiCheatSystem | null>(null);

  React.useEffect(() => {
    systemRef.current = new AntiCheatSystem({
      ...config,
      onViolation: (event) => {
        setState(prev => ({
          ...prev,
          violations: [...prev.violations, event],
          trustScore: systemRef.current?.getTrustScore() ?? prev.trustScore,
        }));
        config.onViolation?.(event);
      },
    });

    return () => {
      systemRef.current?.stop();
    };
  }, []);

  const start = React.useCallback(() => {
    systemRef.current?.start();
    setState(prev => ({ ...prev, isActive: true }));
  }, []);

  const stop = React.useCallback(() => {
    systemRef.current?.stop();
    setState(prev => ({ ...prev, isActive: false }));
  }, []);

  return {
    ...state,
    start,
    stop,
    isMonitoring: state.isActive,
  };
}

import React from 'react';