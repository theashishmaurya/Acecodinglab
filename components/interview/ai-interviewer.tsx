'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';

interface AIInterviewerProps {
  session_id: string;
  challenge_key: string;
  onQuestionAsked?: (question: string) => void;
  onResponseProvided?: (response: string) => void;
  onInterviewComplete?: (evaluation: EvaluationResult) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface EvaluationResult {
  overall_score: number;
  technical_score: number;
  communication_score: number;
  problem_solving_score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendation: 'strong_yes' | 'yes' | 'maybe' | 'no' | 'strong_no';
}

// AI Interviewer prompts and logic
const SYSTEM_PROMPT = `You are an expert technical interviewer for AceCodingLab. Your role is to:

1. Conduct technical interviews in a conversational, supportive manner
2. Ask probing questions to assess the candidate's understanding
3. Provide subtle hints when the candidate is stuck (without giving away answers)
4. Evaluate problem-solving approach, not just the final solution
5. Take notes on the candidate's strengths and areas for improvement

Interview Guidelines:
- Start with easy questions and progress to harder ones
- Ask follow-up questions based on responses
- Note time-to-solution and approach quality
- Be encouraging but maintain professional boundaries
- If the candidate is stuck, offer progressive hints (3 levels)
- After 45 minutes, summarize findings and conclude

Scoring Criteria:
- Technical Accuracy (0-100): Correctness of solution
- Communication (0-100): Clarity of explanation
- Problem Solving (0-100): Approach and methodology
- Code Quality (0-100): Clean, maintainable code

Always respond in a friendly, professional tone.`;

export function AIInterviewer({
  session_id,
  challenge_key,
  onQuestionAsked,
  onResponseProvided,
  onInterviewComplete,
}: AIInterviewerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start interview
  useEffect(() => {
    startInterview();
  }, []);

  const startInterview = async () => {
    setIsTyping(true);
    
    // Simulated AI response - in production, call your AI API
    const greeting = `Hello! I'm your AI interviewer for today. We'll be working on the "${challenge_key}" challenge.

Before we begin, I'd like you to:
1. Explain your initial thoughts on how you might approach this problem
2. Feel free to ask clarifying questions at any time
3. Think out loud as you code - I want to understand your thought process

Let's start! Can you tell me what you think this problem is asking for?`;

    setMessages([{
      id: Date.now().toString(),
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
    }]);
    
    setIsTyping(false);
    onQuestionAsked?.(greeting);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    onResponseProvided?.(content);
    setIsTyping(true);

    // Simulated AI response - replace with actual API call
    const response = await generateAIResponse(content, messages);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
    onQuestionAsked?.(response);
  };

  const generateAIResponse = async (
    userInput: string,
    conversationHistory: Message[]
  ): Promise<string> => {
    // In production, call OpenAI/Anthropic API here
    // For demo, return contextual responses
    
    const input = userInput.toLowerCase();
    
    if (input.includes('stuck') || input.includes('help') || input.includes('hint')) {
      return `I understand you're looking for guidance. Here's a hint level 1:

Think about what data structure might be most efficient for this problem. What are the key operations you need to perform frequently?

Let me know if you need another hint, or try to implement something and share your code!`;
    }
    
    if (input.includes('solution') || input.includes('answer')) {
      return `I appreciate you asking, but I want to help you discover the solution yourself. That's the best way to learn!

Can you describe what you've tried so far? Even a partial solution or pseudocode would help me understand your approach.`;
    }
    
    if (input.includes('time complexity') || input.includes('big o')) {
      return `Great question! When analyzing time complexity for this type of problem:

1. Consider how many times you iterate through the data
2. Look for nested loops - those often indicate O(n²)
3. Hash map lookups are O(1) on average
4. Binary search is O(log n)

What's your current approach? I can help you analyze its complexity.`;
    }

    if (elapsed > 45 * 60) { // 45 minutes
      return `We're approaching the end of our interview time. Let me summarize what I've observed:

**Strengths:**
- Good problem decomposition
- Clear communication style

**Areas for Improvement:**
- Consider edge cases earlier
- Practice expressing time complexity

You did well! Do you have any questions about the problem or approach?`;
    }

    // Default response
    const responses = [
      `Interesting approach! Can you explain why you chose that direction? I want to make sure I understand your reasoning.`,
      `That's a solid start. What edge cases should we consider for this problem?`,
      `Good thinking! Let's continue. How would you handle large inputs efficiently?`,
      `I see where you're going with this. Can you walk me through how your solution handles [specific scenario]?`,
      `Nice! Now, what would happen if we modified the input constraints? How would your solution adapt?`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Voice recognition (Web Speech API)
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert('Speech recognition is not supported in this browser.');
      }
    }
  }, [isListening]);

  const completeInterview = async () => {
    // Generate final evaluation
    const finalEvaluation: EvaluationResult = {
      overall_score: 78,
      technical_score: 80,
      communication_score: 85,
      problem_solving_score: 75,
      summary: 'The candidate demonstrated strong problem-solving skills and communicated their approach clearly. They successfully identified edge cases and implemented an efficient solution.',
      strengths: [
        'Clear communication of thought process',
        'Good understanding of time complexity',
        'Handled follow-up questions well',
      ],
      improvements: [
        'Could improve initial problem analysis',
        'Practice more edge case identification early',
      ],
      recommendation: 'yes',
    };
    
    setEvaluation(finalEvaluation);
    onInterviewComplete?.(finalEvaluation);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="ai-interviewer">
      {/* Header */}
      <div className="interviewer-header">
        <div className="interviewer-info">
          <div className="ai-avatar">
            <Bot size={24} />
          </div>
          <div>
            <h3>AI Interviewer</h3>
            <span className="interview-type">Technical Interview</span>
          </div>
        </div>
        <div className="interview-timer">
          <span className="timer-label">Elapsed</span>
          <span className="timer-value">{formatTime(elapsed)}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-sender">
                  {message.role === 'assistant' ? 'Interviewer' : 'You'}
                </span>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message assistant">
            <div className="message-avatar">
              <Bot size={20} />
            </div>
            <div className="message-content typing">
              <Loader2 className="spinner" size={16} />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Evaluation Panel */}
      {evaluation && (
        <div className="evaluation-panel">
          <h3>Interview Complete</h3>
          <div className="scores-grid">
            <div className="score-item">
              <span className="score-label">Overall</span>
              <span className="score-value">{evaluation.overall_score}%</span>
            </div>
            <div className="score-item">
              <span className="score-label">Technical</span>
              <span className="score-value">{evaluation.technical_score}%</span>
            </div>
            <div className="score-item">
              <span className="score-label">Communication</span>
              <span className="score-value">{evaluation.communication_score}%</span>
            </div>
            <div className="score-item">
              <span className="score-label">Problem Solving</span>
              <span className="score-value">{evaluation.problem_solving_score}%</span>
            </div>
          </div>
          <p className="summary">{evaluation.summary}</p>
          <div className="feedback-section">
            <div className="strengths">
              <h4>Strengths</h4>
              <ul>
                {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="improvements">
              <h4>Areas for Improvement</h4>
              <ul>
                {evaluation.improvements.map((i, idx) => <li key={idx}>{i}</li>)}
              </ul>
            </div>
          </div>
          <div className={`recommendation ${evaluation.recommendation}`}>
            Recommendation: {evaluation.recommendation.replace('_', ' ').toUpperCase()}
          </div>
        </div>
      )}

      {/* Input */}
      {!evaluation && (
        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response or question..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              rows={3}
            />
            <div className="input-actions">
              <button
                onClick={toggleListening}
                className={`voice-btn ${isListening ? 'active' : ''}`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                className="send-btn"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          <button onClick={completeInterview} className="complete-btn">
            End Interview
          </button>
        </div>
      )}

      <style jsx>{`
        .ai-interviewer {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--bg-primary, white);
          border-radius: 12px;
          border: 1px solid var(--border, #e5e7eb);
          overflow: hidden;
        }

        .interviewer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--bg-secondary, #f9fafb);
          border-bottom: 1px solid var(--border, #e5e7eb);
        }

        .interviewer-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ai-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .interviewer-info h3 {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .interview-type {
          font-size: 0.75rem;
          color: var(--text-muted, #6b7280);
        }

        .interview-timer {
          text-align: right;
        }

        .timer-label {
          display: block;
          font-size: 0.625rem;
          color: var(--text-muted, #6b7280);
          text-transform: uppercase;
        }

        .timer-value {
          font-size: 1.125rem;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          color: var(--text, #111827);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message {
          display: flex;
          gap: 0.75rem;
          max-width: 85%;
        }

        .message.user {
          margin-left: auto;
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message.assistant .message-avatar {
          background: var(--primary, #3b82f6);
          color: white;
        }

        .message.user .message-avatar {
          background: var(--bg-tertiary, #e5e7eb);
          color: var(--text, #374151);
        }

        .message-content {
          background: var(--bg-secondary, #f3f4f6);
          padding: 0.75rem 1rem;
          border-radius: 1rem;
        }

        .message.user .message-content {
          background: var(--primary, #3b82f6);
          color: white;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 0.25rem;
        }

        .message-sender {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .message-time {
          font-size: 0.625rem;
          opacity: 0.7;
        }

        .message-content p {
          margin: 0;
          font-size: 0.875rem;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .message-content.typing {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-muted, #6b7280);
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .input-area {
          padding: 1rem;
          border-top: 1px solid var(--border, #e5e7eb);
          background: var(--bg-secondary, #f9fafb);
        }

        .input-wrapper {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .input-wrapper textarea {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid var(--border, #e5e7eb);
          border-radius: 8px;
          font-size: 0.875rem;
          resize: none;
          font-family: inherit;
        }

        .input-wrapper textarea:focus {
          outline: none;
          border-color: var(--primary, #3b82f6);
        }

        .input-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .voice-btn, .send-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .voice-btn {
          background: white;
          border: 1px solid var(--border, #e5e7eb);
          color: var(--text-muted, #6b7280);
        }

        .voice-btn.active {
          background: #ef4444;
          border-color: #ef4444;
          color: white;
        }

        .send-btn {
          background: var(--primary, #3b82f6);
          color: white;
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .complete-btn {
          width: 100%;
          padding: 0.625rem;
          background: var(--bg-tertiary, #e5e7eb);
          border: none;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          color: var(--text, #374151);
        }

        .complete-btn:hover {
          background: #d1d5db;
        }

        .evaluation-panel {
          padding: 1.5rem;
          background: var(--bg-secondary, #f9fafb);
          border-top: 1px solid var(--border, #e5e7eb);
        }

        .evaluation-panel h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
        }

        .scores-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .score-item {
          text-align: center;
          padding: 0.75rem;
          background: white;
          border-radius: 8px;
          border: 1px solid var(--border, #e5e7eb);
        }

        .score-label {
          display: block;
          font-size: 0.625rem;
          text-transform: uppercase;
          color: var(--text-muted, #6b7280);
          margin-bottom: 0.25rem;
        }

        .score-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary, #3b82f6);
        }

        .summary {
          font-size: 0.875rem;
          color: var(--text, #374151);
          line-height: 1.6;
          margin: 0 0 1rem 0;
        }

        .feedback-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .feedback-section h4 {
          font-size: 0.75rem;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
        }

        .feedback-section ul {
          margin: 0;
          padding-left: 1rem;
          font-size: 0.8125rem;
        }

        .feedback-section li {
          margin-bottom: 0.25rem;
        }

        .strengths h4 {
          color: #10b981;
        }

        .improvements h4 {
          color: #f59e0b;
        }

        .recommendation {
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.875rem;
        }

        .recommendation.strong_yes {
          background: #d1fae5;
          color: #065f46;
        }

        .recommendation.yes {
          background: #dbeafe;
          color: #1e40af;
        }

        .recommendation.maybe {
          background: #fef3c7;
          color: #92400e;
        }

        .recommendation.no, .recommendation.strong_no {
          background: #fee2e2;
          color: #991b1b;
        }

        :global(.dark) .ai-interviewer {
          --bg-primary: #1f2937;
          --bg-secondary: #374151;
          --bg-tertiary: #4b5563;
          --border: #4b5563;
          --text: #f9fafb;
          --text-muted: #9ca3af;
        }
      `}</style>
    </div>
  );
}