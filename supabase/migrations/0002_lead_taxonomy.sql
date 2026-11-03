-- 0002_lead_taxonomy.sql
-- Alinea el canal (source) y la intención (intent) del lead con el modelo del CRM y
-- añade el nivel de interés (temperature). Aditivo y seguro: no borra valores ni filas.
-- Aplicar en Supabase → SQL Editor.

alter table public.lead drop constraint if exists lead_source_check;
alter table public.lead add constraint lead_source_check
  check (source in (
    'whatsapp','web','formulario','instagram','idealista','fotocasa',
    'llamada','recomendacion','valoracion','manual'
  ));

alter table public.lead drop constraint if exists lead_intent_check;
alter table public.lead add constraint lead_intent_check
  check (intent in ('comprar','vender','alquilar','reformar','valoracion','patrimonio','otro'));

-- Nivel de interés (lo marca el asesor): Caliente / Templado / Frío.
alter table public.lead add column if not exists temperature text
  check (temperature in ('caliente','templado','frio'));
