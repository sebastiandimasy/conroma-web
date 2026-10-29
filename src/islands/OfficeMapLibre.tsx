import { useEffect, useRef } from 'react';
import { Map as MapLibreMap, Marker, Popup, NavigationControl, setWorkerUrl } from 'maplibre-gl';
// Vite bundla el worker y da su URL; evita el fallo "Worker failed to load" del adaptador Cloudflare.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';

setWorkerUrl(workerUrl);

// Estilos CartoDB: siguen el tema claro/oscuro de la web (sin cookies de rastreo, a diferencia de Google).
const STYLES = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
};

interface Props {
  latitude: number;
  longitude: number;
  label: string;
}

// El tema de Conroma vive en <html data-theme>; sin él, se sigue el del sistema.
function resolveTheme(): 'light' | 'dark' {
  const attr = document.documentElement.dataset.theme;
  if (attr === 'light' || attr === 'dark') return attr;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function OfficeMapLibre({ latitude, longitude, label }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new MapLibreMap({
      container: containerRef.current,
      style: STYLES[resolveTheme()],
      center: [longitude, latitude],
      zoom: 15,
      attributionControl: { compact: true },
      scrollZoom: false, // no secuestrar el scroll de la página
      dragRotate: false,
    });
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');

    const marker = document.createElement('div');
    marker.className = 'office-map__marker';
    new Marker({ element: marker })
      .setLngLat([longitude, latitude])
      .setPopup(new Popup({ offset: 18, closeButton: false }).setText(label))
      .addTo(map);

    // Cambiar el estilo del mapa cuando el usuario cambia el tema de la web.
    const observer = new MutationObserver(() => map.setStyle(STYLES[resolveTheme()]));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      observer.disconnect();
      map.remove();
    };
  }, [latitude, longitude, label]);

  return <div ref={containerRef} className="office-map__canvas" />;
}
