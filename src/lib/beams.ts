// Fondo animado de la página: haces de luz ámbar que suben despacio (adaptado de «Beams
// Background» de 21st.dev a la marca: sin azules, tonos del amarillo #F3BC16 al ámbar).
// Pensado para móvil: se pinta a 1/10 de resolución (el navegador lo amplía y eso ya lo
// difumina), a ~30 fps, se para con la pestaña oculta y con «reducir movimiento» queda quieto.

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

const SCALE = 0.1; // resolución del lienzo respecto a la pantalla
const BEAMS = 14;
const FRAME_MS = 33;

// El lienzo es opaco (color de fondo del tema) y los haces se mezclan con «darken» en claro y
// «lighten» en oscuro: por mucho que se solapen, ningún punto pasa del color `peak`. Ese tope
// está calculado para que el texto gris (--color-ink-3) y el rojo de error sigan ≥4,5:1.
const THEME = {
  light: { base: '#ffffff', peak: '255, 248, 222', op: 'darken' }, // crema muy suave
  dark: { base: '#0c0a09', peak: '33, 27, 17', op: 'lighten' }, // brillo cálido muy tenue
} as const;

function isDark(): boolean {
  return document.documentElement.dataset.theme === 'dark';
}

function newBeam(w: number, h: number, i: number, fromBottom: boolean): Beam {
  const column = i % 3;
  const spacing = w / 3;
  return {
    x: column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.6,
    y: fromBottom ? h + h * 0.1 : Math.random() * h * 1.5 - h * 0.25,
    width: w * (0.18 + Math.random() * 0.22),
    length: h * 2.2,
    angle: -35 + Math.random() * 10,
    speed: h * (0.0007 + Math.random() * 0.0007),
    opacity: 0.55 + Math.random() * 0.35,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.02,
  };
}

export function initBeams(canvas: HTMLCanvasElement | null): void {
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let beams: Beam[] = [];
  let w = 0;
  let h = 0;

  function resize() {
    w = Math.max(1, Math.round(window.innerWidth * SCALE));
    h = Math.max(1, Math.round(window.innerHeight * SCALE));
    if (canvas!.width === w && canvas!.height === h && beams.length) return;
    canvas!.width = w;
    canvas!.height = h;
    beams = Array.from({ length: BEAMS }, (_, i) => newBeam(w, h, i, false));
  }

  function draw() {
    const t = THEME[isDark() ? 'dark' : 'light'];
    ctx!.globalCompositeOperation = 'source-over';
    ctx!.fillStyle = t.base;
    ctx!.fillRect(0, 0, w, h);
    ctx!.globalCompositeOperation = t.op;
    for (const b of beams) {
      const a = b.opacity * (0.8 + Math.sin(b.pulse) * 0.2);
      const color = (k: number) => `rgba(${t.peak}, ${a * k})`;
      ctx!.save();
      ctx!.translate(b.x, b.y);
      ctx!.rotate((b.angle * Math.PI) / 180);
      const g = ctx!.createLinearGradient(0, 0, 0, b.length);
      g.addColorStop(0, color(0));
      g.addColorStop(0.1, color(0.5));
      g.addColorStop(0.4, color(1));
      g.addColorStop(0.6, color(1));
      g.addColorStop(0.9, color(0.5));
      g.addColorStop(1, color(0));
      ctx!.fillStyle = g;
      ctx!.fillRect(-b.width / 2, 0, b.width, b.length);
      ctx!.restore();
    }
  }

  let last = 0;
  let frame = 0;
  function tick(now: number) {
    frame = requestAnimationFrame(tick);
    if (now - last < FRAME_MS) return;
    last = now;
    beams.forEach((b, i) => {
      b.y -= b.speed;
      b.pulse += b.pulseSpeed;
      if (b.y + b.length < -h * 0.1) beams[i] = newBeam(w, h, i, true);
    });
    draw();
  }

  resize();
  draw();
  window.addEventListener('resize', () => {
    resize();
    draw();
  });
  // El interruptor de tema cambia data-theme: repintar con los tonos del otro tema.
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (still) return;
  frame = requestAnimationFrame(tick);
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(frame);
    if (!document.hidden) frame = requestAnimationFrame(tick);
  });
}
