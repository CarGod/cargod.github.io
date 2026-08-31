---
locale: "es"
title: "Plantillas y técnicas para estructurar prompts"
seoTitle: "Plantilla de Prompt estructurado: evita omisiones | Luffy Liu"
description: "A partir de situaciones cotidianas como escribir una carta o comprar empanadas de carne, aprende a organizar prompts complejos con rol, acción, límites, formato y ejemplos."
slug: "structured-prompts"
contentKey: "tutorial.prompt-engineering.structured-prompts"
translation_of: "/tutorials/prompt-engineering/structured-prompts/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 6
tags:
  - id: "prompt-engineering"
    label: "ingeniería de prompts"
  - id: "structured-prompts"
    label: "prompts estructurados"
draft: false
---

## Sin reglas no hay orden

Antes de empezar formalmente, ¿recuerdas cuando en primaria el profesor nos pedía a menudo que escribiéramos una carta a «Li Ming»?

Normalmente había que empezar con «Hola» y a veces terminar con fórmulas como «Atentamente». En los exámenes, sobre todo, se descontaban puntos si faltaba un elemento.

En aquel momento siempre me preguntaba por qué tenía que ser tan complicado. ¿No bastaba con escribir lo que queríamos decir, como en una nota breve?

Cuando empecé a trabajar, tuve que escribir correos con frecuencia. Al principio no seguía un formato fijo, pero después descubrí que, con las prisas, era fácil olvidar algo.

A veces omitía mi nombre; otras, la fecha; y en ocasiones olvidaba decir a la otra persona qué debía hacer a continuación.

Poco a poco volví a revisar los correos en un orden fijo, como cuando era pequeño. Incluso con mucho trabajo, era menos probable que olvidara información importante.

Lo mismo sucede en muchos sectores. El personal de enfermería, la tripulación de cabina y quienes manejan equipos revisan una y otra vez listas de comprobación. Si la tarea parece tan simple, ¿por qué lo hacen?

Porque las personas siempre podemos olvidar algo. Un proceso fijo no garantiza que nunca haya errores, pero sí puede reducir las omisiones.

Lo mismo ocurre al escribir prompts.

¿Podemos preparar una plantilla de referencia y recorrerla cuando la tarea sea compleja?

Sí.

Pero es una herramienta para reducir omisiones, no «la mejor fórmula» para todos los modelos y todas las tareas.

## ¿Qué debe contener un buen Prompt?

¿Debemos incluir toda la información y dar todos los detalles posibles?

Por supuesto que no.

En la comedia china *Wulin Waizhuan (My Own Swordsman)*, el agente Yan Xiaoliu suele disparar una retahíla de preguntas: «¿Cuál es tu apellido? ¿Y tu nombre? ¿De dónde vienes? ¿Adónde vas? ¿Cuántas personas hay en tu familia? ¿Cuánta tierra toca por persona? ¿Cuántas reses hay en el campo?»

Suena muy concreto, pero buena parte de esa información no tiene relación con el asunto que se intenta resolver. Demasiada información también puede convertirse en una distracción.

Con muy poca información, el modelo solo puede adivinar. Un exceso de información irrelevante también genera interferencias.

Veamos una situación real: **pedir a Zhang San que compre dos empanadas de carne de vacuno**.

## Comprar dos empanadas de carne

Supongamos que el requisito completo es:

```text
Pide a Zhang San que vaya ahora a la tienda Lawson de la planta baja y compre dos empanadas de carne de vacuno, a 7 yuanes cada una.
Debe calentarlas, poner cada una en su propia bolsa de papel y regresar en menos de 20 minutos.
```

¿Qué información importante contiene?

Primero, ¿quién debe hacer la compra? Hace falta una persona concreta. Si en medio de un grupo solo decimos «cómprame dos empanadas de carne», Zhang San no sabrá si nos dirigimos a él. Este es el **rol o destinatario**.

¿Adónde debe ir y cuándo? De lo contrario, Zhang San podría comprarlas mañana o ir a otra tienda. Este es el **momento y lugar de la acción**.

¿Qué debe comprar, cuántas unidades y a qué precio? Esta es la **tarea y sus límites**.

¿Hay que calentarlas? Esta es una **operación concreta**.

¿Cómo deben empaquetarse? Este es el **formato de entrega**.

¿Cuánto puede tardar en volver? Esta es otra **restricción**.

Supongamos que solo decimos a Zhang San: «Ve a comprarme algo».

¿Conseguirá traer exactamente las dos empanadas de carne que imaginábamos?

No es imposible. Si no olvida ni un detalle, es que Zhang San nos conoce muy bien.

Pero la mayoría de las veces tendrá que preguntar o adivinar.

Si esto les ocurre a las personas, ¿qué pasará con la IA?

Si queremos que el modelo escriba una novela, pero solo decimos «escríbeme una novela», es poco probable que el contenido coincida exactamente con lo que imaginábamos.

## Una estructura de referencia

En un Prompt complejo podemos elegir los elementos necesarios entre los siguientes:

### Role (rol)

Indica desde qué punto de vista quieres que trabaje el modelo o a quién va dirigido el resultado.

El rol no otorga al modelo una cualificación profesional real ni «bloquea» sus conocimientos de otros campos. Lo útil son los criterios concretos que hay detrás, como «busca riesgos como lo haría alguien que revisa código», no «eres el mejor ingeniero del mundo».

### Skills (capacidades necesarias)

Enumera las capacidades necesarias para la tarea, como resumir, clasificar, traducir o explicar código.

Esto no instala nuevas capacidades en el modelo; solo ayuda a dirigir su atención hacia el tipo de procesamiento que exige la tarea. Muchas tareas sencillas pueden omitir este elemento.

### Action (acción)

Indica directamente qué debe completar el modelo.

Por ejemplo: extraer tareas de un acta, buscar errores en el código o preparar el esquema de una historia a partir de un tema.

### Constraints (restricciones)

Indica qué no debe hacer, cómo actuar cuando falte información y qué límites hay en cuanto a longitud, idioma, seguridad y hechos.

Por ejemplo: no añadir información ausente en el original; escribir «no proporcionado» si algo se desconoce; responder en español.

### Format (formato)

Especifica si quieres Markdown, una tabla, JSON o campos fijos.

### Example (ejemplo)

Cuando la regla sea abstracta, incluye un ejemplo de entrada y salida que ayude al modelo a entender la correspondencia.

## Incorporar la estructura en un Prompt

```text
# Role
Editor de historias de ciencia ficción

## Action
A partir del tema proporcionado por el usuario, ofrece los perfiles de los personajes, el conflicto de la historia y un esquema en tres actos.

## Constraints
- No utilices personajes famosos ni tramas de obras existentes.
- Si falta información, enumera primero las preguntas que deben aclararse; no completes los huecos por tu cuenta.
- El mundo puede ser ficticio, pero sus reglas internas deben ser coherentes de principio a fin.

## Format
Usa Markdown y divide la salida en cuatro partes: «Personajes, conflicto, esquema y preguntas pendientes».

## Example
Personaje: un ingeniero encargado de reparar rutas interestelares.
Conflicto: una operación de mantenimiento revela la historia que dos civilizaciones habían ocultado.
```

Esta plantilla no es una respuesta estándar que debas copiar de manera obligatoria.

Si solo quieres mejorar la fluidez de una frase, no hace falta escribir las seis partes. La estructura gana valor cuando la tarea incluye materiales largos, colaboración entre varias personas o procesamiento posterior mediante programas.

Para una tarea sencilla, escribe algo sencillo.

Para una tarea compleja, usa la plantilla para comprobar si falta algo.

**Capítulo anterior:** [Seis técnicas para obtener buenos resultados](/tutorials/prompt-engineering/clear-instructions/)

**Capítulo siguiente:** [Hacer que el modelo produzca datos JSON](/tutorials/prompt-engineering/json-output/)
