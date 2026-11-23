# Base de rendimiento — antes de las animaciones GSAP

Compilación de partida: commit `286d51b` (copia local en `.superpowers/sdd/2026-11-23-animaciones-gsap/dist-base/`,
fuera de git). Las medidas de tiempo (LCP, INP, tirones) se toman **a la vez** sobre esta copia y sobre la
compilación nueva en la tarea 7, a 390×844 y con la ventana del navegador visible: medirlas ahora, con la
ventana oculta, daba valores de un navegador en segundo plano y no sirven para comparar.

| Página | CLS (scroll completo) | Tareas largas en scroll | LCP | INP |
|---|---|---|---|---|
| `/es/` | 0 | 0 ms | en tarea 7 | en tarea 7 |

## Antes y después (23-nov-2026, panel visible, 390×844)

Referencia «antes»: la compilación de producción (`~/conroma-web-swipe`, servida en :4399), que ya trae
el fondo de haces pero no las animaciones. «Después»: esta rama con la fusión de origin (:4322).
Scroll completo de la página a pasos de 60 px; «lentos» = fotogramas de más de 34 ms.

| Página | CLS antes → después | Tareas largas | Fotogramas lentos antes → después |
|---|---|---|---|
| `/es/` | 0,0020 → 0,0028 | 0 → 0 ms | 12 → 8 (de 318) |
| `/es/venta/` | 0,0105 → 0 | 0 → 0 ms | 12 → 10 (de 502) |

LCP: solo se obtuvo en una medida (212 ms en `/es/` antes); en el resto el navegador del panel no
devolvió entrada de LCP, así que no hay comparación fiable. INP no se midió. Ficha y `/es/vender/` sin
medir en esta pasada.
