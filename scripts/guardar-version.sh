#!/usr/bin/env bash
# Guarda el build actual (dist/client) como versión publicable, para poder volver atrás.
# Se ejecuta justo DESPUÉS de `npm run build` y ANTES de subir a Hostinger.
#
#   bash scripts/guardar-version.sh
#
# Deja ~/conroma-versiones/<fecha>-<commit>[-demo].zip y conserva las 10 últimas.
# Vuelta atrás: subir el zip anterior a public_html y extraerlo reemplazando (docs/SWIPE.md).
set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ORIGEN="$RAIZ/dist/client"
DESTINO="${CONROMA_VERSIONES:-$HOME/conroma-versiones}"

[ -f "$ORIGEN/es/index.html" ] || { echo "No hay build en $ORIGEN. Ejecuta antes: npm run build"; exit 1; }

COMMIT=$(git -C "$RAIZ" rev-parse --short HEAD)
SUCIO=$(git -C "$RAIZ" status --porcelain -- src public | head -1)
[ -n "$SUCIO" ] && COMMIT="$COMMIT-sin-commitear"
# Un build de demo lleva noindex en todas las páginas: que no se confunda con uno de producción.
grep -q 'content="noindex' "$ORIGEN/es/index.html" && COMMIT="$COMMIT-demo"

NOMBRE="$(date +%Y%m%d-%H%M)-$COMMIT"
mkdir -p "$DESTINO"
(cd "$ORIGEN" && zip -rq "$DESTINO/$NOMBRE.zip" . -x '*.DS_Store')

# Conserva las 10 más recientes.
ls -1t "$DESTINO"/*.zip | tail -n +11 | while read -r viejo; do rm -f "$viejo"; done

echo "Versión guardada: $DESTINO/$NOMBRE.zip ($(du -h "$DESTINO/$NOMBRE.zip" | cut -f1))"
echo "Anteriores:"
ls -1t "$DESTINO"/*.zip | sed -n '2,4p' | sed 's/^/  /'
