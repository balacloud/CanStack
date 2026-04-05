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
