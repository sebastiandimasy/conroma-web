-- Conroma — Panel + CRM: esquema inicial (Supabase/Postgres)
-- Decisiones 2026-11-01: alta de pisos propia + módulo de leads + Supabase oficial.
-- Seguridad: RLS en TODAS las tablas públicas. Rol del comercial en app_metadata
-- (NO user_metadata). Staff = authenticated con role in ('admin','comercial').
-- Revisar con `supabase db advisors` antes de dar por buena.

-- ───────────────────────── Helper de rol ─────────────────────────
-- SECURITY INVOKER (por defecto). Lee el rol del JWT (app_metadata), no editable por el usuario.
create or replace function public.is_staff()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'comercial'),
    false
  )
$$;

-- ───────────────────────── Tablas ─────────────────────────
-- Comerciales (espejo de auth.users; el login lo gestiona Supabase Auth).
create table if not exists public.agent (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null,
  email       text not null,
  role        text not null default 'comercial' check (role in ('admin','comercial')),
  created_at  timestamptz not null default now()
);

-- Inventario (fuente de verdad propia; la web pública lee los 'publicado').
create table if not exists public.property (
  id             uuid primary key default gen_random_uuid(),
  ref            text unique not null,
  operation      text not null check (operation in ('venta','alquiler')),
  type           text not null,
  town           text not null,
  zone           text not null,
  price          integer not null,
  previous_price integer,
  rooms          integer not null default 0,
  baths          integer not null default 0,
  area           integer not null default 0,
  floor          integer,
  elevator       boolean,
  parking        boolean,
  terrace        boolean,
  state          text,
  tag            text,
  description    text,
  likes          text,
  watch_out      text,
  geo_lat        double precision,
  geo_lng        double precision,
  radius_m       integer check (radius_m between 30 and 70),
  status         text not null default 'borrador' check (status in ('borrador','publicado','retirado')),
  created_by     uuid references public.agent (id),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists property_status_idx on public.property (status);
create index if not exists property_town_idx on public.property (town);

create table if not exists public.property_photo (
  id          uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.property (id) on delete cascade,
  storage_key text not null,        -- clave en el bucket property-photos
  sort_order  integer not null default 0,
  alt         text,
  created_at  timestamptz not null default now()
);
create index if not exists property_photo_property_idx on public.property_photo (property_id, sort_order);

-- Leads (captura desde la web + gestión).
create table if not exists public.lead (
  id                uuid primary key default gen_random_uuid(),
  name              text,
  phone             text,          -- E.164 para wa.me
  email             text,
  intent            text check (intent in ('comprar','vender','alquilar','valoracion','otro')),
  zone              text,
  budget            integer,
  property_ref      text,          -- piso de interés (si lo hay)
  source            text not null default 'web' check (source in ('web','whatsapp','formulario','llamada','valoracion','manual')),
  status            text not null default 'nuevo' check (status in ('nuevo','contactado','cita','ganado','perdido','sin_respuesta')),
  assigned_to       uuid references public.agent (id),
  consent_marketing boolean not null default false,
  consent_at        timestamptz,
  consent_source    text,
  created_at        timestamptz not null default now()
);
create index if not exists lead_status_idx on public.lead (status);
create index if not exists lead_assigned_idx on public.lead (assigned_to);

create table if not exists public.lead_event (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.lead (id) on delete cascade,
  type       text not null check (type in ('llamada','whatsapp','email','nota','cambio_estado')),
  note       text,
  agent_id   uuid references public.agent (id),
  created_at timestamptz not null default now()
);
create index if not exists lead_event_lead_idx on public.lead_event (lead_id, created_at);

create table if not exists public.client (
  id                uuid primary key default gen_random_uuid(),
  lead_id           uuid references public.lead (id),
  name              text not null,
  phone             text,
  email             text,
  consent_marketing boolean not null default false,
  created_at        timestamptz not null default now()
);

create table if not exists public.appointment (
  id          uuid primary key default gen_random_uuid(),
  property_id uuid references public.property (id),
  lead_id     uuid references public.lead (id),
  client_id   uuid references public.client (id),
  agent_id    uuid references public.agent (id),
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  status      text not null default 'pendiente' check (status in ('pendiente','realizada','no_show','cancelada')),
  notes       text,
  created_at  timestamptz not null default now()
);
create index if not exists appointment_agent_idx on public.appointment (agent_id, starts_at);

create table if not exists public.review_request (
  id             uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointment (id) on delete cascade,
  channel        text not null check (channel in ('whatsapp','email')),
  status         text not null default 'enviada' check (status in ('enviada','fallida','clic')),
  sent_at        timestamptz not null default now(),
  clicked_at     timestamptz
);

-- ───────────────────────── RLS ─────────────────────────
alter table public.agent           enable row level security;
alter table public.property        enable row level security;
alter table public.property_photo  enable row level security;
alter table public.lead            enable row level security;
alter table public.lead_event      enable row level security;
alter table public.client          enable row level security;
alter table public.appointment     enable row level security;
alter table public.review_request  enable row level security;

-- Staff: acceso total al CRM interno (gate por rol en app_metadata).
-- Patrón por tabla: SELECT/INSERT/UPDATE/DELETE to authenticated using/with check is_staff().
do $$
declare t text;
begin
  foreach t in array array[
    'agent','property','property_photo','lead','lead_event','client','appointment','review_request'
  ] loop
    execute format('create policy %I on public.%I for select to authenticated using (public.is_staff());', t||'_staff_sel', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_staff());', t||'_staff_ins', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_staff()) with check (public.is_staff());', t||'_staff_upd', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.is_staff());', t||'_staff_del', t);
  end loop;
end $$;

-- Web pública (anon/publishable): SOLO lectura de pisos PUBLICADOS y sus fotos.
-- Leads/citas/clientes NO tienen acceso anon.
create policy property_public_sel on public.property
  for select to anon using (status = 'publicado');

create policy property_photo_public_sel on public.property_photo
  for select to anon using (
    exists (select 1 from public.property p where p.id = property_id and p.status = 'publicado')
  );

-- ───────────────────────── Storage (fotos de pisos) ─────────────────────────
-- Bucket público (la web muestra las fotos). Escritura solo staff.
insert into storage.buckets (id, name, public)
values ('property-photos','property-photos', true)
on conflict (id) do nothing;

create policy property_photos_staff_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'property-photos' and public.is_staff());

create policy property_photos_staff_update on storage.objects
  for update to authenticated
  using (bucket_id = 'property-photos' and public.is_staff())
  with check (bucket_id = 'property-photos' and public.is_staff());

create policy property_photos_staff_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'property-photos' and public.is_staff());
-- (Lectura pública: el bucket es public=true, no requiere policy de SELECT.)
