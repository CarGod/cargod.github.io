---
locale: "en"
title: "What Is a Token?"
seoTitle: "What Is a Token? How Models Process Text | Luffy Liu"
description: "Use a sentence-completion experiment to understand Tokens, Tokenizers, and Token IDs—and why counts vary across models and encodings."
slug: "tokens"
contentKey: "tutorial.prompt-engineering.tokens"
translation_of: "/tutorials/prompt-engineering/tokens/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 3
tags:
  - id: "prompt-engineering"
    label: "Prompt Engineering"
  - id: "tokens"
    label: "Tokens"
draft: false
---

## What Happened?

What happens when we send a Prompt to a large language model?

How does it return a result?

Why does the result sometimes change?

We first need two ideas: Tokens and probability.

This chapter starts with Tokens.

## Try Completing a Sentence

For a moment, forget everything else and look at this fragment:

```text
If you suddenly
```

If I ask you to turn it into a short sentence, what would you write?

Pause for a moment and think.

Suppose Zhang San and Li Si—two ordinary placeholder names in the original example—write these answers:

```text
Zhang San: If you suddenly sneezed
```

```text
Li Si: If you suddenly turned into a cat
```

Both answers satisfy the request, yet they are different.

Why?

Because a sentence often has more than one reasonable continuation. What we have already seen, the words we know, and the choice made at that moment all affect what comes next.

### First, Think of a Sentence in Pieces

When we speak or write, we often do not plan the whole sentence at once. We keep going while choosing what to say next.

The same sentence can even have different pauses:

```text
When, I am, writing, this passage, I am, also, thinking, one, word, at, a, time
```

```text
When I, am writing, this, passage, I am also, thinking, one word, at a time
```

I did not deliberately control the pauses. I simply added commas where I happened to pause, and the breaks were not exactly the same both times.

For now, we can treat the content between the commas as separate “markers.” What has already been written affects what the next piece might be.

### Ask Zhang San Again

Ask Zhang San again and he might write:

```text
If you suddenly appeared here
```

Or he may give the same answer as before.

We are not Zhang San, so we do not know which continuation he will choose. What we can say is that he can only use the words and expressions he knows; if he does not know something, he may get it wrong or simply make it up.

Can we tentatively describe the process in three steps?

1. First, have a certain store of words and sentences.
2. Use what has already appeared to judge what could come next.
3. If several continuations work, choose one of them.

Pause here for a moment. Does this resemble anything you notice when you speak or write?

### Three Small Exercises

Do not look ahead for an answer. Write these three exercises on paper or type them on screen, and notice how you build each sentence piece by piece.

```text
Extend this into a short sentence, counting punctuation as part of the length:
My hometown is...
```

```text
Complete this sentence:
Today, on gptpmt, I...
```

```text
Write a sentence using this pattern:
Because ... therefore ...
```

Finished?

These sentence-completion exercises give us a useful intuition: when text is generated, what has already appeared influences what may come next.

But it is only an analogy. The way a language model processes Tokens is not the same as how a human brain actually thinks or speaks.

## What Is a Token?

A model does not process a passage according to the “character count” or “word count” we see.

Before the text reaches the model, a matching Tokenizer converts it into a sequence of **Tokens**, the units the model processes. The model works with these Tokens, generates new ones step by step, and finally converts them back into the text we see.

A Token may be:

- a complete word;
- part of a word;
- part of a Chinese character or another character;
- a combination of a space and text;
- punctuation or another byte sequence.

A Token count is therefore not the same as a character count or a word count.

For example:

```text
I love prompt engineering.
我喜欢提示工程。
```

You cannot infer the Token counts from the visible length alone. Even identical text may be split differently when the model or encoding changes.

Tokenizers used by early GPT models commonly relied on BPE (Byte Pair Encoding) or a related method. Different models today may use different vocabularies and encodings, so the result in one old screenshot is not a universal rule.

### When a Tokenizer Does Not “Travel Well”

Start with an English sentence:

```text
I love GPT pmt.
```

It contains letters, spaces, words, and punctuation. A Tokenizer does not necessarily split it into complete words: `I` may be a Token on its own, a leading space may be grouped with the letters after it, and `GPT` may be split into smaller pieces.

Why?

Because a Tokenizer follows its own vocabulary and encoding rules. It does not divide text according to the “characters” and “words” we learned in language class.

What about Chinese?

You might guess that one Chinese character always equals one Token.

Is that really true?

If `GPT` can be “split apart,” can a Chinese character be “split” too? Take the character `爱` in this sentence:

```text
我爱 GPT pmt。
```

The character is not literally cut in half. But computers represent text through encodings, and some byte-based Tokenizers may place the byte sequence for one Chinese character into more than one Token. Older tools that displayed those pieces one by one could even show unreadable replacement symbols.

First, here is one reproducible result. As of 2026-08-31, the official OpenAI `tiktoken` test encodes `hello world` as `[15339, 1917]` with `cl100k_base`, for a total of 2 Tokens, and decodes it back to the original text. The case appears in the [official test file](https://github.com/openai/tiktoken/blob/main/tests/test_encoding.py).

This result belongs only to that encoding and that input. It does not mean other models or encodings will produce the same result.

Instead of stopping at the explanation, try a real tokenization experiment yourself:

1. Open the official Tokenizer or counting tool for the service you currently use.
2. Record the test date, service and model name, and the encoding name shown by the tool.
3. Enter `I love GPT pmt.` and `我爱 GPT pmt。` separately.
4. Record the split the tool actually shows, the Token count, and any Token IDs it provides.
5. If the tool lets you change the model or encoding, choose another option and repeat the test.

Keep the model, encoding, and date with every result. If the output changes later, we can then tell whether the text changed or the model, vocabulary, or tool was updated.

Put simply, “splitting a Chinese character” is useful for remembering one phenomenon: **a complete character to a human does not necessarily correspond to exactly one Token.**

But that is not a fixed rule for every model. Change the model, vocabulary, or encoding, and the same character may use one Token or several. Chinese also does not always use more Tokens than English. For an exact count, test with the tool that matches the target model.

## What Is a Token ID?

A Tokenizer maps each Token to an integer in its vocabulary. That number is the Token ID.

```text
Text: Hello
Tokens: [Hel] [lo]
Token IDs: [example ID 1] [example ID 2]
```

This only illustrates the idea; it is not the actual split used by any particular model.

A Token ID is like an index in the model’s vocabulary. Change the model or encoding and the IDs for the same text may be completely different. The ID does not indicate importance, factual reliability, or model confidence.

## Why Should a User Understand Tokens?

First, a model has a finite capacity for each request. The input, conversation history, tool descriptions, and output all consume Tokens.

Second, “write 500 Chinese characters” and “generate at most a certain number of Tokens” are not the same constraint. If a workflow needs an exact character count, check it after generation.

Finally, many APIs report the Tokens used for input and output. The accounting method depends on the service and model, so consult the current documentation and the returned usage data.

When you need an accurate count, do not rely on a fixed formula such as “one Chinese character equals several Tokens.” Identify the actual model, then use the Tokenizer or counting interface for that service.

OpenAI users can inspect tokenization with the official [Tokenizer](https://platform.openai.com/tokenizer). For other services, use their official tools and documentation.

## Return to the Opening Question

Once the model has a sequence of Tokens, how does it decide which Token comes next?

Why can the same fragment continue in different ways?

To answer that, we need probability and sampling.

**Previous:** [Your First Conversation](/tutorials/prompt-engineering/first-conversation/)

**Next:** [Probability, Sampling, and Temperature](/tutorials/prompt-engineering/probability-temperature/)
