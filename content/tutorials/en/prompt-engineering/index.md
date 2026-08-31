---
locale: "en"
title: "What Is Prompt Engineering?"
seoTitle: "What Is Prompt Engineering? A Practical Introduction | Luffy Liu"
description: "Start with the genie-in-a-lamp analogy to understand Prompt Engineering and why clearer requests give a model less room to guess."
slug: "prompt-engineering"
contentKey: "tutorial.prompt-engineering"
translation_of: "/tutorials/prompt-engineering/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 1
tags:
  - id: "prompt-engineering"
    label: "Prompt Engineering"
  - id: "ai-basics"
    label: "AI basics"
draft: false
---

Prompt Engineering is the practice of designing, writing, and improving the prompts we give to large language models.

That may sound a little abstract, so let us start with an example.

Imagine that you have Aladdin’s lamp and the genie grants you three wishes. Your first thought would probably be: how do I word the wish so the genie understands it?

You might want the genie to make you the richest person in the world. But if the wish is poorly worded and the genie interprets it as something else, the result will not be what you had in mind.

Or perhaps you want one trillion US dollars, but all you say is, “Give me one trillion.”

One trillion of what?

Which currency? When should it arrive? In what form? None of that has been said.

The wish we give the genie is much like a Prompt. Whether the result matches our intention depends in large part on whether we have explained what we actually want.

In this analogy, the genie is the model and the wish is the Prompt we send it.

Of course, this is only an analogy. A real model does not truly understand a wish, and even an excellent Prompt cannot guarantee a correct answer. The model may still miss information, return outdated material, or state an unknown as if it were true.

## Natural Language Is Becoming a New Way to Operate Computers

In the past, making a computer do something often meant learning a programming language such as Python or Java. Large language models now let more people describe tasks directly in Chinese, English, Japanese, and other natural languages.

That does lower the barrier.

It does not make programming, professional knowledge, or industry experience worthless.

If we ask a model to review a contract but do not know which clauses matter, it is hard to notice what it missed. The same is true when it writes code: if we cannot read the code at all, we cannot tell whether it runs or whether it creates a security problem.

Prompt Engineering is therefore not a shortcut that removes the need to learn anything else.

It is better understood as a skill that fits into many kinds of work: think through the problem, explain the task, define the result, and then check whether the model actually did it.

## How Do You Learn Prompt Engineering Well?

Do not begin by hunting for a “universal Prompt.”

Start with a few simpler questions:

1. How does a model process text?
2. Why can the same question receive different answers?
3. Which missing details force the model to guess?
4. How should we organize long material, complex steps, and output formats?
5. Once the model answers, how do we check the result?

The chapters that follow take these questions one step at a time.

## Will AI Make People Stop Learning?

That depends on how we use it.

If we merely copy answers and never check their sources, AI may amplify errors and gradually weaken our own understanding of the task.

If we use it for discussion, practice, gap-finding, and verification, it can help us explore a problem more quickly.

Medical, legal, financial, and safety-critical material must not be accepted merely because the model sounds fluent. Passwords, API keys, trade secrets, and unnecessary personal information should not be pasted casually into a chat either.

Put simply: AI can help us, but people still have to decide how its output should be used.

## What Do You Need Before Starting?

A computer or phone that can access a large language model is enough.

Choose an official service that is available to you:

- [ChatGPT](https://chatgpt.com/)
- [Claude](https://claude.ai/)
- [Grok](https://grok.com/)
- [Gemini](https://gemini.google.com/)
- [Qwen](https://chat.qwen.ai/)
- [Doubao](https://www.doubao.com/)
- [Tencent Yuanbao](https://yuanbao.tencent.com/)
- [DeepSeek](https://chat.deepseek.com/)

Products, models, and access options change. This series focuses on ways of thinking that transfer across tools, but you still need to test the results with the model you actually use.

> **Note:** Use a trusted official service. Do not use unofficial mirror sites, and never send passwords, keys, or unpublished data to one.

## Series Contents

1. **Introduction: What Is Prompt Engineering?**
2. [Your First Conversation](/tutorials/prompt-engineering/first-conversation/)
3. [What Is a Token?](/tutorials/prompt-engineering/tokens/)
4. [Probability, Sampling, and Temperature](/tutorials/prompt-engineering/probability-temperature/)
5. [Six Ways to Get Better Output](/tutorials/prompt-engineering/clear-instructions/)
6. [Structured Prompt Templates and Techniques](/tutorials/prompt-engineering/structured-prompts/)
7. [Ask the Model to Output JSON](/tutorials/prompt-engineering/json-output/)
8. [Using XML Tags Well](/tutorials/prompt-engineering/xml-delimiters/)
9. [Complex Tasks: Decomposition, Calculation, and Validation](/tutorials/prompt-engineering/complex-tasks/)

**Next:** [Your First Conversation](/tutorials/prompt-engineering/first-conversation/)
