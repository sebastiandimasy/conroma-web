# Para la reunión con el stakeholder

Guion de lo que conviene contar y de lo que hay que pedirle. Escrito para hablarlo en voz alta,
sin tecnicismos. Fecha: 3 de noviembre de 2026.

---

## 1. Qué le enseñamos

Una demo privada de la web nueva en un subdominio (`demo.conromaasesores.com`), **con contraseña
y sin que Google la pueda encontrar**. La web actual sigue intacta: no hemos tocado nada de lo
que está en producción.

**Que la vea en el móvil.** El 97 % de la gente que entra en la web lo hace desde el móvil, así
que es la pantalla que importa.

## 2. Por qué cambiamos la web (en una frase cada cosa)

La web antigua la generaba la plantilla del programa de gestión (Habitatsoft), y eso le pasaba
factura en Google:

| Problema de la web actual | Qué significa |
|---|---|
| Ninguna de sus 253 páginas decía a Google cuál es la versión buena | Google se encuentra la misma ficha repetida y no sabe cuál enseñar |
| Tenía 4 idiomas, pero sin avisar a Google de que lo eran | Los idiomas competían entre ellos en vez de sumar |
| La mitad de los títulos estaban repetidos | Dos páginas distintas se presentaban igual ante Google |
| 1.945 fotos sin descripción | Google no sabe qué hay en ellas: se pierde todo el buscador de imágenes |
| No había WhatsApp | El canal por el que la gente contacta de verdad hoy |
| No se podía pedir una valoración | **No se captaban propietarios**, que es la mitad del negocio |

La web nueva arregla las seis cosas.

## 3. Lo que hay que decirle sí o sí sobre la migración

### a) No se pierde el sitio en Google, pero hay que hacerlo bien
Tenemos **las 192 direcciones antiguas redirigidas una a una** a su equivalente nueva. Están
comprobadas: ninguna se queda sin destino. Quien entre por un enlace viejo, un marcador o un
resultado de Google, aterriza donde toca.

> El detalle técnico que importa: hoy la web vive en `www.conromaasesores.com` y la nueva está
> preparada para `conromaasesores.com` (sin www). **El servidor nuevo tiene que responder a las
> dos formas**, o las redirecciones no llegan a ejecutarse. Está contemplado y documentado.

### b) El correo no se toca
Es la pregunta que siempre sale. El correo va por un camino distinto al de la web. Si todo se
queda en Hostinger —que es el plan— **no hay que tocar ni un registro del correo**: riesgo cero.

### c) Las primeras semanas Google va a bailar
Es normal y no es un fallo: durante 2-4 semanas Google irá cambiando las direcciones viejas por
las nuevas. Puede haber subidas y bajadas en ese tramo. Lo vigilaremos con Search Console.

### d) Se puede volver atrás en minutos
No apagamos el servidor viejo hasta pasadas **dos semanas**. Si algo sale mal, se revierte en
minutos. Tenemos además **un backup completo de la web actual**: 285 páginas y 908 archivos.

### e) El día del cambio
Mejor **un martes o miércoles por la mañana**, nunca un viernes ni antes de un puente: si hay
que corregir algo, queremos tener días laborables por delante.

## 4. Lo que hay que PEDIRLE

### 🔴 El archivo de Habitatsoft con las fotos que faltan — lo más urgente
**8 de los 126 inmuebles no tienen ni una foto.** Mientras no las tengan:
- esas 8 fichas **no salen en Google** (las dejamos fuera a propósito: una ficha sin foto no se
  vende y perjudica al resto),
- y en la web se ven pobres al lado de las otras 118.

Un inmueble sin foto prácticamente no recibe contactos. Son 8 oportunidades paradas.
**Pedirle que reclame el archivo de fotos a Habitatsoft**, aunque sea solo las de esos 8.

> Vale la pena mencionarlo: **Lloret de Mar tiene 35 inmuebles y Malgrat 23**. La web habla
> de Malgrat como si fuera el único mercado. Si Lloret pesa más, deberíamos reflejarlo.

### 🔴 El NIF/CIF y el número AICAT
Es el **único bloqueante legal sin rodeo**. Las páginas de aviso legal y privacidad siguen con
los huecos sin rellenar. Publicar un aviso legal sin el NIF incumple la ley (LSSI), y el número
**AICAT** es obligatorio para agentes inmobiliarios en Cataluña. Son dos datos: con ellos, en
diez minutos quedan listas.

### 🟠 Accesos
- Entrar a **Google Tag Manager** para confirmar que la analítica está realmente puesta. Está
  instalado el contenedor, pero desde fuera no se puede ver si dentro está la etiqueta de
  Analytics. Si no estuviera, **publicaríamos a ciegas, sin medir nada**.
- La cuenta de **Hostinger** para crear el subdominio de la demo y, llegado el día, hacer el
  cambio.

### 🟡 Decisiones que solo puede tomar él
1. **¿Versión en catalán?** La web antigua tenía catalán, castellano, inglés y francés (mal
   montados). La nueva, de momento, solo castellano. En Malgrat el catalán es lengua habitual.
2. **¿Cuándo?** En cuanto tengamos el NIF, el AICAT y el visto bueno.

## 5. Estado del CRM: hasta dónde llegamos

El CRM es el programa interno para llevar pisos, clientes y citas. Está **en fase de prototipo
funcional**: se puede navegar entero y ver cómo trabajaría el equipo.

**Las 10 pantallas están diseñadas y navegables**, con dos perfiles distintos: lo que ve la
dirección (todo el equipo) y lo que ve un comercial (solo lo suyo).

| Pantalla | Estado |
|---|---|
| Panel de inicio | ✅ **Con datos reales** |
| Leads (clientes interesados) | ✅ **Con datos reales** |
| Ficha de un lead | ✅ **Con datos reales** — cambiar etapa, interés y notas ya se guarda |
| Pisos | 🟡 Diseñada, con datos de ejemplo |
| Ficha de piso (alta y edición) | 🟡 Diseñada, con datos de ejemplo |
| Agenda de visitas | 🟡 Diseñada, con datos de ejemplo |
| Valoraciones | 🟡 Diseñada, con datos de ejemplo |
| Contactos | 🟡 Diseñada, con datos de ejemplo |
| Difusión a portales | 🟡 Diseñada, con datos de ejemplo |
| Asesores | 🟡 Diseñada, con datos de ejemplo |

**Traducido: 3 de 10 pantallas ya funcionan de verdad contra la base de datos.** Las otras 7
están construidas y se ven, pero con datos de ejemplo. El trabajo que falta no es de diseño:
es conectarlas, y el camino ya está abierto con las tres primeras.

Lo que sí conviene decirle con claridad: **la web nueva ya captura clientes de verdad**. Cada
formulario de contacto y cada solicitud de valoración queda registrada. Eso funciona desde el
primer día, independientemente de lo que falte del CRM.

## 6. Lo que NO hay que prometer

- **Que el día 1 suben las visitas.** No funciona así: las primeras semanas Google reorganiza.
  La mejora se nota a partir del mes o mes y medio.
- **Que el CRM está terminado.** Está a mitad: 3 pantallas de 10 funcionando.
- **Una fecha de cambio** mientras falten el NIF y el AICAT.

## 7. Un apunte que conviene mencionar

Los vídeos de la web pesan **44 MB**, y uno solo ocupa **19 MB**. En un móvil con datos eso
tarda mucho y gasta la tarifa del visitante. Hay que comprimirlos antes de publicar. No es
bloqueante, pero sí hay que hacerlo.
