---
{
  "id": "018-sevilla-alhambra-noche",
  "order": 18,
  "title": "Día 14 · Las doce aguas bajo la luna",
  "channelCode": "T-42N0",
  "startsUnlocked": false,
  "activation": { "mode": "all", "date": { "on": "2026-08-26" }, "location": { "lat": 37.3832105, "lng": -5.9901835, "radiusMeters": 1000, "label": "Real Alcázar de Sevilla" } },
  "mission": "Devolver la memoria compartida",
  "formulaWord": null,
  "water": "Agua Clara de la Noche",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Alcázar y Catedral preparan la lectura de capas antes de la Alhambra nocturna. En Mexuar, Arrayanes, Comares y Leones se resuelve el plan. Los doce leones distintos prueban autoría compartida. Las aguas eran relaciones vividas, no objetos. Topoloco es derrotado sin dejar de ser inteligente y huidizo.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Último día. En el Real Alcázar elegid un patio o palacio y después un jardín de otra función o época." },
  { "from": "topotino", "time": "auto", "text": "Comparad geometría, uso del agua y relación interior–jardín. Decid qué capa dialoga con otra en vez de borrarla." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "alcazar-capas-dialogo",
    "blockedFlags": ["alcazar_capas"],
    "openAnswer": true,
    "minWords": 17,
    "containsAnyGroups": [["alcázar", "alcazar", "palacio", "patio", "jardín", "jardin"], ["geometría", "geometria", "arco", "azulejo", "simetría", "simetria"], ["agua", "fuente", "estanque", "canal"], ["época", "epoca", "función", "funcion", "dialoga", "conserva"]],
    "setFlags": ["alcazar_capas"],
    "remember": { "kind": "architectural_dialogue", "label": "Diálogo de capas en el Real Alcázar" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. Superponer no siempre significa ocultar; puede crear diálogo. Necesitaremos esa idea esta noche." },
      { "from": "topotino", "time": "auto", "text": "En la Catedral conectad tres transformaciones: la Giralda y el Giraldillo, el gran espacio gótico y una pieza que narra viajes o poder, como la tumba de Colón o el retablo. Explicad qué cambió de función, qué se añadió y qué permaneció reconocible." }
    ]
  },
  {
    "id": "catedral-transformaciones",
    "requiredFlags": ["alcazar_capas"],
    "blockedFlags": ["catedral_transformaciones"],
    "openAnswer": true,
    "minWords": 17,
    "containsAnyGroups": [["giralda", "giraldillo"], ["catedral", "gótico", "gotico", "retablo"], ["colón", "colon", "tumba", "viaje", "poder"], ["cambió", "cambio", "añadió", "anadio", "permanece", "función", "funcion"]],
    "setFlags": ["catedral_transformaciones"],
    "remember": { "kind": "building_transformation", "label": "Transformaciones visibles de la Catedral" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Preparación completa. Viajad a Granada y descansad antes de la entrada nocturna. No intentéis resolver nada durante el trayecto." },
      { "from": "topotino", "time": "auto", "text": "A las 22:00, cuando entréis en los Palacios Nazaríes, escribid MEXUAR. Desde ahí iremos paso a paso; no os adelantaré alternativas ni el final." }
    ]
  },
  {
    "id": "alhambra-mexuar",
    "requiredFlags": ["catedral_transformaciones"],
    "blockedFlags": ["alhambra_mexuar"],
    "match": ["mexuar", "estamos en el mexuar", "hemos entrado en el mexuar"],
    "setFlags": ["alhambra_mexuar"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Canal estable. Topoloco ha dejado una afirmación en Mexuar: «un edificio solo puede contar la historia de su primer uso». Refutadla con dos transformaciones observadas hoy y un detalle del propio espacio que muestre adaptación o superposición." }
    ]
  },
  {
    "id": "mexuar-refutacion",
    "requiredFlags": ["alhambra_mexuar"],
    "blockedFlags": ["mexuar_refutado"],
    "openAnswer": true,
    "minWords": 16,
    "containsAnyGroups": [["alcázar", "alcazar", "catedral", "giralda", "mexuar"], ["cambió", "cambio", "transformó", "transformo", "añadió", "anadio", "uso", "función", "funcion"], ["detalle", "arco", "decoración", "decoracion", "espacio"], ["refuta", "falso", "porque"]],
    "setFlags": ["mexuar_refutado"],
    "remember": { "kind": "final_refutation", "label": "Refutación de la memoria de un solo uso" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Primera cerradura abierta. Id al Patio de los Arrayanes. Frente al reflejo, elegid un detalle arquitectónico y comparad objeto e imagen. Explicad qué información conserva el reflejo, cuál transforma y qué ocurre si el agua se mueve." }
    ]
  },
  {
    "id": "arrayanes-reflejo",
    "requiredFlags": ["mexuar_refutado"],
    "blockedFlags": ["arrayanes_reflejo"],
    "openAnswer": true,
    "minWords": 13,
    "containsAnyGroups": [["arrayanes", "estanque", "agua", "reflejo"], ["objeto", "imagen", "arquitectura", "torre", "arco"], ["conserva", "invierte", "deforma", "mueve", "cambia", "porque"]],
    "setFlags": ["arrayanes_reflejo"],
    "remember": { "kind": "final_reflection", "label": "Objeto, reflejo y distorsión en Arrayanes" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Segunda cerradura. El reflejo depende del original y del medio: Topoloco guardó imágenes y pretendió declararlas originales." },
      { "from": "topotino", "time": "auto", "text": "En Comares, recuperad dos respuestas de vuestra memoria de chat: una observación y una corrección realizadas en días distintos. No consultéis ni transcribáis el cuaderno. Explicad cómo se apoyan mutuamente aunque procedan de lugares diferentes." }
    ]
  },
  {
    "id": "comares-dos-memorias",
    "requiredFlags": ["arrayanes_reflejo"],
    "blockedFlags": ["comares_memorias"],
    "openAnswer": true,
    "minWords": 14,
    "containsAnyGroups": [["observamos", "vimos", "evidencia", "respuesta"], ["corregimos", "cambiamos", "revisamos", "aprendimos"], ["lugar", "día", "dia", "distinto"], ["conecta", "apoya", "porque"]],
    "setFlags": ["comares_memorias"],
    "remember": { "kind": "cross_episode_synthesis", "label": "Síntesis de dos recuerdos conversacionales" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Tercera cerradura. Vuestra historia no es una fila de respuestas: cada corrección cambia cómo entendéis las anteriores." },
      { "from": "topotino", "time": "auto", "text": "Entrad al Patio de los Leones. Contad doce, pero no busquéis doce objetos idénticos: comparad al menos tres leones por cabeza, tamaño, perfil, talla o postura. Decid qué revela su diferencia sobre las manos que los hicieron y por qué destruye la idea de un único dueño de la obra." }
    ]
  },
  {
    "id": "leones-doce-diferentes",
    "requiredFlags": ["comares_memorias"],
    "blockedFlags": ["leones_diferentes"],
    "openAnswer": true,
    "minWords": 17,
    "containsAnyGroups": [["doce", "12", "leones"], ["cabeza", "tamaño", "tamano", "perfil", "talla", "postura", "diferente"], ["manos", "artesanos", "autores", "hicieron"], ["compartida", "único", "unico", "dueño", "dueno", "porque"]],
    "setFlags": ["leones_diferentes"],
    "remember": { "kind": "shared_authorship", "label": "Los doce leones y la autoría compartida" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Doce leones, distintos entre sí y realizados por varias manos. Doce no significaba colección separada: significaba una obra común sostenida por diferencias." },
      { "from": "topotino", "time": "auto", "text": "Consultad ahora el Cuaderno de la Memoria sin mostrarlo. Paula y Hugo deben decidir juntos si sus dos miradas forman una sola propiedad o una relación compartida. Enviad únicamente la conclusión y una razón; ninguna página, marca o detalle privado." }
    ]
  },
  {
    "id": "alhambra-conclusion-compartida",
    "requiredFlags": ["leones_diferentes"],
    "blockedFlags": ["completado_sevilla_alhambra_noche"],
    "openAnswer": true,
    "minWords": 11,
    "containsAnyGroups": [["compartida", "juntos", "relación", "relacion", "dos miradas"], ["no pertenece", "no es propiedad", "nadie", "topoloco"], ["porque", "completa", "diferente", "conecta"]],
    "setFlags": ["completado_sevilla_alhambra_noche", "topoloco_derrotado", "doce_aguas_reunidas"],
    "remember": { "kind": "final_conclusion", "label": "Conclusión privada que reúne las doce aguas" },
    "water": "Agua Clara de la Noche",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Cierre abierto. Ha despertado el Agua Clara de la Noche y las doce aguas han respondido como una red. No eran líquidos ni contraseñas: eran doce formas de relacionar evidencia, memoria, lugares y personas." },
      { "from": "topotino", "time": "auto", "text": "Topoloco provocó el eclipse de mi memoria para convertirme en un testigo aislado. Después quiso usar vuestras experiencias para fabricar una versión perfecta y encerrarla en su museo. Ha fallado porque una memoria compartida conserva diferencias y acepta correcciones." },
      { "from": "topotino", "time": "auto", "text": "Acaba de huir por un conducto que, sinceramente, es demasiado estrecho incluso para un topo de su ego. No lo hemos capturado, pero su máquina se ha quedado sin propietario único y ha devuelto las conexiones." },
      { "from": "topotino", "time": "auto", "text": "Recuerdo Londres y recuerdo este viaje. No todo ha vuelto de golpe, y está bien: ahora sé distinguir un hueco de una mentira. Paula, Hugo: gracias. Lo habéis hecho extraordinariamente bien." },
      { "from": "topotino", "time": "auto", "text": "La aventura principal termina aquí, en la Alhambra de noche, como debía. Mañana habrá un epílogo tranquilo a la luz del día. Ahora salid con los adultos y descansad. Misión cumplida." }
    ]
  },
  {
    "id": "alhambra-retraso-cierre",
    "requiredFlags": ["catedral_transformaciones"],
    "blockedFlags": ["alhambra_mexuar"],
    "containsAny": ["no podemos entrar", "entrada cancelada", "hemos llegado tarde", "cerrado"],
    "messages": [{ "from": "topotino", "time": "auto", "text": "No inventaremos una visita nocturna. Guardamos el cierre para el primer momento real en que podáis acceder; la historia no se reinicia. Decidme el nuevo plan cuando lo sepáis y adaptaré el acceso sin revelar las respuestas." }]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "En el Alcázar comparad geometría, agua y relación con el jardín.",
  "En la Catedral separad función cambiada, añadido y elemento reconocible.",
  "Arrayanes exige distinguir objeto, imagen y movimiento del agua.",
  "En Leones comparad diferencias reales y relacionadlas con varias manos.",
  "Del cuaderno solo enviáis la conclusión compartida."
]
```

## Pistas progresivas

```json
[
  "Las capas del Alcázar y la Catedral no pertenecen a una sola época.",
  "Un reflejo conserva relaciones, pero invierte y puede deformarse.",
  "Usad dos respuestas del chat que ya habéis dado durante el viaje.",
  "Los leones difieren en peso, perfil, cabeza y talla.",
  "Dos miradas no se anulan: forman una relación que ninguna posee sola."
]
```

## Contexto para IA

Este es el final activo. Luna debe usar la memoria persistente para ayudar a recordar respuestas del chat, nunca inventarlas; si no dispone de dos, pide dos ejemplos reales sin atribuirlos. La visita nocturna va paso a paso. Topoloco huye, no se convierte en aliado. El cuaderno se consulta en privado y solo se comunica la conclusión. Después del cierre no abre otra amenaza.

## Fuentes documentales

- https://alcazarsevilla.org/
- https://www.catedraldesevilla.es/la-catedral/
- https://www.alhambra-patronato.es/visita/alhambra-y-generalife-visita-nocturna-a-palacios-nazaries
- https://www.alhambra-patronato.es/edificios-lugares/patio-de-los-leones
- https://www.alhambra-patronato.es/edificios-lugares/estructura-urbana
- https://www.alhambra-patronato.es/los-leones-de-la-alhambra-tienen-rasgos-siluetas-y-tamanos-diferenciados
