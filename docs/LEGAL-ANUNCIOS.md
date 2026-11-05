# Qué obliga la ley a poner en cada anuncio

Verificado el 5 de noviembre de 2026 contra el BOE, el DOGC y la Generalitat.
Aplica a **Conroma Asesores**, agente inmobiliario en **Malgrat de Mar (Cataluña)**.

> **Aviso de partida.** El CRM HabitatSoft muestra en su ficha un campo de VPO citando
> *«la nueva ley de vivienda 11/2025 establece la obligatoriedad en Cataluña de indicar si el
> inmueble es de Protección Oficial»*. **Eso es incorrecto.** La Ley 11/2025 existe
> (DOGC 9574, en vigor el 1-1-2026) pero **no modifica los artículos de publicidad** y **no
> obliga a indicar VPO en un anuncio**. Lo que sí es cierto —el campo de gran tenedor— viene de
> otras normas. No des por buena una obligación legal porque la diga un proveedor de software.

---

## 1. Lo que hay que poner en TODA ficha de inmueble

Artículo **59 de la Ley 18/2007** del derecho a la vivienda (Cataluña), más normativa estatal.

| Dato | Norma | Multa si falta |
|---|---|---|
| **Nº de registro AICAT** de Conroma, en la web y en los anuncios | Ley 18/2007 arts. **57** y **59.e)** | Leve: **3.000–9.000 €** |
| **Etiqueta energética (A–G)** | **RD 390/2021 arts. 15.2 y 17.3** | 300–600 € estatal **+** leve catalana 3.000–9.000 € |
| Localización de la vivienda | art. 59.a) | Leve |
| Superficie útil y construida (anexos aparte) | art. 59.d) | Leve |
| Dirección física del agente en la web | art. 55.3 | Leve |
| Estado: terminada / en obra / proyectada | art. 59.b) | Solo obra nueva |
| Nº y caducidad de la licencia de obras | art. 59.c) | Solo primera transmisión |

**El certificado energético es el agujero grande.** Es obligatorio desde 2013, aplica a las 126
fichas, y hoy **no tenemos el dato de ninguna**. Está en Habitatsoft: hay que traerlo al feed.
Publicar una letra sin certificado en vigor es peor todavía: infracción **muy grave**,
1.001–6.000 € (D.A. 12ª.3.d del RDL 7/2015).

---

## 2. Alquiler en zona tensionada: el riesgo caro

**Malgrat de Mar, Lloret de Mar y Blanes están declarados zona de mercado residencial
tensionado** (Resolución TER/800/2024, publicada en BOE-A-2024-5214). **Vigente hasta el
16 de marzo de 2027** — anotar esa fecha para revisarla.

Anunciar allí el **alquiler de una vivienda** obliga además a publicar:

| Dato | Norma |
|---|---|
| **Precio máximo** que resulta del índice de referencia, o la última renta de los últimos 5 años | art. **59.g)** y 61.2.f) |
| **Si el propietario es gran tenedor** (umbral en la zona: **5 o más** viviendas) | art. **59.h)** y 61.2.g) |

Omitir cualquiera de los dos es **infracción GRAVE: 9.001 – 90.000 €** (art. 124.2.n).

### Qué hemos hecho con esto

Teníamos **2 inmuebles en alquiler** y **ningún** dato de los dos obligatorios:

| Ref | Qué es | Dónde | Decisión |
|---|---|---|---|
| `C-1280-A` | Chalet, 2.800 € | Lloret de Mar (zona tensionada) | **Retirado** hasta tener los datos |
| `PK-043-M` | Parking, 30.000 € | Pineda de Mar | Se publica: un parking **no es vivienda** |

`src/data/properties.ts` filtra automáticamente las viviendas en alquiler a las que les falte
`rentIndexMax` o `largeHolder`. En cuanto el dato entre en el feed, la ficha vuelve sola.
`tests/legal.test.ts` impide que alguien lo desactive sin enterarse.

> ⚠️ **`PK-043-M` a 30.000 € «de alquiler» tiene pinta de ser un error de datos** (un parking no
> se alquila por eso). Conviene revisarlo en Habitatsoft: probablemente sea una venta mal
> etiquetada.

---

## 3. VPO: obligatorio, pero NO en el anuncio

Ninguna norma obliga a indicar la protección oficial en la publicidad. Sí hay que darla **en la
oferta**, es decir, en la información por escrito previa a cobrar cualquier cantidad:

- **Ley 18/2007 art. 60.2.f) y 60.3.g)**: régimen de protección, plan de vivienda, fecha de
  calificación y limitaciones para el comprador.
- **Ley 12/2023 art. 31.1.e)**: el interesado puede exigirlo antes de firmar o entregar dinero.

Tener el campo en la ficha es **buena práctica** —evita leads que no pueden comprar— pero no es
una obligación del anuncio.

---

## 4. Lo que falta y solo puede dar Conroma

1. **Nº AICAT** y **NIF/CIF**. Bloquean el aviso legal y son obligatorios en cada anuncio.
2. **Etiqueta energética de los 126 inmuebles.** Está en Habitatsoft; hay que incorporarla al feed.
3. Para los alquileres: **precio máximo del índice** (calculadora oficial de la Generalitat) y
   **si el propietario es gran tenedor**.

## 5. Lo que no está cerrado del todo

La **Ley 11/2026, de 9 de julio** (DOGC 9706) habría reescrito el art. 59 **eliminando** la
obligación de indicar la referencia de la cédula de habitabilidad en la publicidad, y
sustituyéndola por la prohibición de publicitar sin cédula vigente. Lo dicen cuatro despachos de
forma coincidente, pero **no hemos podido leer el texto oficial**: el PDF del DOGC no es
extraíble y el consolidado del BOE aún no la incorpora.

**Mientras no se confirme, incluir la referencia de la cédula no es sancionable; omitirla sí
podría serlo.** Conviene que lo confirme un abogado colegiado antes de retirar ese dato.

---

## Fuentes

- [Ley 18/2007, consolidada](https://www.boe.es/buscar/act.php?id=BOE-A-2008-3657) — arts. 55, 57, 59, 60, 61, 118, 123, 124, 125
- [Ley 11/2025, de 29 de diciembre](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-5547)
- [Ley 12/2023 por el derecho a la vivienda](https://www.boe.es/buscar/act.php?id=BOE-A-2023-12203) — arts. 3.k), 31
- [RD 390/2021, certificación energética](https://www.boe.es/buscar/act.php?id=BOE-A-2021-9176) — arts. 13, 15, 17, 21
- [RDL 7/2015 TRLSRU](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11723) — D.A. 12ª y 13ª
- [Zonas tensionadas, 1T 2024 — incluye Malgrat de Mar](https://www.boe.es/buscar/doc.php?id=BOE-A-2024-5214)
- [Listado oficial de municipios ZMRT](https://habitatge.gencat.cat/ca/ambits/preus-ingressos-i-zones/limit-preu-lloguer/llistat-municipis-zmrt/)
