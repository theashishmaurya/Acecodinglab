CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

create table
  public.users (
    id uuid not null,
    full_name text null,
    email text null,
    role text not null,
    profile_image_url text null,
    bio text null,
    location text null,
    phone_number text null,
    github_username text null,
    linkedin_url text null,
    website_url text null,
    skills text[] null,
    years_of_experience integer null,
    preferred_job_type text null,
    preferred_work_location text null,
    is_profile_public boolean null default false,
    last_active_at timestamp with time zone null,
    metadata jsonb null,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    constraint users_pkey primary key (id),
    constraint users_email_key unique (email),
    constraint users_id_fkey foreign key (id) references auth.users (id),
    constraint users_role_check check (
      (role = any (array['candidate'::text, 'hr'::text]))
    )
  ) tablespace pg_default;

create index if not exists idx_users_email on public.users using btree (email) tablespace pg_default;

create index if not exists idx_users_role on public.users using btree (role) tablespace pg_default;

create trigger set_users_updated_at before
update on users for each row
execute function set_updated_at ();