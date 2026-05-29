-- ============================================================
-- Trigger Supabase Auth → profiles
-- À exécuter UNE SEULE FOIS dans Supabase SQL Editor
-- après avoir appliqué les migrations Prisma (prisma migrate dev)
--
-- Ce trigger crée automatiquement une ligne dans `profiles`
-- à chaque nouvel utilisateur inscrit via Supabase Auth.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Utilisateur'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'supervisor')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Supprimer l'ancien trigger s'il existe
drop trigger if exists on_auth_user_created on auth.users;

-- Créer le trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
