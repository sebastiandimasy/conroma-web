#!/usr/bin/env bash
# Tarea diaria del puente con el panel de Habitatsoft (la lanza launchd, ver docs/PUENTE-HABITATSOFT.md).
#
#   1. Lee el panel con la sesión guardada y reescribe el inventario.
#   2. Si algo cambió: compila, pasa los tests y guarda la versión (vuelta atrás).
#   3. Sube a Hostinger si existe `.hostinger` y hace la prueba de humo.
#
# Destino: CONROMA_DESTINO=demo (por defecto, hasta el swipe) o produccion.
# Registro: ~/.conroma-habitatsoft/lecturas/AAAA-MM-DD.log
set -uo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PERFIL="${HABITATSOFT_PROFILE:-$HOME/.conroma-habitatsoft}"
DESTINO="${CONROMA_DESTINO:-demo}"
DEMO_URL="${DEMO_URL:-https://magenta-mule-200826.hostingersite.com}"
DATOS=(src/data/properties.real.json src/data/property-first-seen.json)

mkdir -p "$PERFIL/lecturas"
exec >>"$PERFIL/lecturas/$(date +%F).log" 2>&1
echo "=== $(date '+%F %T') · destino: $DESTINO ==="
cd "$RAIZ"

avisar() {
  echo "[diario] $1"
  osascript -e "display notification \"$1\" with title \"Conroma · Habitatsoft\"" >/dev/null 2>&1 || true
}

# Copia de los datos por si el build falla: entonces se vuelve a lo de ayer.
COPIA="$(mktemp -d)"
for f in "${DATOS[@]}"; do cp "$f" "$COPIA/"; done
restaurar() { for f in "${DATOS[@]}"; do cp "$COPIA/$(basename "$f")" "$f"; done; }

node scripts/habitatsoft-panel/sync-panel.mjs || exit $?   # ya avisa él

if cmp -s "$COPIA/properties.real.json" src/data/properties.real.json; then
  echo "[diario] el panel no trae cambios: no hace falta compilar ni subir."
  exit 0
fi

if [ "$DESTINO" = "demo" ]; then
  BUILD=(env PUBLIC_PREVIEW=true npm run build)
else
  BUILD=(npm run build)
fi
if ! "${BUILD[@]}" || ! npx vitest run; then
  restaurar
  avisar "El build o los tests fallan con el inventario de hoy. He dejado el de ayer; mira el registro."
  exit 1
fi
bash scripts/guardar-version.sh

if [ ! -f .hostinger ]; then
  avisar "Inventario actualizado y compilado. No subo: falta el archivo .hostinger con el FTP."
  exit 0
fi

if [ "$DESTINO" = "demo" ]; then
  # Fuera del Escritorio: macOS no deja a las tareas de launchd tocarlo.
  bash scripts/preparar-preview.sh "$PERFIL/demo" && PREVIEW_DIR="$PERFIL/demo" python3 scripts/subir-preview.py ||
    { avisar "Fallo subiendo la demo."; exit 1; }
  node scripts/smoke.mjs "$DEMO_URL" --preview || { avisar "La demo no pasa la prueba de humo."; exit 1; }
else
  # Producción: se sube el build sin wrangler.json (config de Cloudflare con rutas de este Mac)
  # y se borran del servidor las fichas de pisos que ya no están activos.
  git add "${DATOS[@]}" public/data/altas.json && git commit -q -m "data(inventario): lectura del panel del $(date +%d-%m-%Y)" || true
  rm -rf "$PERFIL/produccion" && rsync -a --exclude wrangler.json dist/client/ "$PERFIL/produccion/" &&
    BORRAR_FICHAS_RETIRADAS=1 PREVIEW_DIR="$PERFIL/produccion" python3 scripts/subir-preview.py ||
    { avisar "Fallo subiendo la web a producción. Sigue la versión anterior; mira el registro."; exit 1; }
  node scripts/smoke.mjs "${SITE_URL:-https://conromaasesores.com}" || { avisar "La web no pasa la prueba de humo."; exit 1; }
fi
avisar "Web actualizada con el inventario de Habitatsoft de hoy."
