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

create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
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
