<?php
// Aviso por correo de cada formulario de la web (contacto y valoración) a gestion@.
// El lead se guarda en Supabase desde el navegador; esto solo avisa. Destinatario fijo:
// aunque alguien llame a este script a mano, solo puede escribir a la propia inmobiliaria.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

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
$linea = fn($v, $max = 200) => mb_substr(trim(preg_replace('/[\r\n\t]+/', ' ', (string) ($v ?? ''))), 0, $max);
$nombre = $linea($datos['name'] ?? '', 80);
$telefono = $linea($datos['phone'] ?? '', 30);
if (mb_strlen($nombre) < 2 || !preg_match('/^\+?\d[\d\s]{7,14}$/', $telefono)) responder(422, false);

$formulario = $linea($datos['form'] ?? 'contacto', 20) === 'valoracion' ? 'Valoración' : 'Contacto';
$campos = [
    'Formulario' => $formulario,
    'Nombre' => $nombre,
    'Teléfono' => $telefono,
    'Necesita' => $linea($datos['intent'] ?? '', 40),
    'Dirección del piso' => $linea($datos['address'] ?? '', 160),
    'Cómo prefiere que le contestemos' => $linea($datos['channel'] ?? '', 40),
    'Idioma de la web' => $linea($datos['lang'] ?? '', 5),
    'Página' => $linea($datos['page'] ?? '', 200),
];
$cuerpo = '';
foreach ($campos as $etiqueta => $valor) {
    if ($valor !== '') $cuerpo .= "$etiqueta: $valor\n";
}
$mensaje = mb_substr(trim((string) ($datos['message'] ?? '')), 0, 3000);
if ($mensaje !== '') $cuerpo .= "\nMensaje:\n$mensaje\n";
$cuerpo .= "\nGuardado también en Supabase (tabla lead). Enviado " . date('d/m/Y H:i') . ".\n";

$asunto = '=?UTF-8?B?' . base64_encode("Web · $formulario · $nombre") . '?=';
$cabeceras = implode("\r\n", [
    'From: Web Conroma <' . REMITENTE . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

$enviado = mail(DESTINO, $asunto, $cuerpo, $cabeceras, '-f' . REMITENTE);
responder($enviado ? 200 : 500, $enviado);
