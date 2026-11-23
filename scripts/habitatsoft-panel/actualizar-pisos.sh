#!/usr/bin/env bash
# Actualiza los pisos de conromaasesores.com con lo que hay hoy en el panel de Habitatsoft.
#
#   bash scripts/habitatsoft-panel/actualizar-pisos.sh
#
# La sesión de Habitatsoft solo dura 3 horas (cookie hs-auth): si ha caducado, abre el Chrome
# del puente para que inicies sesión y luego sigue solo (lee, compila, tests, versión, sube y
# prueba de humo). Tiene que correr en la copia de producción (~/conroma-web-swipe), que es
# la que tiene el .hostinger de producción.
set -uo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PERFIL="${HABITATSOFT_PROFILE:-$HOME/.conroma-habitatsoft}"
LOG="$PERFIL/lecturas/$(date +%F).log"
cadena() { CONROMA_DESTINO=produccion bash "$RAIZ/scripts/habitatsoft-panel/sync-diario.sh"; }

cadena
codigo=$?
if [ "$codigo" -eq 3 ]; then
  node "$RAIZ/scripts/habitatsoft-panel/sync-panel.mjs" --login
  read -r -p "Cuando veas «Mis inmuebles» en esa ventana de Chrome, pulsa Intro aquí… "
  # En Mac cerrar la ventana no cierra Chrome, y con el perfil abierto no se puede leer.
  pkill -TERM -f "user-data-dir=$PERFIL" 2>/dev/null || true
  for _ in $(seq 1 15); do pgrep -f "user-data-dir=$PERFIL" >/dev/null || break; sleep 1; done
  cadena
  codigo=$?
fi

echo
# Solo la última ejecución (el registro es de todo el día).
awk '/^=== /{buf=""} {buf=buf $0 "\n"} END{printf "%s", buf}' "$LOG" |
  grep -E "^\[(panel|diario)\]|Subidos|Fichas retiradas|✓|✗|Todo bien" | tail -12
exit "$codigo"
