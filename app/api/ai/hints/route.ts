import { NextRequest, NextResponse } from 'next/server';
import { getAIClient } from '@/lib/ai/client';
import { SYSTEM_PROMPTS, USER_PROMPTS } from '@/lib/ai/prompts';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const runtime = 'edge';

// Rate limiting per user
const userRequests = new Map<string, { count: number; resetAt: number }>();

function checkUserRateLimit(userId: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 50; // 50 hints per hour

  const userLimit = userRequests.get(userId);
  
  if (!userLimit || now > userLimit.resetAt) {
    userRequests.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Get user session
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check rate limit
    if (!checkUserRateLimit(user.id)) {
      return NextResponse.json(
        { error: 'Hint limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { challengeId, challenge, currentCode, level = 1, previousHints = [] } = body;

    // Validate input
    if (!challengeId || !challenge) {
      return NextResponse.json(
        { error: 'Challenge ID and challenge description are required' },
        { status: 400 }
      );
    }

    if (level < 1 || level > 3) {
      return NextResponse.json(
        { error: 'Level must be between 1 and 3' },
        { status: 400 }
      );
    }

    const aiClient = getAIClient();

    // Generate hint
    const hint = await aiClient.generateHint(
      challenge,
      currentCode || '',
      level,
      previousHints
    );

    // Store hint usage in database (optional)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/hint_usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          challenge_id: challengeId,
          level,
          hint_text: hint,
          code_snapshot: currentCode?.substring(0, 1000), // Limit size
          created_at: new Date().toISOString(),
        }),
      });
    } catch (dbError) {
      console.error('Failed to store hint usage:', dbError);
      // Don't fail the request if DB write fails
    }

    return NextResponse.json({
      hint,
      level,
      nextLevelAvailable: level < 3,
      remainingRequests: maxRequests - (userRequests.get(user.id)?.count || 0),
    });
  } catch (error) {
    console.error('Hint generation error:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate hint' },
      { status: 500 }
    );
  }
}

// Get hint history for a challenge
export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get('challengeId');

    if (!challengeId) {
      return NextResponse.json(
        { error: 'Challenge ID is required' },
        { status: 400 }
      );
    }

    // Get hint history
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/hint_usage?user_id=eq.${user.id}&challenge_id=eq.${challengeId}&select=level,hint_text,created_at&order=created_at.asc`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    const hints = await response.json();

    return NextResponse.json({
      hints,
      highestLevel: hints.length > 0 ? Math.max(...hints.map((h: any) => h.level)) : 0,
    });
  } catch (error) {
    console.error('Failed to get hint history:', error);
    return NextResponse.json(
      { error: 'Failed to get hint history' },
      { status: 500 }
    );
  }
}

const maxRequests = 50;