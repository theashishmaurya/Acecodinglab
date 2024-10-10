create table
  public.overall_scores (
    id uuid not null default extensions.uuid_generate_v4 (),
    attempt_id uuid null,
    total_score numeric null,
    percentage_score numeric null,
    feedback text null,
    metadata jsonb null,
    calculated_at timestamp with time zone null default current_timestamp,
    constraint overall_scores_pkey primary key (id),
    constraint overall_scores_attempt_id_key unique (attempt_id),
    constraint overall_scores_attempt_id_fkey foreign key (attempt_id) references interview_attempts (id)
  ) tablespace pg_default;