'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, Loader2, AlertCircle, Sparkles } from 'lucide-react';

interface HintPanelProps {
  challengeId: string;
  challengeDescription: string;
  currentCode: string;
  onHintUsed?: (level: number, hint: string) => void;
}

interface Hint {
  level: number;
  text: string;
  timestamp: Date;
}

const LEVEL_CONFIG = {
  1: {
    label: 'Direction Hint',
    description: 'Points you in the right direction',
    color: 'yellow',
    icon: '💡',
  },
  2: {
    label: 'Implementation Hint',
    description: 'More specific guidance with code snippet',
    color: 'orange',
    icon: '🔧',
  },
  3: {
    label: 'Detailed Hint',
    description: 'Core algorithm with edge cases',
    color: 'red',
    icon: '🎯',
  },
};

export function HintPanel({
  challengeId,
  challengeDescription,
  currentCode,
  onHintUsed,
}: HintPanelProps) {
  const [hints, setHints] = useState<Hint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number>(50);
  const [expanded, setExpanded] = useState(true);

  const currentLevel = hints.length + 1;
  const canRequestHint = currentLevel <= 3 && remaining > 0;

  // Load existing hints on mount
  useEffect(() => {
    async function loadHints() {
      try {
        const response = await fetch(`/api/ai/hints?challengeId=${challengeId}`);
        if (response.ok) {
          const data = await response.json();
          setHints(data.hints.map((h: any) => ({
            level: h.level,
            text: h.hint_text,
            timestamp: new Date(h.created_at),
          })));
        }
      } catch (err) {
        console.error('Failed to load hints:', err);
      }
    }
    
    loadHints();
  }, [challengeId]);

  const requestHint = useCallback(async () => {
    if (!canRequestHint || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/hints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          challenge: challengeDescription,
          currentCode,
          level: currentLevel,
          previousHints: hints.map(h => h.text),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate hint');
      }

      const data = await response.json();
      
      const newHint: Hint = {
        level: currentLevel,
        text: data.hint,
        timestamp: new Date(),
      };

      setHints(prev => [...prev, newHint]);
      setRemaining(data.remainingRequests);
      onHintUsed?.(currentLevel, data.hint);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get hint');
    } finally {
      setLoading(false);
    }
  }, [canRequestHint, loading, challengeId, challengeDescription, currentCode, currentLevel, hints, onHintUsed]);

  return (
    <div className="hint-panel">
      <div className="hint-header" onClick={() => setExpanded(!expanded)}>
        <div className="header-left">
          <Lightbulb className="hint-icon" size={18} />
          <h3>Need a Hint?</h3>
          {hints.length > 0 && (
            <span className="hint-count">{hints.length}/3 used</span>
          )}
        </div>
        <div className="header-right">
          {remaining < 10 && (
            <span className="remaining-warning">{remaining} left</span>
          )}
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {expanded && (
        <div className="hint-content">
          {error && (
            <div className="hint-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {hints.length === 0 && (
            <div className="hint-empty">
              <Sparkles size={24} />
              <p>Stuck? Get a hint to point you in the right direction!</p>
              <p className="hint-info">
                Hints are progressive: Level 1 gives direction, Level 3 gives details.
              </p>
            </div>
          )}

          {hints.map((hint, index) => {
            const config = LEVEL_CONFIG[hint.level as keyof typeof LEVEL_CONFIG];
            return (
              <div key={index} className={`hint-item level-${hint.level}`}>
                <div className="hint-item-header">
                  <span className="level-badge" style={{ backgroundColor: `var(--color-${config.color})` }}>
                    {config.icon} Level {hint.level}
                  </span>
                  <span className="level-label">{config.label}</span>
                </div>
                <p className="hint-text">{hint.text}</p>
                <span className="hint-time">
                  {hint.timestamp.toLocaleTimeString()}
                </span>
              </div>
            );
          })}

          {canRequestHint ? (
            <button
              className="get-hint-btn"
              onClick={requestHint}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="spinner" size={16} />
                  Thinking...
                </>
              ) : (
                <>
                  <Lightbulb size={16} />
                  Get {hints.length === 0 ? 'a' : 'another'} hint
                  {hints.length > 0 && ` (Level ${currentLevel})`}
                </>
              )}
            </button>
          ) : hints.length >= 3 ? (
            <p className="hint-limit">You've used all 3 hints for this challenge.</p>
          ) : (
            <p className="hint-limit">No more hints available right now.</p>
          )}

          <p className="hint-disclaimer">
            💡 Hints don't give away the solution - they guide your thinking.
          </p>
        </div>
      )}

      <style jsx>{`
        .hint-panel {
          background: var(--bg-secondary, #f9fafb);
          border: 1px solid var(--border, #e5e7eb);
          border-radius: 12px;
          overflow: hidden;
          font-size: 0.875rem;
        }

        .hint-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          cursor: pointer;
          background: var(--bg-tertiary, #f3f4f6);
          border-bottom: 1px solid var(--border, #e5e7eb);
          transition: background 0.2s;
        }

        .hint-header:hover {
          background: var(--bg-hover, #e5e7eb);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .hint-icon {
          color: var(--primary, #3b82f6);
        }

        .hint-header h3 {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .hint-count {
          font-size: 0.75rem;
          color: var(--text-muted, #6b7280);
          background: var(--bg, white);
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .remaining-warning {
          font-size: 0.75rem;
          color: #f59e0b;
        }

        .hint-content {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .hint-empty {
          text-align: center;
          padding: 1rem;
          color: var(--text-muted, #6b7280);
        }

        .hint-empty p {
          margin: 0.5rem 0 0 0;
        }

        .hint-info {
          font-size: 0.75rem;
        }

        .hint-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 0.8125rem;
        }

        .hint-item {
          padding: 0.75rem;
          border-radius: 8px;
          border-left: 3px solid;
        }

        .hint-item.level-1 {
          background: #fefce8;
          border-color: #facc15;
        }

        .hint-item.level-2 {
          background: #fff7ed;
          border-color: #fb923c;
        }

        .hint-item.level-3 {
          background: #fef2f2;
          border-color: #f87171;
        }

        .hint-item-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .level-badge {
          font-size: 0.6875rem;
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
          color: white;
          font-weight: 600;
        }

        .level-label {
          font-size: 0.75rem;
          color: var(--text-muted, #6b7280);
        }

        .hint-text {
          margin: 0;
          line-height: 1.5;
          color: var(--text, #374151);
        }

        .hint-time {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.6875rem;
          color: var(--text-muted, #9ca3af);
        }

        .get-hint-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.625rem 1rem;
          background: var(--primary, #3b82f6);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .get-hint-btn:hover:not(:disabled) {
          background: var(--primary-dark, #2563eb);
        }

        .get-hint-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .hint-limit {
          text-align: center;
          color: var(--text-muted, #6b7280);
          font-size: 0.8125rem;
          margin: 0;
        }

        .hint-disclaimer {
          text-align: center;
          color: var(--text-muted, #9ca3af);
          font-size: 0.75rem;
          margin: 0;
        }

        :global(.dark) .hint-panel {
          --bg-secondary: #1f2937;
          --bg-tertiary: #374151;
          --bg-hover: #4b5563;
          --border: #374151;
          --text: #f9fafb;
          --text-muted: #9ca3af;
        }
      `}</style>
    </div>
  );
}