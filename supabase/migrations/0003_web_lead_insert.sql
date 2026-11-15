-- 0003_web_lead_insert.sql
-- La web es ESTÁTICA (Hostinger): el formulario inserta leads DIRECTO en Supabase con la
-- anon key (decisión: opción A). Esta policy permite SOLO INSERT a `anon` y acota lo que puede
-- escribir, para que un bot no pueda auto-asignarse asesor, fijar estado/interés ni meter
-- campos enormes. NO hay policy de SELECT/UPDATE/DELETE para anon → no puede leer leads.
-- Aplicar en Supabase → SQL Editor. Aditivo y seguro.

-- Mensaje libre del formulario web. Anon no puede escribir en lead_event, así que la nota
-- del contacto va en esta columna de `lead`.
alter table public.lead add column if not exists message text;

create policy lead_anon_insert on public.lead
  for insert to anon
  with check (
    assigned_to is null
    and status = 'nuevo'
    and temperature is null
    and source in ('web', 'formulario', 'valoracion')
    and char_length(coalesce(name, '')) <= 120
    and char_length(coalesce(email, '')) <= 160
    and char_length(coalesce(phone, '')) <= 40
    and char_length(coalesce(zone, '')) <= 120
    and char_length(coalesce(property_ref, '')) <= 40
    and char_length(coalesce(message, '')) <= 2000
    and char_length(coalesce(email, '') || coalesce(phone, '')) >= 5  -- algo de contacto
  );

-- IMPORTANTE para el cliente (ContactForm/ValuationWizard):
--   supabase.from('lead').insert(row, { returning: 'minimal' })
-- Sin `returning: 'minimal'`, PostgREST intenta devolver la fila y necesitaría SELECT (que anon
-- NO tiene) → el insert fallaría. Con 'minimal' no devuelve nada y funciona.

-- Límite de peticiones: en hosting estático no hay servidor para validar un CAPTCHA ni limitar
-- por IP. Defensa de Fase 1 = honeypot (campo `company` oculto, ya existe) + esta policy acotada.
-- Si aparece spam real, subir a opción B (Supabase Edge Function que valide Turnstile), o añadir
-- un trigger de tope global (p. ej. máx. N inserts 'nuevo' web por hora). No se implementa ahora.
