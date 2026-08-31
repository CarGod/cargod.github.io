---
locale: "es"
title: "Tareas complejas: descomposición, cálculo y verificación"
seoTitle: "Tareas complejas: divide y verifica | Luffy Liu"
description: "Conserva el método práctico de guiar paso a paso, distingue las operaciones verificables del razonamiento privado del modelo y aprende a revisar respuestas con el problema de los cubos de agua."
slug: "complex-tasks"
contentKey: "tutorial.prompt-engineering.complex-tasks"
translation_of: "/tutorials/prompt-engineering/complex-tasks/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 9
tags:
  - id: "prompt-engineering"
    label: "ingeniería de prompts"
  - id: "task-decomposition"
    label: "descomposición de tareas"
draft: false
---

## ¿Por qué es fácil equivocarse en tareas complejas?

Imagina que de repente nos llaman para resolver un problema complejo. Si respondemos sin detenernos a pensar, ¿qué tal podremos hacerlo?

Lo más probable es que nos equivoquemos.

Si antes de empezar leemos bien el problema, confirmamos las condiciones y avanzamos paso a paso, el resultado suele ser más fiable.

Lo mismo ocurre con los modelos de lenguaje.

Pero hay un punto que debemos tener en cuenta: no necesitamos pedir al modelo que revele toda su cadena de pensamiento privada ni podemos considerar un largo texto sobre «lo que está pensando» como prueba de que la respuesta es correcta.

Lo que de verdad necesitamos es contenido que una persona pueda comprobar: qué condiciones se han usado, qué fórmula o evidencia se ha aplicado, cuáles son los resultados intermedios necesarios y cuál es la respuesta final.

## Empecemos por un problema sencillo

```text
¿Kobe Bryant y Michael Jordan proceden del mismo país?
Responde directamente y aporta una frase de evidencia que pueda comprobarse.
```

No es un problema complejo. Kobe Bryant y Michael Jordan son de Estados Unidos, así que proceden del mismo país.

En una pregunta sencilla basta con dejar claros la respuesta y el fundamento necesario. No hace falta escribir un proceso largo solo para parecer minucioso.

¿Y si el problema tiene alguna vuelta más?

## Veamos un problema algo más complejo

```text
Tres personas bebieron tres cubos de agua en tres días.
Si todas beben la misma cantidad de agua cada día, ¿cuántos cubos beberán nueve personas en nueve días?
Da la respuesta directamente.
```

Si solo nos fijamos en «tres, tres, tres» y «nueve, nueve», es fácil contestar guiándonos por los números de la superficie.

¿Es realmente así?

Calculemos primero por nuestra cuenta.

Tres personas durante tres días suman 9 días-persona. Si dividimos tres cubos entre esos 9 días-persona, cada persona bebe `1/3` de cubo al día.

Nueve personas durante nueve días suman 81 días-persona. Al multiplicar por `1/3` de cubo por persona y día, el resultado es 27 cubos.

Por tanto, convertir solo los números de la superficie da un resultado incorrecto. La respuesta correcta es **27 cubos**.

## Señala la ruta clave

En un problema así, limitarse a decir al modelo «piénsalo con atención» quizá no ayude.

Es como trabajar con una persona en prácticas que parece capaz de hacer de todo. Si no consigue resolver un problema complejo, puede que no le falte capacidad, sino que no sepa qué mirar primero y qué calcular después.

En ese momento debemos ofrecerle una pequeña guía sobre la ruta clave.

Podemos escribir el Prompt así:

```text
Calcula el siguiente problema.

Tres personas bebieron tres cubos de agua en tres días. Si todas beben la misma cantidad de agua cada día, ¿cuántos cubos beberán nueve personas en nueve días?

Sigue estos pasos clave:
1. Calcula el total de días-persona de tres personas durante tres días.
2. Calcula cuántos cubos bebe una persona al día.
3. Calcula el total de días-persona de nueve personas durante nueve días.
4. Calcula por último el consumo total.

Muestra las fórmulas y los resultados intermedios necesarios para comprobar la respuesta y escribe después la respuesta final por separado.
No produzcas todo el razonamiento interno.
```

Las operaciones verificables son:

```text
Total original de días-persona: 3 × 3 = 9 días-persona
Consumo diario por persona: 3 ÷ 9 = 1/3 de cubo
Total objetivo de días-persona: 9 × 9 = 81 días-persona
Consumo total: 81 × 1/3 = 27 cubos

Respuesta: 27 cubos
```

Lo que de verdad ayuda aquí es señalar la ruta clave y hacer que las fórmulas y los resultados intermedios puedan revisarse.

## Separa las operaciones de la respuesta final

¿Por qué dividir las dos partes?

Porque queremos ver la respuesta rápidamente y, si surge alguna duda, volver a comprobar su fundamento.

Pero unas «operaciones comprobables» no son lo mismo que toda la cadena de pensamiento privada del modelo. Para este problema, `3 × 3 = 9 días-persona`, `3 ÷ 9 = 1/3 de cubo` y `81 × 1/3 = 27 cubos` bastan para revisar el resultado.

Por último, que el modelo escriba unos pasos muy completos no garantiza que sean correctos. Podemos revisar un cálculo con una calculadora o código, y una respuesta factual en la fuente original.

En un problema sencillo, deja claros la respuesta y el fundamento necesario.

En un problema complejo, señala la ruta clave y separa el fundamento comprobable de la respuesta final.

**Capítulo anterior:** [Cómo aprovechar las etiquetas XML](/tutorials/prompt-engineering/xml-delimiters/)

**Volver a la introducción:** [¿Qué es Prompt Engineering?](/tutorials/prompt-engineering/)
