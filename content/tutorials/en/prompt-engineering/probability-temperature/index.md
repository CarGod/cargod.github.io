---
locale: "en"
title: "Probability, Sampling, and Temperature"
seoTitle: "Why Model Answers Vary: Probability and Temperature | Luffy Liu"
description: "Follow the next-Token generation process to understand how probability, sampling, and Temperature affect consistency and variety."
slug: "probability-temperature"
contentKey: "tutorial.prompt-engineering.probability-temperature"
translation_of: "/tutorials/prompt-engineering/probability-temperature/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 4
tags:
  - id: "prompt-engineering"
    label: "Prompt Engineering"
  - id: "model-sampling"
    label: "Model Sampling"
draft: false
---

## How Is a Sentence Generated?

The previous chapter introduced Tokens.

Now the model has a sequence of Tokens. How does it keep going and turn them into a sentence?

Let us start with an unfinished piece of text:

```text
I love
```

What might come next?

To make the idea easier to see, here is an invented, simplified list of candidates:

```text
you     30%
this    18%
music   12%
it       8%
...
```

These numbers are only an illustration. They are not output from a real model.

Based on the current context, the model calculates a probability distribution over possible next Tokens. A Token is then chosen according to the decoding strategy in use.

Suppose it chooses `you`. The text now becomes:

```text
I love you
```

The model puts this new text back into the context and predicts the next Token.

```text
I love
I love you
I love you too
I love you too.
```

This process repeats until the model generates an end marker, reaches an output limit, or is stopped in some other way by the system.

One point needs to be corrected clearly: a Tokenizer only converts between text and Token IDs. It does not assign each Token a fixed response probability when it splits the text.

The model calculates probabilities during generation from the current context. Put the same word in a different sentence, and what is likely to follow can change too.

## Why Can the Same Question Produce Different Answers?

We can try a very simple experiment.

Open two separate conversations that do not share context, and enter this in each one:

```text
Once upon a time there was a little prince
```

The two answers may begin in similar ways and then move toward different plots.

Why?

Because many generation processes use sampling instead of always choosing the highest-scoring Token at every step. Once one choice differs, the following context also differs, and the rest of the answer continues along another path.

Model versions, system instructions, conversation history, tool results, and service-side implementation can also affect the result.

So entering the same sentence does not necessarily mean that every condition of the two runs was identical.

## What Is Temperature?

Temperature is a sampling parameter exposed by some model APIs.

In simple terms, it changes how concentrated the probability distribution over candidate Tokens is:

- A lower Temperature usually gives high-probability candidates more weight, making output more concentrated.
- A higher Temperature usually gives more candidates a chance, making output more varied and potentially less stable.

It is not a “creativity switch,” and it does not automatically make facts more accurate.

For extraction, classification, or fixed-format output, we usually care more about consistency. For brainstorming, we may be willing to accept more variation.

Either way, the result still needs to be checked.

## What Temperature Should You Use?

There is no single fixed number that suits every task.

Different models and interfaces may differ in whether they support Temperature, which range they allow, and how it interacts with other sampling parameters. Ordinary chat products may not reveal all the parameters used for a particular response.

So do not treat “the web app defaults to 0.7” or “this value is best” as a general rule.

A more reliable approach is to try the real task several times, compare the results under different settings, and then decide which value to use.

Whether an interface supports Temperature and which range it allows should be checked in the current official documentation for that platform. Even with a very low Temperature, output may not be identical every time, so important results still need checking.

## Back to Prompt Engineering

Once we understand randomness, we stop treating a model like a database query that returns the same result every time.

A Prompt narrows the range of likely answers toward what we need. Validation tells us whether this particular answer is actually usable.

**Previous:** [What Is a Token?](/tutorials/prompt-engineering/tokens/)

**Next:** [Six Ways to Get Better Output](/tutorials/prompt-engineering/clear-instructions/)
