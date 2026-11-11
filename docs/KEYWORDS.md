# Conroma · Mapa de keywords por intención

> Guía de qué busca el usuario en cada página. **Los volúmenes NO están rellenos**: se añaden
> con datos reales de NotFair (`getKeywordIdeas`, Planificador de Google Ads) en cuanto se
> conecte Google Ads en NotFair. No inventar cifras. Última actualización: 2026-11-11.

Cómo leerlo: *principal* = la keyword que la página debe ganar; *secundarias* = variantes y
términos semánticos a incluir en H2/párrafos; *intención* = transaccional (T) / local (L) /
informacional (I). La columna **Vol.** se rellena luego.

## Núcleo de negocio

| Página | Intención | Keyword principal | Secundarias / semánticas | Vol. |
|---|---|---|---|---|
| Home `/es/` | T·L | inmobiliaria Malgrat de Mar | inmobiliaria Maresme, inmobiliaria Alt Maresme, agencia inmobiliaria Malgrat, inmobiliaria Costa Brava | — |
| Comprar `/es/comprar/` | T·L | comprar piso Malgrat de Mar | pisos en venta Maresme, comprar casa Costa Brava, casas en venta Alt Maresme, comprar vivienda Malgrat | — |
| Vender `/es/vender/` | T·L | vender piso Malgrat de Mar | vender casa Maresme, cómo vender mi piso, vender piso rápido, inmobiliaria para vender | — |
| Valoración `/es/valoracion/` | T·L | valoración piso gratis Malgrat | cuánto vale mi piso, tasación piso Maresme, valorar vivienda gratis, precio de mi casa | — |
| Alquilar `/es/alquilar/` | T·L | pisos en alquiler Malgrat de Mar | alquiler Santa Susanna, alquiler Pineda de Mar, alquilar piso Maresme, buscar inquilino | — |
| ¿Puedo comprar? `/es/comprar/puedo-comprar/` | I | cuánto puedo pagar por un piso | calcular hipoteca, cuánto me puedo gastar en un piso, ahorro para comprar casa | — |

## Servicios

| Página | Intención | Keyword principal | Secundarias / semánticas | Vol. |
|---|---|---|---|---|
| Reformas `/es/reformas/` | T·L | reforma integral piso Maresme | Conroma en Obras, reformar piso antes de vender, interiorismo Malgrat, reforma cocina/baño Maresme | — |
| Gestión patrimonio `/es/gestion-de-patrimonio/` | T | gestión de patrimonio inmobiliario | administración de inmuebles, rentabilidad alquiler, gestión de alquileres Maresme | — |
| Servicios `/es/servicios/` | I·L | servicios inmobiliaria Malgrat | qué hace una inmobiliaria, honorarios inmobiliaria, servicios de compraventa | — |

## Municipios (resolver canibalización por INTENCIÓN)

Regla: **dos plantillas, dos intenciones distintas** (así no compiten):
- `/es/inmobiliaria/{pueblo}` → intención **vendedor/agencia**: "inmobiliaria en {pueblo}".
- `/es/venta/{pueblo}` → intención **comprador/catálogo**: "pisos en venta en {pueblo}".

| Pueblo | `/inmobiliaria/{pueblo}` (vender) | `/venta/{pueblo}` (comprar) | Vol. |
|---|---|---|---|
| Malgrat de Mar | inmobiliaria Malgrat de Mar · vender piso Malgrat | pisos en venta Malgrat de Mar · comprar casa Malgrat | — |
| Blanes | inmobiliaria Blanes · vender piso Blanes | pisos en venta Blanes | — |
| Lloret de Mar | inmobiliaria Lloret de Mar | pisos en venta Lloret de Mar · apartamento Lloret | — |
| Pineda de Mar | inmobiliaria Pineda de Mar | pisos en venta Pineda de Mar | — |
| Calella | inmobiliaria Calella | pisos en venta Calella | — |
| Santa Susanna | inmobiliaria Santa Susanna | pisos / apartamentos en venta Santa Susanna | — |
| Palafolls | inmobiliaria Palafolls | casas en venta Palafolls | — |
| Tordera | inmobiliaria Tordera | casas con terreno Tordera | — |
| Maçanet de la Selva | — | pisos y casas en venta Maçanet de la Selva | — |

(Los pueblos con 1 inmueble suelto quedan fuera del índice; no se les hace keyword.)

## GEO / buscadores IA (consultas conversacionales)

Preguntas tal cual las hace la gente a ChatGPT/Perplexity/AI Overviews. Se cubren con las FAQ
citables y el contenido local:
- "mejor inmobiliaria en Malgrat de Mar" / "inmobiliaria de confianza en el Maresme"
- "inmobiliaria familiar Costa Brava" / "inmobiliaria que también hace reformas"
- "cuánto cuesta vender un piso con inmobiliaria en Cataluña"
- "qué inmobiliaria vende pisos en Lloret de Mar"
- "cómo vender un piso heredado en el Maresme"

## Siguiente paso
1. Conectar **Google Ads** en NotFair (o DataForSEO).
2. Correr `getKeywordIdeas` con estas semillas por municipio y servicio → rellenar **Vol.** y CPC.
3. Reordenar prioridades por volumen × intención y ajustar titles/intros/H2 con los términos que
   de verdad tengan búsquedas.
