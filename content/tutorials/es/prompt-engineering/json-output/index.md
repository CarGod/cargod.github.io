---
locale: "es"
title: "Hacer que el modelo produzca datos JSON"
seoTitle: "Cómo obtener JSON válido de un modelo | Luffy Liu"
description: "Mediante el caso progresivo de un profesor que registra datos de alumnos, entiende por qué los programas necesitan datos estructurados y cómo definir campos, valores desconocidos y validar JSON."
slug: "json-output"
contentKey: "tutorial.prompt-engineering.json-output"
translation_of: "/tutorials/prompt-engineering/json-output/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 7
tags:
  - id: "prompt-engineering"
    label: "ingeniería de prompts"
  - id: "structured-output"
    label: "salida estructurada"
draft: false
---

## ¿Qué es JSON?

JSON (JavaScript Object Notation, notación de objetos de JavaScript) es un formato habitual de intercambio de datos. Organiza los datos mediante pares de clave y valor, por lo que resulta fácil de leer para las personas y de analizar para los programas.

```json
{
  "name": "John",
  "age": 30,
  "isStudent": false,
  "grades": [90, 85, 88],
  "address": {
    "city": "New York",
    "zipcode": "10001"
  }
}
```

Este ejemplo representa el nombre, la edad, la condición de estudiante, las calificaciones y la dirección de una persona.

Los valores de JSON pueden ser cadenas, números, booleanos, `null`, arrays u objetos. La mayoría de los lenguajes de programación populares ofrecen herramientas para procesar JSON, por lo que se utiliza a menudo para transferir datos entre sistemas.

Pero ¿por qué pedir al modelo que produzca JSON?

Veamos un ejemplo.

## El problema del profesor

Imaginemos que soy profesor de primaria. El primer día de clase pido a los niños que escriban una breve presentación personal y quiero registrar esa información en el sistema de gestión de alumnos.

Cada niño escribirá de una manera distinta.

```text
Me llamo Zhang San, tengo 9 años y vivo en la urbanización Felicidad. Mi madre es profesora y mi padre es médico. Me gusta dibujar y cantar.
```

```text
Soy Xiaomei, tengo 8 años y vivo en Jardín de los Plátanos. Lo que más me gusta es bailar. Mi padre atrapa a los malos todos los días y mi madre me cuida en casa.
```

Podemos pedir al modelo que extraiga el nombre, la edad, el trabajo de los padres, la dirección y las aficiones.

En el caso de Zhang San, el original indica claramente las profesiones de sus padres. En el de Xiaomei, «atrapa a los malos todos los días» no demuestra de forma fiable que su padre sea policía, y «me cuida en casa» tampoco demuestra que la profesión de su madre sea ama de casa.

No debemos registrar una inferencia como un hecho solo porque una interpretación parezca razonable.

Por eso, un resultado más prudente debe dejar vacíos los campos que no se proporcionan de forma explícita:

```text
Nombre: Xiaomei
Edad: 8 años
Trabajo del padre: no proporcionado
Trabajo de la madre: no proporcionado
Dirección: Jardín de los Plátanos
Afición: bailar
```

Visto así, no parece haber ningún problema.

Pero debemos preguntarnos qué hacer si queremos introducir estos datos en el sistema de gestión de alumnos.

Si solo hay dos alumnos, podemos hacerlo a mano.

¿Y si hay 100?

El profesor acabaría agotado.

Así que escribimos un programa para importar en bloque los resultados extraídos por el modelo.

Aquí aparece un problema. El resultado anterior solo es texto dividido en varias líneas. Para obtener el nombre, el programa podría leer la primera; para obtener la edad, la segunda.

Ahora supongamos que añadimos un campo de «sexo»:

```text
Nombre: Xiaomei
Sexo: femenino
Edad: 8 años
Trabajo del padre: no proporcionado
Trabajo de la madre: no proporcionado
Dirección: Jardín de los Plátanos
Afición: bailar
```

La segunda línea antes contenía la edad y ahora contiene el sexo, así que el código podría fallar.

Alguien podría pensar: en lugar de usar el número de línea, ¿por qué no buscar directamente «Edad:»?

¿Y si también queremos añadir las edades del padre y de la madre?

```text
Nombre: Xiaomei
Edad: 8 años
Trabajo del padre: no proporcionado
Edad del padre: no proporcionada
Trabajo de la madre: no proporcionado
Edad de la madre: no proporcionada
Dirección: Jardín de los Plátanos
Afición: bailar
```

Los campos aumentan y la jerarquía se vuelve más compleja. Si seguimos dependiendo de números de línea y fragmentos de texto, mantener el programa será cada vez más difícil.

¿Cuál es la causa fundamental?

Estos datos no tienen una estructura estable y explícita.

## Representar la jerarquía con JSON

La misma información puede escribirse así:

```json
{
  "name": "小美",
  "age": 8,
  "father": {
    "job": null,
    "age": null
  },
  "mother": {
    "job": null,
    "age": null
  },
  "address": "梧桐花园",
  "hobby": ["跳舞"]
}
```

Ahora el programa puede leer directamente `name`, `age` o `father.job` sin adivinar en qué línea se encuentran.

JSON no es obligatorio para todas las tareas. Si el resultado solo está destinado a una persona, el texto normal o Markdown suelen ser más naturales. Los datos estructurados son especialmente valiosos cuando un programa debe continuar procesando el resultado.

## ¿Cómo pedir al modelo que produzca JSON?

```text
Extrae la información del alumno contenida en <student></student> y produce únicamente un objeto JSON.

Campos:
- name: cadena o null
- age: número o null
- father_job: cadena o null
- mother_job: cadena o null
- address: cadena o null
- hobby: array de cadenas

Reglas:
- Extrae solo la información proporcionada de forma explícita en el original.
- No deduzcas profesiones a partir de las descripciones.
- Escribe null para los valores únicos no proporcionados.
- No produzcas ningún texto explicativo fuera de JSON.

<student>
{{presentación del alumno}}
</student>
```

Lo más importante no son solo las palabras «devuelve JSON».

También hemos especificado los campos, los tipos, los valores ausentes y el límite de lo que no debe inferirse.

## Si el modelo dice «esto es JSON», ¿podemos usarlo sin más?

No necesariamente.

Puede añadir una explicación, omitir campos, usar un tipo incorrecto o generar JSON con una sintaxis inválida. Aunque la sintaxis sea correcta, el contenido puede incumplir las reglas del negocio.

Por eso, el programa debe comprobar al menos dos cosas más:

1. ¿Puede un JSON parser analizar la salida?
2. ¿Son correctos los campos, los tipos, los valores permitidos y las reglas del negocio?

Si la plataforma admite Structured Outputs (salidas estructuradas) o JSON Schema (esquemas JSON), conviene priorizar las restricciones estructurales que ofrece. Sin embargo, el alcance del soporte puede cambiar y siempre debe consultarse la documentación oficial de la interfaz utilizada.

> **Nota:** todos los datos de alumnos anteriores son ficticios. No envíes al modelo direcciones reales de menores, documentos de identidad, información médica ni otros datos sensibles para practicar.

JSON facilita que el resultado entre en un programa, pero la verdadera fiabilidad procede de definir bien los campos, no inventar valores desconocidos, validar mediante programas y hacer que una persona gestione las excepciones.

**Capítulo anterior:** [Plantillas y técnicas para estructurar prompts](/tutorials/prompt-engineering/structured-prompts/)

**Capítulo siguiente:** [Cómo aprovechar las etiquetas XML](/tutorials/prompt-engineering/xml-delimiters/)
