/**
 * AI Client - Unified interface for OpenAI and Anthropic
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { AI_CONFIG, AIProvider, AIOptions, Message, CompletionResponse, StreamChunk } from './config';

export class AIClient {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;
  private requestCounts: Map<string, number[]> = new Map();

  constructor() {
    if (AI_CONFIG.openai.apiKey) {
      this.openai = new OpenAI({
        apiKey: AI_CONFIG.openai.apiKey,
      });
    }
    if (AI_CONFIG.anthropic.apiKey) {
      this.anthropic = new Anthropic({
        apiKey: AI_CONFIG.anthropic.apiKey,
      });
    }
  }

  /**
   * Complete a chat conversation
   */
  async complete(
    messages: Message[],
    options: AIOptions = {}
  ): Promise<CompletionResponse> {
    const provider = options.provider || 'openai';
    
    await this.checkRateLimit(provider);

    if (provider === 'anthropic') {
      return this.anthropicComplete(messages, options);
    }
    
    return this.openaiComplete(messages, options);
  }

  /**
   * Stream a chat completion
   */
  async *stream(
    messages: Message[],
    options: AIOptions = {}
  ): AsyncGenerator<StreamChunk> {
    const provider = options.provider || 'openai';
    
    await this.checkRateLimit(provider);

    if (provider === 'anthropic') {
      yield* this.anthropicStream(messages, options);
      return;
    }
    
    yield* this.openaiStream(messages, options);
  }

  /**
   * OpenAI completion
   */
  private async openaiComplete(
    messages: Message[],
    options: AIOptions
  ): Promise<CompletionResponse> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await this.openai.chat.completions.create({
      model: options.model || AI_CONFIG.openai.model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      max_tokens: options.maxTokens || AI_CONFIG.openai.maxTokens,
      temperature: options.temperature ?? AI_CONFIG.openai.temperature,
    });

    const choice = response.choices[0];
    
    return {
      content: choice.message.content || '',
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      } : undefined,
      finishReason: choice.finish_reason,
    };
  }

  /**
   * OpenAI streaming
   */
  private async *openaiStream(
    messages: Message[],
    options: AIOptions
  ): AsyncGenerator<StreamChunk> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const stream = await this.openai.chat.completions.create({
      model: options.model || AI_CONFIG.openai.model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      max_tokens: options.maxTokens || AI_CONFIG.openai.maxTokens,
      temperature: options.temperature ?? AI_CONFIG.openai.temperature,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      const done = chunk.choices[0]?.finish_reason !== null;
      
      if (content) {
        yield { content, done: false };
      }
      
      if (done) {
        yield { content: '', done: true };
      }
    }
  }

  /**
   * Anthropic completion
   */
  private async anthropicComplete(
    messages: Message[],
    options: AIOptions
  ): Promise<CompletionResponse> {
    if (!this.anthropic) {
      throw new Error('Anthropic API key not configured');
    }

    // Convert messages to Anthropic format
    const systemMessage = messages.find(m => m.role === 'system');
    const otherMessages = messages.filter(m => m.role !== 'system');

    const response = await this.anthropic.messages.create({
      model: options.model || AI_CONFIG.anthropic.model,
      max_tokens: options.maxTokens || AI_CONFIG.anthropic.maxTokens,
      system: systemMessage?.content,
      messages: otherMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const textBlock = response.content.find(b => b.type === 'text');
    
    return {
      content: textBlock ? (textBlock as any).text : '',
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
      finishReason: response.stop_reason,
    };
  }

  /**
   * Anthropic streaming
   */
  private async *anthropicStream(
    messages: Message[],
    options: AIOptions
  ): AsyncGenerator<StreamChunk> {
    if (!this.anthropic) {
      throw new Error('Anthropic API key not configured');
    }

    const systemMessage = messages.find(m => m.role === 'system');
    const otherMessages = messages.filter(m => m.role !== 'system');

    const stream = await this.anthropic.messages.stream({
      model: options.model || AI_CONFIG.anthropic.model,
      max_tokens: options.maxTokens || AI_CONFIG.anthropic.maxTokens,
      system: systemMessage?.content,
      messages: otherMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield { content: (event.delta as any).text, done: false };
      }
    }

    yield { content: '', done: true };
  }

  /**
   * Rate limiting check
   */
  private async checkRateLimit(provider: AIProvider): Promise<void> {
    const key = `${provider}:${Math.floor(Date.now() / 60000)}`;
    const counts = this.requestCounts.get(key) || [];
    
    // Clean old entries
    const now = Date.now();
    const minuteAgo = now - 60000;
    const recentCounts = counts.filter(t => t > minuteAgo);
    
    if (recentCounts.length >= AI_CONFIG.rateLimit.maxRequestsPerMinute) {
      throw new Error(`Rate limit exceeded for ${provider}. Please try again later.`);
    }
    
    recentCounts.push(now);
    this.requestCounts.set(key, recentCounts);
  }

  /**
   * Helper: Explain code
   */
  async explainCode(code: string, language: string): Promise<string> {
    const response = await this.complete([
      {
        role: 'system',
        content: `You are a helpful coding tutor. Explain code clearly and concisely. 
                  Break down complex concepts, identify key patterns, and explain the purpose of each section.
                  Format your response in markdown with clear sections.`,
      },
      {
        role: 'user',
        content: `Explain this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n
                  Include:
                  1. A brief summary of what the code does
                  2. Key concepts used
                  3. Line-by-line explanation
                  4. Time and space complexity
                  5. Any potential improvements`,
      },
    ]);
    
    return response.content;
  }

  /**
   * Helper: Analyze complexity
   */
  async analyzeComplexity(code: string, language: string): Promise<{
    time: string;
    space: string;
    explanation: string;
  }> {
    const response = await this.complete([
      {
        role: 'system',
        content: 'You are a code complexity analyzer. Analyze the time and space complexity of code. Respond in JSON format.',
      },
      {
        role: 'user',
        content: `Analyze the complexity of this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n
                  Respond with JSON: { "time": "O(n)", "space": "O(1)", "explanation": "..." }`,
      },
    ]);
    
    try {
      return JSON.parse(response.content);
    } catch {
      return {
        time: 'Unknown',
        space: 'Unknown',
        explanation: 'Could not analyze complexity',
      };
    }
  }

  /**
   * Helper: Generate hint
   */
  async generateHint(
    challenge: string,
    currentCode: string,
    level: number,
    previousHints: string[]
  ): Promise<string> {
    const levelPrompts = {
      1: 'Give a gentle hint that points in the right direction. Do NOT give code or solution. 1-2 sentences max.',
      2: 'Give a more specific hint with a very small code snippet (1-2 lines max). Help understand the approach. 2-3 sentences.',
      3: 'Give a detailed hint with the core algorithm logic. Mention edge cases. Still do NOT provide the complete solution.',
    };
    
    const response = await this.complete([
      {
        role: 'system',
        content: `You are a helpful coding tutor. ${levelPrompts[level]}
                  Be encouraging but don't give away the answer.`,
      },
      {
        role: 'user',
        content: `Challenge: ${challenge}
                  
                  Current code:
                  \`\`\`
                  ${currentCode || 'No code written yet'}
                  \`\`\`
                  
                  ${previousHints.length > 0 ? `Previous hints:\n${previousHints.map((h, i) => `Level ${i + 1}: ${h}`).join('\n')}` : ''}
                  
                  Give me a Level ${level} hint.`,
      },
    ]);
    
    return response.content;
  }
}

// Singleton instance
let aiClient: AIClient | null = null;

export function getAIClient(): AIClient {
  if (!aiClient) {
    aiClient = new AIClient();
  }
  return aiClient;
}