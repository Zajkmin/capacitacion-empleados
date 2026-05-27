create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Usuario',
  email text not null unique,
  role text not null default 'encuestador',
  extra_permissions text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
add column if not exists extra_permissions text[] not null default '{}';

create table if not exists public.roles (
  id text primary key,    
  label text not null,
  description text not null default '',
  color text not null default 'bg-slate-600',
  permissions text[] not null default '{}',
  locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if to_regclass('public.countries') is not null
    and to_regclass('public.project_groups') is null then
    alter table public.countries rename to project_groups;
  end if;
end;
$$;

create table if not exists public.project_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'custom',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.project_groups
add column if not exists type text not null default 'custom';

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.project_groups(id) on delete cascade,
  name text not null,
  bg_color text not null default 'bg-sky-600',
  text_color text not null default 'text-white',
  cover_image text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'country_id'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'group_id'
  ) then
    alter table public.projects rename column country_id to group_id;
  end if;
end;
$$;

alter table public.projects
alter column group_id set not null;

do $$
declare
  constraint_name text;
begin
  select tc.constraint_name into constraint_name
  from information_schema.table_constraints tc
  join information_schema.key_column_usage kcu
    on tc.constraint_name = kcu.constraint_name
    and tc.table_schema = kcu.table_schema
  where tc.table_schema = 'public'
    and tc.table_name = 'projects'
    and tc.constraint_type = 'FOREIGN KEY'
    and kcu.column_name = 'group_id'
  limit 1;

  if constraint_name is not null then
    execute format('alter table public.projects drop constraint %I', constraint_name);
  end if;
end;
$$;

alter table public.projects
add constraint projects_group_id_fkey
foreign key (group_id) references public.project_groups(id) on delete cascade;

create table if not exists public.project_sections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text not null default '',
  type text not null default 'rules',
  content text,
  color text not null default 'bg-primary',
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.roles (id, label, description, color, permissions, locked)
values
  (
    'admin',
    'Administrador',
    'Acceso completo a todas las funciones',
    'bg-red-600',
    array[
      'view_dashboard',
      'view_projects',
      'view_sections',
      'add_section',
      'edit_section',
      'delete_section',
      'manage_users',
      'view_training',
      'view_updates',
      'manage_roles'
    ],
    true
  ),
  (
    'supervisor',
    'Supervisor',
    'Coordina equipos y supervisa proyectos',
    'bg-blue-600',
    array[
      'view_dashboard',
      'view_projects',
      'view_sections',
      'view_training',
      'view_updates'
    ],
    false
  ),
  (
    'encuestador',
    'Encuestador',
    'Acceso operativo a proyectos y capacitacion',
    'bg-green-600',
    array[
      'view_dashboard',
      'view_projects',
      'view_sections',
      'view_training'
    ],
    false
  ),
  (
    'analista_calidad',
    'Analista Control de Calidad',
    'Revisa, edita y valida contenido operativo',
    'bg-purple-600',
    array[
      'view_dashboard',
      'view_projects',
      'view_sections',
      'add_section',
      'edit_section',
      'view_training',
      'view_updates'
    ],
    false
  )
on conflict (id) do nothing;

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
for each row
execute function public.set_updated_at();

drop trigger if exists roles_set_updated_at on public.roles;
create trigger roles_set_updated_at
before update on public.roles
for each row
execute function public.set_updated_at();

drop trigger if exists countries_set_updated_at on public.project_groups;
drop trigger if exists project_groups_set_updated_at on public.project_groups;
create trigger project_groups_set_updated_at
before update on public.project_groups
for each row
execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

drop trigger if exists project_sections_set_updated_at on public.project_sections;
create trigger project_sections_set_updated_at
before update on public.project_sections
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Usuario'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'encuestador')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.project_groups enable row level security;
alter table public.projects enable row level security;
alter table public.project_sections enable row level security;

create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_user_permissions()
returns text[]
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(r.permissions, '{}') || coalesce(p.extra_permissions, '{}')
  from public.profiles p
  left join public.roles r on r.id = p.role
  where p.id = auth.uid();
$$;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Admins can read profiles" on public.profiles;
create policy "Admins can read profiles"
on public.profiles
for select
to authenticated
using (public.current_user_role() = 'admin');

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
on public.profiles
for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "Authenticated users can read roles" on public.roles;
create policy "Authenticated users can read roles"
on public.roles
for select
to authenticated
using (true);

drop policy if exists "Admins can insert roles" on public.roles;
create policy "Admins can insert roles"
on public.roles
for insert
to authenticated
with check (public.current_user_role() = 'admin');

drop policy if exists "Admins can update roles" on public.roles;
create policy "Admins can update roles"
on public.roles
for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "Admins can delete roles" on public.roles;
create policy "Admins can delete roles"
on public.roles
for delete
to authenticated
using (public.current_user_role() = 'admin' and locked = false);

drop policy if exists "Authenticated users can read countries" on public.project_groups;
drop policy if exists "Admins can manage countries" on public.project_groups;
drop policy if exists "Authenticated users can read project groups" on public.project_groups;
create policy "Authenticated users can read project groups"
on public.project_groups
for select
to authenticated
using (true);

drop policy if exists "Admins can manage project groups" on public.project_groups;
create policy "Admins can manage project groups"
on public.project_groups
for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "Authenticated users can read projects" on public.projects;
create policy "Authenticated users can read projects"
on public.projects
for select
to authenticated
using (true);

drop policy if exists "Admins can manage projects" on public.projects;
create policy "Admins can manage projects"
on public.projects
for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "Authenticated users can read project sections" on public.project_sections;
create policy "Authenticated users can read project sections"
on public.project_sections
for select
to authenticated
using (true);

drop policy if exists "Users with add_section can insert project sections" on public.project_sections;
create policy "Users with add_section can insert project sections"
on public.project_sections
for insert
to authenticated
with check (
  public.current_user_role() = 'admin'
  or 'add_section' = any(public.current_user_permissions())
);

drop policy if exists "Users with edit_section can update project sections" on public.project_sections;
create policy "Users with edit_section can update project sections"
on public.project_sections
for update
to authenticated
using (
  public.current_user_role() = 'admin'
  or 'edit_section' = any(public.current_user_permissions())
)
with check (
  public.current_user_role() = 'admin'
  or 'edit_section' = any(public.current_user_permissions())
);

drop policy if exists "Users with delete_section can delete project sections" on public.project_sections;
create policy "Users with delete_section can delete project sections"
on public.project_sections
for delete
to authenticated
using (
  public.current_user_role() = 'admin'
  or 'delete_section' = any(public.current_user_permissions())
);
