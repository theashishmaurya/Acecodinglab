import { createClient } from "@/lib/supabase/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";

export interface PracticeSession {
    id: string;
    user_id: string;
    question_id: string;
    created_at: string;
    updated_at: string;
    completed_at: string | null;
    current_code: string;
    language: string;
    status: 'in_progress' | 'completed';
  }

  const supabase: SupabaseClient = createClient()
  
  export const practiceSessionsAPI = {
    // Start a new practice session
    startSession: async (questionId: string, language: string, initialCode: string): Promise<string> => {
      const { data, error } = await supabase
        .from('practice_sessions')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          question_id: questionId,
          language: language,
          current_code: initialCode,
          status: 'in_progress'
        })
        .select('id')
        .single();
  
      if (error) throw error;
      return data.id;
    },
  
    // Get a specific practice session
    getSession: async (sessionId: string): Promise<PracticeSession> => {
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
  
      if (error) throw error;
      return data;
    },
  
    // Update the code in a practice session
    updateSessionCode: async (sessionId: string, newCode: string): Promise<void> => {
      const { error } = await supabase
        .from('practice_sessions')
        .update({ current_code: newCode })
        .eq('id', sessionId);
  
      if (error) throw error;
    },
  
    // Complete a practice session
    completeSession: async (sessionId: string): Promise<void> => {
      const { error } = await supabase
        .from('practice_sessions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('status', 'in_progress');
  
      if (error) throw error;
    },
  
    // Get all in-progress sessions for the current user
    getInProgressSessions: async (): Promise<PracticeSession[]> => {
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('status', 'in_progress')
        .order('updated_at', { ascending: false });
  
      if (error) throw error;
      return data;
    },
  
    // Get all completed sessions for the current user
    getCompletedSessions: async (): Promise<PracticeSession[]> => {
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });
  
      if (error) throw error;
      return data;
    }
  };