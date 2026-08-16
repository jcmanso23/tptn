---
{
  "id": "008-huellas-mira-obidos",
  "order": 8,
  "title": "Día 4 · El espía de Topoloco",
  "channelCode": "T-21A0",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-16" }, "location": { "lat": 39.5678412, "lng": -8.5899740, "radiusMeters": 5000, "label": "Monumento Natural das Pegadas de Dinossáurios" } },
  "mission": "Descubrir quién vigila el canal",
  "formulaWord": "PREGUNTO",
  "water": "Agua del Tiempo Profundo",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

No se cambia nada anterior al 16 de agosto. Topotina detecta vigilancia, escribe al revés `OCOLOPOT ED AÍPSE NU SOMENET EUQ OERC` y después aclara: «CREO QUE TENEMOS UN ESPÍA DE TOPOLOCO». Sospecha que es un dinosaurio. Topotino responde con incredulidad y humor.

El día es una sola persecución. En el yacimiento Paula y Hugo buscan al espía mientras aprenden a distinguir observación, deducción y suposición. Encuentran una marca reciente de tres garras y una nota presuntuosa, pero no al responsable. Gotas propone buscar en las entrañas de la Tierra y conduce a Mira de Aire. Allí explica con humor y precisión cómo el agua disuelve caliza, abre galerías y deposita mineral; el espía vuelve a escapar. Gotas propone un refugio amurallado y la investigación conduce lógicamente a Óbidos.

La casa familiar en Óbidos pasa a llamarse **EL REFUGIO**. En cuanto llegan, Topotino les comunica que ha cogido una casita dentro de la muralla, en Rua do Facho 35; el código de entrada les llegará por el canal de los adultos y no se escribe en el chat. Porta da Vila, las murallas, la altura, el castillo, las calles estrechas y los accesos permiten pensar como defensores medievales. La Livraria de Santiago muestra que una antigua iglesia puede proteger hoy historias: un lugar cambia de función sin perder memoria. Por la noche una marca de tres garras conduce a Dino Parque, donde fósiles, reconstrucciones, huevos, embriones y científicos pueden identificar al espía.

Louri no entra en el chat ni es nombrado durante este episodio.

## Secuencia canónica

1. Advertencia invertida de Topotina y sospecha del dinosaurio.
2. Expedición física en las huellas: dirección, tamaño, velocidad posible y límites de la evidencia.
3. Señal reciente de tres garras y nota vanidosa; el espía no aparece.
4. Gotas conduce a Mira de Aire porque el escondite podría estar bajo tierra.
5. Investigación de estalactitas, estalagmitas, galerías y tiempo geológico.
6. Al no encontrarlo, Gotas exige un refugio defendible: Óbidos.
7. Comprobación de accesos, muralla, altura, castillo y Livraria de Santiago.
8. La pista final identifica Dino Parque como el laboratorio donde podrán descubrir quién es el espía.

## Mensajes iniciales

```json
[
  { "from": "topotina", "time": "auto", "text": "Buenos días. OCOLOPOT ED AÍPSE NU SOMENET EUQ OERC" },
  { "from": "topotina", "time": "auto", "text": "Leedlo desde el final: CREO QUE TENEMOS UN ESPÍA DE TOPOLOCO. Creo que es un dinosaurio." },
  { "from": "topotino", "time": "auto", "text": "Un dinosaurio espía. Claro. Seguid las huellas con los adultos y separad lo que veis de lo que suponéis." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "dia16-rastreo-continuo",
    "containsAny": ["huellas", "garras", "dirección", "direccion"],
    "setFlags": ["huellas_inferencia"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Bien: una huella conserva una acción, no el color ni las intenciones. Seguid hacia Mira de Aire; Gotas cree que el espía se oculta bajo tierra." },
      { "from": "gotas", "time": "auto", "text": "Al llegar, recorred la cueva sin correr, lamer estalactitas, adoptar murciélagos ni medir agujeros personalmente." }
    ]
  },
  {
    "id": "obidos-llegada-refugio",
    "requiredFlags": ["huellas_inferencia"],
    "blockedFlags": ["obidos_llegada"],
    "containsAny": ["óbidos", "obidos", "hemos llegado", "llegamos", "estamos en obidos", "estamos en óbidos"],
    "setFlags": ["obidos_llegada"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "¡Hemos llegado a Óbidos! Antes de pensar como defensores medievales, tengo una noticia de refugio: os he cogido una casita dentro de la muralla." },
      { "from": "topotino", "time": "auto", "text": "Está en Rua do Facho 35. Os llegará un código para entrar; cuando lo recibáis, usadlo con los adultos y no lo escribáis en este chat. Topoloco tiene demasiada afición por las puertas ajenas." },
      { "from": "topotino", "time": "auto", "text": "Esta noche será EL REFUGIO. Dejad las mochilas, respirad como dos exploradores que han sobrevivido a una cueva y después miraremos por qué esta ciudad amurallada era tan fácil de defender." }
    ]
  },
  {
    "id": "dia16-refugio-cierre",
    "requiredFlags": ["huellas_inferencia", "obidos_llegada"],
    "containsAny": ["óbidos", "obidos", "refugio", "livraria"],
    "setFlags": ["completado_huellas_mira_obidos"],
    "water": "Agua del Tiempo Profundo",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Recorred Óbidos: Porta da Vila, calles, murallas, altura, castillo y Livraria de Santiago. Esta noche será EL REFUGIO." },
      { "from": "topotina", "time": "auto", "text": "La marca de tres garras apunta a Dino Parque. Preparad calzado cómodo, agua y protector solar. Mañana identificaremos al espía. Descansad." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "Mirad la marca exacta: forma, dirección y tamaño. Después separad eso de vuestra explicación.",
  "Una muralla frena el acceso; una puerta permite vigilar por dónde se entra."
]
```

## Pistas progresivas

```json
[
  "La huella conserva una acción, pero no el color ni las intenciones.",
  "Si no está en la superficie, Gotas propone buscar bajo tierra.",
  "Después necesitaremos un lugar alto, amurallado y con accesos controlables."
]
```

## Contexto para IA

- No revelar a Louri, Burger King ni su relación con Topoloco.
- No afirmar que una huella antigua pertenece al espía actual.
- Mensajes breves y concretos; una acción principal por burbuja.
- Gotas exagera la seguridad: no correr, no lamer estalactitas, no adoptar murciélagos y no medir agujeros personalmente.
- El siguiente lugar se revela solo después de fracasar de forma razonada en el anterior.
- El Cuaderno permanece privado.

## Fuentes documentales

- https://natural.pt/protected-areas/monumento-natural-pegadas-dinossaurios-serra-aire
- https://www.grutasmiradaire.com/
- https://turismo.obidos.pt/
- https://www.cm-obidos.pt/areas-de-intervencao/cultura/livraria-de-santiago
