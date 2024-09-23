'use server';
import createClient from '@/lib/supabase/supabaseServer';
import { PostgrestError } from '@supabase/supabase-js';

const supabase = createClient();

export interface IInterviewTask {
  task_order: number;
  title: string;
  description?: string;
  current_code: string;
}

export interface ICreateInterviewSession {
  p_description: string;
  p_end_date: string;
  p_invited_users?: string[];
  p_is_public: boolean;
  p_max_participants: string;
  p_start_date: string;
  p_tasks: object;
  p_title: string;
  p_duration: number;
}

export async function createInterviewSession(
  interviewSession: ICreateInterviewSession,
): Promise<{ success: boolean; error?: string; sessionId?: string }> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    const rpcData = {
      p_title: interviewSession.p_title,
      p_description: interviewSession.p_description,
      p_created_by: user.id,
      p_start_date: interviewSession.p_start_date,
      p_end_date: interviewSession.p_end_date,
      p_max_participants: interviewSession.p_max_participants,
      p_is_public: interviewSession.p_is_public,
      p_tasks: interviewSession.p_tasks,
      p_invited_users: interviewSession.p_invited_users || [],
      p_duration: interviewSession.p_duration,
    };

    console.log(rpcData, 'RPC Data');

    const { data, error } = await supabase.rpc('create_interview_session', {});

    if (error) throw error;

    return { success: true, sessionId: data };
  } catch (error) {
    const postgrestError = error as PostgrestError;
    return {
      success: false,
      error: postgrestError.message || 'An unknown error occurred',
    };
  }
}
// Helper functions
