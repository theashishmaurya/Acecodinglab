'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Clock } from 'lucide-react';

interface ChallengeTimerProps {
  challengeKey: string;
  onTimeUpdate?: (time: number) => void;
  onComplete?: (time: number) => void;
}

interface LapTime {
  timestamp: number;
  label: string;
}

export function ChallengeTimer({ challengeKey, onTimeUpdate, onComplete }: ChallengeTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState<LapTime[]>([]);
  const [showLaps, setShowLaps] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Load saved time from localStorage
  useEffect(() => {
    const savedTime = localStorage.getItem(`timer-${challengeKey}`);
    if (savedTime) {
      setElapsedTime(parseInt(savedTime, 10));
    }
    
    const savedLaps = localStorage.getItem(`timer-laps-${challengeKey}`);
    if (savedLaps) {
      setLaps(JSON.parse(savedLaps));
    }
  }, [challengeKey]);

  // Save time to localStorage
  useEffect(() => {
    localStorage.setItem(`timer-${challengeKey}`, elapsedTime.toString());
  }, [challengeKey, elapsedTime]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedTime;
      intervalRef.current = setInterval(() => {
        const newTime = Date.now() - startTimeRef.current;
        setElapsedTime(newTime);
        onTimeUpdate?.(newTime);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, elapsedTime, onTimeUpdate]);

  const toggleTimer = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
    localStorage.removeItem(`timer-${challengeKey}`);
    localStorage.removeItem(`timer-laps-${challengeKey}`);
  }, [challengeKey]);

  const addLap = useCallback(() => {
    const newLap: LapTime = {
      timestamp: elapsedTime,
      label: `Lap ${laps.length + 1}`,
    };
    const newLaps = [...laps, newLap];
    setLaps(newLaps);
    localStorage.setItem(`timer-laps-${challengeKey}`, JSON.stringify(newLaps));
  }, [challengeKey, elapsedTime, laps]);

  const markComplete = useCallback(() => {
    setIsRunning(false);
    onComplete?.(elapsedTime);
    addLap();
  }, [elapsedTime, onComplete, addLap]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="challenge-timer">
      <div className="timer-display">
        <Clock className="timer-icon" size={18} />
        <span className={`time ${isRunning ? 'running' : ''}`}>
          {formatTime(elapsedTime)}
        </span>
      </div>

      <div className="timer-controls">
        <button
          onClick={toggleTimer}
          className={`timer-btn ${isRunning ? 'pause' : 'play'}`}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button
          onClick={addLap}
          className="timer-btn lap"
          disabled={!isRunning}
          aria-label="Add lap"
          title="Mark milestone"
        >
          <Flag size={16} />
        </button>

        <button
          onClick={resetTimer}
          className="timer-btn reset"
          aria-label="Reset timer"
          title="Reset timer"
        >
          <RotateCcw size={16} />
        </button>

        <button
          onClick={markComplete}
          className="timer-btn complete"
          aria-label="Mark complete"
          title="Mark challenge complete"
        >
          Complete
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps-section">
          <button
            onClick={() => setShowLaps(!showLaps)}
            className="toggle-laps"
          >
            {showLaps ? 'Hide' : 'Show'} Milestones ({laps.length})
          </button>
          
          {showLaps && (
            <ul className="laps-list">
              {laps.map((lap, index) => (
                <li key={index} className="lap-item">
                  <span className="lap-label">{lap.label}</span>
                  <span className="lap-time">{formatTime(lap.timestamp)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <style jsx>{`
        .challenge-timer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--bg-secondary, #f9fafb);
          border-radius: 12px;
          border: 1px solid var(--border, #e5e7eb);
        }
        
        .timer-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .timer-icon {
          color: var(--text-muted, #6b7280);
        }
        
        .time {
          font-size: 2rem;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          color: var(--text, #111827);
          letter-spacing: 0.05em;
        }
        
        .time.running {
          color: var(--primary, #3b82f6);
        }
        
        .timer-controls {
          display: flex;
          gap: 0.5rem;
        }
        
        .timer-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid var(--border, #e5e7eb);
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text, #374151);
        }
        
        .timer-btn:hover:not(:disabled) {
          background: var(--bg-tertiary, #f3f4f6);
        }
        
        .timer-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .timer-btn.play {
          background: var(--primary, #3b82f6);
          border-color: var(--primary, #3b82f6);
          color: white;
        }
        
        .timer-btn.play:hover {
          background: #2563eb;
        }
        
        .timer-btn.pause {
          background: #f59e0b;
          border-color: #f59e0b;
          color: white;
        }
        
        .timer-btn.pause:hover {
          background: #d97706;
        }
        
        .timer-btn.complete {
          background: #10b981;
          border-color: #10b981;
          color: white;
        }
        
        .timer-btn.complete:hover {
          background: #059669;
        }
        
        .laps-section {
          width: 100%;
          border-top: 1px solid var(--border, #e5e7eb);
          padding-top: 0.75rem;
        }
        
        .toggle-laps {
          font-size: 0.75rem;
          color: var(--primary, #3b82f6);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0;
        }
        
        .toggle-laps:hover {
          text-decoration: underline;
        }
        
        .laps-list {
          margin: 0.5rem 0 0 0;
          padding: 0;
          list-style: none;
          max-height: 120px;
          overflow-y: auto;
        }
        
        .lap-item {
          display: flex;
          justify-content: space-between;
          padding: 0.375rem 0;
          font-size: 0.75rem;
          border-bottom: 1px solid var(--border, #f3f4f6);
        }
        
        .lap-item:last-child {
          border-bottom: none;
        }
        
        .lap-label {
          color: var(--text-muted, #6b7280);
        }
        
        .lap-time {
          font-variant-numeric: tabular-nums;
          font-weight: 500;
          color: var(--text, #374151);
        }
        
        :global(.dark) .challenge-timer {
          --bg-secondary: #1f2937;
          --border: #374151;
          --text: #f9fafb;
          --text-muted: #9ca3af;
          --bg-tertiary: #374151;
        }
        
        :global(.dark) .timer-btn {
          background: #374151;
          border-color: #4b5563;
          color: #f9fafb;
        }
      `}</style>
    </div>
  );
}