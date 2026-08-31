---
locale: "es"
title: "Seis técnicas para obtener buenos resultados"
seoTitle: "Seis técnicas prácticas para escribir prompts claros | Luffy Liu"
description: "Reduce las conjeturas del modelo y acerca los resultados a los requisitos mediante instrucciones claras, rol y estilo, delimitadores, pasos, ejemplos y longitud de salida."
slug: "clear-instructions"
contentKey: "tutorial.prompt-engineering.clear-instructions"
translation_of: "/tutorials/prompt-engineering/clear-instructions/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 5
tags:
  - id: "prompt-engineering"
    label: "ingeniería de prompts"
  - id: "prompt-writing"
    label: "redacción de prompts"
draft: false
---

## No puede leer la mente

Los modelos de lenguaje son potentes, pero, por desgracia, no pueden leer la mente.

Cuando queremos algo, debemos explicarlo con la mayor claridad posible en vez de obligar al modelo a adivinar qué estamos pensando.

**Cuanto menos tenga que adivinar, más probable será que el resultado se acerque a nuestros requisitos.**

Veamos seis técnicas sencillas pero frecuentes.

## 1. Redacta instrucciones claras

Para obtener la respuesta que buscamos, debemos proporcionar los detalles y el contexto que de verdad importan. De lo contrario, el modelo solo puede adivinar.

| Expresión ambigua | Expresión más clara |
| --- | --- |
| ¿Cómo se suman números en Excel? | ¿Cómo puedo sumar los importes en dólares de una fila de Excel y colocar automáticamente el resultado en la columna «Total» de la derecha? |
| ¿Quién es el presidente? | ¿Quién era el presidente de Estados Unidos en 2021? ¿Con qué frecuencia suelen celebrarse las elecciones presidenciales estadounidenses? |
| Escribe un método para la sucesión de Fibonacci. | Escribe en Python un método que calcule la sucesión de Fibonacci y explica con comentarios la función de cada parte. |
| Escribe y resume un acta de reunión. | Escribe un acta de reunión ficticia y enumera con Markdown los participantes, los puntos principales y las tareas que aparezcan de forma explícita. |

Un Prompt no es mejor por ser más largo. La clave es si deja clara la información que afecta al resultado.

## 2. Especifica el estilo, el público y el rol

Si queremos un tono concreto, podemos decirlo directamente.

### Especifica el estilo

```text
Cuando te pida que escribas algo, incluye al menos un chiste o una frase ingeniosa en cada párrafo.

Escribe una carta de agradecimiento a mi compañero de clase Zhang San. Dale las gracias porque, gracias a su presentación, conseguí un trabajo.
```

Una misma carta se lee de forma completamente distinta si parece un documento solemne o una conversación relajada. En vez de esperar a que el modelo adivine, podemos indicar directamente el estilo que buscamos.

Por supuesto, «un chiste en cada párrafo» es una demostración deliberadamente llamativa. En una tarea real también podríamos pedir «un tono sincero y natural, sin elogios exagerados».

### Especifica el rol

Si la tarea requiere un punto de vista definido, también podemos especificar un rol:

```text
Eres profesor universitario de literatura china. Responde desde la perspectiva de una clase de literatura.

Explica el cambio emocional y la idea que expresa Li Bai al escribir: «El Cielo me dio talento, que tendrá su utilidad; mil monedas de oro gastadas volverán otra vez».
```

### Combina el rol y el público

¿Y si queremos que un niño de diez años entienda el mismo tema?

```text
Eres un astrofísico galardonado con el Premio Nobel de Física. Responde desde la perspectiva de la divulgación astrofísica.
La respuesta está dirigida a niños de diez años: debe ser comprensible y estar llena de imaginación.

Explica cómo se forman los agujeros negros y cuáles son sus características.
```

Así quedan claros al mismo tiempo el punto de vista, el público objetivo y el estilo. Hay tres capas más de información que en «explica los agujeros negros».

La descripción del rol ayuda al modelo a entender el punto de vista, el público y los criterios. No le otorga realmente un título ni demuestra que la respuesta sea necesariamente profesional.

En vez de decir «eres el mayor experto del mundo», es mejor escribir los criterios de evaluación que necesitamos de verdad.

## 3. Separa contenidos distintos con delimitadores

Cuando un Prompt contiene al mismo tiempo las instrucciones, el material original y el formato de salida, podemos separarlos mediante comillas triples, títulos Markdown o etiquetas XML.

```text
Resume el texto entre comillas triples con un poema breve.

"""
Sobre el vasto mar, el fuerte viento reunía las nubes oscuras. El petrel volaba altivo como un relámpago negro.
"""
```

También podemos escribirlo así:

```text
<task>Compara dos poemas relacionados con la Torre de la Grulla Amarilla y explica las razones.</task>
<article>El hombre de antaño partió ya en la grulla amarilla; aquí solo queda la Torre de la Grulla Amarilla…</article>
<article>Mi viejo amigo se despide al oeste de la Torre de la Grulla Amarilla; entre brumas floridas de marzo baja hacia Yangzhou…</article>
```

También podemos usar nombres de campo para separar el resumen y el título:

```text
Te daré el resumen y el título de un artículo.
Decide si el título resume con precisión el contenido y ayuda al lector a entender el tema.
Si no cumple alguno de los dos criterios, propón cinco títulos alternativos.

Resumen: Un periodo prolongado de lluvias intensas afecta a varias regiones del norte. La lluvia durará bastante, cubrirá una zona amplia y en algunos lugares podría ser torrencial.

Título: Fuertes lluvias en varias regiones del norte; atención a posibles lluvias torrenciales
```

Aquí, «Resumen:» y «Título:» también son delimitadores. No emplean ningún símbolo especial, pero indican con claridad qué parte es el resumen y cuál es el título.

En una tarea sencilla quizá no se aprecie una gran diferencia antes y después de añadir delimitadores. Cuanto más compleja sea la tarea y más extenso el material, más importantes serán unos límites claros.

Los delimitadores no vuelven de repente más inteligente al modelo. Solo nos ayudan a marcar «qué es la instrucción, qué es el material y qué es el formato».

## 4. Especifica los pasos para completar la tarea

Muchas tareas necesitan de por sí varios pasos. Si los escribimos, al modelo le resultará más fácil seguir nuestro razonamiento.

```text
Completa la tarea en este orden:

1. Resume en una sola frase el texto entre comillas triples y añade el prefijo «Resumen:».
2. Traduce esa frase al inglés y añade el prefijo «Traducción:».

"""
{{texto que debe procesarse}}
"""
```

Los pasos tampoco son mejores por ser más numerosos. Escribe primero los que realmente afectan al resultado y no dividas una tarea sencilla en decenas de pasos solo para que parezca profesional.

## 5. Explica mediante ejemplos

A veces, el estilo o el formato que queremos resulta difícil de explicar con una sola regla.

En ese caso podemos ofrecer ejemplos directamente.

```text
Eres un «generador de nombres para animales mágicos». Pon nombres a los animales siguiendo el estilo de los ejemplos.

Animal: gato
Nombre: Agente de la Noche

Animal: perro
Nombre: Relámpago Sobrehumano

Ahora inventa un nombre para el «caballo».
```

Entre uno y tres ejemplos de buena calidad suelen bastar para que el modelo vea la correspondencia que buscamos.

Pero el modelo también imitará los problemas de los ejemplos. Por eso, no deben mostrar solo el caso ideal, sino cubrir también los límites que aparecerán en la tarea real.

## 6. Especifica la longitud de la salida

Podemos limitar la salida mediante un número aproximado de caracteres, frases, párrafos o puntos.

Pero el modelo no sigue todos estos requisitos exactamente del mismo modo.

Probemos tres veces con el mismo texto. Para poder comparar, el original de los tres Prompt es idéntico.

### Primera ronda: unos 50 caracteres

```text
Resume en unos 50 caracteres el contenido entre comillas triples.

"""
Sobre el vasto mar, el fuerte viento reunía las nubes oscuras. Entre las nubes y el mar, el petrel volaba altivo como un relámpago negro.

A veces rozaba las olas con las alas; otras subía hacia las nubes como una flecha. En su grito se oía el deseo de que llegara la tormenta.
"""
```

«Unos 50 caracteres» parece una instrucción precisa, pero el modelo genera Token: no cuenta un carácter de forma sincronizada con cada paso. El resultado puede acercarse a 50 caracteres o superarlos claramente.

### Segunda ronda: dos párrafos

```text
Resume en dos párrafos el contenido entre comillas triples.

"""
Sobre el vasto mar, el fuerte viento reunía las nubes oscuras. Entre las nubes y el mar, el petrel volaba altivo como un relámpago negro.

A veces rozaba las olas con las alas; otras subía hacia las nubes como una flecha. En su grito se oía el deseo de que llegara la tormenta.
"""
```

Esta vez podemos ver de inmediato si el resultado tiene dos párrafos. El número de párrafos suele ser más fácil de observar que una cifra exacta de caracteres.

### Tercera ronda: tres puntos

```text
Resume en tres puntos el contenido entre comillas triples.

"""
Sobre el vasto mar, el fuerte viento reunía las nubes oscuras. Entre las nubes y el mar, el petrel volaba altivo como un relámpago negro.

A veces rozaba las olas con las alas; otras subía hacia las nubes como una flecha. En su grito se oía el deseo de que llegara la tormenta.
"""
```

El número de puntos también es muy visible: podemos comprobar enseguida si hay tres.

Las tres rondas procesan el mismo texto y solo cambia la forma de expresar la longitud. «Unos 50 caracteres» controla un intervalo aproximado; «dos párrafos» y «tres puntos» controlan la estructura. No son el mismo tipo de requisito.

El número de párrafos o puntos suele ser más fácil de observar, pero eso no permite omitir la comprobación. Si una operación exige un número estricto de caracteres, párrafos o puntos, hay que volver a validarlo después de la generación mediante un programa o un proceso editorial.

## Un último repaso

No es necesario usar las seis técnicas en todos los prompts.

Para una tarea sencilla basta con expresarse con claridad. En una tarea compleja, añade de forma gradual contexto, delimitadores, pasos y ejemplos.

El objetivo real no es escribir un Prompt muy largo, sino reducir las conjeturas del modelo y facilitar la comprobación del resultado.

**Capítulo anterior:** [Probabilidad, muestreo y Temperature](/tutorials/prompt-engineering/probability-temperature/)

**Capítulo siguiente:** [Plantillas y técnicas para estructurar prompts](/tutorials/prompt-engineering/structured-prompts/)
