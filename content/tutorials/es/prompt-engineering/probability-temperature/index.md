---
locale: "es"
title: "Probabilidad, muestreo y Temperature"
seoTitle: "Respuestas variables: probabilidad y Temperature | Luffy Liu"
description: "Sigue el proceso de generación del siguiente Token para entender por qué la probabilidad, el muestreo y la Temperature afectan a la estabilidad y variedad de las respuestas."
slug: "probability-temperature"
contentKey: "tutorial.prompt-engineering.probability-temperature"
translation_of: "/tutorials/prompt-engineering/probability-temperature/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 4
tags:
  - id: "prompt-engineering"
    label: "ingeniería de prompts"
  - id: "model-sampling"
    label: "muestreo del modelo"
draft: false
---

## ¿Cómo se produce una frase?

El capítulo anterior presentó los Token.

El modelo ya ha recibido una secuencia de Token. ¿Cómo los continúa hasta formar una frase?

Empecemos por un texto todavía incompleto:

```text
I love
```

¿Qué podría venir después?

Para facilitar la comprensión, inventemos una lista simplificada de candidatos:

```text
you     30%
this    18%
music   12%
it       8%
...
```

Estas cifras son meramente ilustrativas, no una salida de un modelo real.

Según el contexto actual, el modelo calcula una distribución de probabilidad para los posibles Token siguientes y selecciona uno de acuerdo con la estrategia de decodificación utilizada.

Si elige `you`, el contenido actual pasa a ser:

```text
I love you
```

A continuación, el modelo devuelve el nuevo contenido al contexto y predice el Token siguiente.

```text
I love
I love you
I love you too
I love you too.
```

El proceso se repite hasta que aparece una marca de fin de generación, se alcanza el límite de salida o el sistema lo detiene de otro modo.

Conviene corregir una idea en particular: el Tokenizer solo transforma texto en Token ID y viceversa. No asigna a cada Token, en el momento de segmentar el texto, una probabilidad de respuesta que vaya a permanecer fija para siempre.

El modelo calcula la probabilidad durante la generación según el contexto actual. Una misma palabra colocada en frases distintas puede dar lugar a continuaciones probables diferentes.

## ¿Por qué una misma pregunta recibe respuestas distintas?

Podemos hacer un experimento muy sencillo.

Abre dos conversaciones nuevas que no compartan contexto y escribe en ambas:

```text
Había una vez un principito
```

Las dos respuestas pueden empezar de forma parecida y luego avanzar hacia historias diferentes.

¿Por qué?

Porque muchos procesos de generación emplean muestreo en lugar de elegir siempre el Token con la puntuación más alta en cada paso. Basta con que una elección cambie para que el contexto posterior también lo haga y toda la respuesta siga otro camino.

Además, la versión del modelo, las instrucciones del sistema, el historial de la conversación, los resultados de las herramientas y la implementación del servidor pueden influir en el resultado.

Por tanto, «he escrito la misma frase» no significa necesariamente que todas las condiciones de las dos ejecuciones sean idénticas.

## ¿Qué es Temperature?

Temperature (temperatura) es un parámetro de muestreo disponible en algunas interfaces de modelos.

De forma intuitiva, ajusta el grado de concentración de la distribución de probabilidad de los Token candidatos:

- una Temperature menor suele dar más ventaja a los candidatos de alta probabilidad y concentra la salida;
- una Temperature mayor suele dar oportunidades a más candidatos, lo que produce una salida más variada, pero quizá también más inestable.

No es un «interruptor de creatividad» ni vuelve los hechos automáticamente más correctos.

Al extraer información, clasificar o producir un formato fijo, normalmente nos importa más la consistencia. En una lluvia de ideas, quizá aceptemos más variación.

En ambos casos hay que revisar el resultado.

## ¿Qué valor debe tener Temperature?

No existe una cifra fija que sirva para todas las tareas.

El soporte de Temperature, su intervalo permitido y su combinación con otros parámetros de muestreo pueden variar entre modelos e interfaces. Los productos de chat para usuarios generales tampoco tienen por qué publicar todos los parámetros empleados en cada generación.

Por eso, no debemos considerar afirmaciones como «la versión web usa 0.7 por defecto» o «este valor es el mejor» como conclusiones universales.

Un método más fiable consiste en probar varias veces la tarea que realmente queremos hacer, comparar los resultados con distintos ajustes y decidir después qué valor usar.

Para saber si una interfaz admite Temperature y qué intervalo permite, hay que consultar la documentación oficial actual de la plataforma utilizada. Incluso con una Temperature muy baja, la salida puede cambiar entre intentos, así que los resultados importantes siguen necesitando revisión.

## De vuelta a la ingeniería de prompts

Cuando entendemos esta variabilidad, dejamos de tratar el modelo como una consulta de base de datos que devuelve siempre el mismo resultado.

La función del Prompt es acercar las posibles respuestas al intervalo que necesitamos; la de la verificación es confirmar si el resultado de esta ocasión puede usarse.

**Capítulo anterior:** [¿Qué es un Token?](/tutorials/prompt-engineering/tokens/)

**Capítulo siguiente:** [Seis técnicas para obtener buenos resultados](/tutorials/prompt-engineering/clear-instructions/)
