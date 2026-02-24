import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/supabaseServer';
import { createInterviewSchema } from '@/lib/interview/schemas';

export const runtime = 'nodejs';

/**
 * GET /api/interviews
 * List all interviews for the current user
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('interviews')
      .select(`
        *,
        participants:interview_participants(count)
      `, { count: 'exact' })
      .eq('interviewer_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (from) {
      query = query.gte('scheduled_at', from);
    }
    if (to) {
      query = query.lte('scheduled_at', to);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: interviews, error, count } = await query;

    if (error) {
      console.error('Failed to fetch interviews:', error);
      return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
    }

    return NextResponse.json({
      interviews,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Interviews fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/interviews
 * Create a new interview
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate input
    const validated = createInterviewSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const data = validated.data;

    // Determine status
    const status = data.scheduled_at ? 'scheduled' : 'draft';

    // Create interview
    const { data: interview, error: createError } = await supabase
      .from('interviews')
      .insert({
        title: data.title,
        description: data.description,
        interviewer_id: user.id,
        scheduled_at: data.scheduled_at,
        duration_minutes: data.duration_minutes,
        timezone: data.timezone || 'UTC',
        status,
        type: data.type,
        auto_record: data.auto_record ?? true,
        anti_cheat_enabled: data.anti_cheat_enabled ?? true,
        ai_proctoring_enabled: data.ai_proctoring_enabled ?? false,
        selected_challenges: data.selected_challenges,
        notes: data.notes,
        settings: {
          allow_hints: data.settings?.allow_hints ?? true,
          max_hints_per_challenge: data.settings?.max_hints_per_challenge ?? 3,
          show_timer: data.settings?.show_timer ?? true,
          allow_code_explanation: data.settings?.allow_code_explanation ?? true,
          require_fullscreen: data.settings?.require_fullscreen ?? true,
          block_copy_paste: data.settings?.block_copy_paste ?? true,
          enable_breaks: data.settings?.enable_breaks ?? false,
          max_breaks: data.settings?.max_breaks ?? 1,
        },
      })
      .select()
      .single();

    if (createError) {
      console.error('Failed to create interview:', createError);
      return NextResponse.json({ error: 'Failed to create interview' }, { status: 500 });
    }

    // Add participants if provided
    if (data.participants && data.participants.length > 0) {
      const participants = data.participants.map(p => ({
        interview_id: interview.id,
        email: p.email,
        name: p.name,
        role: p.role,
        invite_status: 'pending',
      }));

      const { error: participantError } = await supabase
        .from('interview_participants')
        .insert(participants);

      if (participantError) {
        console.error('Failed to add participants:', participantError);
        // Don't fail the request, but log the error
      }
    }

    return NextResponse.json({ interview }, { status: 201 });
  } catch (error) {
    console.error('Interview creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}