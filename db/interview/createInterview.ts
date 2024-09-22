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
  intervieweeEmail: string;
  infoUrl?: string;
  interviewerIntro?: string;
  notes?: string;
  selectedDate: string;
  currentMonth: string;
  timeFormat: string;
  duration: string;
  sendEmail: boolean;
  selectedTimezone: string;
  selectedTime: string;
  checkedRows: any[]; // You might want to define a more specific type for this
  filePreview?: string;
  proctored: boolean;
  tasks: IInterviewTask[];
}

export async function createInterviewSession(
  interviewSession: ICreateInterviewSession,
): Promise<{ success: boolean; error?: string; sessionId?: string }> {
  try {
    // Prepare the data for the RPC call
    const rpcData = {
      p_scheduled_start_time: `${interviewSession.selectedDate}T${interviewSession.selectedTime}:00${getTimezoneOffset(interviewSession.selectedTimezone)}`,
      p_session_duration: parseDuration(interviewSession.duration),
      p_status: 'scheduled',
      p_proctored: interviewSession.proctored,
      p_participant_email: interviewSession.intervieweeEmail,
      p_participant_full_name: '', // You might want to add this to your form
      p_participant_link: interviewSession.infoUrl,
      p_participant_notes: interviewSession.notes,
      p_participant_resume_url: interviewSession.filePreview,
      p_tasks: interviewSession.tasks,
      p_interviewer_intro: interviewSession.interviewerIntro,
      p_time_format: interviewSession.timeFormat,
      p_send_email: interviewSession.sendEmail,
      p_timezone: interviewSession.selectedTimezone,
      p_checked_rows: JSON.stringify(interviewSession.checkedRows),
      p_current_month: interviewSession.currentMonth,
    };

    console.log(rpcData, 'RPC Data');

    // Call the RPC function
    const { data, error } = await supabase.rpc(
      'create_interview_session',
      rpcData,
    );

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

function getTimezoneOffset(timezone: string): string {
  const date = new Date();
  const offsetMinutes = -date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMinutesPart = Math.abs(offsetMinutes) % 60;
  const sign = offsetMinutes >= 0 ? '+' : '-';
  return `${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutesPart.toString().padStart(2, '0')}`;
}

function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)(m|h)$/);
  if (!match) throw new Error('Invalid duration format');
  const [, value, unit] = match;
  return unit === 'h' ? parseInt(value) * 60 : parseInt(value);
}
