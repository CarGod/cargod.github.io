---
locale: es
title: "¿Cómo incorporar IA a los sistemas heredados de una empresa? Empieza por estas cuatro etapas"
seoTitle: "Cuatro etapas para llevar IA a sistemas heredados | Luffy Liu"
description: "Un marco en cuatro etapas—Chatbot, AI + Tools, Copilot y Agent—para evaluar los datos, las herramientas, los flujos de trabajo y la gobernanza que necesita una empresa."
slug: enterprise-ai-four-stages
contentKey: blog.enterprise-ai-four-stages
published: 2026-08-20
updated: 2026-08-30
tags:
  - id: ai
    label: IA
  - id: agent
    label: Agent
  - id: copilot
    label: Copilot
  - id: enterprise-digitalization
    label: transformación digital
  - id: ai-customer-service
    label: atención al cliente
translation_of: "/blog/enterprise-ai-four-stages/"
cover: "assets/cover-liu-lufei-original-v8.png"
cover_alt: "Cuatro etapas para incorporar IA a los sistemas heredados de una empresa"
media_base: "shared:enterprise-ai-four-stages"
draft: false
---

El modelo es solo una pequeña parte. ¿Se pueden usar los datos? ¿Son claras las interfaces? ¿Cómo se conectan los procesos? ¿Quién interviene cuando la IA se equivoca? Todas estas preguntas aparecen a la vez.

Después de terminar los tutoriales de gptpmt, pasé mucho tiempo ocupado con toda clase de cosas y hacía mucho que no me sentaba a escribir un artículo de forma sistemática.

Conocí ChatGPT en 2022, empecé a escribir gptpmt en 2023 y más tarde participé en proyectos empresariales de IA. Han pasado más de tres años. En ese tiempo he probado muchas cosas y he visto los problemas que afrontan numerosas empresas al llevar la IA a la práctica.

Últimamente, cada vez más amigos me preguntan lo mismo: si una empresa ya cuenta con muchos sistemas de negocio, ¿cómo debería conectarlos a la IA?

Parece una cuestión técnica: qué modelo elegir, qué framework usar y cómo llamar a las API.

Pero al empezar el trabajo se descubre que el modelo es solo una pequeña pieza. ¿Pueden utilizarse los datos internos? ¿Se entienden las interfaces existentes? ¿Cómo se conectan varios procesos de negocio? ¿Quién se ocupa del resultado cuando la IA se equivoca? Todo aparece al mismo tiempo.

Empecemos por una situación habitual de atención al cliente. Una persona abre el chat de soporte y pregunta:

> «¿Por qué todavía no han enviado mi pedido?»

La IA enumera muchas posibles causas de un retraso logístico y al final solicita el número de pedido. La persona se lo da, pero la IA sigue sin poder consultarlo y acaba transfiriendo la conversación a un agente humano.

La empresa ha dedicado mucho tiempo a crear atención al cliente con IA. La carga de trabajo no ha disminuido y el equipo tiene ahora una tarea adicional: explicar a la propia IA.

¿Por qué sucede?

El problema no tiene por qué estar en el modelo. Se ha asignado a un sistema que solo responde preguntas una tarea que exige consultar, decidir, ejecutar y asumir riesgos.

Es como discutir la decoración de la última planta antes de construir los cimientos. El problema no es solo que la obra avance despacio: a mitad del proyecto se descubre que la estructura inferior no puede sostenerla.

Integrar IA en sistemas heredados también exige completar capacidades capa por capa. Podemos pensar en cuatro etapas: **Chatbot** (una interfaz conversacional que responde preguntas), **AI + Tools** (IA conectada a capacidades concretas del negocio), **Copilot** (un asistente que encadena pasos hacia un objetivo y devuelve a las personas los casos inciertos) y **Agent** (un sistema que actúa de forma autónoma dentro de límites acordados).

No es un estándar del sector. Es un marco para revisar capacidades. Una empresa puede decidir no lanzar todas las versiones intermedias, pero no puede saltarse las capas subyacentes de datos, herramientas, tareas y gobernanza.

![Cuatro etapas para integrar IA en sistemas empresariales y las capacidades necesarias en cada una](/assets/blog/enterprise-ai-four-stages/diagram-01-four-stages-original-v6.png)

*Cuatro etapas, cuatro capas de capacidad.*

## Primera etapa: Chatbot—primero, responder bien

Simplifiquemos la pregunta.

En vez de preguntar por su propio pedido, la persona pregunta: «¿Cuánto tardan normalmente en enviar un producto después del pago?»

En este caso, la IA no necesita entrar en ningún sistema de negocio. Si la empresa ha organizado las reglas de envío, la política de devoluciones, la información de productos y las preguntas frecuentes, puede responder.

En esta etapa, el Chatbot responde preguntas generales basándose en el conocimiento de la empresa.

El horario, las descripciones de productos, las normas de gastos o las condiciones del servicio posventa suelen existir ya en documentos internos. Antes, cada empleado tenía que buscarlos; ahora puede preguntar con lenguaje natural y dejar que la IA encuentre el contenido relevante y organice una respuesta.

Parece que bastaría con cargar los documentos.

Sin embargo, cuando la pregunta trata de un pedido concreto, el Chatbot no sabe nada. Desconoce quién es la persona, qué pedidos tiene y en qué estado se encuentra el actual. Si continúa respondiendo, solo puede adivinar a partir de las reglas generales.

La primera etapa tiene, por tanto, un límite claro: puede responder preguntas cubiertas por el conocimiento de la empresa, pero no fingir que conoce hechos operativos en curso.

### De la etapa cero a la primera, la clave no es el modelo sino la gobernanza de datos

Muchas empresas empiezan entregando a la IA millones de palabras procedentes de documentos de Lark, manuales de producto y registros de soporte, convencidas de que más documentos producirán mejores respuestas.

Tener más documentos no equivale a disponer de conocimiento utilizable.

Imagina una cocina con decenas de botes de especias idénticos, sin etiquetas ni lugar fijo. Quien cocina sabe que allí debe de haber sal, azúcar, vinagre y pimienta, pero cuando necesita algo tiene que abrir cada bote y olerlo.

Los documentos empresariales suelen parecerse a esa cocina.

Una política de devolución puede existir en tres versiones. Un producto retirado puede conservar su antiguo guion de soporte. Una misma palabra puede significar cosas distintas en varios departamentos, y el nombre de un mismo proceso puede haber cambiado varias veces con los años.

Si a una persona le cuesta encontrar la respuesta, la IA también recuperará documentos equivocados.

El problema adicional es que la IA se expresa con fluidez. Si mezcla una norma antigua con otra nueva, una persona corriente quizá no detecte el error. Cuanto más se parece una respuesta incorrecta a una correcta, mayor es el riesgo.

La primera capacidad que hay que construir es la gobernanza de datos. Como mínimo, la empresa debe aclarar:

- qué contenido es correcto y cuál está obsoleto;
- cómo se clasifican los documentos y dónde debe buscarse cada tipo de pregunta;
- cómo se llama el mismo concepto en distintos sistemas y si hace falta un glosario común;
- qué puede ver cada perfil y cómo se separa la información sensible;
- quién mantiene el contenido y cuándo se retiran las versiones antiguas;
- qué se considera una respuesta correcta y cómo se detectarán los errores de forma continua.

La IA puede ayudar a clasificar, eliminar duplicados y organizar, pero la empresa debe definir la taxonomía, las responsabilidades y los criterios de aceptación.

La gobernanza de datos no es una limpieza puntual. Las reglas cambian, los productos se retiran y las organizaciones se reorganizan. Un contenido correcto hoy puede dejar de serlo dentro de seis meses. La base de conocimiento necesita un mecanismo de mantenimiento continuo o volverá rápidamente a su estado anterior.

Llegados aquí, el soporte no se limita a «conectar un gran modelo»: responde basándose en conocimiento empresarial vigente. Si no encuentra fundamentos, debe decir que no lo sabe en lugar de inventar una respuesta verosímil.

¿Cómo se sabe que la primera etapa está terminada? No mediante una demostración con preguntas preparadas. Hay que comprobar si el sistema sigue encontrando el fundamento correcto cuando usuarios reales reformulan, hacen preguntas sucesivas o llegan a los límites de permisos. Solo cuando esto sea estable tendrá sentido avanzar hacia los sistemas de negocio.

## Segunda etapa: AI + Tools—permitir que la IA consulte este pedido

En la segunda etapa, la pregunta empieza a referirse a un pedido concreto.

Para responder a la pregunta inicial, la IA debe llamar a una herramienta de consulta y obtener el pedido y su estado logístico. Solo después de comprobar que sigue en el almacén puede explicar la causa real.

Si la persona solicita una devolución, el sistema también tendrá que llamar a una herramienta de reembolso.

La IA ya no se limita a leer conocimiento empresarial: utiliza un sistema de negocio para hacer algo concreto. Esto es AI + Tools.

Las Tools son puntos de acceso a capacidades que la empresa ofrece a la IA. Consultar el pedido es una herramienta; obtener la logística, otra; calcular el importe del reembolso, otra; y enviarlo realmente, una herramienta distinta.

La IA interpreta lo que dice la persona, elige la herramienta adecuada y convierte los datos devueltos en un resultado comprensible.

Sigue pareciendo sencillo. Entonces aparecen los problemas.

Un sistema heredado puede contener más de una decena de API de reembolso. Algunas son versiones antiguas, otras solo devuelven cupones, otras exigen campos internos y algunas ni siquiera explican bien por qué han fallado.

Entregárselas todas a la IA y pedirle que adivine no vuelve inteligente al sistema. Solo hace visible una complejidad que antes estaba oculta.

Antes, estas interfaces las usaban desarrolladores que conocían el sistema. Sabían cuál funcionaba, cuál era un vestigio histórico y qué parámetro marcado como «opcional» fallaba en realidad si se omitía. La IA no posee ese conocimiento tácito; solo puede juzgar a partir de la descripción recibida.

Si los nombres son ambiguos, los parámetros están incompletos y los resultados no siguen una estructura común, incluso un modelo potente puede equivocarse.

### De la primera etapa a la segunda, la clave es la gobernanza de herramientas

La gobernanza de herramientas no consiste solo en envolver API antiguas. Exige responder de nuevo a cuestiones básicas:

- ¿Qué problema resuelve la herramienta y cuándo no debe usarse?
- ¿Qué parámetros son obligatorios y de dónde se obtienen?
- ¿Qué estructuras representan éxito, error y éxito parcial?
- ¿Qué roles pueden llamarla y qué datos pueden leer o modificar?
- ¿Cuántas veces pueden ejecutarse las consultas y qué modificaciones necesitan confirmación?
- ¿Cómo se evitan reembolsos o pedidos duplicados si llega dos veces la misma solicitud?
- ¿Puede rastrearse quién inició cada llamada, qué introdujo y cuál fue el resultado?

Una propiedad fácil de pasar por alto es la idempotencia.

Imaginemos que la herramienta de reembolso agota el tiempo de espera. La IA no sabe si la operación se completó y vuelve a llamarla. Sin protección contra duplicados, el mismo pedido podría reembolsarse dos veces.

No es una cuestión de inteligencia del modelo, sino de que la herramienta esté preparada para llamadas automatizadas.

Quienes mantienen el sistema deben poder explicar primero cómo funciona una herramienta y solo después entregarla a la IA. Cuantas menos herramientas y más clara su responsabilidad, más fácil será usarlas bien. Conviene reunir muchas interfaces históricas en unas pocas capacidades de negocio estables, en lugar de trasladar toda la complejidad al modelo.

En este punto hay que separar ejecutar una instrucción de completar una tarea.

Consultar un pedido, leer la logística e iniciar un reembolso son instrucciones explícitas. La persona indica un paso, la IA llama a una herramienta, obtiene el resultado y se detiene. Eso es AI + Tools.

Cuando solo se proporciona el objetivo final y el sistema debe decidir qué hacer primero, qué viene después y cómo resolver problemas intermedios, entramos en la siguiente etapa.

## Tercera etapa: Copilot—mantener la tarea en marcha

Añadamos una condición: consulta este pedido y, si todavía no se ha enviado, reembólsalo directamente.

Una llamada ya no basta. El sistema debe verificar a la persona y el pedido, consultar la logística, comprobar los requisitos, calcular el importe, iniciar el reembolso y comunicar el resultado.

AI + Tools se parece a una persona que indica un paso y una IA que ejecuta un paso. En Copilot, la persona proporciona un objetivo y la IA enlaza varios pasos a su alrededor. Cuando encuentra incertidumbre o un riesgo alto, se detiene y devuelve el trabajo a una persona.

La IA repite un ciclo: entender el objetivo actual, elegir el siguiente paso, llamar a una herramienta, leer el resultado y decidir lo que sigue con la nueva información.

Si el pedido ya salió, no debe seguir el flujo de devolución para pedidos no enviados. Si la herramienta devuelve un importe anómalo, debe detenerse. Si no se verificó la identidad, no debe cambiar el pedido. El resultado de cada paso modifica el siguiente.

Esto forma un circuito cerrado de tarea.

La diferencia entre la segunda y la tercera etapa no está en llamar a varias herramientas a la vez ni simplemente en pasar de lectura a escritura. Está en que el sistema siga avanzando hacia un objetivo hasta completar la tarea, fallar o requerir intervención humana.

Cuando las herramientas se conectan, aparecen nuevos problemas.

### Primer problema: gobernanza de intenciones

La dificultad no suele ser llamar a una herramienta concreta, sino entrar desde el principio en el proceso equivocado.

Supongamos que el seguimiento no se actualiza durante tres días y la persona pide a la vez presentar una reclamación y recibir un reembolso.

La petición contiene una anomalía logística, una reclamación y un reembolso. Si el sistema reconoce solo la reclamación, quizá se limite a tranquilizar sin gestionar la devolución. Si reembolsa directamente, puede omitir el estado del pedido y las condiciones aplicables.

Debe identificar primero el dominio de negocio, dividir una expresión ambigua en intenciones ejecutables y decidir su orden.

¿Por qué no construir un enorme clasificador para que la IA elija entre cientos de opciones?

Las operaciones reales son mucho más complejas que una demostración. «Cámbialo» puede significar modificar una dirección en pedidos, cambiar una reserva en viajes o actualizar datos de un empleado en recursos humanos. A medida que crece el negocio, situar todas las intenciones al mismo nivel vuelve caótica la clasificación.

Es mejor usar un enrutamiento jerárquico.

El primer nivel distingue pedidos, logística, posventa o cuentas. Dentro de pedidos, el siguiente distingue consulta, modificación, cancelación o reembolso. Si una frase contiene varias intenciones, hay que separarlas y ordenarlas por dependencias.

Un caso de transporte lo muestra con claridad. «Llévame al aeropuerto mañana por la mañana» requiere conocer el punto de partida, la hora del vuelo y el margen de llegada. Si se añade «reserva otro coche para quien viaja conmigo», aparece una segunda persona, otro origen y quizá otra clase de vehículo. Introducirlo todo en una intención simple de «pedir coche» mezcla fácilmente los procesos posteriores.

Gobernar intenciones no es poner una etiqueta a una frase. Es concretar gradualmente lo que la persona quiere conseguir hasta convertirlo en una tarea que el sistema pueda ejecutar.

![Una petición se concreta por dominio e intención hasta llegar al flujo de pedidos correcto](/assets/blog/enterprise-ai-four-stages/diagram-02-intent-tree-original-v6.png)

*De una frase a una tarea ejecutable.*

### Segundo problema: gestión del estado

Añadamos otro cambio.

El sistema ya consultó el pedido y está a punto de enviar el reembolso cuando la persona cambia de idea: que no reembolse todavía; que modifique la dirección de entrega.

No sería razonable continuar a ciegas ni descartar todo lo anterior. El sistema debe interrumpir el proceso, conservar la información ya obtenida y evaluar si aún es posible cambiar la dirección.

Esto requiere gestión del estado. El sistema debe saber tanto qué se ha hablado como en qué punto está la tarea, qué herramientas se han ejecutado y qué operaciones pueden deshacerse. Si el reembolso ya se envió, debe entrar en un flujo de cancelación o compensación, no fingir que nada ocurrió.

Hay al menos dos contextos. El contexto conversacional determina a qué pedido se refiere «este pedido» y qué se confirmó. El contexto de tarea registra el paso actual del reembolso, qué herramienta funcionó y qué acción espera confirmación.

Guardar solo el chat no basta. Puede decir «preparando reembolso», pero el sistema necesita saber si la orden se envió. Guardar solo el estado de herramientas tampoco basta: un simple «mejor déjalo» cambia el objetivo.

Un Copilot debe manejar varios cambios:

- los resultados ya obtenidos siguen disponibles después de una interrupción;
- el proceso se reanuda en el punto correcto cuando llega información adicional;
- las intenciones dependientes se ejecutan en el orden adecuado;
- una operación con efectos secundarios puede revertirse o compensarse si falla;
- si faltan capacidades o datos, o el riesgo es excesivo, la tarea se transfiere a una persona con todo el contexto.

La gobernanza de intenciones decide si se tomó el camino correcto. La gestión del estado evita perderse cuando cambia la tarea.

Solo entonces la IA participa realmente en un proceso de negocio, en lugar de ser un chat alrededor de varias herramientas.

## Cuarta etapa: Agent—¿quién asume el resultado dentro de los límites?

En la etapa Copilot, la IA ya comprende objetivos, organiza pasos y llama a herramientas de forma continuada. ¿Qué falta para ser un Agent?

Responsabilidad.

Supongamos que un sistema de soporte puede reembolsar. Un pedido solo admite 50 yuanes, pero una persona logra inducir al sistema a devolver 5.000. ¿Quién asume el resultado?

Si el personal sigue revisando cada caso y, cuando falla, se dice que «la persona que revisaba no lo vio», el sistema sigue siendo un Copilot. La IA ejecuta y una persona mantiene el pie sobre el freno.

Agent implica otro compromiso: dentro de límites operativos acordados, el personal no tiene que revisar cada caso. Si una decisión autónoma sale mal, el equipo que entrega el Agent responde por el resultado dentro del ámbito convenido.

Esto no significa que un Agent ofrezca garantías ilimitadas.

Los niveles L2 y L3 de automatización de la conducción ayudan a entender el cambio. L2 sigue exigiendo vigilancia continua del conductor. L3 asigna más tareas al sistema bajo condiciones limitadas y conserva requisitos de toma de control. La analogía solo ilustra un cambio de tareas y supervisión; no permite deducir responsabilidades legales en un accidente concreto.

La responsabilidad real depende de la ley local, los compromisos del producto, las condiciones de operación y los hechos. Con un Agent ocurre lo mismo: hay que escribir los límites por adelantado y, fuera de ellos, rechazar, degradar de forma segura o transferir a una persona.

Por ejemplo, un Agent de reembolsos puede atender solo solicitudes ordinarias de hasta 200 yuanes, con un estado de pedido inequívoco e identidad verificada. Si supera el importe, detecta una cuenta anómala o las reglas entran en conflicto, deriva el caso inmediatamente.

Dentro del límite puede terminar por sí mismo. Fuera no debe seguir adivinando solo para mejorar su tasa de finalización.

### De Copilot a Agent, la clave es la supervisión sistemática

Cuando las personas dejan de revisar cada caso, la supervisión no desaparece. Pasa de «una persona observa cada paso» a «el sistema contiene automáticamente el riesgo».

![Copilot depende de confirmación humana; Agent opera con barreras del sistema dentro de límites acordados](/assets/blog/enterprise-ai-four-stages/diagram-03-governance-original-v6.png)

*Operación desatendida no significa operación sin control.*

Como mínimo, el sistema debe controlar:

- **Permisos:** a qué sistemas accede, qué datos lee y qué puede modificar.
- **Presupuesto:** máximo de llamadas, recursos e importe por tarea.
- **Monitorización:** qué hace ahora, si se desvía y si detecta anomalías a tiempo.
- **Control de riesgos:** reglas que nunca pueden eludirse y casos que exigen verificar de nuevo la identidad.
- **Interrupción automática:** si se detiene de inmediato ante fallos repetidos, costes anómalos o pérdida de control.
- **Reversión y compensación:** cómo volver a un estado seguro cuando una operación queda a medias.
- **Auditoría y evaluación:** si cada decisión es trazable y los casos extremos se prueban de forma repetida.
- **Responsabilidad:** quién responde, repara y asume el resultado dentro del alcance acordado.

La dificultad está en convertir las decisiones que antes vivían en la experiencia del personal en reglas ejecutables.

Un agente de soporte puede ver un reembolso y sentir que «algo no cuadra». Un Agent no comparte ese entendimiento tácito. La empresa debe concretar si la anomalía está en el importe, la frecuencia, la cuenta o la contradicción entre el estado y el motivo. ¿Qué se rechaza, qué exige una segunda confirmación y qué pasa a una persona?

La supervisión sistemática existe de verdad solo cuando esa experiencia se vuelve explícita.

La evaluación tampoco puede limitarse a la precisión media. Aunque gestione bien los pedidos normales, un sistema que permite saltarse permisos con entradas extremas o sigue llamando herramientas tras varios fallos no puede operar sin atención.

Un Agent fiable necesita más que un buen modelo: un ámbito operativo claro, monitorización continua, toma de control humana, respuesta a incidentes y recuperación.

En este marco, Agent no es un nombre más moderno para Copilot. Es un compromiso de responsabilidad sobre resultados autónomos dentro de límites definidos.

## ¿Por dónde debe empezar una empresa?

No empieces preguntando «¿cómo construimos un Agent?». Observa qué le falta al sistema actual.

![Evaluación de capacidades en las capas de conocimiento, herramientas, flujos y gobernanza](/assets/blog/enterprise-ai-four-stages/diagram-04-upgrade-checklist-original-v6.png)

*Encuentra la capa más débil y empieza allí.*

Si el conocimiento es inexacto, organiza primero los datos y no dejes que la IA intente responderlo todo.

Si el Chatbot ya responde bien, convierte las interfaces antiguas y desordenadas en herramientas claras, seguras y trazables.

Si las herramientas funcionan, añade gobernanza de intenciones y gestión del estado para mantener el sistema en el flujo correcto.

Si el Copilot completa tareas de varios pasos de forma estable, convierte las reglas útiles de la supervisión humana en permisos, controles de riesgo, interrupciones, auditorías y responsabilidades ejecutables.

Las cuatro capas pueden traducirse en acciones concretas.

### Primera capa: organizar primero el conocimiento

Elige un escenario acotado con preguntas concentradas. No cargues desde el principio todos los documentos de la empresa. Confirma las fuentes, la clasificación, los permisos y el responsable; después prueba repetidamente con preguntas reales.

### Segunda capa: organizar las herramientas

Empieza por herramientas de consulta y estabiliza sus entradas y resultados. Para las que modifican datos, prioriza permisos, confirmación, idempotencia y auditoría antes de que ocurran errores.

### Tercera capa: crear un circuito cerrado de tarea

Elige un proceso con pocos pasos y un resultado fácil de comprobar. Valida la división de intenciones, el estado, la interrupción y reanudación, y la transferencia humana. Un flujo completo y estable vale más que diez a medio hacer.

### Cuarta capa: ampliar poco a poco el límite autónomo

Escribe qué tareas pueden ejecutarse sin atención y configura para ese ámbito presupuestos, monitorización, riesgos, interrupciones, compensaciones y responsables. Amplía el límite tras comprobar la estabilidad, en lugar de intentar automatizarlo todo desde el principio.

Una versión intermedia puede no lanzarse oficialmente, pero no se pueden omitir las capacidades y las pruebas que representa.

Tampoco todas las empresas necesitan llegar al final. Para algunos casos basta un Chatbot; en operaciones de alto riesgo puede ser mejor conservar la confirmación humana a largo plazo.

## Para terminar

Chatbot, AI + Tools, Copilot y Agent no forman un estándar obligatorio ni significan que solo haya éxito al llegar a la cuarta etapa.

El marco busca responder una pregunta más práctica: cuando un proyecto de IA se atasca, ¿podemos ver qué falta realmente?

Si las respuestas son imprecisas, revisa conocimiento y datos. Si se eligen mal las herramientas, revisa interfaces y permisos. Si el flujo no termina, revisa intención y estado. Si no se confía en la autonomía, revisa supervisión y responsabilidad.

Cada paso revela un problema de la capa siguiente que antes ocultaban las personas. Las reglas recordadas por experiencia se convierten en problemas de datos; las API usadas con conocimiento tácito, en problemas de herramientas; las excepciones vigiladas por el personal, en problemas de gobernanza.

Conectar un modelo más potente no hace que desaparezcan.

Todos seguimos explorando y los límites de muchos conceptos continuarán cambiando. En vez de apresurarse a demostrar que ya se ha construido un Agent, conviene elegir un caso real y conseguir que el sistema responda bien una pregunta, use bien una herramienta y complete de forma estable un flujo.

La práctica mostrará qué falta después.

Identifica la capa actual y constrúyela de verdad. Así, incorporar IA a un sistema heredado no se limitará a añadir otro chat que parece inteligente.

## Referencias

- NHTSA, [Automated Vehicle Safety](https://www.nhtsa.gov/vehicle-safety/automated-vehicle-safety); SAE, [J3016 Levels of Driving Automation](https://www.sae.org/binaries/content/assets/cm/content/blog/sae-j3016-visual-chart_5.3.21.pdf).
- NIST, [AI Risk Management Framework Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/).
- Anthropic, [Building Effective AI Agents](https://www.anthropic.com/engineering/building-effective-agents).

## Cuenta oficial de WeChat

Si también te interesan la IA empresarial, los Agents y su aplicación en operaciones reales, puedes seguir la cuenta oficial de WeChat «刘路飞». Seguiré escribiendo sobre estas cuestiones.

![Yunzhou, personaje original de la cuenta de WeChat 刘路飞](/assets/blog/enterprise-ai-four-stages/mascot-yunzhou-avatar-v4.png)

**Luffy Liu · 刘路飞** es creador independiente de productos y escribe sobre IA empresarial, Agents y flujos de trabajo reales.

## Seguir leyendo

[Guía de ingeniería de prompts](/tutorials/prompt-engineering/)
