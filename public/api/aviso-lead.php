<?php
// Aviso por correo de cada formulario de la web (contacto y valoración) a gestion@.
// El lead se guarda en Supabase desde el navegador; esto solo avisa. Destinatario fijo:
// aunque alguien llame a este script a mano, solo puede escribir a la propia inmobiliaria.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
date_default_timezone_set('Europe/Madrid');

const DESTINO = 'gestion@conromaasesores.com';
const REMITENTE = 'web@conromaasesores.com';

function responder(int $codigo, bool $ok): void {
    http_response_code($codigo);
    echo json_encode(['ok' => $ok]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') responder(405, false);

$origen = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
$host = parse_url($origen, PHP_URL_HOST) ?: '';
if ($host !== 'conromaasesores.com' && $host !== 'www.conromaasesores.com') responder(403, false);

$datos = json_decode(file_get_contents('php://input', false, null, 0, 20000) ?: '', true);
if (!is_array($datos)) responder(400, false);
if (!empty($datos['company'])) responder(200, true); // honeypot: los bots creen que ha ido bien

// Como mucho 5 avisos cada 10 minutos por IP.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'x';
$marca = sys_get_temp_dir() . '/conroma-aviso-' . md5($ip);
$recientes = array_filter(
    is_file($marca) ? (array) json_decode((string) file_get_contents($marca), true) : [],
    fn($t) => is_int($t) && $t > time() - 600
);
if (count($recientes) >= 5) responder(429, false);
$recientes[] = time();
file_put_contents($marca, json_encode(array_values($recientes)));

// Una línea: sin saltos (evita inyectar cabeceras) y con tope de longitud.
$linea = fn($v, $max = 200) => mb_substr(trim(preg_replace('/[\r\n\t]+/', ' ', is_scalar($v) ? (string) $v : '')), 0, $max);
$e = fn($v) => htmlspecialchars($v, ENT_QUOTES, 'UTF-8');

$nombre = $linea($datos['name'] ?? '', 80);
$telefono = $linea($datos['phone'] ?? '', 30);
if (mb_strlen($nombre) < 2 || !preg_match('/^\+?\d[\d\s]{7,14}$/', $telefono)) responder(422, false);

// Teléfono para los botones: sin espacios y con prefijo de España si viene a 9 cifras.
$digitos = preg_replace('/\D/', '', $telefono);
if (strlen($digitos) === 9) $digitos = '34' . $digitos;

$esValoracion = $linea($datos['form'] ?? '', 20) === 'valoracion';
$idiomas = ['es' => 'Español', 'en' => 'Inglés', 'ca' => 'Catalán'];
$idioma = $idiomas[$linea($datos['lang'] ?? '', 5)] ?? '';
$pagina = $linea($datos['page'] ?? '', 200);

// Ficha: etiqueta => valor (los vacíos no salen).
$ficha = [
    'Necesita' => $linea($datos['intent'] ?? '', 40),
    'Dirección del piso' => $linea($datos['address'] ?? '', 160),
    'Prefiere que le contestemos por' => $linea($datos['channel'] ?? '', 40),
];
foreach (array_slice((array) ($datos['details'] ?? []), 0, 8, true) as $etiqueta => $valor) {
    $ficha[$linea($etiqueta, 40)] = $linea($valor, 300);
}
$ficha['Idioma de la web'] = $idioma;
$ficha['Página'] = $pagina !== '' ? 'conromaasesores.com' . $pagina : '';
$ficha = array_filter($ficha, fn($v, $k) => $v !== '' && $k !== '', ARRAY_FILTER_USE_BOTH);

$mensaje = mb_substr(trim(is_string($datos['message'] ?? null) ? $datos['message'] : ''), 0, 3000);
$cuando = date('d/m/Y') . ' a las ' . date('H:i');
$tipo = $esValoracion ? 'Solicitud de valoración' : 'Mensaje de contacto';

// Texto plano (para clientes de correo sin HTML).
$texto = "$tipo desde la web\n\n$nombre\nTeléfono: $telefono\n\n";
foreach ($ficha as $k => $v) $texto .= "$k: $v\n";
if ($mensaje !== '') $texto .= "\nMensaje:\n$mensaje\n";
$texto .= "\nRecibido el $cuando. Guardado también en Supabase (tabla lead).\n";

// HTML: lo importante arriba (quién y cómo contactarle) y el resto en una ficha.
$filas = '';
foreach ($ficha as $k => $v) {
    $filas .= '<tr><td style="padding:8px 0;color:#6b6760;font-size:14px;vertical-align:top;width:42%">' . $e($k)
        . '</td><td style="padding:8px 0;font-size:15px;color:#1A1912">' . $e($v) . '</td></tr>';
}
$bloqueMensaje = $mensaje === '' ? '' :
    '<p style="margin:24px 0 8px;color:#6b6760;font-size:14px">Mensaje</p>'
    . '<div style="padding:16px;background:#f5f5f4;border-radius:12px;font-size:15px;line-height:1.5;color:#1A1912">'
    . nl2br($e($mensaje)) . '</div>';
$boton = fn($href, $txt, $fondo, $color) =>
    '<a href="' . $e($href) . '" style="display:inline-block;padding:12px 20px;margin:0 8px 8px 0;border-radius:10px;'
    . "background:$fondo;color:$color;font-weight:700;font-size:15px;text-decoration:none\">$txt</a>";

$html = '<!doctype html><html lang="es"><body style="margin:0;padding:24px;background:#f5f5f4;font-family:-apple-system,Helvetica,Arial,sans-serif">'
    . '<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden">'
    . '<div style="height:6px;background:#F3BC16"></div>'
    . '<div style="padding:28px 28px 8px">'
    . '<p style="margin:0 0 4px;color:#6b6760;font-size:14px">' . $e($tipo) . ' · ' . $e($cuando) . '</p>'
    . '<h1 style="margin:0 0 4px;font-size:26px;line-height:1.2;color:#1A1912">' . $e($nombre) . '</h1>'
    . '<p style="margin:0 0 20px;font-size:18px;color:#1A1912">' . $e($telefono) . '</p>'
    . $boton('tel:+' . $digitos, 'Llamar', '#1A1912', '#ffffff')
    . $boton('https://wa.me/' . $digitos, 'WhatsApp', '#F3BC16', '#1A1912')
    . '<table style="width:100%;margin-top:20px;border-collapse:collapse;border-top:1px solid #e7e5e4">' . $filas . '</table>'
    . $bloqueMensaje
    . '</div>'
    . '<p style="margin:0;padding:20px 28px 28px;color:#8a857d;font-size:13px">Guardado también en Supabase (tabla lead).</p>'
    . '</div></body></html>';

$limite = 'conroma-' . bin2hex(random_bytes(8));
$cuerpo = "--$limite\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
    . chunk_split(base64_encode($texto))
    . "--$limite\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
    . chunk_split(base64_encode($html))
    . "--$limite--\r\n";

$asunto = '=?UTF-8?B?' . base64_encode(($esValoracion ? 'Valoración' : 'Contacto') . " · $nombre · $telefono") . '?=';
$cabeceras = implode("\r\n", [
    'From: Web Conroma <' . REMITENTE . '>',
    'MIME-Version: 1.0',
    "Content-Type: multipart/alternative; boundary=\"$limite\"",
]);

$enviado = mail(DESTINO, $asunto, $cuerpo, $cabeceras, '-f' . REMITENTE);
responder($enviado ? 200 : 500, $enviado);
