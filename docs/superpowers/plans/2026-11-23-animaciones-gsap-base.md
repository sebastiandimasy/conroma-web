# Base de rendimiento — antes de las animaciones GSAP

Compilación de partida: commit `286d51b` (copia local en `.superpowers/sdd/2026-11-23-animaciones-gsap/dist-base/`,
fuera de git). Las medidas de tiempo (LCP, INP, tirones) se toman **a la vez** sobre esta copia y sobre la
compilación nueva en la tarea 7, a 390×844 y con la ventana del navegador visible: medirlas ahora, con la
ventana oculta, daba valores de un navegador en segundo plano y no sirven para comparar.

| Página | CLS (scroll completo) | Tareas largas en scroll | LCP | INP |
|---|---|---|---|---|
| `/es/` | 0 | 0 ms | en tarea 7 | en tarea 7 |
