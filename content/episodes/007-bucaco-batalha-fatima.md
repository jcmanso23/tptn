---
{
  "id": "007-bucaco-batalha-fatima",
  "order": 7,
  "title": "Día 3 · El país pequeño y las promesas grandes",
  "channelCode": "T-31B5",
  "startsUnlocked": false,
  "activation": {
    "mode": "all",
    "required": ["completado_magikland_curia"],
    "date": { "on": "2026-08-15" },
    "location": { "lat": 40.202478, "lng": -8.434375, "radiusMeters": 1000, "label": "Portugal dos Pequenitos, Coimbra" }
  },
  "mission": "Distinguir tamaño, representación e importancia",
  "formulaWord": null,
  "water": "Agua de la Promesa",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Buçaco ya se investigó de forma breve al final del 14 de agosto. Topotina cambió el orden porque la señal del bosque perdía intensidad al caer la tarde; no inventó un destino ni resolvió la prueba. De Buçaco salió una imagen de monumentos portugueses reducidos al tamaño de los niños. Esa consecuencia conduce el 15 de agosto a Portugal dos Pequenitos, y después a Batalha y Fátima.

La jornada estudia tres ideas relacionadas sin confundirlas. En Coimbra, Paula y Hugo distinguen un edificio original de su reproducción a escala y observan qué conserva, reduce, selecciona o recoloca una representación. En Batalha comparan esa experiencia con un monasterio real originado por una promesa y trabajado durante generaciones, incluidas las Capelas Imperfeitas. En Fátima separan tamaño físico de centralidad: la Capelinha es pequeña y ocupa un lugar fundamental dentro de un recinto enorme.

Topoloco intenta imponer la frase «solo importa lo grande, original y terminado». La respuesta no es que una reproducción y un original sean iguales. Una reproducción puede enseñar si reconoce sus límites; una obra inacabada conserva decisiones y trabajo; un espacio pequeño puede ser central para una comunidad. Esta distinción prepara Dino Parque —modelo, fósil y estudio— e Isla Mágica —escenario histórico, función actual y fuente original— sin adelantar esos destinos.

Topotina participa al llegar a Coimbra. Confirma que el cambio de orden funcionó, explica que vigilará la señal y no responde por los niños. Topotino continúa dudando de que trabajaran juntos y bromea con que Portugal se ha encogido; Topotina corrige el concepto: es una representación a escala. La relación avanza mediante trabajo compartido y humor breve.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. Ayer Topotina adelantó Buçaco y allí apareció una imagen: varios monumentos portugueses al tamaño de los niños." },
  { "from": "topotina", "time": "auto", "text": "La coordenada apunta a Portugal dos Pequenitos, en Coimbra. Yo vigilaré la señal; vosotros comprobad qué conserva y qué cambia cada reproducción." },
  { "from": "topotino", "time": "auto", "text": "Después seguiremos una promesa de piedra hasta Batalha y compararemos tamaño e importancia en Fátima. Una parada cada vez." }
]
```

## Respuestas guiadas

```json
[
  {
    "id": "portugal-pequenitos-representacion",
    "blockedFlags": ["portugal_pequenitos_representacion"],
    "openAnswer": true,
    "minWords": 10,
    "containsAnyGroups": [["representación", "representacion", "reproducción", "reproduccion", "maqueta", "escala"], ["pequeño", "pequeno", "tamaño", "tamano", "puerta", "ventana"], ["conserva", "reduce", "cambia", "omite", "selecciona"]],
    "setFlags": ["portugal_pequenitos_representacion"],
    "remember": { "kind": "representation_scale", "label": "Límites de una representación arquitectónica a escala" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Bien visto. La reproducción conserva formas reconocibles, pero reduce tamaño y distancia y puede omitir partes." },
      { "from": "topotina", "time": "auto", "text": "Una copia útil explica qué ha transformado. Topoloco prefiere ocultarlo para que parezca el único original." },
      { "from": "topotino", "time": "auto", "text": "Guardad la diferencia. Ahora la señal conduce a un monasterio real construido por una promesa: Batalha." }
    ]
  },
  {
    "id": "batalha-llegada",
    "requiredFlags": ["portugal_pequenitos_representacion"],
    "blockedFlags": ["batalha_llegada"],
    "match": ["batalha", "estamos en batalha", "hemos llegado a batalha"],
    "setFlags": ["batalha_llegada"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Batalha localizada. Esto no es una reproducción: observad materiales, altura y espacio del edificio real." },
      { "from": "topotino", "time": "auto", "text": "Recorred la iglesia o el Claustro Real y terminad en las Capelas Imperfeitas. Buscad algo terminado y algo que quedó abierto." }
    ]
  },
  {
    "id": "batalha-capelas",
    "requiredFlags": ["batalha_llegada"],
    "blockedFlags": ["batalha_resuelto"],
    "openAnswer": true,
    "minWords": 12,
    "containsAnyGroups": [["batalha"], ["capelas", "capillas", "imperfectas", "inacabadas", "sin techo"], ["promesa", "obra", "porque", "evidencia"]],
    "setFlags": ["batalha_resuelto"],
    "remember": { "kind": "heritage_reasoning", "label": "Promesa y obra inacabada en Batalha" },
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Gracias. El monasterio recuerda una promesa; las capillas muestran que una intención puede quedar abierta sin perder su historia." },
      { "from": "topotino", "time": "auto", "text": "Topoloco ha escrito: «lo mayor siempre es el centro». En Fátima compararemos una capilla pequeña con una explanada y dos basílicas." }
    ]
  },
  {
    "id": "fatima-escala",
    "requiredFlags": ["batalha_resuelto"],
    "blockedFlags": ["completado_bucaco_batalha_fatima"],
    "openAnswer": true,
    "minWords": 12,
    "containsAnyGroups": [["capelinha", "capilla"], ["basílica", "basilica", "grande", "pequeña", "pequena", "espacio"], ["centro", "importante", "símbolo", "simbolo", "tradición", "tradicion", "porque"]],
    "setFlags": ["completado_bucaco_batalha_fatima"],
    "remember": { "kind": "scale_reasoning", "label": "Diferencia entre escala física y centralidad en Fátima" },
    "water": "Agua de la Promesa",
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Exacto. Hoy habéis separado cuatro cosas: original, representación, tamaño e importancia." },
      { "from": "topotino", "time": "auto", "text": "He recordado una promesa mía: si volvía a perderme en mis recuerdos, confiaría en las dos versiones que Paula y Hugo pudieran comprobar juntos." },
      { "from": "topotina", "time": "auto", "text": "Esa promesa sí la recuerdo. La escribiste dos veces y aun así perdiste el papel." },
      { "from": "topotino", "time": "auto", "text": "Medida de seguridad redundante. La cuarta ventana se ha aclarado." },
      { "from": "topotino", "time": "auto", "text": "La siguiente muestra pasos de un animal desaparecido y agua trabajando bajo tierra. Preparad calzado con buena suela y una capa ligera. Ahora descansad." }
    ]
  },
  {
    "id": "dia15-impedimento",
    "blockedFlags": ["completado_bucaco_batalha_fatima"],
    "containsAny": ["no podemos", "está cerrado", "esta cerrado", "llueve", "cambio de plan"],
    "messages": [
      { "from": "topotino", "time": "auto", "text": "Decidme qué lugar o condición concreta impide continuar. No fingiremos una visita y mantendremos la misma idea con algo que sí podáis observar." }
    ]
  }
]
```

## Respuestas suaves si fallan

```json
[
  "En Portugal dos Pequenitos decid qué conserva la reproducción y qué reduce, omite o cambia.",
  "En Batalha unid promesa, monasterio y Capelas Imperfeitas.",
  "En Fátima comparad espacio físico con centralidad simbólica."
]
```

## Pistas progresivas

```json
[
  "Una puerta al tamaño de Hugo demuestra que el edificio no es el original trasladado.",
  "Una reproducción puede enseñar formas aunque cambie tamaño, distancia y contexto.",
  "Buscad en Batalha las capillas que permanecen abiertas al cielo.",
  "La Capelinha es mucho menor que las basílicas, pero ocupa el corazón del recinto."
]
```

## Contexto para IA

Buçaco ocurrió realmente al final del 14 de agosto y no se repite. Topotina cambió el orden porque la señal perdía intensidad; no diseñó una nueva ruta completa. El 15 empieza en Portugal dos Pequenitos y sigue por Batalha y Fátima. Topotino distingue siempre reproducción y original. No ridiculiza la fe: separa observación física, historia documentada y significado para una comunidad. La experiencia de Coimbra prepara modelos posteriores, pero no revela Dino Parque, Isla Mágica ni el museo. Topotina entra con su avatar, bromea con su hermano y vigila la señal sin resolver respuestas. El Cuaderno sigue privado. No conoce Granada, los doce leones ni la causa confirmada de la amnesia.

## Fuentes documentales

- https://portugaldospequenitos.pt/areas-tematicas/
- https://portugaldospequenitos.pt/horario/
- https://www.cm-coimbra.pt/wp-content/uploads/2023/08/COIMBRA-PARA-LOS-PEQUENITOS_ESP_V1_1.pdf
- https://www.patrimoniocultural.gov.pt/pat_mun/mosteiro-da-batalha/
- https://www.santuario-fatima.pt/pt/pages/lugares-das-aparicoes
- https://www.santuario-fatima.pt/pt/pages/lugares-de-culto-e-oracao
