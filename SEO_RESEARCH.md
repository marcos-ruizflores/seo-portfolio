# SEO Research

> **Limitaciones de esta primera pasada (2026-09-19)**
>
> - Resultados observados con un buscador web desde EE. UU., **no** con google.es desde España. El orden real en España puede variar.
> - **No hay datos de volumen.** La columna "Volumen" queda como `PENDIENTE` hasta consultarla en Google Ads Keyword Planner (gratis con una cuenta de Google Ads, sin campañas activas). No se inventan cifras.
> - "Competencia" es una valoración cualitativa de la primera página: quién ocupa los resultados y si hay webs pequeñas posicionadas.

## Criterios de priorización

1. ¿Una web pequeña y nueva puede entrar? (Hay webs de nicho en la primera página, no solo marcas grandes.)
2. ¿La búsqueda pide una **herramienta**? Estas resisten mejor los resúmenes de IA de Google que las preguntas informativas.
3. ¿Podemos hacerla **mejor** que lo que hay? (Más clara, más rápida, más precisa, en español de España.)
4. ¿Cuánto cuesta mantenerla? (Cambios de ley anuales, festivos, etc.)

---

## Proyecto 1 — Herramientas para desarrolladores (`sites/devtools`)

Papel en el portfolio: validar la plantilla. Mantenimiento casi nulo y todo funciona en el navegador. Es probable que el RPM de AdSense sea bajo; tráfico esperado moderado.

| Keyword        | Intención   | Volumen   | Competencia | Observaciones de la SERP                                                                                                                                                                | Página objetivo   | Prioridad         |
| -------------- | ----------- | --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------- |
| formatear json | Herramienta | PENDIENTE | Media       | pinetools.com/es, site24x7 (es), jsonreader.com/es, utilipad, json-indent.com, jsononline.net/es. Muchas son traducciones de webs en inglés; jsonformatter.org (inglés) también aparece | `/formatear-json` | Alta (construida) |

Pendiente: repetir el análisis para validar JSON, generar UUID, Base64, timestamp Unix, URL encode, decodificar JWT, probar regex, cron y formatear SQL antes de construirlas.

## Proyecto 2 — Calculadoras laborales y de nómina (España)

Papel en el portfolio: previsiblemente el de **mayor valor por visita** (finanzas personales). Es contenido YMYL: los cálculos deben ser exactos, llevar tests, citar la norma y actualizarse cada año.

| Keyword                      | Intención   | Volumen   | Competencia                                        | Observaciones de la SERP                                                                                                                                              | Página objetivo | Prioridad                                         |
| ---------------------------- | ----------- | --------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------- |
| calculadora sueldo neto 2026 | Herramienta | PENDIENTE | **Muy alta**                                       | Bankinter, Banco Santander y muchas webs de nicho (calculolaboral.org, billeo.es, calculadoraonline.es, calculaminomina.com, calculadorabrutoneto.com, tecalculo.com) | `/sueldo-neto`  | Media: clave para el sitio, difícil de posicionar |
| calculadora finiquito        | Herramienta | PENDIENTE | Alta, pero con **webs pequeñas en primera página** | finiquitocalculadora.es, finiqueitor.com, billeo.es y nominax.com. Muchos resultados son de **México** → hay que apuntar a "España" en título y contenido             | `/finiquito`    | **Alta**                                          |

Ideas por investigar: indemnización por despido, paro (prestación por desempleo), IRPF por comunidad, vacaciones no disfrutadas, pagas extra prorrateadas.

## Proyecto 3 — Fechas, plazos y días hábiles (España)

Papel en el portfolio: herramientas con intención clara y resultado personalizado (festivos por comunidad autónoma), algo que un resumen de IA no resuelve bien. Mantenimiento: publicar cada año el calendario de festivos oficial (BOE y boletines autonómicos).

| Keyword                                | Intención   | Volumen   | Competencia                           | Observaciones de la SERP                                                                                                                                                                           | Página objetivo | Prioridad |
| -------------------------------------- | ----------- | --------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------- |
| calcular días hábiles entre dos fechas | Herramienta | PENDIENTE | Media, **webs de nicho posicionadas** | contadordias.net, diainternacionalde.com, es.planetcalc.com, dates.toolsrmg.com, calculopro.com, dias-laborables.es. Valor diferencial: festivos por comunidad y plazos administrativos/procesales | `/dias-habiles` | **Alta**  |

Ideas por investigar: días entre fechas, calcular edad exacta, sumar días a una fecha, calendario laboral por comunidad 2027, plazos legales (Ley 39/2015).

## Descartado por ahora

- **Calculadora de consumo eléctrico:** SERP muy saturada (omnicalculator, ovacen, tarifaluzhora, calculadoraconversor, todaslascalculadoras…) sin un diferencial claro. Se puede retomar como sección del proyecto 2 o 3 si los datos lo justifican.

## Fuentes de esta pasada

Búsquedas del 2026-09-19: "calculadora sueldo neto 2026 España", "calculadora finiquito online 2026", "formatear JSON online en español", "calcular días hábiles entre dos fechas España festivos", "calculadora consumo eléctrico electrodomésticos coste kWh".
