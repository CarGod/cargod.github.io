---
locale: "en"
title: "Six Ways to Get Better Output"
seoTitle: "Six Practical Ways to Write a Clear Prompt | Luffy Liu"
description: "Use clear instructions, roles and style, delimiters, steps, examples, and output length to make the model guess less."
slug: "clear-instructions"
contentKey: "tutorial.prompt-engineering.clear-instructions"
translation_of: "/tutorials/prompt-engineering/clear-instructions/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 5
tags:
  - id: "prompt-engineering"
    label: "Prompt Engineering"
  - id: "prompt-writing"
    label: "Prompt Writing"
draft: false
---

## It Cannot Read Your Mind

Large language models are powerful. Unfortunately, they cannot read our minds.

When we want something, we need to say it as clearly as we can instead of asking the model to guess what we have in mind.

**The less it has to guess, the more likely the result is to match what we need.**

Here are six simple and often useful ways to do that.

## 1. Write Clear Instructions

To get the response we want, we need to provide the details and context that truly matter. Otherwise, the model can only guess.

| Vague | Clearer |
| --- | --- |
| How do I add numbers in Excel? | How do I add a row of dollar amounts in Excel and automatically put the result in the “Total” column on the right? |
| Who was the president? | Who was the president of the United States in 2021? How often are US presidential elections normally held? |
| Write a Fibonacci method | Write a Python method that calculates the Fibonacci sequence, with comments explaining what each part does. |
| Write and summarize meeting notes | Write a fictional meeting transcript, then use Markdown to list the speakers, key points, and explicitly stated action items. |

A Prompt is not better simply because it is longer. What matters is whether the information that can change the result has been stated clearly.

## 2. Specify the Style, Audience, and Role

If we want a particular tone, we can say so directly.

### Specify the Style

```text
Whenever I ask you to write something, include at least one joke or playful line in every paragraph.

Write a thank-you letter to my classmate Zhang San. Thank him for introducing me to the job I successfully found.
```

The same thank-you letter will feel completely different as a formal memo or as a relaxed chat. Instead of waiting for the model to guess, state the style we want.

Of course, “one joke in every paragraph” is deliberately vivid for the demonstration. In a real task, we might instead write, “Keep it sincere and natural, without exaggerated praise.”

### Specify the Role

If the task needs a particular point of view, we can specify a role:

```text
You are a university professor of Chinese literature. Answer from the perspective of a literature class.

Explain the emotional change and idea that Li Bai expresses in the line, “Heaven has made us talents; we're not made in vain. A thousand gold coins spent, more will turn up again.”
```

### Combine the Role and the Audience

What if we want a ten-year-old child to understand the same topic?

```text
You are a Nobel Prize-winning astrophysicist. Answer from the perspective of popular astrophysics.
The answer is for ten-year-old children, so make it understandable and full of imagination.

Explain how black holes form and what their characteristics are.
```

Now the viewpoint, target reader, and style are all explicit. That gives the model three more layers of information than “Explain black holes.”

A role description helps the model understand the viewpoint, audience, and standard. It does not grant the model a real title, nor does it prove that the answer is professional.

Instead of saying, “You are the greatest expert in the world,” write down the judgment criteria that actually matter.

## 3. Separate Different Parts with Delimiters

When a Prompt contains task instructions, source material, and an output format, use triple quotes, Markdown headings, or XML tags to keep those parts separate.

```text
Summarize the text inside the triple quotes as a short poem.

"""
Over the grey plain of the sea the wind gathers storm clouds. Like a black flash, a storm petrel soars proudly.
"""
```

Or write it this way:

```text
<task>Compare two poems related to Yellow Crane Tower and explain your reasoning.</task>
<article>The people of old have left on the yellow crane; only Yellow Crane Tower remains here...</article>
<article>My old friend leaves Yellow Crane Tower in the west; in misty blossoms of March, he goes down to Yangzhou...</article>
```

We can also use field names to separate a summary from a title:

```text
I will give you an article summary and a title.
Decide whether the title accurately summarizes the article and helps readers understand its subject.
If it fails either standard, provide five alternative titles.

Summary: A prolonged period of heavy rain is affecting several northern regions. The rain will last for some time and cover a broad area, with exceptionally heavy rain possible in some places.

Title: Heavy rain hits several northern regions; exceptionally heavy rain possible in some areas
```

Here, “Summary:” and “Title:” are delimiters too. They use no special symbols, but still show the model which part is the summary and which part is the title.

With a simple task, delimiters may not make an obvious difference. As the task grows more complex and the source material gets longer, clear boundaries matter more.

Delimiters do not suddenly make the model smarter. They simply mark which part is the instruction, which part is the material, and which part is the format.

## 4. Specify the Steps

Many tasks naturally take more than one step. Writing those steps down makes it easier for the model to follow our approach.

```text
Complete the task in this order:

1. Summarize the text inside the triple quotes in one sentence. Prefix it with “Summary:”.
2. Translate that summary into English. Prefix it with “Translation:”.

"""
{{text to process}}
"""
```

More steps are not always better. Write the steps that truly affect the result; do not split a simple task into dozens of steps just to make it look professional.

## 5. Show an Example

Sometimes the style or format we want is hard to explain with one rule.

In that case, show an example directly.

```text
You are a “magical animal name generator.” Follow the style of the examples to name an animal.

Animal: cat
Name: Night Agent

Animal: dog
Name: Super Lightning

Now give a name to a horse.
```

One to three good examples are often enough to show the model the relationship we want.

But the model will copy problems in the examples too. Do not select only ideal cases; include the edges that the real task is likely to encounter.

## 6. Specify the Output Length

We can limit output by giving an approximate number of words, sentences, paragraphs, or bullet points.

But the model does not follow all of these constraints in quite the same way.

Let us use the same source passage for three rounds. The text inside each Prompt is identical so that the difference is easy to see.

### Round One: About 50 Words

```text
Summarize the content inside the triple quotes in about 50 words.

"""
Over the grey plain of the sea the wind gathers the storm clouds. Between the clouds and the sea, the storm petrel proudly soars, like a streak of black lightning.

Now its wing touches the waves; now it rises like an arrow toward the clouds. It cries out, and in that cry is its longing for the storm.
"""
```

“About 50 words” sounds clear, but the model generates Tokens rather than counting a word in lockstep with every output step. The result may be close to 50 words or noticeably over.

### Round Two: Two Paragraphs

```text
Summarize the content inside the triple quotes in two paragraphs.

"""
Over the grey plain of the sea the wind gathers the storm clouds. Between the clouds and the sea, the storm petrel proudly soars, like a streak of black lightning.

Now its wing touches the waves; now it rises like an arrow toward the clouds. It cries out, and in that cry is its longing for the storm.
"""
```

This time, we can see at a glance whether the result has two paragraphs. Compared with an exact word count, paragraph count is usually easier to observe.

### Round Three: Three Bullet Points

```text
Summarize the content inside the triple quotes in three bullet points.

"""
Over the grey plain of the sea the wind gathers the storm clouds. Between the clouds and the sea, the storm petrel proudly soars, like a streak of black lightning.

Now its wing touches the waves; now it rises like an arrow toward the clouds. It cries out, and in that cry is its longing for the storm.
"""
```

The number of bullet points is also easy to see. We can immediately check whether the answer has three.

All three rounds use the same passage. Only the length instruction changes. “About 50 words” controls an approximate word range, while “two paragraphs” and “three bullet points” control structure. They are not the same kind of requirement.

Paragraph and bullet counts are usually easier to observe, but they still need checking. If a workflow must meet an exact word, paragraph, or bullet count, validate it again with code or an editing process after generation.

## One Last Look

You do not need all six techniques in every Prompt.

For a simple task, saying it clearly may be enough. For a complex task, add context, delimiters, steps, and examples as needed.

The goal is not to make the Prompt long. It is to make the model guess less and the result easier for us to check.

**Previous:** [Probability, Sampling, and Temperature](/tutorials/prompt-engineering/probability-temperature/)

**Next:** [Structured Prompt Templates and Techniques](/tutorials/prompt-engineering/structured-prompts/)
