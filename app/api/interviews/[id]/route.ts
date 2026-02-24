import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/supabaseServer';
import { updateInterviewSchema } from '@/lib/interview/schemas';

export const runtime = 'nodejs';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/interviews/[id]
 * Get a single interview by ID
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: interview, error } = await supabase
      .from('interviews')
      .select(`
        *,
        participants:interview_participants(*)
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
      }
      console.error('Failed to fetch interview:', error);
      return NextResponse.json({ error: 'Failed to fetch interview' }, { status: 500 });
    }

    // Check access - either interviewer or participant
    const isInterviewer = interview.interviewer_id === user.id;
    const isParticipant = interview.participants?.some(
      (p: any) => p.user_id === user.id || p.email === user.email
    );

    if (!isInterviewer && !isParticipant) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ interview });
  } catch (error) {
    console.error('Interview fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/interviews/[id]
 * Update an interview
 */
export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check ownership
    const { data: existing, error: fetchError } = await supabase
      .from('interviews')
      .select('interviewer_id, status')
      .eq('id', params.id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    if (existing.interviewer_id !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Can't update completed or cancelled interviews
    if (existing.status === 'completed' || existing.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot update completed or cancelled interviews' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validated = updateInterviewSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const data = validated.data;

    // Update status if scheduled_at changes
    const updates: any = { ...data };
    if (data.scheduled_at !== undefined) {
      updates.status = data.scheduled_at ? 'scheduled' : 'draft';
    }

    const { data: interview, error: updateError } = await supabase
      .from('interviews')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Failed to update interview:', updateError);
      return NextResponse.json({ error: 'Failed to update interview' }, { status: 500 });
    }

    return NextResponse.json({ interview });
  } catch (error) {
    console.error('Interview update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/interviews/[id]
 * Cancel/delete an interview
 */
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check ownership
    const { data: existing, error: fetchError } = await supabase
      .from('interviews')
      .select('interviewer_id, status')
      .eq('id', params.id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    if (existing.interviewer_id !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // If in progress, just cancel, otherwise delete
    if (existing.status === 'in_progress') {
      const { error: cancelError } = await supabase
        .from('interviews')
        .update({ status: 'cancelled' })
        .eq('id', params.id);

      if (cancelError) {
        return NextResponse.json({ error: 'Failed to cancel interview' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Interview cancelled' });
    }

    // Delete the interview
    const { error: deleteError } = await supabase
      .from('interviews')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      console.error('Failed to delete interview:', deleteError);
      return NextResponse.json({ error: 'Failed to delete interview' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Interview deleted' });
  } catch (error) {
    console.error('Interview deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}