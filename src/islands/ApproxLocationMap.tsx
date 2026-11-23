import { useEffect, useRef } from 'react';
import { Map as MapLibreMap, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import type { Feature } from 'geojson';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { strings, type Lang } from '../i18n';

setWorkerUrl(workerUrl);

// Mismos estilos CartoDB que el mapa de la oficina: siguen el tema claro/oscuro, sin cookies de rastreo.
const STYLES = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
};

interface Props {
  latitude: number;
  longitude: number;
  label: string;
  /** Radio del círculo de zona en metros (ubicación aproximada, no exacta). */
  radiusMeters?: number;
  lang: Lang;
}

const texts = strings({
  es: { area: 'Ubicación aproximada' },
  en: { area: 'Approximate location' },
  ca: { area: 'Ubicació aproximada' },
});

// Textos propios de MapLibre (por defecto en inglés): botones de zoom y aviso de «dos dedos».
const MAP_LOCALE: Record<Lang, Record<string, string> | undefined> = {
  en: undefined,
  es: {
    'NavigationControl.ZoomIn': 'Acercar',
    'NavigationControl.ZoomOut': 'Alejar',
    'CooperativeGesturesHandler.WindowsHelpText': 'Usa Ctrl + rueda para hacer zoom en el mapa',
    'CooperativeGesturesHandler.MacHelpText': 'Usa ⌘ + rueda para hacer zoom en el mapa',
    'CooperativeGesturesHandler.MobileHelpText': 'Usa dos dedos para mover el mapa',
  },
  ca: {
    'NavigationControl.ZoomIn': 'Apropar',
    'NavigationControl.ZoomOut': 'Allunyar',
    'CooperativeGesturesHandler.WindowsHelpText': 'Fes servir Ctrl + roda per fer zoom al mapa',
    'CooperativeGesturesHandler.MacHelpText': 'Fes servir ⌘ + roda per fer zoom al mapa',
    'CooperativeGesturesHandler.MobileHelpText': 'Fes servir dos dits per moure el mapa',
  },
};

function resolveTheme(): 'light' | 'dark' {
  const attr = document.documentElement.dataset.theme;
  if (attr === 'light' || attr === 'dark') return attr;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Polígono que aproxima un círculo alrededor del centro, en metros.
function circlePolygon(longitude: number, latitude: number, radiusMeters: number, points = 64): Feature {
  const earth = 6378137;
  const dLat = (radiusMeters / earth) * (180 / Math.PI);
  const dLng = dLat / Math.cos((latitude * Math.PI) / 180);
  const ring: [number, number][] = [];
  for (let i = 0; i <= points; i += 1) {
    const angle = (i / points) * 2 * Math.PI;
    ring.push([longitude + dLng * Math.cos(angle), latitude + dLat * Math.sin(angle)]);
  }
  return { type: 'Feature', geometry: { type: 'Polygon', coordinates: [ring] }, properties: {} };
}

export default function ApproxLocationMap({ latitude, longitude, label, radiusMeters = 250, lang }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // El amarillo sale del token de marca, no de un hex suelto; igual en claro y oscuro.
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue('--color-accent').trim() || '#f4ce4b';
    const edge = styles.getPropertyValue('--color-accent-deep').trim() || accent;
    const circle = circlePolygon(longitude, latitude, radiusMeters);

    const map = new MapLibreMap({
      container: containerRef.current,
      style: STYLES[resolveTheme()],
      center: [longitude, latitude],
      zoom: 16,
      attributionControl: { compact: true },
      cooperativeGestures: true, // un dedo hace scroll de página, dos mueven el mapa
      scrollZoom: false,
      dragRotate: false,
      locale: MAP_LOCALE[lang],
    });
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');

    // El estilo de CartoDB borra las capas propias al cambiarlo; se re-aplican cada vez.
    function addZone() {
      if (map.getSource('zona')) return;
      map.addSource('zona', { type: 'geojson', data: circle });
      map.addLayer({ id: 'zona-fill', type: 'fill', source: 'zona', paint: { 'fill-color': accent, 'fill-opacity': 0.22 } });
      map.addLayer({ id: 'zona-line', type: 'line', source: 'zona', paint: { 'line-color': edge, 'line-width': 2 } });
    }
    map.on('load', addZone);
    map.on('styledata', addZone);

    const observer = new MutationObserver(() => map.setStyle(STYLES[resolveTheme()]));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      observer.disconnect();
      map.remove();
    };
  }, [latitude, longitude, label, radiusMeters, lang]);

  return <div ref={containerRef} className="approx-map__canvas" aria-label={`${texts[lang].area}: ${label}`} role="group" />;
}
