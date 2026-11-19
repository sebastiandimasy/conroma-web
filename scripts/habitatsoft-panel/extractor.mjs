/**
 * Extractor del panel de Habitatsoft. Se ejecuta DENTRO de una pestaña de
 * gestion.habitatsoft.com/Inmuebles/MisInmuebles con la sesión iniciada (sync-panel.mjs lo inyecta).
 * Solo lee: GET a las mismas URLs que usa el panel, de una en una y con pausas.
 *
 * Devuelve { total, records } con un PanelRecord por inmueble activo (ver src/lib/habitatsoft-panel.ts).
 * No sale de la página: la calle (solo zona y pueblo), ni nada del propietario.
 *
 * Tiene que ser autocontenida: se serializa con toString() y se evalúa en la página.
 */
export async function extraerPanel(limite = Infinity) {
  const PORTFOLIO = 'https://portfolio.habitatsoft.com';
  const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
  const html = async (url, ajax = false) => {
    const res = await fetch(url, { credentials: 'include', headers: ajax ? { 'X-Requested-With': 'XMLHttpRequest' } : {} });
    if (!res.ok) throw new Error(`HTTP ${res.status} en ${new URL(url).pathname}`);
    return res.text();
  };
  const dom = (text) => new DOMParser().parseFromString(text, 'text/html');
  const euros = (el) => Number((el?.textContent ?? '').replace(/[^\d]/g, '')) || 0;

  // 1. Listado de activos: la URL la pide el propio panel al cargar; esperamos a verla.
  let listado;
  for (let i = 0; i < 40 && !listado; i++) {
    listado = performance.getEntriesByType('resource').map((e) => e.name).find((n) => n.includes('/properties/listing'));
    if (!listado) await pausa(500);
  }
  if (!listado) throw new Error('El panel no ha cargado el listado de inmuebles (¿sesión caducada?)');
  const url = new URL(listado);
  url.searchParams.set('PropertyStatus', '20'); // activos

  const filas = [];
  // El total lo da la propia página («113 Inmuebles activos») o el parámetro con que pide el listado.
  const total =
    Number(document.body.textContent.match(/(\d+)\s+Inmuebles activos/)?.[1]) || Number(url.searchParams.get('TotalRegistros')) || 0;
  const limpiaRef = (ref) => ref.replace(/\s*-\s*/g, '-').trim();
  for (let page = 1; page <= 30 && (!total || filas.length < total); page++) {
    url.searchParams.set('Page', String(page));
    let d;
    try {
      d = dom(await html(url));
    } catch (e) {
      if (page === 1) throw e;
      break; // pasada la última página el panel responde 500
    }
    const rows = [...d.querySelectorAll('.property-row[data-propertyreference]')];
    const nuevas = rows.filter((r) => !filas.some((f) => f.ref === limpiaRef(r.dataset.propertyreference)));
    if (!nuevas.length) break;
    for (const r of nuevas) {
      filas.push({
        ref: limpiaRef(r.dataset.propertyreference),
        id: r.id.replace(/^id_/, '').replace('-', '.'),
        operation: r.dataset.operationtypename ?? '',
        type: r.dataset.propertytypename ?? '',
        price: euros(r.querySelector('span.bold')),
        previousPrice: euros(r.querySelector('.previous-price')) || null,
      });
    }
    await pausa(400);
  }

  // 2. Ficha y certificado de cada uno.
  const records = [];
  for (const fila of filas.slice(0, limite)) {
    const b = dom(await html(`${PORTFOLIO}/properties/propertyDetail/BasicInfo?culture=es-ES&propertyId=${fila.id}&loadEditTabs=false`));
    const hidden = {};
    for (const i of b.querySelectorAll('input[type=hidden][name]')) {
      if (!/owner|propiet|tel[eé]f|mail|nif|dni|valoracion/i.test(i.name)) hidden[i.name] = i.value;
    }
    const description = hidden.Description_body_CS ?? '';
    delete hidden.Description_body_CS;

    const info = {};
    for (const el of b.querySelectorAll('li, div, p')) {
      const m = el.children.length === 0 && el.textContent.trim().match(/^([^:]{3,30}):\s*(.+)$/);
      if (m) info[m[1].trim()] ??= m[2].trim();
    }

    const titulo = [...b.querySelectorAll('div')].find((e) => /^Caracter[ií]sticas$/.test(e.textContent.trim()));
    const features = titulo
      ? [...titulo.parentElement.querySelectorAll('div')].map((e) => e.textContent.trim()).filter((t) => t && t.length < 30 && !/^Caracter/.test(t))
      : [];

    // Dirección «Calle Nº.Zona. Pueblo»: solo salen los dos últimos tramos.
    const tramos = (b.querySelector('.propertyDetail__basicInfo__subtitle')?.textContent ?? '').split('.').map((s) => s.trim()).filter(Boolean);
    const place = { town: tramos.at(-1) ?? '', zone: tramos.length >= 3 ? tramos.at(-2) : '' };

    const images = [...b.querySelectorAll('img')]
      .map((i) => i.getAttribute('src') ?? '')
      .filter((s) => /imghs\.net\/3xl\//.test(s));

    await pausa(300);
    const e = await html(`/Inmuebles/EdicionInmueble?Id=${fila.id}&PropertyReference=${encodeURIComponent(fila.ref)}`, true);
    // La página trae varios bloques CEnergetica y el primero a veces va vacío: vale el primero con datos.
    const keep = ['CertificacionEnergeticaEnTramite', 'CertificacionEnergetica', 'CertificacionEmisiones', 'PrestacionEnergetica', 'PrestacionEmisiones'];
    let energy = null;
    for (const m of e.replace(/&quot;/g, '"').matchAll(/"CEnergetica":(\{[^{}]*\})/g)) {
      let ce;
      try {
        ce = JSON.parse(m[1]);
      } catch {
        continue;
      }
      if (keep.some((k) => ce[k])) {
        energy = Object.fromEntries(keep.map((k) => [k, ce[k] == null ? '' : String(ce[k])]));
        break;
      }
    }

    records.push({ ...fila, place, info, hidden, features, images: [...new Set(images)], description, energy });
    await pausa(300);
  }
  return { total, records };
}
