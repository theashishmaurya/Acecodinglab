'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { BookOpen, X, Loader2, MessageCircle, Send, Copy, Check } from 'lucide-react';

interface ExplanationPanelProps {
  code: string;
  language?: string;
  context?: string;
  onClose?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ExplanationPanel({
  code,
  language = 'javascript',
  context,
  onClose,
}: ExplanationPanelProps) {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [followUp, setFollowUp] = useState('');
  const [copied, setCopied] = useState(false);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

  // Request explanation on mount
  useEffect(() => {
    if (code) {
      requestExplanation();
    }
    return () => {
      // Cancel stream on unmount
      if (readerRef.current) {
        readerRef.current.cancel();
      }
    };
  }, [code, language]);

  const requestExplanation = useCallback(async () => {
    setLoading(true);
    setError(null);
    setExplanation('');

    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, context, detailLevel: 'normal' }),
      });

      if (!response.ok) {
        throw new Error('Failed to explain code');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      readerRef.current = reader || null;

      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        // Parse SSE data
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.content) {
                accumulated += data.content;
                setExplanation(accumulated);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }

      setExplanation(accumulated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to explain code');
    } finally {
      setLoading(false);
      readerRef.current = null;
    }
  }, [code, language, context]);

  const askFollowUp = useCallback(async () => {
    if (!followUp.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: followUp,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setFollowUp('');

    try {
      // For follow-up questions, we'd normally maintain conversation context
      // This is a simplified version
      const response = await fetch('/api/ai/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a code tutor. Answer questions about this code:\n\n```' + language + '\n' + code + '\n```' },
            { role: 'user', content: followUp },
          ],
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Follow-up failed:', err);
    }
  }, [followUp, code, language]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }, [explanation]);

  return (
    <div className="explanation-panel">
      <div className="panel-header">
        <div className="header-left">
          <BookOpen size={18} />
          <h3>Code Explanation</h3>
        </div>
        <div className="header-actions">
          {explanation && !loading && (
            <button className="action-btn" onClick={copyToClipboard} title="Copy explanation">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          )}
          {onClose && (
            <button className="action-btn" onClick={onClose} title="Close">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="panel-content">
        {loading && !explanation && (
          <div className="loading-state">
            <Loader2 className="spinner" size={24} />
            <p>Analyzing code...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={requestExplanation}>Try again</button>
          </div>
        )}

        {explanation && (
          <div className="explanation-content">
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(explanation) }}
            />
          </div>
        )}

        {messages.length > 0 && (
          <div className="follow-ups">
            <h4>Follow-up Questions</h4>
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.role}`}>
                <div className="message-header">
                  {msg.role === 'user' ? 'You' : 'AI'}
                </div>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel-footer">
        <input
          type="text"
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && askFollowUp()}
          placeholder="Ask a follow-up question..."
          disabled={loading}
        />
        <button onClick={askFollowUp} disabled={loading || !followUp.trim()}>
          <Send size={16} />
        </button>
      </div>

      <style jsx>{`
        .explanation-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--bg-primary, white);
          border-left: 1px solid var(--border, #e5e7eb);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border, #e5e7eb);
          background: var(--bg-secondary, #f9fafb);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .header-left h3 {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .header-actions {
          display: flex;
          gap: 0.25rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          color: var(--text-muted, #6b7280);
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: var(--bg-hover, #e5e7eb);
          color: var(--text, #374151);
        }

        .panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: var(--text-muted, #6b7280);
        }

        .loading-state p {
          margin-top: 0.75rem;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .error-state {
          text-align: center;
          padding: 2rem;
          color: #dc2626;
        }

        .error-state button {
          margin-top: 0.5rem;
          padding: 0.375rem 0.75rem;
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          color: #dc2626;
          cursor: pointer;
        }

        .explanation-content {
          line-height: 1.6;
        }

        .markdown-content :global(h1) {
          font-size: 1.25rem;
          margin: 1rem 0 0.5rem;
        }

        .markdown-content :global(h2) {
          font-size: 1.125rem;
          margin: 1rem 0 0.5rem;
        }

        .markdown-content :global(h3) {
          font-size: 1rem;
          margin: 0.75rem 0 0.5rem;
        }

        .markdown-content :global(p) {
          margin: 0.5rem 0;
        }

        .markdown-content :global(ul),
        .markdown-content :global(ol) {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .markdown-content :global(li) {
          margin: 0.25rem 0;
        }

        .markdown-content :global(code) {
          background: var(--bg-secondary, #f3f4f6);
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-size: 0.8125rem;
        }

        .markdown-content :global(pre) {
          background: var(--bg-secondary, #f3f4f6);
          padding: 0.75rem;
          border-radius: 6px;
          overflow-x: auto;
          margin: 0.75rem 0;
        }

        .markdown-content :global(pre code) {
          background: none;
          padding: 0;
        }

        .follow-ups {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border, #e5e7eb);
        }

        .follow-ups h4 {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-muted, #6b7280);
          margin: 0 0 0.75rem 0;
        }

        .message {
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .message.user {
          background: var(--primary-light, #dbeafe);
          margin-left: 1rem;
        }

        .message.assistant {
          background: var(--bg-secondary, #f3f4f6);
          margin-right: 1rem;
        }

        .message-header {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-muted, #6b7280);
          margin-bottom: 0.25rem;
        }

        .message-content {
          font-size: 0.8125rem;
          line-height: 1.5;
        }

        .panel-footer {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-top: 1px solid var(--border, #e5e7eb);
          background: var(--bg-secondary, #f9fafb);
        }

        .panel-footer input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border, #e5e7eb);
          border-radius: 6px;
          font-size: 0.8125rem;
        }

        .panel-footer input:focus {
          outline: none;
          border-color: var(--primary, #3b82f6);
        }

        .panel-footer button {
          padding: 0.5rem 0.75rem;
          background: var(--primary, #3b82f6);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .panel-footer button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        :global(.dark) .explanation-panel {
          --bg-primary: #1f2937;
          --bg-secondary: #374151;
          --bg-hover: #4b5563;
          --border: #374151;
          --text: #f9fafb;
          --text-muted: #9ca3af;
          --primary-light: #1e3a5f;
        }
      `}</style>
    </div>
  );
}

// Simple markdown to HTML conversion
function formatMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Lists
    .replace(/^\* (.*$)/gm, '<li>$1</li>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>');
}