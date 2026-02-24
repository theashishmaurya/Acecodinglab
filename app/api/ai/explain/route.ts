import { NextRequest, NextResponse } from 'next/server';
import { getAIClient } from '@/lib/ai/client';
import { SYSTEM_PROMPTS } from '@/lib/ai/prompts';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language = 'javascript', context, detailLevel = 'normal' } = body;

    // Validate input
    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    // Limit code size
    if (code.length > 50000) {
      return NextResponse.json(
        { error: 'Code is too large. Maximum 50,000 characters.' },
        { status: 400 }
      );
    }

    const aiClient = getAIClient();

    // Build detail prompt based on level
    const detailPrompts = {
      brief: 'Provide a brief explanation (2-3 sentences max).',
      normal: 'Provide a clear explanation with key points.',
      detailed: 'Provide a comprehensive explanation with line-by-line breakdown, examples, and context.',
    };

    // Use streaming for better UX
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const stream = aiClient.stream([
            {
              role: 'system',
              content: SYSTEM_PROMPTS.explanation,
            },
            {
              role: 'user',
              content: `${detailPrompts[detailLevel as keyof typeof detailPrompts] || detailPrompts.normal}

Explain this ${language} code:
\`\`\`${language}
${code}
\`\`\`

${context ? `Additional context: ${context}` : ''}

Format your response in markdown with:
1. **Summary** - Brief overview of what the code does
2. **Key Concepts** - List of concepts/patterns used
3. **Explanation** - Detailed explanation
4. **Complexity** - Time and space complexity analysis
${detailLevel === 'detailed' ? '5. **Edge Cases** - Potential edge cases\n6. **Improvements** - Suggested improvements' : ''}`,
            },
          ]);

          for await (const chunk of stream) {
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
  } catch (error) {
    console.error('Explanation error:', error);
    
    return NextResponse.json(
      { error: 'Failed to explain code' },
      { status: 500 }
    );
  }
}