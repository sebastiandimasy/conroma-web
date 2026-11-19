# Puente diario con el panel de Habitatsoft

> Solución provisional mientras Habitatsoft no nos da la URL del feed «Enlace Web 2.0».
> Cuando llegue el feed, se pone en `HABITATSOFT_FEED_URL` y este puente se apaga
> (`bash scripts/habitatsoft-panel/instalar-tarea.sh --quitar`).

## Qué hace

Cada mañana, en este Mac:

1. Abre Chrome **sin ventana**, con un perfil propio (`~/.conroma-habitatsoft`), y entra en
   *Mis inmuebles* con la sesión que dejaste guardada.
2. Lee los **inmuebles activos**: listado (ref, operación, tipo, precio y precio tachado), ficha
   (superficies, habitaciones, baños, planta, características, coordenadas, fotos, descripción)
   y certificado energético. Solo **lee** (las mismas peticiones que hace el panel, de una en una
   y con pausas). Nunca edita nada.
3. Reescribe `src/data/properties.real.json`:
   - Los inmuebles que ya estaban **conservan** su ref, pueblo, zona y lo editorial; se
     actualizan precio, bajada, datos, fotos, descripción y energía.
   - Los **nuevos** entran con pueblo y zona sacados de la dirección. **La calle no sale nunca
     de la página del panel**, ni nada del propietario.
   - Los que ya **no están activos** desaparecen de la web.
   - Si la lectura se queda a medias o trae menos de la mitad de lo publicado, **no toca nada**.
4. Si hay cambios: compila (build de demo hasta el swipe), pasa los tests y guarda la versión
   en `~/conroma-versiones` para poder volver atrás.
5. Si existe `.hostinger` (FTP), sube la demo y pasa la prueba de humo. Si no existe, se queda
   compilado y te avisa.

Te avisa con una notificación de macOS si la sesión caduca, si la lectura no es fiable o si
algo falla. El registro de cada día está en `~/.conroma-habitatsoft/lecturas/AAAA-MM-DD.log`
y la última lectura en bruto, en `~/.conroma-habitatsoft/lecturas/ultima.json`.

## Puesta en marcha (una vez)

```bash
node scripts/habitatsoft-panel/sync-panel.mjs --login
```

Se abre un Chrome aparte. Inicia sesión en Habitatsoft **marcando «Recordar»**, comprueba que
ves *Mis inmuebles* y **cierra esa ventana** (si sigue abierta, la tarea no puede usar el perfil).

Prueba sin escribir nada (lee 3 fichas):

```bash
node scripts/habitatsoft-panel/sync-panel.mjs --prueba 3
```

Programar la tarea (cada día a las 07:15; si el Mac duerme, corre al despertar):

```bash
bash scripts/habitatsoft-panel/instalar-tarea.sh
```

Lanzarla ahora a mano: `launchctl kickstart gui/$(id -u)/com.conroma.habitatsoft-sync`.

## Cuando avisa

| Aviso | Qué hacer |
| --- | --- |
| «La sesión de Habitatsoft ha caducado» | Repetir `--login`. |
| «Lectura del panel no fiable» | Nada urgente: la web sigue con lo de ayer. Si se repite, mirar el registro. |
| «El build o los tests fallan» | Ya ha vuelto al inventario de ayer. Mirar el registro del día. |
| «No subo: falta .hostinger» | Crear `.hostinger` (ver `scripts/subir-preview.py`). |

## Piezas

- `scripts/habitatsoft-panel/extractor.mjs`: lo que corre dentro del panel (solo lectura).
- `src/lib/habitatsoft-panel.ts`: convierte cada ficha en `Property` (con tests en
  `tests/habitatsoft-panel.test.ts`). Energía: código `552` = exento, `548` = en trámite; letras A-G con kWh y
  emisiones; si el panel no trae certificado, no se inventa y rellena lo leído de la web antigua.
- `scripts/habitatsoft-panel/sync-panel.mjs`: arranca Chrome por CDP (sin dependencias nuevas),
  lee y escribe el inventario. Salidas: 0 bien, 2 lectura no fiable, 3 sesión caducada, 1 error.
- `scripts/habitatsoft-panel/sync-diario.sh`: la cadena completa del día.
- `scripts/habitatsoft-panel/instalar-tarea.sh`: la programa con launchd (o `--quitar`).
- `scripts/inventario-comun.mjs`: escritura del inventario y del registro de altas, compartida
  con el feed (`scripts/fetch-inventory.mjs`).

## Límites

- Depende de que el Mac esté encendido y de que la sesión «Recordar» dure. Habitatsoft no dice
  cuánto dura: si caduca, avisa y la web sigue con el último inventario bueno.
- Lee el HTML del panel: si Habitatsoft cambia su panel, el extractor puede dejar de leer.
  Entonces la comprobación de lectura completa lo frena y avisa; nunca publica a medias.
- Tras el swipe (`CONROMA_DESTINO=produccion`) solo compila y comprueba; la subida a producción
  sigue el procedimiento de `docs/SWIPE.md` o el workflow de GitHub.
