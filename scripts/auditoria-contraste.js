// Auditoría de contraste WCAG por tema. Pegar en la consola o en javascript_tool; desactivar transiciones antes (*{transition:none!important}).
(() => {
  document.querySelectorAll("[data-reveal],[data-split],.reveal").forEach((e) => { e.style.opacity = 1; e.style.visibility = "visible"; e.style.transform = "none"; });
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgba = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const over = (top, bot) => { const a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1]; };
  function bgOf(el) {
    const stack = [];
    for (let n = el; n; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.backgroundImage !== 'none' && !s.backgroundImage.startsWith('linear-gradient(rgba(0, 0, 0, 0)')) return null; // foto/degradado: no medible
      const c = rgba(s.backgroundColor);
      if (c[3] > 0) { stack.push(c); if (c[3] >= 0.99) break; }
    }
    let base = [255, 255, 255, 1];
    if (!stack.length || stack[stack.length - 1][3] < 0.99) base = rgba(getComputedStyle(document.body).backgroundColor);
    return stack.reverse().reduce((acc, c) => over(c, acc), base);
  }
  function audit() {
    const out = new Map();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const t = walker.currentNode; if (!t.textContent.trim()) continue;
      const el = t.parentElement; if (!el || el.closest('script,style,noscript,svg,[aria-hidden="true"]')) continue;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      const s = getComputedStyle(el); if (s.visibility === 'hidden' || +s.opacity === 0) continue;
      const bg = bgOf(el); if (!bg) continue;
      const fg = over(rgba(s.color), bg);
      const k = ratio(fg, bg); const size = parseFloat(s.fontSize); const large = size >= 24 || (size >= 18.66 && +s.fontWeight >= 700);
      if (k < (large ? 3 : 4.5)) {
        const sel = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
        const key = sel; if (!out.has(key)) out.set(key, { sel, ratio: +k.toFixed(2), text: t.textContent.trim().slice(0, 40), color: s.color, bg: `rgb(${bg.slice(0, 3).map(Math.round)})` });
      }
    }
    return [...out.values()];
  }
  const root = document.documentElement; const prev = root.dataset.theme;
  const res = {};
  for (const th of ['light', 'dark']) { root.dataset.theme = th; res[th] = audit(); }
  if (prev) root.dataset.theme = prev; else delete root.dataset.theme;
  return { page: location.pathname, light: res.light.length, dark: res.dark.length, ...res };
})()
