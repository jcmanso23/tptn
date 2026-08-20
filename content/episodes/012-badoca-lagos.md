---
{
  "id": "012-badoca-lagos",
  "order": 12,
  "title": "Día 8 · Topoloco toma el canal",
  "channelCode": "T-21A6",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-20" } },
  "mission": "Recuperar el chat secreto",
  "formulaWord": null,
  "water": null,
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Topoloco invade el Comunicador Subterráneo y presenta el Corrector Definitivo de la Historia: quiere borrar dudas y voces diferentes para aparecer como héroe de todas las aventuras. Topotina intenta expulsarlo mientras Topotino protesta con una indignación poco útil. Paula y Hugo pueden distraer a Topoloco con cualquier mensaje.

Louri utiliza una única conexión de emergencia del comunicador oculto en el juguete. Revela que el safari terrestre fue un señuelo y que las cuevas son marinas. La señal de Topoloco conduce a delfines salvajes, cuevas del mar y un puerto del Algarve. Los niños deducen Lagos. Topoloco expulsa a todos y se queda solo intentando reclutarlos hasta la mañana siguiente. Esta excepción no reabre el arco de Louri: su canal queda cerrado definitivamente después del aviso.

## Mensajes iniciales

```json
[]
```

## Respuestas guiadas

```json
[
  {
    "id": "asalto-topoloco-gestionado",
    "blockedFlags": ["lagos_descubierto_por_louri"],
    "containsAny": ["lagos"],
    "setFlags": ["lagos_descubierto_por_louri"],
    "messages": [
      { "from": "louri", "time": "auto", "text": "Lagos. Allí está la marina desde la que podréis seguir la señal por mar." }
    ]
  },
  {
    "id": "canal-dia21-recuperado",
    "requiredFlags": ["lagos_descubierto_por_louri"],
    "blockedFlags": ["completado_badoca_lagos"],
    "containsAny": ["canal recuperado", "topoloco fuera"],
    "setFlags": ["completado_badoca_lagos", "canal_recuperado_dia21"],
    "messages": [
      { "from": "topotina", "time": "auto", "text": "Acceso de Topoloco revocado. La pista marítima queda guardada." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Mientras Topoloco controle el canal, responded a lo último que os diga. La investigación normal está en pausa."
]
```

## Pistas progresivas

```json
[
  "La ciudad está en el Algarve y tiene una marina desde la que salen barcos para observar delfines y cuevas marinas.",
  "El nombre empieza por L y termina en S: Lagos."
]
```

## Contexto para IA

Esta fase está controlada por la escena persistente de la aplicación. Topoloco es un doctor loco brillante, vanidoso y teatral. Durante la toma final solo habla él y ofrece cargos o ventajas absurdas para reclutar a Paula y Hugo. No revela futuras paradas ni recupera misiones de Lisboa, Dino Parque o Badoca. Louri solo pronuncia la alerta preescrita por la aplicación y no vuelve después. El día 21 Topotina recupera el canal y Vasco activa el Protocolo Azul.

## Fuentes documentales

- https://www.cm-lagos.pt/
- https://daysofadventure.com/
