// Interview Platform Types

export type InterviewStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type InterviewType = 'live' | 'ai_conducted' | 'take_home';
export type ParticipantRole = 'interviewer' | 'candidate' | 'observer';
export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'expired';
export type SessionStatus = 'not_started' | 'in_progress' | 'submitted' | 'timeout';
export type Recommendation = 'strong_yes' | 'yes' | 'maybe' | 'no' | 'strong_no';
export type AntiCheatEventType = 
  | 'tab_switch'
  | 'copy_paste'
  | 'devtools_open'
  | 'fullscreen_exit'
  | 'right_click'
  | 'keyboard_shortcut'
  | 'window_blur'
  | 'multiple_faces'
  | 'no_face_detected'
  | 'suspicious_audio'
  | 'external_api_call'
  | 'unusual_typing_pattern';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Interview {
  id: string;
  title: string;
  description?: string;
  interviewer_id: string;
  status: InterviewStatus;
  type: InterviewType;
  scheduled_at?: Date;
  duration_minutes: number;
  max_candidates: number;
  auto_record: boolean;
  anti_cheat_enabled: boolean;
  ai_proctoring_enabled: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface InterviewParticipant {
  id: string;
  interview_id: string;
  user_id?: string;
  email?: string;
  name?: string;
  role: ParticipantRole;
  invite_token?: string;
  invite_status: InviteStatus;
  joined_at?: Date;
  left_at?: Date;
  created_at: Date;
}

export interface InterviewChallenge {
  id: string;
  interview_id: string;
  challenge_key: string;
  order_index: number;
  time_limit_minutes?: number;
  required: boolean;
  created_at: Date;
}

export interface InterviewSession {
  id: string;
  interview_id: string;
  participant_id: string;
  challenge_id?: string;
  started_at?: Date;
  submitted_at?: Date;
  code_snapshot?: string;
  language: string;
  status: SessionStatus;
  
  // AI Evaluation
  ai_score?: number;
  ai_feedback?: string;
  code_quality_score?: number;
  communication_score?: number;
  problem_solving_score?: number;
  
  created_at: Date;
  updated_at: Date;
}

export interface AntiCheatEvent {
  id: string;
  session_id: string;
  event_type: AntiCheatEventType;
  severity: Severity;
  details?: Record<string, any>;
  screenshot_url?: string;
  timestamp: Date;
}

export interface AIConversation {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  created_at: Date;
}

export interface InterviewRecording {
  id: string;
  interview_id: string;
  participant_id?: string;
  recording_url: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  format: string;
  status: 'processing' | 'ready' | 'error';
  created_at: Date;
}

export interface CandidateEvaluation {
  id: string;
  interview_id: string;
  participant_id: string;
  
  // Scores
  overall_score?: number;
  technical_score?: number;
  communication_score?: number;
  problem_solving_score?: number;
  code_quality_score?: number;
  
  // AI Generated
  ai_summary?: string;
  strengths?: string[];
  areas_for_improvement?: string[];
  
  // Reviewer Notes
  interviewer_notes?: string;
  recommendation?: Recommendation;
  
  // Trust/Integrity
  trust_score: number;
  cheat_events_count: number;
  
  created_at: Date;
  updated_at: Date;
}

// Real-time events for live collaboration
export interface RealtimeEvent {
  type: 'code_change' | 'cursor_move' | 'selection' | 'chat' | 'presence' | 'draw';
  participant_id: string;
  timestamp: number;
  data: any;
}

export interface ChatMessage {
  id: string;
  interview_id: string;
  participant_id: string;
  participant_name: string;
  content: string;
  type: 'text' | 'system' | 'ai';
  created_at: Date;
}

// AI Interviewer types
export interface AIInterviewerState {
  active: boolean;
  current_question?: string;
  question_index: number;
  follow_ups_asked: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  engagement_level: 'high' | 'medium' | 'low';
}

export interface AIQuestion {
  id: string;
  question: string;
  type: 'technical' | 'behavioral' | 'clarification' | 'follow_up';
  expected_duration_seconds: number;
  keywords: string[];
  rubric: {
    excellent: string[];
    good: string[];
    needs_improvement: string[];
  };
}