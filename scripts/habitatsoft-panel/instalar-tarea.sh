#!/usr/bin/env bash
# Programa (o quita) la tarea diaria del puente con Habitatsoft en este Mac.
#
#   bash scripts/habitatsoft-panel/instalar-tarea.sh          # cada día a las 07:15
#   bash scripts/habitatsoft-panel/instalar-tarea.sh 06:30    # a otra hora
#   bash scripts/habitatsoft-panel/instalar-tarea.sh --quitar
#
# Si el Mac está dormido a esa hora, launchd la lanza al despertar.
set -euo pipefail
ETIQUETA=com.conroma.habitatsoft-sync
PLIST="$HOME/Library/LaunchAgents/$ETIQUETA.plist"
SCRIPT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/sync-diario.sh"

launchctl bootout "gui/$(id -u)/$ETIQUETA" 2>/dev/null || true
if [ "${1:-}" = "--quitar" ]; then
  rm -f "$PLIST"
  echo "Tarea quitada."
  exit 0
fi

HORA="${1:-07:15}"
H=$((10#${HORA%%:*})); M=$((10#${HORA##*:}))
mkdir -p "$HOME/Library/LaunchAgents"
cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$ETIQUETA</string>
  <key>ProgramArguments</key><array><string>/bin/bash</string><string>$SCRIPT</string></array>
  <key>StartCalendarInterval</key><dict><key>Hour</key><integer>$H</integer><key>Minute</key><integer>$M</integer></dict>
  <key>StandardOutPath</key><string>$HOME/.conroma-habitatsoft/launchd.log</string>
  <key>StandardErrorPath</key><string>$HOME/.conroma-habitatsoft/launchd.log</string>
</dict>
</plist>
PLIST
mkdir -p "$HOME/.conroma-habitatsoft"
launchctl bootstrap "gui/$(id -u)" "$PLIST"
printf 'Programada cada día a las %02d:%02d. Lanzarla ahora: launchctl kickstart gui/%s/%s\n' "$H" "$M" "$(id -u)" "$ETIQUETA"
