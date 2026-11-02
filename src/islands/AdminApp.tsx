import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { createBrowserClient } from '../lib/supabase';

// Panel interno de Conroma: login (Supabase Auth) + alta/edición de pisos.
// El CRUD va directo contra Supabase desde el navegador, protegido por RLS
// (solo usuarios 'staff' pueden escribir). Cada comercial entra con su usuario/contraseña.

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

function Login({ supabase }: { supabase: ReturnType<typeof createBrowserClient> }) {
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

function Panel({ supabase, email }: { supabase: ReturnType<typeof createBrowserClient>; email: string }) {
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
    <div className="admin__panel">
      <header className="admin__bar">
        <strong>Pisos</strong>
        <span className="admin__muted">{email}</span>
        <button className="button button--ghost button--small" onClick={() => supabase.auth.signOut()}>Salir</button>
      </header>
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
    </div>
  );
}

function PropertyForm({ supabase, initial, onDone, onCancel }: {
  supabase: ReturnType<typeof createBrowserClient>;
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

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
    </label>
  );
}
