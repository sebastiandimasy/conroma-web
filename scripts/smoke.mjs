#!/usr/bin/env node
/**
 * Prueba de humo de la web publicada: dice en 10 segundos si funciona o hay que volver atrás.
 *
 *   node scripts/smoke.mjs https://conromaasesores.com            # producción
 *   node scripts/smoke.mjs https://demo.hostingersite.com --preview # demo (espera noindex)
 *
 * Sale con código 0 si todo pasa y con 1 si algo falla (y entonces: docs/SWIPE.md, «Vuelta atrás»).
 * Comprueba lo que de verdad rompe el negocio: que cargan la home, el catálogo, una ficha con su
 * foto de Habitatsoft y los legales, y que la indexación es la que toca.
 */

/**
 * Revisa una página ya descargada. Devuelve la lista de fallos (vacía = bien).
 * @param {{ status: number, html?: string }} page
 * @param {{ preview?: boolean, mustContain?: string[] }} [options]
 * @returns {string[]}
 */
export function checkPage({ status, html = '' }, { preview = false, mustContain = [] } = {}) {
  const fails = [];
  if (status !== 200) return [`responde ${status}`];
  const noindex = /<meta[^>]+name="robots"[^>]+noindex/i.test(html);
  if (preview && !noindex) fails.push('falta el noindex de la demo');
  if (!preview && noindex) fails.push('lleva noindex en producción: Google la dejaría de indexar');
  for (const text of mustContain) if (!html.includes(text)) fails.push(`no contiene «${text}»`);
  return fails;
}

async function get(url, method = 'GET') {
  try {
    const res = await fetch(url, { method, redirect: 'manual', headers: { 'User-Agent': 'conroma-smoke/1' } });
    return { status: res.status, location: res.headers.get('location'), html: method === 'GET' ? await res.text() : '' };
  } catch (error) {
    return { status: 0, html: '', error: String(error.cause?.code ?? error.message) };
  }
}

async function main() {
  const base = (process.argv[2] ?? '').replace(/\/$/, '');
  const preview = process.argv.includes('--preview');
  if (!/^https?:\/\//.test(base)) {
    console.error('Uso: node scripts/smoke.mjs https://dominio [--preview]');
    process.exit(2);
  }

  const results = [];
  const check = (name, page, options) => results.push({ name, fails: checkPage(page, options) });

  const home = await get(`${base}/es/`);
  check('Home /es/', home, { preview, mustContain: ['Conroma'] });

  const catalog = await get(`${base}/es/venta/`);
  const fichas = [...new Set(catalog.html.match(/\/es\/inmueble\/[a-z0-9-]+\//g) ?? [])];
  check('Catálogo /es/venta/', catalog, { preview });
  if (catalog.status === 200 && fichas.length < 20) results.push({ name: 'Catálogo /es/venta/', fails: [`solo enlaza ${fichas.length} fichas`] });

  if (fichas[0]) {
    const ficha = await get(`${base}${fichas[0]}`);
    check(`Ficha ${fichas[0]}`, ficha, { preview, mustContain: ['Ref.'] });
    // La foto sale de nuestro dominio (/fotos/, WebP) o, si no se pudo convertir, de Habitatsoft.
    const foto = ficha.html.match(/\/fotos\/[^"\s,)]+\.webp|https:\/\/fotoshs\.imghs\.net\/[^"\s,)]+/)?.[0];
    if (foto) {
      const img = await get(foto.startsWith('/') ? `${base}${foto}` : foto, 'HEAD');
      results.push({ name: `Foto de la ficha (${foto.startsWith('/') ? 'propia' : 'Habitatsoft'})`, fails: img.status === 200 ? [] : [`la foto responde ${img.status}`] });
    }
  }

  check('Aviso legal', await get(`${base}/es/aviso-legal/`), { preview, mustContain: ['Titular'] });
  check('Contacto', await get(`${base}/es/contacto/`), { preview });

  const raiz = await get(`${base}/`);
  results.push({ name: 'Raíz /', fails: [200, 301, 302].includes(raiz.status) ? [] : [`responde ${raiz.status}`] });

  let failed = 0;
  for (const { name, fails } of results) {
    if (fails.length) failed += 1;
    console.log(`${fails.length ? '✗' : '✓'} ${name}${fails.length ? ` — ${fails.join('; ')}` : ''}`);
  }
  console.log(failed ? `\n${failed} comprobación(es) fallan. Si es producción: vuelta atrás, docs/SWIPE.md.` : '\nTodo bien.');
  process.exit(failed ? 1 : 0);
}

if (import.meta.main) main();
