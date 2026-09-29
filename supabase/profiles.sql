-- Ejecutar una vez en Supabase SQL Editor. Perfiles públicos; el correo nunca se publica.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,20}$'),
  display_name text not null check (char_length(display_name) between 2 and 40),
  bio text not null default '' check (char_length(bio) <= 240),
  avatar_color text not null default 'rose' check (avatar_color in ('rose','lilac','peach','mint','sky')),
  favorite_genre text not null default '' check (char_length(favorite_genre) <= 40),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
grant select on public.profiles to anon, authenticated;
grant update (display_name, bio, avatar_color, favorite_genre) on public.profiles to authenticated;

create policy "Perfiles visibles" on public.profiles
  for select to anon, authenticated using (true);
create policy "Editar perfil propio" on public.profiles
  for update to authenticated using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.handle_new_kagura_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    lower(new.raw_user_meta_data ->> 'username'),
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), 'Fan de anime')
  );
  return new;
end;
$$;

create trigger on_kagura_user_created
  after insert on auth.users
  for each row execute function public.handle_new_kagura_user();
