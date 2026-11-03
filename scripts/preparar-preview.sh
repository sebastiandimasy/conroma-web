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

# El prototipo del CRM va en /crm/ para que el stakeholder pueda trastear con el
# desde la misma URL. Vite lo compila con base './', asi que funciona en subcarpeta.
CRM="${CRM_DIST:-$HOME/conroma-crm-ui/dist}"
if [ -d "$CRM" ]; then
  mkdir -p "$DESTINO/crm"
  cp -R "$CRM"/ "$DESTINO/crm"/
  python3 - "$DESTINO/crm/index.html" <<'NOINDEX'
import sys
p = sys.argv[1]
s = open(p, encoding='utf-8').read()
if 'noindex' not in s:
    s = s.replace('<meta charset="utf-8"/>', '<meta charset="utf-8"/>\n<meta name="robots" content="noindex, nofollow"/>')
    open(p, 'w', encoding='utf-8').write(s)
NOINDEX
  echo "CRM incluido en /crm/."
else
  echo "AVISO: no encuentro el build del CRM en $CRM. La demo ira sin /crm/."
  echo "       Compilalo con: cd ~/conroma-crm-ui && npm run build"
fi

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
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Conroma Asesores · Demo privada</title>
<style>
  :root { color-scheme: light dark; --ink:#1A1912; --paper:#fff; --muted:#6b6a63; --line:#e5e3dc; --accent:#F3BC16; }
  @media (prefers-color-scheme: dark) { :root { --ink:#f5f4ef; --paper:#17171a; --muted:#a3a29b; --line:#2e2e32; } }
  * { box-sizing:border-box }
  body { margin:0; min-height:100dvh; display:grid; place-items:center; padding:24px;
         background:var(--paper); color:var(--ink);
         font:16px/1.5 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif }
  main { width:min(100%,560px) }
  .tag { display:inline-block; padding:4px 10px; border-radius:999px; background:var(--accent);
         color:#1A1912; font-size:13px; font-weight:700; letter-spacing:.01em }
  h1 { margin:16px 0 8px; font-size:clamp(1.6rem,5vw,2.1rem); line-height:1.15; letter-spacing:-.02em }
  p.lead { margin:0 0 28px; color:var(--muted) }
  a.card { display:block; padding:20px; margin-bottom:12px; border:1px solid var(--line);
           border-radius:16px; text-decoration:none; color:inherit; background:var(--paper);
           transition:border-color .18s ease, transform .18s ease }
  a.card:hover, a.card:focus-visible { border-color:var(--ink); transform:translateY(-1px) }
  a.card:focus-visible { outline:2px solid var(--accent); outline-offset:3px }
  .card h2 { margin:0 0 4px; font-size:1.05rem }
  .card span { color:var(--muted); font-size:.9rem }
  footer { margin-top:24px; color:var(--muted); font-size:.85rem }
</style>
</head>
<body>
<main>
  <span class="tag">Demo privada</span>
  <h1>Conroma Asesores</h1>
  <p class="lead">Dos cosas para revisar. Ábrelas mejor desde el móvil: es por donde entra el 97&nbsp;% de la gente.</p>

  <a class="card" href="/es/">
    <h2>La web nueva &rarr;</h2>
    <span>124 inmuebles, buscador con filtros y solicitud de valoración.</span>
  </a>

  <a class="card" href="/crm/">
    <h2>El CRM interno &rarr;</h2>
    <span>Prototipo navegable con datos de ejemplo. Puedes trastear sin romper nada.</span>
  </a>

  <footer>Nada de esto es público ni aparece en Google. La web actual sigue intacta.</footer>
</main>
</body>
</html>
EOF

(cd "$(dirname "$DESTINO")" && rm -f "$(basename "$DESTINO").zip" && zip -rq "$(basename "$DESTINO").zip" "$(basename "$DESTINO")" -x "*.DS_Store")

echo "Listo:"
echo "  carpeta: $DESTINO"
echo "  zip:     $DESTINO.zip  ($(du -h "$DESTINO.zip" | cut -f1))"
echo "Subelo segun docs/PREVIEW-HOSTINGER.md"
