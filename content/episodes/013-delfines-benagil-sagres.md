---
{
  "id": "013-delfines-benagil-sagres",
  "order": 13,
  "title": "Día 9 · La pista que no puede prometerse",
  "channelCode": "T-96A3",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-21" }, "location": { "lat": 37.1098806, "lng": -8.6748233, "radiusMeters": 1000, "label": "Marina de Lagos" } },
  "mission": "Investigar el horizonte",
  "formulaWord": null,
  "water": "Agua del Horizonte",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

El barco convierte la incertidumbre en prueba. Si no hay delfines, la ausencia es un resultado válido. Benagil y Sagres enseñan erosión y ambigüedad. Corvinho, del relato oficial de la fortaleza, es amigo puntual.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Antes de zarpar: un avistamiento de delfines no se garantiza. Registrad tres señales que use la tripulación para buscar y, si aparecen, una conducta comprobable. Si no aparecen, explicad por qué la ausencia no demuestra que no haya delfines en esta costa." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "delfines-incertidumbre",
    "blockedFlags": ["delfines_incertidumbre"],
    "openAnswer": true,
    "minWords": 14,
    "containsAnyGroups": [["delfín", "delfin", "delfines", "no vimos", "no aparecieron"], ["aleta", "grupo", "salto", "respira", "ave", "pez", "tripulación", "tripulacion", "guía", "guia"], ["no demuestra", "incertidumbre", "pueden", "momento", "zona", "porque"]],
    "setFlags": ["delfines_incertidumbre"],
    "remember": { "kind": "uncertain_field_observation", "label": "Búsqueda de delfines con resultado abierto" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Investigación válida. Habéis separado no observar de demostrar ausencia. Topoloco odia esa diferencia porque no cabe en sus titulares." },
      { "from": "topotino", "time": "auto", "text": "En la costa de Benagil elegid una cueva, arco o entrada de luz visible desde el barco. Describid fractura, forma y acción del mar. Proponed qué parte de la roca podría cambiar antes y qué evidencia os hace pensarlo. No toquéis la pared ni inventéis una velocidad exacta." }
    ]
  },
  {
    "id": "benagil-erosion",
    "requiredFlags": ["delfines_incertidumbre"],
    "blockedFlags": ["benagil_erosion"],
    "openAnswer": true,
    "minWords": 14,
    "containsAnyGroups": [["cueva", "arco", "agujero", "entrada", "luz", "roca"], ["mar", "ola", "agua", "erosión", "erosion", "fractura"], ["cambiará", "cambiara", "débil", "debil", "antes", "porque", "evidencia"]],
    "setFlags": ["benagil_erosion"],
    "remember": { "kind": "geomorphology_prediction", "label": "Predicción de erosión en Benagil" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Bien: forma actual, proceso y predicción separados. Ahora rumbo a Sagres, al antiguo Promontorium Sacrum." },
      { "from": "topotino", "time": "auto", "text": "En la fortaleza buscad primero la gran figura circular de 48 alineaciones. Proponed dos funciones y una observación que apoye o debilite cada una." },
      { "from": "topotino", "time": "auto", "text": "Después seguid el recorrido hasta un punto seguro frente al horizonte. Corvinho, el cuervo joven del relato, vigila desde arriba." }
    ]
  },
  {
    "id": "sagres-rosa-hipotesis",
    "requiredFlags": ["benagil_erosion"],
    "blockedFlags": ["sagres_rosa"],
    "openAnswer": true,
    "minWords": 17,
    "containsAnyGroups": [["rosa", "círculo", "circulo", "líneas", "lineas", "48"], ["viento", "dirección", "direccion", "gnomon", "sol", "reloj", "navegación", "navegacion"], ["hipótesis", "hipotesis", "podría", "podria"], ["apoya", "debilita", "observamos", "porque"]],
    "setFlags": ["sagres_rosa"],
    "remember": { "kind": "competing_hypotheses", "label": "Hipótesis rivales sobre la figura de Sagres" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Corvinho aprueba: una figura enigmática admite hipótesis, no seguridad de cartón. Él insiste en que vuela mejor con viento lateral. No viene al caso, pero es cuervo." },
      { "from": "topotino", "time": "auto", "text": "Mirad el promontorio y el horizonte. Explicad por qué este punto pudo sentirse como final del mundo conocido y, a la vez, como comienzo de una ruta. Usad dos evidencias físicas y una idea histórica." }
    ]
  },
  {
    "id": "sagres-horizonte",
    "requiredFlags": ["sagres_rosa"],
    "blockedFlags": ["completado_delfines_benagil_sagres"],
    "openAnswer": true,
    "minWords": 14,
    "containsAnyGroups": [["horizonte", "mar", "atlántico", "atlantico", "acantilado", "viento"], ["final", "límite", "limite"], ["comienzo", "ruta", "navegar", "puerto", "salir"], ["historia", "porque", "evidencia"]],
    "setFlags": ["completado_delfines_benagil_sagres"],
    "remember": { "kind": "perspective_reframing", "label": "Sagres como final y comienzo" },
    "water": "Agua del Horizonte",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. El mismo horizonte puede ser límite o invitación según la posición y el conocimiento del observador. Ha despertado el Agua del Horizonte." },
      { "from": "topotino", "time": "auto", "text": "Topoloco ha enviado un mensaje: «Ya sé qué pruebas aceptáis. A partir de ahora cada pista parecerá vuestra». Ha admitido que necesita vuestra experiencia real para fabricar falsificaciones convincentes." },
      { "from": "topotino", "time": "auto", "text": "Mañana compararemos dos costas de roca y dormiréis en una jaima." },
      { "from": "topotino", "time": "auto", "text": "Llevad agua para beber y calzado con buena suela. Nada de acercarse a bordes." },
      { "from": "topotino", "time": "auto", "text": "Guardad vuestra capacidad de detectar contradicciones. Ahora descansad; el viento de Sagres también despeina los pensamientos." }
    ]
  },
  {
    "id": "barco-cancelado",
    "blockedFlags": ["delfines_incertidumbre"],
    "containsAny": ["cancelado", "no sale el barco", "mal tiempo", "mala mar", "no podemos embarcar"],
    "setFlags": ["delfines_incertidumbre"],
    "messages": [{ "from": "topotino", "time": "auto", "text": "La seguridad manda. Usad desde tierra tres señales para inferir estado del mar y explicad por qué cancelar aporta información. Después continuad con Sagres; no fingiremos delfines ni cuevas vistos desde el barco." }]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "No ver delfines hoy no prueba que no vivan en esta costa.",
  "En Benagil: forma, proceso erosivo y predicción con evidencia.",
  "La figura de Sagres necesita dos hipótesis rivales.",
  "El horizonte debe funcionar como final y como comienzo."
]
```

## Pistas progresivas

```json
[
  "La tripulación combina experiencia y varias señales, no una sola.",
  "Las fracturas y zonas más expuestas pueden cambiar antes.",
  "Se ha interpretado como rosa de los vientos y también se ha relacionado con un gnomon.",
  "Sagres era último puerto antes del Atlántico abierto."
]
```

## Contexto para IA

Corvinho es aliado puntual basado en el relato oficial. No promete fauna. Topotino sabe que Topoloco necesita experiencias reales para falsificar pistas. No revela Granada. Cuaderno privado.

## Fuentes documentales

- https://daysofadventure.com/
- https://fortalezadesagres.pt/sobre-o-promontorio/historia/
- https://fortalezadesagres.pt/es/sobre-el-promontorio/mapa-interactivo/
- https://fortalezadesagres.pt/eventos-noticias/os-corvos-e-a-rosa-dos-ventos/
