---
locale: "en"
title: "Complex Tasks: Decomposition, Calculation, and Validation"
seoTitle: "Complex Task Prompts: Break Down and Verify | Luffy Liu"
description: "Keep the practical value of step-by-step guidance while separating checkable calculations from a model's private chain of thought, then verify the answer with a water-barrel problem."
slug: "complex-tasks"
contentKey: "tutorial.prompt-engineering.complex-tasks"
translation_of: "/tutorials/prompt-engineering/complex-tasks/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 9
tags:
  - id: "prompt-engineering"
    label: "Prompt Engineering"
  - id: "task-decomposition"
    label: "Task Decomposition"
draft: false
---

## Why Do Complex Tasks Go Wrong So Easily?

Imagine being called over to deal with a complicated problem. If we answer immediately without thinking it through, how good can the result be?

It will probably be wrong.

If we first read the problem carefully, confirm the conditions, and work through it one step at a time, the result is usually more reliable.

The same is true for a large language model.

One point is worth keeping in mind: we do not need to ask a model to reveal its complete private chain of thought, and a long passage saying “I am thinking” is not proof that the answer is correct.

What we need is material a person can check: the conditions used, the formula or evidence applied, any necessary intermediate results, and the final answer.

## Start with a Simple Question

```text
Are Kobe Bryant and Michael Jordan from the same country?
Answer directly and give one sentence of checkable evidence.
```

This is not a complicated question. Kobe Bryant and Michael Jordan are both from the United States, so they are from the same country.

For a simple question like this, a clear answer and the necessary factual basis are enough. There is no need to write a long process merely to look thorough.

What if the question is a little more involved?

## Now Try a More Complex Question

```text
Three people drink three barrels of water in three days.
Assuming each person drinks the same amount each day, how many barrels will nine people drink in nine days?
Give the answer directly.
```

If we only stare at the threes and nines, it is easy to answer from the surface pattern.

Is that really right?

Let us calculate it ourselves.

Three people drinking for three days gives 9 person-days. Three barrels divided by 9 person-days means each person drinks `1/3` of a barrel per day.

Nine people drinking for nine days gives 81 person-days. Multiply that by `1/3` of a barrel per person-day, and the result is 27 barrels.

So a surface-level conversion is wrong. The correct answer is **27 barrels**.

## Give the Critical Path

For a problem like this, simply telling the model to “think carefully” may not help.

It is like working with an intern who seems able to do anything. When the intern cannot solve a complicated task, it may not be a lack of ability; they may not know what to examine first and what to calculate next.

This is when we give a little critical guidance.

We can rewrite the Prompt like this:

```text
Calculate the following problem:

Three people drink three barrels of water in three days. Assuming each person drinks the same amount each day, how many barrels will nine people drink in nine days?

Use these key steps:
1. Calculate the total person-days for three people over three days.
2. Calculate how many barrels one person drinks per day.
3. Calculate the total person-days for nine people over nine days.
4. Calculate the total amount of water.

Show the formula and intermediate results needed to verify the answer, then write the final answer separately.
Do not output the complete private reasoning process.
```

Here is a checkable result:

```text
Original person-days: 3 × 3 = 9 person-days
Amount per person per day: 3 ÷ 9 = 1/3 barrel
Target person-days: 9 × 9 = 81 person-days
Total amount: 81 × 1/3 = 27 barrels

Answer: 27 barrels
```

What helps here is pointing out the critical path and making the formulas and intermediate results easy to verify.

## Separate the Calculation from the Final Answer

Why separate the two?

Because we want to see the answer quickly, while still being able to go back and check its basis when something looks wrong.

But a “checkable calculation” is not the same thing as a model's complete private chain of thought. For this problem, `3 × 3 = 9 person-days`, `3 ÷ 9 = 1/3 barrel`, and `81 × 1/3 = 27 barrels` are enough for verification.

Finally, a neatly written sequence of steps is not a guarantee of correctness. Verify a calculation with a calculator or code, and check a factual answer against the original source.

For a simple question, give the answer and the necessary basis.

For a complex problem, give the critical path, then separate the checkable basis from the final answer.

**Previous:** [Using XML Tags Well](/tutorials/prompt-engineering/xml-delimiters/)

**Back to the introduction:** [What Is Prompt Engineering?](/tutorials/prompt-engineering/)
