import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { createBrowserClient } from '../lib/supabase';

// Panel interno de Conroma: login (Supabase Auth) + gestión de pisos y de leads.
// El CRUD va directo contra Supabase desde el navegador, protegido por RLS
// (solo usuarios 'staff' pueden leer/escribir). Cada comercial entra con su usuario/contraseña.

type Supa = ReturnType<typeof createBrowserClient>;

type Property = {
  id?: string;
  ref: string;
  operation: 'venta' | 'alquiler';
  type: string;
  town: string;
  zone: string;
  price: number;
  previous_price: number | null;
  rooms: number;
  baths: number;
  area: number;
  floor: number | null;
  elevator: boolean | null;
  parking: boolean | null;
  terrace: boolean | null;
  state: string;
  tag: string;
  description: string;
  likes: string;
  watch_out: string;
  geo_lat: number | null;
  geo_lng: number | null;
  radius_m: number | null;
  status: 'borrador' | 'publicado' | 'retirado';
};

const empty: Property = {
  ref: '', operation: 'venta', type: '', town: '', zone: '', price: 0, previous_price: null,
  rooms: 0, baths: 0, area: 0, floor: null, elevator: null, parking: null, terrace: null,
  state: '', tag: '', description: '', likes: '', watch_out: '',
  geo_lat: null, geo_lng: null, radius_m: null, status: 'borrador',
};

type Lead = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  intent: string | null;
  zone: string | null;
  budget: number | null;
  property_ref: string | null;
  source: string;
  status: string;
  temperature: string | null;
  assigned_to: string | null;
  created_at: string;
};

type LeadEvent = {
  id: string;
  lead_id: string;
  type: string;
  note: string | null;
  created_at: string;
};

const LEAD_STATUSES = ['nuevo', 'contactado', 'cita', 'ganado', 'perdido', 'sin_respuesta'];
const STATUS_LABEL: Record<string, string> = {
  nuevo: 'Nuevo', contactado: 'Contactado', cita: 'Cita', ganado: 'Ganado',
  perdido: 'Perdido', sin_respuesta: 'Sin respuesta',
};
const TEMPS = ['caliente', 'templado', 'frio'];
const TEMP_LABEL: Record<string, string> = { caliente: 'Caliente', templado: 'Templado', frio: 'Frío' };

export default function AdminApp() {
  const supabase = useMemo(() => createBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  if (loading) return <p className="admin__muted">Cargando…</p>;
  if (!session) return <Login supabase={supabase} />;
  return <Panel supabase={supabase} email={session.user.email ?? ''} />;
}

function Login({ supabase }: { supabase: Supa }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  }

  return (
    <form className="admin__login" onSubmit={submit}>
      <h1 className="admin__title">Panel Conroma</h1>
      <p className="admin__muted">Entra con tu usuario y contraseña.</p>
      <label className="field">
        <span className="field__label">Email</span>
        <input className="field__control" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className="field">
        <span className="field__label">Contraseña</span>
        <input className="field__control" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error && <p className="admin__error">{error}</p>}
      <button className="button button--primary button--block" type="submit" disabled={busy}>
        {busy ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}

function Panel({ supabase, email }: { supabase: Supa; email: string }) {
  const [view, setView] = useState<'pisos' | 'leads'>('leads');

  return (
    <div className="admin__panel">
      <header className="admin__bar">
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={`button button--small ${view === 'leads' ? 'button--primary' : 'button--ghost'}`}
            onClick={() => setView('leads')}
          >
            Leads
          </button>
          <button
            className={`button button--small ${view === 'pisos' ? 'button--primary' : 'button--ghost'}`}
            onClick={() => setView('pisos')}
          >
            Pisos
          </button>
        </div>
        <span className="admin__muted">{email}</span>
        <button className="button button--ghost button--small" onClick={() => supabase.auth.signOut()}>Salir</button>
      </header>
      {view === 'pisos' ? <PisosView supabase={supabase} /> : <LeadsView supabase={supabase} />}
    </div>
  );
}

/* ---------------------------------- PISOS ---------------------------------- */

function PisosView({ supabase }: { supabase: Supa }) {
  const [list, setList] = useState<Property[]>([]);
  const [editing, setEditing] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('property').select('*').order('created_at', { ascending: false });
    setList((data as Property[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  if (editing) {
    return <PropertyForm supabase={supabase} initial={editing} onDone={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />;
  }

  return (
    <>
      <button className="button button--primary" onClick={() => setEditing({ ...empty })}>+ Nuevo piso</button>
      {loading ? (
        <p className="admin__muted">Cargando pisos…</p>
      ) : list.length === 0 ? (
        <p className="admin__muted">Aún no hay pisos. Crea el primero.</p>
      ) : (
        <ul className="admin__list">
          {list.map((p) => (
            <li key={p.id} className="admin__row">
              <button className="admin__rowbtn" onClick={() => setEditing(p)}>
                <strong>{p.ref}</strong> · {p.type} en {p.zone}, {p.town} · {p.price.toLocaleString('es-ES')} €
                <span className={`admin__badge admin__badge--${p.status}`}>{p.status}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function PropertyForm({ supabase, initial, onDone, onCancel }: {
  supabase: Supa;
  initial: Property;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [p, setP] = useState<Property>(initial);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: keyof Property, v: unknown) => setP((prev) => ({ ...prev, [k]: v }));
  const num = (v: string) => (v === '' ? null : Number(v));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const row = { ...p, updated_at: new Date().toISOString() };
    const { error } = p.id
      ? await supabase.from('property').update(row).eq('id', p.id)
      : await supabase.from('property').insert(row);
    setBusy(false);
    if (error) setError(error.message);
    else onDone();
  }

  return (
    <form className="admin__form" onSubmit={save}>
      <div className="admin__bar">
        <strong>{p.id ? 'Editar piso' : 'Nuevo piso'}</strong>
        <button type="button" className="button button--ghost button--small" onClick={onCancel}>Cancelar</button>
      </div>

      <div className="admin__grid">
        <L label="Referencia"><input className="field__control" value={p.ref} onChange={(e) => set('ref', e.target.value)} required /></L>
        <L label="Operación">
          <select className="field__control" value={p.operation} onChange={(e) => set('operation', e.target.value)}>
            <option value="venta">Venta</option><option value="alquiler">Alquiler</option>
          </select>
        </L>
        <L label="Tipo (p. ej. Piso, Chalet)"><input className="field__control" value={p.type} onChange={(e) => set('type', e.target.value)} required /></L>
        <L label="Pueblo"><input className="field__control" value={p.town} onChange={(e) => set('town', e.target.value)} required /></L>
        <L label="Zona"><input className="field__control" value={p.zone} onChange={(e) => set('zone', e.target.value)} required /></L>
        <L label="Precio (€)"><input className="field__control" type="number" value={p.price} onChange={(e) => set('price', Number(e.target.value))} required /></L>
        <L label="Precio anterior (€)"><input className="field__control" type="number" value={p.previous_price ?? ''} onChange={(e) => set('previous_price', num(e.target.value))} /></L>
        <L label="Habitaciones"><input className="field__control" type="number" value={p.rooms} onChange={(e) => set('rooms', Number(e.target.value))} /></L>
        <L label="Baños"><input className="field__control" type="number" value={p.baths} onChange={(e) => set('baths', Number(e.target.value))} /></L>
        <L label="m²"><input className="field__control" type="number" value={p.area} onChange={(e) => set('area', Number(e.target.value))} /></L>
        <L label="Planta"><input className="field__control" type="number" value={p.floor ?? ''} onChange={(e) => set('floor', num(e.target.value))} /></L>
        <L label="Estado (p. ej. Reformado)"><input className="field__control" value={p.state} onChange={(e) => set('state', e.target.value)} /></L>
        <L label="Radio del mapa (30–70 m)"><input className="field__control" type="number" min={30} max={70} value={p.radius_m ?? ''} onChange={(e) => set('radius_m', num(e.target.value))} /></L>
        <L label="Latitud"><input className="field__control" type="number" step="any" value={p.geo_lat ?? ''} onChange={(e) => set('geo_lat', num(e.target.value))} /></L>
        <L label="Longitud"><input className="field__control" type="number" step="any" value={p.geo_lng ?? ''} onChange={(e) => set('geo_lng', num(e.target.value))} /></L>
      </div>

      <div className="admin__checks">
        <label><input type="checkbox" checked={!!p.elevator} onChange={(e) => set('elevator', e.target.checked)} /> Ascensor</label>
        <label><input type="checkbox" checked={!!p.parking} onChange={(e) => set('parking', e.target.checked)} /> Parking</label>
        <label><input type="checkbox" checked={!!p.terrace} onChange={(e) => set('terrace', e.target.checked)} /> Terraza</label>
      </div>

      <L label="Descripción"><textarea className="field__control" rows={3} value={p.description} onChange={(e) => set('description', e.target.value)} /></L>
      <L label="Lo que más gusta"><textarea className="field__control" rows={2} value={p.likes} onChange={(e) => set('likes', e.target.value)} /></L>
      <L label="A tener en cuenta"><textarea className="field__control" rows={2} value={p.watch_out} onChange={(e) => set('watch_out', e.target.value)} /></L>

      <L label="Estado de publicación">
        <select className="field__control" value={p.status} onChange={(e) => set('status', e.target.value)}>
          <option value="borrador">Borrador</option>
          <option value="publicado">Publicado (sale en la web)</option>
          <option value="retirado">Retirado</option>
        </select>
      </L>

      <p className="admin__muted">Las fotos se añadirán en el siguiente paso (subida a Storage).</p>
      {error && <p className="admin__error">{error}</p>}
      <button className="button button--primary button--block" type="submit" disabled={busy}>
        {busy ? 'Guardando…' : 'Guardar piso'}
      </button>
    </form>
  );
}

/* ---------------------------------- LEADS ---------------------------------- */

function LeadsView({ supabase }: { supabase: Supa }) {
  const [list, setList] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('todos');
  const [selected, setSelected] = useState<Lead | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('lead').select('*').order('created_at', { ascending: false });
    setList((data as Lead[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  if (selected) {
    return (
      <LeadDetail
        supabase={supabase}
        lead={selected}
        onBack={() => { setSelected(null); load(); }}
      />
    );
  }

  const shown = filter === 'todos' ? list : list.filter((l) => l.status === filter);
  const count = (s: string) => list.filter((l) => l.status === s).length;

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        <button
          className={`button button--small ${filter === 'todos' ? 'button--primary' : 'button--ghost'}`}
          onClick={() => setFilter('todos')}
        >
          Todos ({list.length})
        </button>
        {LEAD_STATUSES.map((s) => (
          <button
            key={s}
            className={`button button--small ${filter === s ? 'button--primary' : 'button--ghost'}`}
            onClick={() => setFilter(s)}
          >
            {STATUS_LABEL[s]} ({count(s)})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="admin__muted">Cargando leads…</p>
      ) : shown.length === 0 ? (
        <p className="admin__muted">No hay leads en este estado. Entran solos desde el formulario de la web.</p>
      ) : (
        <ul className="admin__list">
          {shown.map((l) => (
            <li key={l.id} className="admin__row">
              <button className="admin__rowbtn" onClick={() => setSelected(l)} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <strong>{l.name || 'Sin nombre'}</strong>
                {l.phone && <span className="admin__muted">{l.phone}</span>}
                {l.intent && <Chip>{l.intent}</Chip>}
                <Chip>{l.source}</Chip>
                {l.temperature && <Chip>{TEMP_LABEL[l.temperature] ?? l.temperature}</Chip>}
                <StatusChip status={l.status} />
                <span className="admin__muted" style={{ marginLeft: 'auto', fontSize: 12 }}>{fmtDate(l.created_at)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function LeadDetail({ supabase, lead, onBack }: { supabase: Supa; lead: Lead; onBack: () => void }) {
  const [status, setStatus] = useState(lead.status);
  const [temperature, setTemperature] = useState(lead.temperature ?? '');
  const [events, setEvents] = useState<LeadEvent[]>([]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function loadEvents() {
    const { data } = await supabase.from('lead_event').select('*').eq('lead_id', lead.id).order('created_at', { ascending: true });
    setEvents((data as LeadEvent[]) ?? []);
  }
  useEffect(() => { loadEvents(); }, []);

  async function changeStatus(next: string) {
    setStatus(next);
    setError('');
    const { error } = await supabase.from('lead').update({ status: next }).eq('id', lead.id);
    if (error) { setError(error.message); return; }
    await supabase.from('lead_event').insert({ lead_id: lead.id, type: 'cambio_estado', note: `Estado: ${STATUS_LABEL[next] ?? next}` });
    loadEvents();
  }

  async function changeTemperature(next: string) {
    setTemperature(next);
    setError('');
    const { error } = await supabase.from('lead').update({ temperature: next || null }).eq('id', lead.id);
    if (error) setError(error.message);
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setBusy(true);
    setError('');
    const { error } = await supabase.from('lead_event').insert({ lead_id: lead.id, type: 'nota', note: note.trim() });
    setBusy(false);
    if (error) { setError(error.message); return; }
    setNote('');
    loadEvents();
  }

  const waPhone = (lead.phone ?? '').replace(/[^\d]/g, '');

  return (
    <div className="admin__form">
      <div className="admin__bar">
        <button type="button" className="button button--ghost button--small" onClick={onBack}>← Volver</button>
        <strong>{lead.name || 'Lead sin nombre'}</strong>
        <StatusChip status={status} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '4px 0 12px' }}>
        {lead.intent && <Chip>Intención: {lead.intent}</Chip>}
        <Chip>Origen: {lead.source}</Chip>
        {lead.zone && <Chip>Zona: {lead.zone}</Chip>}
        {lead.property_ref && <Chip>Piso: {lead.property_ref}</Chip>}
        {lead.budget != null && <Chip>Presupuesto: {lead.budget.toLocaleString('es-ES')} €</Chip>}
        <Chip>Entró: {fmtDate(lead.created_at)}</Chip>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
        {waPhone && (
          <a className="button button--primary button--small" href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        )}
        {lead.phone && (
          <a className="button button--ghost button--small" href={`tel:${lead.phone}`}>Llamar</a>
        )}
        {lead.email && (
          <a className="button button--ghost button--small" href={`mailto:${lead.email}`}>Email</a>
        )}
      </div>

      <div className="admin__grid">
        <L label="Estado">
          <select className="field__control" value={status} onChange={(e) => changeStatus(e.target.value)}>
            {LEAD_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </L>
        <L label="Nivel de interés">
          <select className="field__control" value={temperature} onChange={(e) => changeTemperature(e.target.value)}>
            <option value="">Sin marcar</option>
            {TEMPS.map((t) => <option key={t} value={t}>{TEMP_LABEL[t]}</option>)}
          </select>
        </L>
      </div>

      {error && <p className="admin__error">{error}</p>}

      <h3 style={{ marginTop: 16 }}>Historial</h3>
      {events.length === 0 ? (
        <p className="admin__muted">Sin interacciones todavía.</p>
      ) : (
        <ul className="admin__list">
          {events.map((ev) => (
            <li key={ev.id} className="admin__row" style={{ padding: '10px 12px' }}>
              <div>
                <Chip>{ev.type}</Chip>{' '}
                <span className="admin__muted" style={{ fontSize: 12 }}>{fmtDate(ev.created_at)}</span>
                {ev.note && <div style={{ marginTop: 4 }}>{ev.note}</div>}
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={addNote} style={{ marginTop: 8 }}>
        <L label="Añadir nota">
          <textarea className="field__control" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej. Llamada: le interesa el T-2093, enseñar el jueves." />
        </L>
        <button className="button button--primary button--small" type="submit" disabled={busy}>
          {busy ? 'Guardando…' : 'Guardar nota'}
        </button>
      </form>
    </div>
  );
}

/* ------------------------------- helpers UI ------------------------------- */

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
    </label>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="tag">{children}</span>;
}

function StatusChip({ status }: { status: string }) {
  const tone =
    status === 'ganado' ? { color: 'var(--color-positive)', borderColor: 'var(--color-positive)' }
    : status === 'perdido' ? { color: 'var(--color-negative)', borderColor: 'var(--color-negative)' }
    : undefined;
  return <span className="tag" style={tone}>{STATUS_LABEL[status] ?? status}</span>;
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}
