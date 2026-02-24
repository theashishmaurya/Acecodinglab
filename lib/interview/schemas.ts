import { z } from 'zod';

export const interviewSettingsSchema = z.object({
  allow_hints: z.boolean().default(true),
  max_hints_per_challenge: z.number().min(0).max(10).default(3),
  show_timer: z.boolean().default(true),
  allow_code_explanation: z.boolean().default(true),
  require_fullscreen: z.boolean().default(true),
  block_copy_paste: z.boolean().default(true),
  enable_breaks: z.boolean().default(false),
  max_breaks: z.number().min(0).max(5).default(1),
});

export const createInterviewSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(1000).optional(),
  type: z.enum(['live', 'ai_conducted', 'take_home']).default('live'),
  scheduled_at: z.string().datetime().optional().nullable(),
  duration_minutes: z.number().min(15).max(480).default(60),
  timezone: z.string().default('UTC'),
  auto_record: z.boolean().default(true),
  anti_cheat_enabled: z.boolean().default(true),
  ai_proctoring_enabled: z.boolean().default(false),
  selected_challenges: z.array(z.string()).min(1, 'Select at least one challenge'),
  notes: z.string().max(2000).optional(),
  settings: interviewSettingsSchema.optional(),
  participants: z.array(z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().optional(),
    role: z.enum(['interviewer', 'candidate', 'observer']).default('candidate'),
  })).optional(),
});

export const updateInterviewSchema = createInterviewSchema.partial();

export const createParticipantSchema = z.object({
  interview_id: z.string().uuid(),
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  role: z.enum(['interviewer', 'candidate', 'observer']).default('candidate'),
});

export const interviewListFiltersSchema = z.object({
  status: z.enum(['draft', 'scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
  type: z.enum(['live', 'ai_conducted', 'take_home']).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
export type CreateParticipantInput = z.infer<typeof createParticipantSchema>;
export type InterviewListFilters = z.infer<typeof interviewListFiltersSchema>;