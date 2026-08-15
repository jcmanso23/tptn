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

Buçaco ya se investigó de forma breve al final del 14 de agosto. Topotina cambió el orden porque la señal del bosque perdía intensidad al caer la tarde; no inventó un destino ni resolvió la prueba. De Buçaco salieron dos fragmentos arquitectónicos mezclados y sin nombre. Topotina propone Portugal dos Pequenitos porque reúne en un solo recinto representaciones de monumentos de todo Portugal y permite identificar el origen de los fragmentos sin conocer previamente la ruta.

La documentación histórica del proyecto confirma que el Monasterio de Batalha forma parte del Portugal Monumental. Fátima no figura en ese inventario. Topoloco ha superpuesto en la transmisión una capilla pequeña y una gran explanada sobre la representación de Batalha para convertir dos lugares distintos en una sola etiqueta. Paula y Hugo deben comprobar físicamente planos o placas, localizar Batalha y descubrir que la señal de Fátima fue añadida. Así recuperan ambos nombres, pero solo se abre primero la coordenada de Batalha.

En Batalha comparan la representación con un monasterio real originado por una promesa y trabajado durante generaciones, incluidas las Capelas Imperfeitas. Ese hallazgo ordena las dos señales y desbloquea Fátima. Allí separan tamaño físico de centralidad: la Capelinha es pequeña y ocupa un lugar fundamental dentro de un recinto enorme.

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
  { "from": "topotino", "time": "auto", "text": "En el Hotel do Parque y en Buçaco vimos lugares con partes de épocas distintas. De Buçaco salieron dos fragmentos de monumentos portugueses mezclados y sin nombre." },
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
      { "from": "topotina", "time": "auto", "text": "Habéis encontrado Batalha en el parque. Fátima solo aparece en la transmisión: Topoloco ha mezclado dos lugares bajo una sola etiqueta." },
      { "from": "topotino", "time": "auto", "text": "Los dos nombres los habéis descubierto vosotros. Solo la palabra PROMESA abre ahora la coordenada de Batalha; Fátima queda pendiente." }
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

Buçaco ocurrió realmente al final del 14 de agosto y no se repite. El capítulo se abre por la mañana para resumir solo lo ya vivido; su primera misión permanece bloqueada por la llegada física a Portugal dos Pequenitos. Topotino y Topotina no enumeran Batalha ni Fátima al comenzar. Ambos nombres solo aparecen cuando Paula y Hugo comprueban físicamente que Batalha figura en el parque y que la supuesta Fátima pertenece a la transmisión manipulada. Conocer los dos nombres no activa dos misiones: solo Batalha abre coordenada. Fátima permanece como pieza pendiente hasta investigar las Capelas Imperfeitas. Topotino distingue siempre representación, original, ausencia y manipulación. No ridiculiza la fe: separa observación física, historia documentada y significado para una comunidad. La experiencia de Coimbra prepara modelos posteriores, pero no revela sus destinos. Topotina entra con su avatar, bromea con su hermano y vigila la señal sin resolver respuestas. El Cuaderno sigue privado. No conoce Granada, los doce leones ni la causa confirmada de la amnesia.

## Fuentes documentales

- https://portugaldospequenitos.pt/areas-tematicas/
- https://portugaldospequenitos.pt/horario/
- https://www.cm-coimbra.pt/wp-content/uploads/2023/08/COIMBRA-PARA-LOS-PEQUENITOS_ESP_V1_1.pdf
- https://arquivomunicipal.lisboa.pt/fileadmin/arquivo_municipal/difusao/publicacoes/catalogos/cassiano_branco/catalogo_CassianoBranco.pdf
- https://www.patrimoniocultural.gov.pt/pat_mun/mosteiro-da-batalha/
- https://www.santuario-fatima.pt/pt/pages/lugares-das-aparicoes
- https://www.santuario-fatima.pt/pt/pages/lugares-de-culto-e-oracao
