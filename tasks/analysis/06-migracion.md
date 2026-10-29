# Migración SEO de la web antigua — plan de estructura

> Fuente: `conroma_enlaces_internos.csv` (volcado Screaming Frog de conromaasesores.com,
> 256 URLs, 252 indexables, 4 × 302). Análisis; no cambia páginas todavía.
> Depende de: feed Habitatsoft (Cimiento B) y datos reales por pueblo (€/m²).

## 1. Qué era la web antigua (con datos)

| Grupo | Nº | Qué es | Valor SEO |
|---|---|---|---|
| `/buscador/<op>/<tipo>/<prov>/<municipio>` | **50 únicas** | Landings filtradas por pueblo y tipo | **ALTO** (intención local) |
| `/buscador/` + `?Pagina=N` | ~65 | Listado Malgrat + paginación | Medio (thin/duplicada) |
| `/detalle/<op>/<tipo>/<prov>/<municipio>/<id>` | ~115 | Fichas de inmueble | Bajo (pisos ya vendidos) |
| Estáticas (contacto, blogs, captación, etc.) | ~10 | Páginas fijas | Medio |

**Universo real de intención local que rankeaba:**
- **Operaciones**: en_venta (93), en_traspaso (6), en_alquiler (4).
- **Provincias**: girona (57), barcelona (44), maresme (2, dato sucio).
- **Tipos** (5, con 1 typo `finc.rusticas`): pisos/dúplex/áticos, casas/torres/chalets,
  terrenos/rústicas/masías, locales/oficinas, parkings/garajes.
- **21 municipios**: lloret_de_mar (17), malgrat_de_mar (14), blanes (10), pineda_de_mar (8),
  calella (8), tordera (6), + 15 menores (riudarenes, caldes de malavella, maçanet, sant hilari,
  palafolls, arbúcies, hostalric, massanes, sant cebrià, vilobí, fogars, besalú, sils, vidreres,
  santa susanna).

**Problemas técnicos heredados** (confirman la auditoría previa):
- **Canonical vacío en las 115 URLs de buscador** → duplicación masiva.
- Paginación `?Pagina=N` genera decenas de páginas thin casi idénticas.
- H1 duplicado con el título en las fichas ("CONROMA ASESORES... - <inmueble>").
- Meta keywords gigantes (obsoletas, Google las ignora).

## 2. Qué cubre ya la web nueva (bien)

`public/_redirects` (50 reglas) **ya evita todo 404**: estáticas 1:1, `/detalle/*` y `/buscador/*`
con regla por municipio (malgrat→venta, blanes/tordera/lloret→inmobiliaria) y comodín de respaldo a
`/es/comprar/`, más `/idioma/*` y `/uikit/*`. La raíz `/ → /es/` la pone el adaptador.

**La red de seguridad está puesta: ninguna URL antigua se rompe.**

## 3. El hueco que sí cuesta posicionamiento

Un 301 conserva autoridad **solo si el destino trata el mismo tema**. Hoy:
- **17 de 21 municipios** (pineda, calella, santa susanna, palafolls, caldes, maçanet…) caen al
  genérico `/es/comprar/`. Una página que rankeaba por "pisos en venta en Calella" aterriza en una
  página de compra genérica → **pérdida de intención y de ranking**.
- **El tipo de inmueble se pierde**: "casas en venta en Malgrat" y "pisos en venta en Malgrat"
  redirigen ambos a `/es/venta/malgrat-de-mar/`, sin faceta por tipo.
- **Alquiler y traspaso** van todos a `/es/alquilar/` (sin página de pueblo de alquiler).

Recuperar esto = darle a cada intención que rankeaba **una página propia que trate ese tema**.

## 4. Taxonomía de URL nueva (mejora y escala la antigua)

Mantiene la granularidad que rankeaba (operación × municipio × tipo) pero limpia y con los niveles
del plan de escalado (`tier: local → comarca → provincia → ccaa → país`):

```
/es/<operacion>/<municipio>/                     listado del pueblo (todos los tipos)
/es/<operacion>/<municipio>/<tipo>/              faceta por tipo (pisos|casas|terrenos|locales|parkings)
/es/inmueble/<slug>/                             ficha (ya existe)
/es/inmobiliaria/<municipio>/                    landing de captación (vender) — ya existe
```

- **Operaciones**: `venta`, `alquiler` (hueco actual), y `traspaso` solo si se decide mantener (6 URLs, poco valor → se puede plegar en `alquiler` o una página de locales comerciales).
- **Municipios**: ampliar `src/data/towns.ts` (hoy 8) a los que tenían presencia SEO real. Prioridad por volumen de URLs antiguas: lloret, malgrat, blanes, pineda, calella, tordera (los 6 fuertes) + santa susanna, palafolls (ya están). Los 13 menores: página solo si hay inventario/dato real; si no, siguen al respaldo.
- **Tipos**: faceta opcional; se publica una faceta solo si hay ≥1 inmueble real de ese tipo en ese pueblo (evita páginas vacías = programmatic slop).
- **Canonical propio** en cada página (el gran fallo antiguo), y paginación con `rel=canonical` a la página 1 o `noindex` en las páginas >1.

## 5. Mapa de redirección — mejora (cuando existan las páginas)

Orden: lo específico antes que el comodín (Cloudflare gana la primera).

```
# Faceta por tipo (cuando exista la página de tipo del municipio)
/buscador/en_venta/pisos_duplex_apartamentos_aticos/:prov/:mun/*   /es/venta/:mun/pisos/      301
/buscador/en_venta/casas_torres_adosados_chalets/:prov/:mun/*      /es/venta/:mun/casas/      301
/buscador/en_venta/terrenos_*/:prov/:mun/*                         /es/venta/:mun/terrenos/   301
/buscador/en_venta/locales_comerciales_oficinas/:prov/:mun/*       /es/venta/:mun/locales/    301
/buscador/en_venta/parkings_garajes/:prov/:mun/*                   /es/venta/:mun/parkings/   301
# Municipio sin faceta → listado del pueblo
/buscador/en_venta/:tipo/:prov/:mun/*                              /es/venta/:mun/            301
/buscador/en_alquiler/:tipo/:prov/:mun/*                           /es/alquiler/:mun/         301
# Respaldo (municipio sin página) → intención
/buscador/en_venta/*                                               /es/comprar/               301
```

- El mapeo `:mun` del slug antiguo (`malgrat_de_mar`) al nuevo (`malgrat-de-mar`) es `_`→`-`.
  Cloudflare no transforma el param, así que para los municipios con página hace falta **una regla
  explícita por pueblo** (como las 4 actuales), no un patrón genérico.
- Paginación `/buscador/?Pagina=*` y `/destacados?...Pagina=*` → `/es/venta/malgrat-de-mar/` (301),
  nunca conservar la paginación antigua.
- Fichas `/detalle/*`: se mantienen hacia el listado del municipio (ya está). Si el feed trae la
  ficha viva, se puede afinar a `/es/inmueble/<slug>` por referencia, pero por defecto → listado.

## 6. NAP (coherencia)

Fuente única: `src/data/site.ts` (`legalName`, `address` Av. Mediterránea 16, 08380 Malgrat de Mar,
`phone` +34 626 378 687, `landline` 937 61 03 53, `email`). Debe aparecer **idéntica** en: schema
`RealEstateAgent.address`, footer, página de contacto y Google Business Profile. El título antiguo ya
llevaba la NAP ("Av. Mediterranea, 16, MALGRAT DE MAR") → mantener la misma grafía (con tilde) en
todas partes. **Pendiente de dato real**: `geo` (lat/long) y `openingHours` (horario de oficina).

## 7. Schema.org

- `RealEstateAgent` (ya existe, centralizado en `seo.ts`): tiene address, areaServed (8 pueblos),
  knowsLanguage, `sameAs` (añadido). **Ampliar** `areaServed` a los municipios que se reactiven;
  añadir `geo` y `openingHoursSpecification` cuando haya dato real; mantener la decisión de NO
  autodeclarar `aggregateRating`.
- **Listados** (`/es/venta/<municipio>/`): `CollectionPage` + `BreadcrumbList`.
- **Fichas** (`/es/inmueble/<slug>`): `RealEstateListing`/`Offer` con precio, metros, habitaciones,
  ubicación — con datos reales del feed, no del sample.
- **Blog**: `Article` con autor y fecha (E-E-A-T YMYL) — ya publicados, falta autoría real.

## 8. Ejecución (orden, atado a las dependencias)

1. **Ya hecho**: red de 301 anti-404 (no se pierde nada hoy).
2. **Reactivar los 6 pueblos fuertes** (lloret, malgrat, blanes, pineda, calella, tordera) con página
   propia de venta + contenido local real → cambiar su 301 del genérico a su página. *(necesita dato
   real por pueblo; sin €/m²/inventario, no se publica — regla del usuario.)*
3. **Facetas por tipo** donde haya inventario real (depende del feed Habitatsoft, Cimiento B).
4. **Páginas de alquiler por pueblo** (`/es/alquiler/<municipio>/`) para recuperar la intención de
   alquiler que hoy cae al genérico.
5. **Canonical + paginación** correctos en todos los listados nuevos (el gran fallo antiguo).
6. Ampliar `areaServed`/`geo`/`openingHours` en schema con datos reales.

## 9. Riesgos

- **Crear páginas de pueblo sin dato real = programmatic slop** (justo el error de la web antigua con
  canonical vacío). Regla: página de municipio/tipo solo con inventario o dato propio real.
- **Mapeo slug `_`→`-`**: Cloudflare no transforma params → regla explícita por pueblo reactivado.
- **Traspaso**: decidir si se mantiene como línea de negocio o se pliega; 6 URLs, bajo valor.
- La migración fina (facetas, fichas vivas) está **bloqueada por el feed Habitatsoft**.
