---
{
  "id": "016-tavira-sevilla",
  "order": 16,
  "title": "Día 12 · El puente que corrigió su nombre",
  "channelCode": "T-29V7",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-24" }, "location": { "lat": 37.1268750, "lng": -7.6498436, "radiusMeters": 1000, "label": "Ponte antiga de Tavira" } },
  "mission": "Dos orillas, una memoria corregible",
  "formulaWord": null,
  "water": "Agua de las Dos Orillas",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Tavira corrige la memoria popular de su puente: no puede demostrarse romano, sí medieval y reconstruido. Sevilla amplía la comparación entre puente, canal, representación y territorio. El cuaderno solo se consulta para producir una conclusión.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. Cruzad el puente antiguo de Tavira y observadlo también desde una ribera segura para ver sus siete arcos." },
  { "from": "topotino", "time": "auto", "text": "Mucha gente lo llama romano; los estudios lo aseguran como medieval y reconstruido hacia 1655. Encontrad tres detalles actuales y explicad por qué un nombre repetido no pesa más que la evidencia." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "tavira-puente-corregido",
    "blockedFlags": ["tavira_puente"],
    "openAnswer": true,
    "minWords": 15,
    "containsAnyGroups": [["siete", "7", "arco", "puente", "peatonal", "río", "rio"], ["romano", "medieval", "1655", "reconstruido"], ["evidencia", "estudio", "repetido", "nombre", "porque"]],
    "setFlags": ["tavira_puente"],
    "remember": { "kind": "myth_correction", "label": "Corrección razonada del origen del puente de Tavira" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Corregir una memoria no la destruye: la vuelve más honesta. El puente sigue siendo valioso sin necesitar una edad inventada." },
      { "from": "topotino", "time": "auto", "text": "Subid al jardín del castillo o buscad otra vista alta segura. Dibujad mentalmente la relación entre río, puente, tejados y salida hacia el mar. Dad dos razones por las que el lugar elevado ayuda a comprender la ciudad y una cosa que oculta." }
    ]
  },
  {
    "id": "tavira-vista-sistema",
    "requiredFlags": ["tavira_puente"],
    "blockedFlags": ["tavira_vista"],
    "openAnswer": true,
    "minWords": 13,
    "containsAnyGroups": [["río", "rio", "puente", "tejados", "mar", "ciudad"], ["alto", "vista", "orienta", "relación", "relacion"], ["oculta", "no vemos", "detalle", "calle", "porque"]],
    "setFlags": ["tavira_vista"],
    "remember": { "kind": "scale_tradeoff", "label": "Ventajas y límites de la vista alta de Tavira" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Exacto: la altura revela conexiones y pierde detalles. Consultad vuestro Cuaderno de la Memoria en privado y decidme solo esta conclusión: ¿recordáis algún lugar del viaje cuya primera interpretación tuvisteis que corregir? No enviéis la página ni el contenido; basta el principio aprendido." }
    ]
  },
  {
    "id": "tavira-conclusion-cuaderno",
    "requiredFlags": ["tavira_vista"],
    "blockedFlags": ["tavira_cuaderno"],
    "openAnswer": true,
    "minWords": 8,
    "containsAnyGroups": [["corregir", "cambiamos", "revisar", "interpretación", "interpretacion", "hipótesis", "hipotesis"], ["evidencia", "observar", "comprobar", "aprendimos", "porque"]],
    "setFlags": ["tavira_cuaderno"],
    "remember": { "kind": "private_notebook_conclusion", "label": "Principio de corrección extraído del cuaderno sin revelar contenido" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Conclusión recibida; contenido privado intacto. Esa es exactamente la función del cuaderno." },
      { "from": "topotino", "time": "auto", "text": "Cruzad a Sevilla. En Plaza de España comparad uno de sus puentes y el canal con el puente y el Gilão de Tavira. Indicad dos semejanzas, tres diferencias y cuál representa un territorio en vez de simplemente cruzarlo." }
    ]
  },
  {
    "id": "sevilla-plaza-comparacion",
    "requiredFlags": ["tavira_cuaderno"],
    "blockedFlags": ["completado_tavira_sevilla"],
    "openAnswer": true,
    "minWords": 18,
    "containsAnyGroups": [["tavira", "gilão", "gilao"], ["plaza de españa", "plaza espana", "sevilla", "canal", "azulejo"], ["semejanza", "ambos", "diferencia"], ["representa", "provincia", "territorio", "cruzar", "porque"]],
    "setFlags": ["completado_tavira_sevilla"],
    "remember": { "kind": "cross_border_comparison", "label": "Comparación entre Tavira y Plaza de España" },
    "water": "Agua de las Dos Orillas",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gran comparación. Un puente puede resolver un cruce, organizar una escena o representar unión. La forma se parece; la función cambia." },
      { "from": "topotino", "time": "auto", "text": "Ha despertado el Agua de las Dos Orillas. Topoloco dividía recuerdos para declarar propietaria a una sola versión; vosotros acabáis de demostrar que dos orillas y dos miradas pueden mantener su diferencia y formar una relación." },
      { "from": "topotino", "time": "auto", "text": "Mañana entraremos en una ciudad representada como aventura. Sus mascotas conocen bien los disfraces." },
      { "from": "topotino", "time": "auto", "text": "Si vais a usar Agua Mágica, preparad bañador, toalla y protector solar." },
      { "from": "topotino", "time": "auto", "text": "Descansad en Sevilla. Aún no sabemos dónde será el final." }
    ]
  },
  {
    "id": "dia24-impedimento",
    "blockedFlags": ["completado_tavira_sevilla"],
    "containsAny": ["no podemos", "cerrado", "cambio de plan", "no llegamos"],
    "messages": [{ "from": "topotino", "time": "auto", "text": "Decidme si falla Tavira o Sevilla. La comparación se reconstruirá con el lugar real y solo con lo que hayáis observado; el cuaderno seguirá privado." }]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "El puente tiene siete arcos; distinguid nombre popular y fecha demostrable.",
  "La vista alta revela conexiones, pero oculta detalles.",
  "Del cuaderno solo necesito el principio aprendido, nunca la página.",
  "Comparad Tavira y Plaza de España con semejanzas, diferencias y función."
]
```

## Pistas progresivas

```json
[
  "Los estudios establecen origen medieval, no romano.",
  "Desde el castillo se relacionan río, puente y ciudad.",
  "Corregir una hipótesis es una fortaleza.",
  "Los bancos de azulejos de Plaza de España representan territorios."
]
```

## Contexto para IA

Topotino nunca pide qué caso concreto contiene el cuaderno; acepta una conclusión general. Todavía no revela Granada. Mantiene historia local precisa y agradece la corrección.

## Fuentes documentales

- https://visitartavira.pt/en/cultural-heritage/old-bridge/
- https://cm-tavira.pt/site/ambiente/jardins-historicos/
- https://visitasevilla.es/en/plaza-de-espana/
