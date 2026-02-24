import { NextRequest, NextResponse } from 'next/server';
import { getAIClient } from '@/lib/ai/client';
import { SYSTEM_PROMPTS } from '@/lib/ai/prompts';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, provider, model, maxTokens, temperature, stream } = body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const aiClient = getAIClient();

    // Handle streaming
    if (stream) {
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of aiClient.stream(messages, {
              provider,
              model,
              maxTokens,
              temperature,
            })) {
              const data = encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`);
              controller.enqueue(data);
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming response
    const response = await aiClient.complete(messages, {
      provider,
      model,
      maxTokens,
      temperature,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI completion error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Rate limit')) {
        return NextResponse.json(
          { error: error.message },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate completion' },
      { status: 500 }
    );
  }
}