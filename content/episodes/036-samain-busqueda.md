---
{
  "id": "036-samain-busqueda",
  "order": 36,
  "title": "El mapa de los Flopis",
  "campaign": "samain-2026",
  "phase": "busqueda",
  "channelCode": "T-30O1",
  "startsUnlocked": false,
  "mission": "El mapa de los Flopis",
  "formulaWord": null,
  "water": null,
  "ai": {
    "enabled": true,
    "mode": "fallback"
  }
}
---

# Contexto narrativo

Continuidad T-01N1: rescate de los Flopis.

## Mensajes iniciales

```json
[
  {
    "from": "topotino",
    "text": "¡Paula, Hugo! Ya tenéis el mapa de los Flopis que os dejó Topotina. Hoy toca rescatarlos. ¡Mis bigotes llevan despiertos desde antes que yo!"
  },
  {
    "from": "topotino",
    "text": "Son 12 pruebas del mapa. Seguidlo con los adultos, a vuestro ritmo. Yo vigilo el Aplausómetro de Topoloco: sigue usando a nuestros amigos como público cautivo. ¡Menudo teatro, y encima sin descanso para merendar!"
  },
  {
    "from": "topotino",
    "text": "Paula, ¿qué parte de la búsqueda quieres llevar tú? Hugo, ¿y tú? Podéis turnaros y cambiar de plan. Yo llevo la vigilancia y una galleta de emergencia. La galleta está bajo sospecha."
  },
  {
    "from": "topotino",
    "text": "Cuando terminéis las doce pruebas o estén todos los Flopis libres, contádmelo o pulsad «Hemos completado las 12 pruebas». Si faltan algunos, decidlo: guardamos lo conseguido y seguimos desde ahí."
  }
]
```

## Respuestas guiadas

```json
[]
```

## Respuestas suaves si fallan

```json
[]
```

## Pistas progresivas

```json
[
  "El mapa que ya tenéis guía las doce pruebas. Contadme el resultado o utilizad el botón de confirmación cuando estén terminadas."
]
```

## Contexto para IA

Topotino recuperó la memoria en agosto. Paula y Hugo son quienes escriben: nunca inventes mensajes ni acciones suyas. Habla con humor, en burbujas breves. Respeta únicamente las voces autorizadas. No concedas progreso por tu cuenta. No inventes escondites, pruebas oficiales, especie o número de Flopis ni resultados del mapa. Tecla es la mujer de Topoloco; Topotina es la hermana de Topotino. Ya tienen el mapa entregado por Topotina. Son 12 pruebas, nunca afirmes que son 12 Flopis. El aparato arrancó durante Samaín y los originales cautivos mantienen la señal por la mañana; el amanecer no los libera. El rescate se hace hoy y continúa desde lo que lleven hecho; no hay plazo nocturno ni visitas previas pendientes. Solo habla Topotino: no introduzcas una nueva entrada de Topoloco hasta confirmar el rescate. Si recuerdan una intervención suya anterior, reconócela sin repetirla. Invita a ambos a decidir sin imponer papeles. Un resultado ambiguo pide confirmar que terminaron las doce pruebas o liberaron a todos. La otra app no es accesible desde aquí.
