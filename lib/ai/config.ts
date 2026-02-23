/**
 * AI Client Configuration
 * Supports OpenAI and Anthropic APIs
 */

export const AI_CONFIG = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '4096'),
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229',
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '4096'),
  },
  rateLimit: {
    maxRequestsPerMinute: parseInt(process.env.AI_RATE_LIMIT || '50'),
    maxRequestsPerDay: parseInt(process.env.AI_DAILY_LIMIT || '1000'),
  },
} as const;

export type AIProvider = 'openai' | 'anthropic';

export interface AIOptions {
  provider?: AIProvider;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: string;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}