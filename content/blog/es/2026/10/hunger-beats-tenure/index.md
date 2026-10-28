---
locale: "es"
title: "Las ganas de avanzar pesan más que la antigüedad: consejos para ingenieros júnior"
seoTitle: "Ganas frente a antigüedad: consejos para ingenieros júnior"
description: "Felix Rieseberg explica cómo una mirada nueva y los prototipos con IA pueden crear valor de negocio. Traducción íntegra de su artículo."
slug: "hunger-beats-tenure"
contentKey: "blog.hunger-beats-tenure"
translation_of: "/blog/hunger-beats-tenure/"
published: "2026-10-28"
updated: "2026-10-28"
tags: [{"id":"ai","label":"IA"},{"id":"software-engineering","label":"Ingeniería de software"}]
original_author: {"name":"Felix Rieseberg","url":"https://felixrieseberg.com/"}
source_url: "https://felixrieseberg.com/hunger-beats-tenure-advice-for-junior-engineers/"
cover: "assets/cover-hunger-beats-tenure-v1.webp"
cover_alt: "Una figura de palitos sostiene un boceto de un arco junto a un portátil que muestra su forma sólida"
media_base: "shared:hunger-beats-tenure"
draft: false
---

Esta es la traducción al español del artículo de Felix Rieseberg. La voz en primera persona corresponde al autor original.

Este mes di por terminada la entrevista tradicional de programación. Como responsable de contratación en Anthropic, dejé de pedir a los candidatos que la hicieran. Tuvo una buena trayectoria: ser capaz de definir problemas con rapidez y encontrar soluciones elegantes era un indicador débil, pero útil, de lo bien que te iría en mis equipos. Los pequeños retos de programación con código real sí nos decían algo significativo sobre los candidatos.

Eso ya no es así. Proponerte un pequeño reto de React tiene tan poco sentido como examinar a alguien de ensamblador; ahora Claude es mejor en ambas cosas. Quienes construyen los productos de mayor impacto en nuestros equipos tienen éxito independientemente de lo bien que se les den estas pruebas.

La entrevista de programación, pese a estar en todas partes, nunca fue popular. Sospecho que los ingenieros consolidados seguirán reaccionando con fuerza a su desaparición, aunque solo sea por lo que dice sobre la evolución de nuestras funciones. Se ha escrito muchísimo sobre cómo la IA supone un reto para los desarrolladores júnior, especialmente para quienes intentan conseguir un empleo. Ahora que he observado durante un tiempo cómo trabajan con IA los compañeros júnior, tengo una visión más esperanzadora: el impacto está menos limitado por los años de conocimientos que hayas acumulado sobre frameworks y bibliotecas.

Estoy viendo a ingenieros relativamente nuevos adelantar a toda velocidad a personas que probablemente programan mejor y llevan mucho más tiempo en esto. Las ganas de avanzar pesan más que la antigüedad.

Este artículo reúne mis mejores consejos para los ingenieros júnior, aunque «júnior» no es la palabra adecuada. En realidad, está dirigido a ingenieros sin capital social, estatus ni poder.

## Mucha visión, ninguna voz

Primero, conoce tanto tu ventaja como tu desventaja.

Desde hace mucho se considera valiosa una mirada nueva, incluso ingenua. Cuando entré en Stripe, su fundador Patrick Collison nos pidió encarecidamente a los recién llegados que prestáramos mucha atención a lo que nos resultara extraño. Apostaba a que los nuevos detectarían fricciones y oportunidades que los veteranos habían dejado de percibir hacía tiempo.

En 1991, James March [escribió](https://doi.org/10.1287/orsc.2.1.71?ref=felixrieseberg.com) que las organizaciones dependen de «mantener una afluencia de personas ingenuas e ignorantes». Cuando le preguntaron a Orson Welles de dónde sacaba la confianza para intentar planos que nadie había probado, [dijo](https://www.themarginalian.org/2012/04/30/orson-welles-on-ignorance-1960/?ref=felixrieseberg.com): «Ignorancia, pura ignorancia; no hay una confianza que se le iguale. Creo que solo cuando sabes algo de una profesión te vuelves tímido o cauteloso».

Cuando entré en Notion, una de mis entrevistas consistía en diseñar una arquitectura para un modo sin conexión. Me desconcertó saber que la consideraban una entrevista «con trampa», porque daban por imposible ese modo. El modelo de datos era demasiado complejo para sincronizar fácilmente un espacio de trabajo entero de Notion, y descargar páginas individuales suponía una experiencia de usuario que su CEO, Ivan Zhao, nunca permitiría. La complejidad del modelo de datos resultó ser cierta; la oposición del fundador, no. La gente lo daba por tan sabido que nadie lo había comprobado. Yo, un recién llegado ignorante, no sabía hacer otra cosa que preguntar.

Es fácil leer anécdotas como esta y ver a gente tomando malas decisiones. No puedo exagerar lo difícil que es detectar esos errores cuando quien los comete eres tú. Poco después de entrar en Notion, quise equipar a los equipos con grandes televisores para mostrar paneles de datos en directo. Me topé con barreras organizativas, fracasé y no me importó lo suficiente como para librar toda una batalla.

Un año después, [Ji Pei](https://www.linkedin.com/in/ji-pei?ref=felixrieseberg.com) se incorporó con la misma idea. Me burlé y le dije que no se molestara; yo ya lo había intentado. Él ya lo había preguntado. Los televisores llegaron al día siguiente. En algún momento de aquel año, me había convertido en el veterano.

El único problema de todo ese poder de la ignorancia es que a nadie le importa lo que pienses. La mayoría de las empresas tecnológicas tienen capas de mandos intermedios que convierten grandes objetivos de negocio en ejecución. Estructuralmente, las empresas suelen organizarse en torno a la idea de que unas pocas personas aprueben o bloqueen cada propuesta. En un mundo donde ejecutar es caro, normalmente tienes que esforzarte hasta alcanzar cierta posición social antes de que toda la organización esté dispuesta a «apostar» por tu idea. Los organigramas suelen cambiar a un ritmo glacial, de modo que incluso las empresas que creen en la IA suelen esperar que los júnior simplemente terminen sus tareas más deprisa, en vez de perseguir con ambición los objetivos del negocio.

Pues bien, buenas noticias: ejecutar ya no es caro.

![Dos figuras miran de frente unos bloques oscuros mientras otra cambia de perspectiva para ver el paso entre ellos](assets/inline-01-fresh-perspective-v1.webp)

## Qué hacer

(1) Prioriza el impacto en el negocio frente a la lista de tareas pendientes: en 2011, antes de la programación con IA, Patrick McKenzie [escribió](https://www.kalzumeus.com/2011/10/28/dont-call-yourself-a-programmer/?ref=felixrieseberg.com) que [«se contrata a los ingenieros para crear valor de negocio, no para programar cosas»](https://www.kalzumeus.com/2011/10/28/dont-call-yourself-a-programmer/?ref=felixrieseberg.com). Aconsejaba vincularse a las partes de la empresa que generan ingresos. Empieza por ahí: entiende qué intenta conseguir realmente tu empresa o, si es grande, tu grupo o departamento. Después, encuentra el nivel adecuado: entender los objetivos del superior de tu responsable suele ser una referencia útil.

(2) Elige una idea radical: piensa en varias ideas que, si tuvieran éxito, aumentarían drásticamente las posibilidades de que tu organización alcanzara esos objetivos. ¡Sé ambicioso!

(3) Constrúyela en un fin de semana: he visto a pequeños grupos e ingenieros que trabajan solos saltarse a toda velocidad el proceso habitual de redactar documentos de requisitos de producto (PRD), conseguir apoyos y negociar tiempo con diseñadores o responsables de producto, simplemente construyendo un prototipo que funciona.

(4) Céntrate en una buena idea: en mi experiencia, los júnior suelen cometer el error de amontonar varias ideas en un solo prototipo, escondiendo tres ideas excelentes entre veinte malas. Si tu prototipo implica crear un lenguaje de programación nuevo, un backend y, de algún modo, también aplicaciones móviles, no vas a tener éxito. El objetivo de crear un prototipo funcional es comunicar tan bien una idea que la dirección entienda rápidamente tanto la oportunidad como que tú eres la persona capaz de llevarla adelante.

(5) Aprovecha tu mirada nueva: si trabajas en algo orientado al usuario, tienes una capacidad singular de empatizar con él y, por tanto, una percepción mucho mejor de cómo le funciona el producto o dónde le falla. A mis compañeros de Slack y Notion les costaba interiorizar cómo era utilizar Slack o Notion desde fuera de la empresa.

Si trabajas en infraestructura o herramientas, tienes la ventaja de no haber aprendido nunca todas las razones por las que se consideran «imposibles» ciertas cosas.

![Un prototipo de fin de semana centrado en una idea conecta un objetivo de negocio con una demostración que funciona](assets/inline-02-weekend-prototype-v1.webp)

## El futuro es prometedor

No creo que la entrevista de programación vaya a volver. Es fácil ponerse sentimental al pensar en cuántos ejemplares de «Algoritmos y estructuras de datos» se compraron con la esperanza de abrir la puerta a buenos empleos y un futuro mejor, o en cómo la muerte de la entrevista de programación marca otro hito en el ascenso de la ingeniería de software a un nuevo nivel de abstracción.

Al mismo tiempo, como alguien que lleva años detestando los ascensos por antigüedad, no puedo evitar ser optimista. Ya he visto bastantes aplicaciones y productos populares creados de esta manera.

En Anthropic, la gente se había acostumbrado tanto a utilizar Claude Code mediante una interfaz de línea de comandos (CLI) que tuvieron que llegar dos ingenieros relativamente nuevos, [Anthony Morris](https://x.com/amorriscode?ref=felixrieseberg.com) y [Alice Zhao](https://x.com/alicelovescake1?ref=felixrieseberg.com), para preparar un prototipo funcional durante un fin de semana. La primera versión pública salió aproximadamente ocho días después. No te sorprenderá saber que una buena interfaz gráfica para Claude Code es un producto muy popular.

Probablemente no soy el único responsable que intenta averiguar cómo entrevistar a personas que construyen bien con IA. Aún no he dado del todo con la fórmula, pero estoy buscando en currículums y portafolios pequeños prototipos que demuestren buen criterio, empatía y una forma de pensar basada en principios. Si has encontrado algo mejor, me encantaría saber cómo.

## Autor original y republicación

Autor original: **Felix Rieseberg**. Artículo original: [Hunger beats tenure: Advice for junior engineers](https://felixrieseberg.com/hunger-beats-tenure-advice-for-junior-engineers/), publicado el **27 de octubre de 2026**.

Esta traducción íntegra al español se publicó en este sitio el **28 de octubre de 2026**. Las experiencias, opiniones y afirmaciones en primera persona pertenecen al autor original; este sitio se ha encargado de la traducción y la maquetación.

Las ilustraciones de este sitio se prepararon para esta republicación.
