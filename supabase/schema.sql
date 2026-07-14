-- Run in Supabase SQL Editor after creating the project.

-- Profiles (one row per auth user, including anonymous guests)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  weight_kg numeric,
  height_cm numeric,
  activity_level text not null default 'moderate'
    check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  goal_intent text check (goal_intent in ('lose', 'maintain', 'gain')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Meal diary entries
create table if not exists public.meal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date text not null,
  meal_type text not null
    check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  food_id text not null,
  food_source text not null,
  title text not null,
  brand text,
  image_url text,
  quantity numeric not null,
  serving_amount numeric not null,
  serving_unit text,
  nutrients jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists meal_entries_user_date_idx
  on public.meal_entries (user_id, date);

-- Auto-create profile on sign-up (anonymous or registered)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists meal_entries_set_updated_at on public.meal_entries;
create trigger meal_entries_set_updated_at
  before update on public.meal_entries
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.meal_entries enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "meal_entries_select_own" on public.meal_entries;
create policy "meal_entries_select_own"
  on public.meal_entries for select
  using (auth.uid() = user_id);

drop policy if exists "meal_entries_insert_own" on public.meal_entries;
create policy "meal_entries_insert_own"
  on public.meal_entries for insert
  with check (auth.uid() = user_id);

drop policy if exists "meal_entries_update_own" on public.meal_entries;
create policy "meal_entries_update_own"
  on public.meal_entries for update
  using (auth.uid() = user_id);

drop policy if exists "meal_entries_delete_own" on public.meal_entries;
create policy "meal_entries_delete_own"
  on public.meal_entries for delete
  using (auth.uid() = user_id);
