---
locale: "zh-CN"
title: "第一次对话"
seoTitle: "第一次与大语言模型对话 | Luffy Liu"
description: "从 Hello, ChatGPT 开始写下第一条 Prompt，认识输入、输出和生成结果的随机性。"
slug: "first-conversation"
contentKey: "tutorial.prompt-engineering.first-conversation"
translation_of: "/tutorials/prompt-engineering/first-conversation/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 2
tags:
  - id: "prompt-engineering"
    label: "提示工程"
  - id: "ai-basics"
    label: "AI 入门"
draft: false
---

在过去，学习一门编程语言，往往会从一个 `Hello, World.` 的例子开始。

今天，我们也遵循这个传统，打开与大语言模型对话的大门。

打开你正在使用的官方产品，输入下面的 Prompt：

```text
Hello, ChatGPT.
```

你可能会看到类似这样的回复：

```text
Hello! How can I assist you today?
```

在这个系列里，我们把发送给模型的内容称为 **Prompt**，把模型返回的内容称为 **输出**。

如果你看到的回复不是 `Hello! How can I assist you today?`，也不用担心。

为什么？

因为生成式模型的输出并不总是完全一样。即使发送相同的内容，模型、上下文和采样方式不同，最后的措辞也可能不同。

这不代表你的 Prompt 一定写错了。

现在，你已经完成了第一条 Prompt。

看起来很简单，对吧？

后面我们会从这句最简单的对话开始，继续看看文字进入模型以后发生了什么，以及为什么模型每次给出的结果可能不一样。

> **注意：** 练习时请使用公开或虚构内容。不要提交密码、API Key、商业秘密、身份证明或不必要的个人信息。

**上一章：** [什么是 Prompt Engineering？](/tutorials/prompt-engineering/)

**下一章：** [什么是 Token？](/tutorials/prompt-engineering/tokens/)
