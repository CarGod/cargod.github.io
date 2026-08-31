---
locale: "es"
title: "¿Qué es un Token?"
seoTitle: "¿Qué es un Token? Cómo procesa texto un modelo | Luffy Liu"
description: "Comprende Token, Tokenizer y Token ID mediante un experimento de completar frases, y descubre por qué el número de Token varía según el modelo y la codificación."
slug: "tokens"
contentKey: "tutorial.prompt-engineering.tokens"
translation_of: "/tutorials/prompt-engineering/tokens/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 3
tags:
  - id: "prompt-engineering"
    label: "ingeniería de prompts"
  - id: "tokens"
    label: "Token"
draft: false
---

## ¿Qué ha ocurrido?

¿Qué sucede cuando enviamos un Prompt a un modelo de lenguaje?

¿Cómo devuelve el resultado?

¿Por qué el resultado cambia a veces?

Primero debemos conocer dos conceptos importantes: Token y probabilidad.

Este capítulo empieza por el Token.

## Hagamos primero un experimento para completar una frase

Por ahora, olvida todo lo demás y mira conmigo esta frase:

```text
Si de repente tú
```

Si te pidiera completarla con una frase breve, ¿qué escribirías?

Puedes detenerte un momento para pensarlo.

Supongamos que Zhang San y Li Si responden así:

```text
Zhang San: Si de repente estornudaras
```

```text
Li Si: Si de repente te convirtieras en gato
```

Los dos cumplen el requisito, pero sus respuestas son distintas.

¿Por qué?

Porque una frase suele admitir más de una continuación razonable. Lo que ya hemos visto, las palabras que conocemos y la decisión que tomamos en ese momento influyen en lo que escribiremos después.

### Veamos primero una frase por partes

Cuando hablamos o escribimos, a menudo no pensamos la frase entera de una sola vez. Seguimos avanzando mientras elegimos qué escribir a continuación.

Una misma frase puede tener pausas distintas:

```text
Cuando, estoy, escribiendo, este, texto, también, pienso, palabra, por, palabra
```

```text
Cuando estoy, escribiendo este, texto, también pienso, palabra por, palabra
```

No controlé las pausas a propósito. Solo añadí una coma donde sentí que debía detenerme, y las posiciones no quedaron exactamente iguales las dos veces.

Por ahora, podemos ver el contenido entre comas como bloques o «marcas». Lo que ya está escrito influye en el bloque que podría venir después.

### Pidamos a Zhang San que escriba otra vez

Si pedimos a Zhang San que lo intente otra vez, podría escribir:

```text
Si de repente aparecieras aquí
```

Por supuesto, también podría repetir la respuesta anterior.

No somos Zhang San y no sabemos qué opción elegirá. Lo que sí sabemos es que solo puede utilizar las palabras y expresiones que conoce; si no sabe algo, también puede equivocarse o «inventárselo».

¿Podemos describir de momento este proceso en tres pasos?

1. Tener primero cierto vocabulario y algunas frases.
2. Usar lo que ya aparece para decidir qué puede venir después.
3. Si hay varias continuaciones posibles, elegir una.

Detente aquí un momento. ¿Has notado algo parecido al hablar o escribir?

### Tres pequeños ejercicios

No busques aún una respuesta. Escribe estos tres ejercicios en papel o directamente en la pantalla y observa cómo completas cada frase poco a poco.

```text
Completa el comienzo con una frase breve, contando también la puntuación:
Mi tierra natal...
```

```text
Completa la frase:
Hoy, en gptpmt, yo...
```

```text
Escribe una frase con esta estructura:
Porque... por eso...
```

¿Has terminado?

Este experimento nos ayuda a desarrollar una intuición: al generar texto, el contenido anterior influye en lo que puede aparecer después.

Pero recuerda que solo es una analogía. La forma en que un modelo de lenguaje procesa Token no equivale al mecanismo real con el que el cerebro humano piensa y habla.

## ¿Qué es un Token?

El modelo no procesa un texto completo directamente según el «número de caracteres» o el «número de palabras» que entendemos las personas.

Antes de entrar en el modelo, el texto pasa por el Tokenizer correspondiente —el componente que lo segmenta— y se transforma en una secuencia de Token. El modelo procesa esos Token, genera otros nuevos paso a paso y, al final, los convierte en el texto que vemos.

Un Token puede ser:

- una palabra completa;
- una parte de una palabra;
- un carácter chino o parte de otro carácter;
- una combinación de espacio y texto;
- un signo de puntuación u otra secuencia de bytes.

Por tanto, el número de Token no equivale al número de caracteres ni al de palabras.

Por ejemplo:

```text
I love prompt engineering.
我喜欢提示工程。
```

No podemos saber cuántos Token producirán estas dos frases con solo contar sus caracteres. Incluso con un texto idéntico, otro modelo o codificación puede segmentarlo de forma distinta y producir otro número de Token.

Los Tokenizer habituales de los primeros modelos GPT utilizaban BPE (Byte Pair Encoding, codificación de pares de bytes) y sus variantes. Hoy, cada modelo puede emplear un vocabulario y una codificación diferentes, por lo que no debemos tratar el resultado de una captura antigua como una regla fija para todos los modelos.

### Un Tokenizer fuera de su terreno

Veamos primero una frase en inglés:

```text
I love GPT pmt.
```

Contiene letras, espacios, palabras y puntuación. El Tokenizer no tiene por qué separarla en palabras completas: `I` puede ser un Token por sí solo, un espacio inicial puede agruparse con las letras siguientes y `GPT` puede dividirse en fragmentos menores.

¿Por qué?

Porque el Tokenizer segmenta el texto según su propio vocabulario y sus reglas de codificación, no según las «letras» y «palabras» que aprendemos en clase de lengua.

¿Y qué ocurre con el chino?

Podríamos suponer que cada carácter chino corresponde siempre a un Token.

¿Es realmente así?

Si `GPT` puede «partirse», ¿también puede «partirse» un carácter chino? Veamos el carácter `爱` de esta frase:

```text
我爱 GPT pmt。
```

El carácter no se corta físicamente por la mitad. Sin embargo, el ordenador representa el texto mediante una codificación, y algunos Tokenizer basados en bytes pueden repartir la secuencia de bytes de un carácter chino entre más de un Token. Cuando herramientas antiguas mostraban esos fragmentos uno por uno, a veces aparecían símbolos de sustitución ilegibles.

Veamos primero un resultado real y reproducible. A fecha de 2026-08-31, la prueba oficial de OpenAI para `tiktoken` codifica `hello world` como `[15339, 1917]` con `cl100k_base`: son 2 Token, y al decodificarlos se recupera el texto original. El caso aparece en el [archivo oficial de pruebas](https://github.com/openai/tiktoken/blob/main/tests/test_encoding.py).

Este resultado solo corresponde a esa codificación y esa entrada. No significa que otros modelos o codificaciones produzcan lo mismo.

En vez de quedarnos solo con la explicación, podemos hacer un experimento real de segmentación:

1. Abre el Tokenizer o la herramienta de conteo oficial del servicio que utilizas actualmente.
2. Anota la fecha de la prueba, el servicio, el modelo y el nombre de la codificación que muestre la herramienta.
3. Introduce por separado `I love GPT pmt.` y `我爱 GPT pmt。`.
4. Registra la segmentación que muestra realmente la herramienta, el número de Token y los Token ID si los ofrece.
5. Si permite cambiar de modelo o codificación, elige otra opción y repite la prueba.

Guarda siempre el modelo, la codificación y la fecha junto al resultado. Si cambia más adelante, podremos distinguir si cambió el texto o si se actualizaron el modelo, el vocabulario o la herramienta.

En pocas palabras, «partir un carácter chino» ayuda a recordar un fenómeno: **un carácter que una persona ve completo no tiene por qué corresponder a un solo Token.**

Pero tampoco es una regla fija para todos los modelos. Al cambiar de modelo, vocabulario o codificación, un mismo carácter puede ocupar un Token o varios. El chino tampoco consume necesariamente más Token que el inglés. Para conocer la cifra exacta, hay que probar con la herramienta correspondiente al modelo de destino.

## ¿Qué es un Token ID?

El Tokenizer asigna cada Token a un identificador entero de su vocabulario. Ese número es el Token ID.

```text
Texto: 你好
Token: [你][好]
Token ID: [ID de ejemplo 1][ID de ejemplo 2]
```

Lo anterior solo sirve para explicar el concepto y no representa la segmentación de ningún modelo real.

El Token ID se parece al número de cada elemento en el vocabulario del modelo. Si cambiamos de modelo o codificación, los Token ID de un mismo texto pueden ser completamente distintos. Tampoco indican la importancia de una palabra, la fiabilidad de un hecho ni la confianza del modelo.

## ¿Por qué conviene entender los Token?

En primer lugar, la cantidad de contenido que un modelo puede procesar de una vez tiene un límite. La entrada, el historial de conversación, las instrucciones de herramientas y la salida consumen Token.

En segundo lugar, pedir «escribe 500 caracteres chinos» no es lo mismo que limitar «el máximo de Token que se pueden generar». Si una tarea exige un número estricto de caracteres, hay que comprobarlo después de que el modelo genere el texto.

Por último, muchas API registran los Token utilizados en la entrada y la salida. El método exacto de medición cambia según el servicio y el modelo, así que deben consultarse la documentación de la interfaz real y los datos de usage que devuelve.

Cuando necesites una cifra exacta, no apliques una fórmula fija como «un carácter chino equivale a tantos Token». Determina primero qué modelo se usa y recurre al Tokenizer o a la interfaz de conteo de ese servicio.

Los usuarios de OpenAI pueden observar la segmentación del texto con el [Tokenizer](https://platform.openai.com/tokenizer) oficial. Para otros servicios, hay que utilizar sus herramientas y documentos oficiales.

## Volvamos a las preguntas iniciales

Cuando el modelo recibe una secuencia de Token, ¿cómo decide cuál será el siguiente?

¿Por qué una misma frase puede continuar de maneras distintas?

Para responder, debemos seguir con la probabilidad y el muestreo.

**Capítulo anterior:** [La primera conversación](/tutorials/prompt-engineering/first-conversation/)

**Capítulo siguiente:** [Probabilidad, muestreo y Temperature](/tutorials/prompt-engineering/probability-temperature/)
