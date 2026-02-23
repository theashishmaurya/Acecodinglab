'use client';

import React from 'react';
import { useTheme } from './theme-provider';
import { Moon, Sun, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const buttons: Array<{ value: 'light' | 'dark' | 'system'; icon: React.ReactNode; label: string }> = [
    { value: 'light', icon: <Sun className="h-4 w-4" />, label: 'Light' },
    { value: 'dark', icon: <Moon className="h-4 w-4" />, label: 'Dark' },
    { value: 'system', icon: <Monitor className="h-4 w-4" />, label: 'System' },
  ];

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Theme selection">
      {buttons.map((button) => (
        <button
          key={button.value}
          onClick={() => setTheme(button.value)}
          className={`theme-toggle-btn ${theme === button.value ? 'active' : ''}`}
          role="radio"
          aria-checked={theme === button.value}
          aria-label={`${button.label} theme`}
          title={`${button.label} theme`}
        >
          {button.icon}
        </button>
      ))}
      <style jsx>{`
        .theme-toggle {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: 2px;
          background: var(--toggle-bg, #f3f4f6);
          border-radius: 8px;
          border: 1px solid var(--toggle-border, #e5e7eb);
        }
        
        .theme-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          color: var(--text-muted, #6b7280);
          transition: all 0.2s;
        }
        
        .theme-toggle-btn:hover {
          background: var(--btn-hover-bg, #e5e7eb);
          color: var(--text, #111827);
        }
        
        .theme-toggle-btn.active {
          background: white;
          color: var(--primary, #3b82f6);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        
        .theme-toggle-btn:focus-visible {
          outline: 2px solid var(--primary, #3b82f6);
          outline-offset: 2px;
        }
        
        :global(.dark) .theme-toggle {
          --toggle-bg: #374151;
          --toggle-border: #4b5563;
          --btn-hover-bg: #4b5563;
          --text: #f9fafb;
          --text-muted: #9ca3af;
        }
        
        :global(.dark) .theme-toggle-btn.active {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
}