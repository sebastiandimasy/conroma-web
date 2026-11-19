/**
 * Puente diario con el panel de Habitatsoft (mientras no llegue el feed «Enlace Web 2.0»).
 *
 *   node scripts/habitatsoft-panel/sync-panel.mjs --login    # una vez: abre Chrome para iniciar sesión
 *   node scripts/habitatsoft-panel/sync-panel.mjs            # lee el panel y reescribe el inventario
 *   node scripts/habitatsoft-panel/sync-panel.mjs --prueba 3 # lee solo 3 fichas, no escribe nada
 *
 * Usa el Chrome del Mac con un perfil PROPIO (~/.conroma-habitatsoft), no el tuyo de siempre.
 * El login de Habitatsoft lleva reCAPTCHA: lo haces tú una vez marcando «Recordar», y este
 * script reutiliza esa sesión. Nunca guarda ni teclea contraseñas.
 *
 * Salidas: 0 = inventario actualizado · 2 = lectura no fiable (deja el volcado actual)
 *          3 = sesión caducada (hay que repetir --login) · 1 = otro error.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { panelInventory } from '../../src/lib/habitatsoft-panel.ts';
import { normRef } from '../../src/lib/inventory.ts';
import { escribirInventario, OUT } from '../inventario-comun.mjs';
import { extraerPanel } from './extractor.mjs';

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PERFIL = process.env.HABITATSOFT_PROFILE || join(homedir(), '.conroma-habitatsoft');
const PANEL = 'https://gestion.habitatsoft.com/Inmuebles/MisInmuebles';
const LOGIN = 'https://gestion.habitatsoft.com/Login';
const SITE = process.env.SITE_URL || 'https://conromaasesores.com';

// Las rutas del inventario son relativas a la raíz del repo (launchd arranca en /).
process.chdir(join(dirname(fileURLToPath(import.meta.url)), '..', '..'));
const args = process.argv.slice(2);
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

function avisar(texto) {
  console.error(`[panel] ${texto}`);
  // Notificación de macOS: el script corre solo de madrugada y nadie mira la consola.
  spawn('osascript', ['-e', `display notification ${JSON.stringify(texto)} with title "Conroma · Habitatsoft"`], { stdio: 'ignore' });
}

if (args.includes('--login')) {
  mkdirSync(PERFIL, { recursive: true });
  spawn(CHROME, [`--user-data-dir=${PERFIL}`, '--no-first-run', '--no-default-browser-check', LOGIN], { detached: true, stdio: 'ignore' }).unref();
  console.log('Se ha abierto Chrome con el perfil del puente. Inicia sesión en Habitatsoft marcando «Recordar»,');
  console.log('comprueba que ves «Mis inmuebles» y cierra esa ventana. Ya está.');
  process.exit(0);
}

/** Cliente CDP mínimo sobre el WebSocket nativo de Node (sin dependencias). */
function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let seq = 0;
  const pendientes = new Map();
  const oyentes = new Set();
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.id && pendientes.has(msg.id)) {
      const { resolve, reject } = pendientes.get(msg.id);
      pendientes.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else if (msg.method) for (const f of oyentes) f(msg);
  };
  const abierto = new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = () => reject(new Error('No conecto con Chrome'));
  });
  return {
    abierto,
    send: (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = ++seq;
        pendientes.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      }),
    esperar: (method, ms = 60_000) =>
      new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error(`Chrome no respondió (${method})`)), ms);
        const f = (msg) => {
          if (msg.method !== method) return;
          clearTimeout(t);
          oyentes.delete(f);
          resolve(msg.params);
        };
        oyentes.add(f);
      }),
    cerrar: () => ws.close(),
  };
}

async function leerPanel(limite) {
  if (!existsSync(PERFIL)) {
    avisar('Falta iniciar sesión una vez: node scripts/habitatsoft-panel/sync-panel.mjs --login');
    process.exit(3);
  }
  const puerto = join(PERFIL, 'DevToolsActivePort');
  rmSync(puerto, { force: true });
  const chrome = spawn(
    CHROME,
    [`--user-data-dir=${PERFIL}`, '--headless=new', '--remote-debugging-port=0', '--no-first-run', '--no-default-browser-check', 'about:blank'],
    { stdio: 'ignore' },
  );
  try {
    for (let i = 0; i < 60 && !existsSync(puerto); i++) await pausa(250);
    if (!existsSync(puerto)) throw new Error('Chrome no ha arrancado (¿está abierta la ventana de --login? ciérrala)');
    const port = readFileSync(puerto, 'utf8').split('\n')[0];
    const target = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(PANEL)}`, { method: 'PUT' })).json();
    const tab = cdp(target.webSocketDebuggerUrl);
    await tab.abierto;
    await tab.send('Page.enable');
    await tab.esperar('Page.loadEventFired').catch(() => {});
    const evaluar = async (expression, timeout = 60_000) => {
      const r = await tab.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, timeout });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description?.split('\n')[0] ?? 'error en la página');
      return r.result.value;
    };
    const ruta = await evaluar('location.pathname');
    if (!/MisInmuebles/i.test(ruta)) {
      avisar('La sesión de Habitatsoft ha caducado. Repite: node scripts/habitatsoft-panel/sync-panel.mjs --login');
      process.exitCode = 3;
      return null;
    }
    const lectura = await evaluar(`(${extraerPanel.toString()})(${Number.isFinite(limite) ? limite : 'Infinity'})`, 20 * 60_000);
    tab.cerrar();
    return lectura;
  } finally {
    chrome.kill();
  }
}

const i = args.indexOf('--prueba');
const limite = i >= 0 ? Number(args[i + 1]) || 3 : Infinity;

try {
  const lectura = await leerPanel(limite);
  if (!lectura) process.exit(process.exitCode ?? 3);
  console.log(`[panel] leídas ${lectura.records.length} fichas de ${lectura.total} activos.`);
  mkdirSync(join(PERFIL, 'lecturas'), { recursive: true });
  writeFileSync(join(PERFIL, 'lecturas', 'ultima.json'), JSON.stringify(lectura, null, 1));

  if (Number.isFinite(limite)) {
    console.log('[panel] modo prueba: no escribo el inventario. Lectura en ' + join(PERFIL, 'lecturas', 'ultima.json'));
    process.exit(0);
  }
  const actuales = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : [];
  const pisos = panelInventory(lectura, actuales);
  if (!pisos) {
    avisar(`Lectura del panel no fiable (${lectura.records.length} de ${lectura.total}). Dejo el inventario como estaba.`);
    process.exit(2);
  }
  const nuevos = await escribirInventario(pisos, SITE);
  const siguen = new Set(pisos.map((p) => normRef(p.ref)));
  const fuera = actuales.filter((p) => !siguen.has(normRef(p.ref))).map((p) => p.ref);
  console.log(`[panel] inventario OK: ${pisos.length} pisos (${nuevos} nuevos hoy) en ${OUT}.`);
  if (fuera.length) console.log(`[panel] ya no están activos en el panel: ${fuera.join(' ')}`);
} catch (e) {
  avisar('Fallo leyendo el panel: ' + (e?.message || e));
  process.exit(1);
}
