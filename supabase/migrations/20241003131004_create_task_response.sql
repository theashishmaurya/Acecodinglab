create table
  public.task_responses (
    id uuid not null default extensions.uuid_generate_v4 (),
    attempt_id uuid not null,
    code_snapshot text not null,
    submitted_at timestamp with time zone null default current_timestamp,
    attempted boolean null default false,
    template_id text not null,
    template_name text null,
    constraint task_responses_pkey primary key (id),
    constraint task_responses_attempt_id_fkey foreign key (attempt_id) references interview_attempts (id)
  ) tablespace pg_default;