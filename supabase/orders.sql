-- À exécuter dans Supabase SQL Editor (une seule fois)
-- Table préfixée "mmj_" (Morocco Magic Journey) pour éviter toute collision
-- si ce projet Supabase est partagé avec d'autres apps.

create table if not exists public.mmj_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  method text not null check (method in ('stripe', 'cmi')),
  currency text not null,
  amount_due numeric not null,
  email text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  provider_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mmj_orders_order_id_idx on public.mmj_orders (order_id);

-- RLS activé, mais AUCUNE policy publique n'est ajoutée volontairement :
-- seule la clé "service role" (utilisée uniquement côté serveur, jamais
-- exposée au navigateur) peut lire/écrire cette table. La clé "anon"
-- (publique) n'a aucun accès par défaut.
alter table public.mmj_orders enable row level security;
