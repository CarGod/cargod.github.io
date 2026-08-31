---
locale: "zh-CN"
title: "什么是 Prompt Engineering？"
seoTitle: "什么是 Prompt Engineering？提示工程入门 | Luffy Liu"
description: "从阿拉丁神灯的愿望说起，理解 Prompt Engineering 是什么、为什么表达越清楚，模型越容易给出可用结果。"
slug: "prompt-engineering"
contentKey: "tutorial.prompt-engineering"
translation_of: "/tutorials/prompt-engineering/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 1
tags:
  - id: "prompt-engineering"
    label: "提示工程"
  - id: "ai-basics"
    label: "AI 入门"
draft: false
---

Prompt Engineering（提示工程）是指在使用大语言模型时，设计、编写和改进 Prompt（提示）的过程。

这么说可能会比较抽象，举个例子。

假如现在你有一盏阿拉丁神灯，灯神让你许三个愿望。我们首先会思考：怎么把愿望说清楚，才能让灯神理解？

如果本来想让灯神把我们变成世界上最富有的人，结果愿望没有说好，灯神理解成了另一件事，最后得到的自然不是我们想要的结果。

又或者，我们想要的是一万亿美元，对灯神说的却只是：“请给我一万亿。”

一万亿什么？

货币是什么？什么时候给？以什么方式给？这些都没有说。

不难发现，我们对灯神许下的愿望就是 Prompt。愿望能不能按预期实现，很大程度上取决于我们有没有把真正想要的内容说清楚。

放到大语言模型里也是一样：灯神可以类比成模型，愿望就是我们发送给模型的 Prompt。

当然，这只是一个帮助理解的类比。现实中的模型不会真正理解愿望，也不会因为 Prompt 写得很好就保证正确。它仍然可能遗漏信息、给出过时内容，或者把不知道的事情说得很像真的。

## 自然语言正在成为一种新的操作方式

过去，我们想让计算机完成一件事，往往需要学习 Python、Java 之类的编程语言。现在，大语言模型让更多人可以直接使用中文、英文、日文等自然语言来描述任务。

门槛确实降低了。

但这并不代表编程、专业知识或行业经验会失去价值。

假如我们让模型分析一份合同，却不知道哪些条款真正重要，就很难发现它漏掉了什么。让模型写一段程序也是如此：如果我们完全看不懂代码，就无法判断它能不能运行，有没有安全问题。

所以，提示工程不是一条“不需要学习任何知识”的捷径。

它更像是一项可以放进很多工作里的能力：把问题想清楚，把任务说明白，把结果定义清楚，然后检查模型到底有没有做到。

## 如何学好提示工程？

先不要急着找所谓的“万能 Prompt”。

我们可以从几个更简单的问题开始：

1. 模型是怎样处理文字的？
2. 为什么同一个问题可能得到不同答案？
3. 哪些信息没有说清楚，会让模型只能猜？
4. 怎样把长材料、复杂步骤和输出格式组织起来？
5. 模型给出答案以后，我们要怎样检查？

接下来的章节会沿着这条路，一步一步往下走。

## AI 会让人停止学习吗？

这取决于我们怎么使用它。

如果只是复制答案，从来不检查来源，AI 可能会放大错误，也可能让我们逐渐失去对任务的理解。

但如果把它当成讨论、练习、查漏和验证的工具，它也可以帮助我们更快地探索一个问题。

需要注意的是，医疗、法律、财务、安全等高风险内容，不能因为模型说得流畅就直接采用。账号密码、API Key、商业秘密和不必要的个人信息，也不应该随手粘贴进对话。

简单来说：AI 可以帮助我们，但最后怎样使用结果，仍然需要人来判断。

## 开始之前需要准备什么？

一台可以访问大语言模型的电脑或手机就够了。

你可以选择自己能够正常使用的官方产品：

- [ChatGPT](https://chatgpt.com/)
- [Claude](https://claude.ai/)
- [Grok](https://grok.com/)
- [Gemini](https://gemini.google.com/)
- [通义千问 / Qwen](https://chat.qwen.ai/)
- [豆包](https://www.doubao.com/)
- [腾讯元宝](https://yuanbao.tencent.com/)
- [DeepSeek](https://chat.deepseek.com/)

不同产品、模型和入口的能力会变化。本系列讲的是可以迁移的思考方法，具体效果仍要在你实际使用的模型上测试。

> **注意：** 请通过可信的官方入口访问模型，不要使用来源不明的镜像站，更不要向镜像站提交密码、密钥或未公开数据。

## 系列目录

1. **导读：什么是 Prompt Engineering？**
2. [第一次对话](/tutorials/prompt-engineering/first-conversation/)
3. [什么是 Token？](/tutorials/prompt-engineering/tokens/)
4. [概率、采样与 Temperature](/tutorials/prompt-engineering/probability-temperature/)
5. [获得优质输出的六大技巧](/tutorials/prompt-engineering/clear-instructions/)
6. [结构化 Prompt 模板与技巧](/tutorials/prompt-engineering/structured-prompts/)
7. [让模型输出 JSON 数据](/tutorials/prompt-engineering/json-output/)
8. [善用 XML 标签](/tutorials/prompt-engineering/xml-delimiters/)
9. [复杂任务：拆解、计算与验证](/tutorials/prompt-engineering/complex-tasks/)

**下一章：** [第一次对话](/tutorials/prompt-engineering/first-conversation/)
