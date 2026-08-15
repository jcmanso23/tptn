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
    "date": { "on": "2026-08-15" }
  },
  "mission": "Distinguir tamaño, representación e importancia",
  "formulaWord": null,
  "water": "Agua de la Promesa",
  "ai": { "enabled": true, "mode": "fallback" }
}
---

# Contexto narrativo

Buçaco ya se investigó de forma breve al final del 14 de agosto. Topotina cambió el orden porque la señal del bosque perdía intensidad al caer la tarde; no inventó un destino ni resolvió la prueba. De Buçaco salió un fragmento con arcos apuntados, pináculos, piedra tallada y el nombre borrado. Topotina propone Portugal dos Pequenitos porque reúne en un solo recinto representaciones de monumentos de todo Portugal y permite identificar el original sin conocer previamente la ruta.

La documentación histórica del proyecto confirma que el Monasterio de Batalha forma parte del Portugal Monumental. Paula y Hugo deben localizar su representación por sus rasgos visibles antes de leer la placa. Solo entonces descubren el nombre de Batalha y abren esa coordenada. En Coimbra no se nombra Fátima ni se anuncia una segunda parada.

En Batalha comparan la representación con un monasterio real originado por el voto de D. João I antes de la batalla de Aljubarrota y trabajado durante generaciones, incluidas las Capelas Imperfeitas. Al completar la comprobación descubren que el destino era un señuelo: el fragmento anterior al eclipse conserva `3 · 13 · 1917`, incompatible con un rey y 1385. Topoloco mantuvo la relación con la Virgen para que el engaño resultara verosímil, pero cambió protagonistas y fecha. La pista auténtica habla de tres niños pastores y de unas apariciones marianas en 1917; Paula y Hugo deducen Fátima. Allí comprueban los nombres de Lúcia, Francisco y Jacinta y separan tamaño físico de centralidad: la Capelinha es pequeña y ocupa un lugar fundamental dentro de un recinto enorme.

Topoloco intenta imponer la frase «solo importa lo grande, original y terminado». La respuesta no es que una reproducción y un original sean iguales. Una reproducción puede enseñar si reconoce sus límites; una obra inacabada conserva decisiones y trabajo; un espacio pequeño puede ser central para una comunidad. Esta distinción prepara Dino Parque —modelo, fósil y estudio— e Isla Mágica —escenario histórico, función actual y fuente original— sin adelantar esos destinos.

Topotina participa al llegar a Coimbra. Confirma que el cambio de orden funcionó, explica que vigilará la señal y no responde por los niños. Topotino continúa dudando de que trabajaran juntos y bromea con que Portugal se ha encogido; Topotina corrige el concepto: es una representación a escala. La relación avanza mediante trabajo compartido y humor breve.

## Mensajes iniciales

```json
[
  { "from": "topotino", "time": "auto", "text": "Buenos días. Antes de movernos necesito ordenar todo lo que ha ocurrido desde el eclipse." },
  { "from": "topotino", "time": "auto", "text": "Perdí casi todos mis recuerdos anteriores. La carta de emergencia dejó el mapa de doce ventanas y confirmó que Paula y Hugo sois mis aliados." },
  { "from": "topotino", "time": "auto", "text": "En Amarante comprobasteis el puente y el Tâmega. Después el chat sufrió interferencias. Sospechamos de Topoloco, pero aún no sabemos cómo entró ni si causó mi amnesia." },
  { "from": "topotino", "time": "auto", "text": "En Magikland descubristeis el Cazarrisas: un programa firmado por Topoloco que estudia qué observáis y por qué un momento se vuelve recuerdo." },
  { "from": "topotina", "time": "auto", "text": "Allí entré yo. Recuerdo que Topotino es mi hermano y que construimos el comunicador juntos. Él todavía no me recuerda, pero ya ha dejado de llamarme intrusa. Casi." },
  { "from": "topotino", "time": "auto", "text": "En el Hotel do Parque y en Buçaco vimos lugares con partes de épocas distintas. De Buçaco salió un fragmento con arcos apuntados, piedra tallada y un nombre borrado." },
  { "from": "topotina", "time": "auto", "text": "Eso sabemos. Ignoramos qué quiere hacer Topoloco con los recuerdos, dónde están las demás ventanas y si el contador de Sombra detectará otra intrusión." },
  { "from": "topotino", "time": "auto", "text": "La única pista abierta señala Portugal dos Pequenitos. Cuando lleguéis, averiguaremos qué contiene. Nada más está decidido todavía." }
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
      { "from": "topotina", "time": "auto", "text": "Habéis encontrado la representación por su arquitectura y la placa confirma el nombre: Monasterio de Batalha." },
      { "from": "topotino", "time": "auto", "text": "PROMESA, CORONA y 1385 abren una sola coordenada. Comprobaremos el edificio real antes de creer nada más." }
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
      { "from": "topotina", "time": "auto", "text": "La clave anterior al eclipse dice 3 · 13 · 1917. No coincide con un rey y 1385: Topoloco nos envió a un señuelo." },
      { "from": "topotino", "time": "auto", "text": "La pista auténtica habla de tres niños pastores y apariciones de la Virgen. Ahora nos toca deducir el lugar." }
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
  "En Portugal dos Pequenitos comparad los arcos y la piedra del fragmento; leed la placa solo después.",
  "En el monasterio comparad la fecha y los protagonistas con 3 · 13 · 1917.",
  "Cuando reconstruyáis la pista auténtica, comprobad allí nombres, fecha y lugar."
]
```

## Pistas progresivas

```json
[
  "Una puerta al tamaño de Hugo demuestra que el edificio no es el original trasladado.",
  "Los arcos apuntados y la piedra muy tallada ayudan a encontrar la representación antes de leer su placa.",
  "En el edificio real, comparad un rey y 1385 con los números 3 · 13 · 1917.",
  "Cuando sepáis qué lugar señala 1917, buscad los tres nombres y la pequeña capilla."
]
```

## Contexto para IA

Buçaco ocurrió realmente al final del 14 de agosto y no se repite. El capítulo se abre por la mañana para resumir solo lo ya vivido; su primera misión permanece bloqueada por la llegada física a Portugal dos Pequenitos. Topotino y Topotina no nombran Batalha hasta que Paula y Hugo localizan físicamente su representación y leen la placa. Fátima está totalmente prohibida en Coimbra. Solo se revela que Batalha era un señuelo después de aprender allí el voto, la fecha y los protagonistas y contrastarlos con `3 · 13 · 1917`. La pista de los tres pastorinhos permite entonces que Paula y Hugo deduzcan Fátima. Topotino distingue representación, original, relato religioso, documentación histórica y observación física. No ridiculiza la fe ni presenta una creencia como prueba científica. La experiencia de Coimbra prepara modelos posteriores, pero no revela sus destinos. Topotina entra con su avatar, bromea con su hermano y vigila la señal sin resolver respuestas. El Cuaderno sigue privado. No conoce Granada, los doce leones ni la causa confirmada de la amnesia.

## Fuentes documentales

- https://portugaldospequenitos.pt/areas-tematicas/
- https://portugaldospequenitos.pt/horario/
- https://www.cm-coimbra.pt/wp-content/uploads/2023/08/COIMBRA-PARA-LOS-PEQUENITOS_ESP_V1_1.pdf
- https://arquivomunicipal.lisboa.pt/fileadmin/arquivo_municipal/difusao/publicacoes/catalogos/cassiano_branco/catalogo_CassianoBranco.pdf
- https://www.patrimoniocultural.gov.pt/pat_mun/mosteiro-da-batalha/
- https://www.santuario-fatima.pt/pt/pages/lugares-das-aparicoes
- https://www.santuario-fatima.pt/pt/pages/lugares-de-culto-e-oracao
