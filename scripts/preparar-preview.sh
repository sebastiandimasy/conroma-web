#!/usr/bin/env bash
# Prepara la demo privada para subir a un subdominio de Hostinger.
# Requiere haber compilado antes con:  PUBLIC_PREVIEW=true npm run build
# Ver docs/PREVIEW-HOSTINGER.md
set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ORIGEN="$RAIZ/dist/client"
DESTINO="${1:-$HOME/Desktop/conroma-preview-hostinger}"

[ -d "$ORIGEN" ] || { echo "No existe $ORIGEN. Compila antes: PUBLIC_PREVIEW=true npm run build"; exit 1; }

# Comprobacion innegociable: si una sola pagina no lleva noindex, no empaquetamos.
TOTAL=$(find "$ORIGEN" -name '*.html' | wc -l | tr -d ' ')
CON=$(find "$ORIGEN" -name '*.html' -exec grep -l 'content="noindex' {} \; | wc -l | tr -d ' ')
if [ "$TOTAL" != "$CON" ]; then
  echo "ABORTADO: $((TOTAL-CON)) de $TOTAL paginas NO llevan noindex."
  echo "Seguramente has compilado sin PUBLIC_PREVIEW=true."
  exit 1
fi
echo "noindex verificado en $CON de $TOTAL paginas."

rm -rf "$DESTINO"; mkdir -p "$DESTINO"
cp -R "$ORIGEN"/ "$DESTINO"/

cat > "$DESTINO/robots.txt" <<'EOF'
# Demo privada para revision interna. No indexar bajo ningun concepto.
User-agent: *
Disallow: /
EOF

cat > "$DESTINO/.htaccess" <<'EOF'
# --- Demo privada de Conroma: no indexable ---
<IfModule mod_headers.c>
  Header set X-Robots-Tag "noindex, nofollow, noarchive, nosnippet"
</IfModule>
DirectoryIndex index.html
RedirectMatch 302 ^/$ /es/
ErrorDocument 404 /404.html
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
EOF

cat > "$DESTINO/index.html" <<'EOF'
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<meta http-equiv="refresh" content="0; url=/es/">
<title>Conroma Asesores</title>
</head>
<body><p>Cargando… <a href="/es/">Entrar</a></p></body>
</html>
EOF

(cd "$(dirname "$DESTINO")" && rm -f "$(basename "$DESTINO").zip" && zip -rq "$(basename "$DESTINO").zip" "$(basename "$DESTINO")" -x "*.DS_Store")

echo "Listo:"
echo "  carpeta: $DESTINO"
echo "  zip:     $DESTINO.zip  ($(du -h "$DESTINO.zip" | cut -f1))"
echo "Subelo segun docs/PREVIEW-HOSTINGER.md"
