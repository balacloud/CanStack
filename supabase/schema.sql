create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  province text not null check (char_length(province) <= 3),
  plan_tier text not null default 'starter' check (plan_tier in ('starter', 'growth', 'scale')),
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_responses (
  user_id uuid primary key references public.users(id) on delete cascade,
  income_range text not null,
  family_size text not null,
  work_type text not null
);

create table if not exists public.recommendations (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  category text not null,
  provider_name text not null,
  affiliate_link text not null
);

alter table public.users enable row level security;
alter table public.quiz_responses enable row level security;
alter table public.recommendations enable row level security;

create policy "users can read their profile"
on public.users
for select
using (auth.uid() = id);

create policy "users can update their profile"
on public.users
for update
using (auth.uid() = id);

create policy "users can insert their profile"
on public.users
for insert
with check (auth.uid() = id);

create policy "users can manage own quiz responses"
on public.quiz_responses
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can manage own recommendations"
on public.recommendations
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Compliance Hub extension
create table if not exists contractor_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  province text not null,
  work_type text not null,
  industry text not null,
  has_employees boolean default false,
  employee_count integer default 0,
  annual_revenue_range text,
  gst_hst_registered boolean default false,
  filing_frequency text default 'quarterly',
  remitter_type text default 'regular',
  fiscal_year_start date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists compliance_acknowledgements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  deadline_id text not null,
  acknowledged_at timestamptz default now(),
  status text default 'pending' check (status in ('pending', 'done', 'snoozed'))
);

alter table contractor_profiles enable row level security;
alter table compliance_acknowledgements enable row level security;

create policy "Users can only access own profile"
  on contractor_profiles for all using (auth.uid() = user_id);

create policy "Users can only access own acknowledgements"
  on compliance_acknowledgements for all using (auth.uid() = user_id);

-- ============================================================
-- Admin: Data Sourcing System (Phase 1)
-- No RLS — accessed exclusively via service-role key in
-- server-side Route Handlers. Never exposed to anon key.
-- ============================================================

-- Source Registry: every official URL we monitor
create table if not exists data_sources (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  jurisdiction    text not null,
  category        text not null,
  source_url      text not null,
  document_ref    text,
  effective_date  date,
  update_cycle    text not null,
  next_expected   date,
  ts_file         text not null,
  ts_constant     text not null,
  notes           text,
  is_active       boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Snapshots: content hash per fetch attempt (change detection)
create table if not exists source_snapshots (
  id              uuid primary key default gen_random_uuid(),
  source_id       uuid not null references data_sources(id) on delete cascade,
  fetched_at      timestamptz default now(),
  http_status     integer,
  content_hash    text,
  content_length  integer,
  hash_changed    boolean not null default false,
  error_message   text,
  created_at      timestamptz default now()
);

create index if not exists idx_snapshots_source_time
  on source_snapshots(source_id, fetched_at desc);

-- Audit Log: immutable append-only action history
create table if not exists audit_log (
  id              uuid primary key default gen_random_uuid(),
  action          text not null,
  source_id       uuid references data_sources(id),
  details         jsonb,
  actor           text not null default 'system',
  created_at      timestamptz default now()
);

create index if not exists idx_audit_created
  on audit_log(created_at desc);
