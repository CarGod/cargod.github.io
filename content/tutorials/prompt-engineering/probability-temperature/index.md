---
locale: "zh-CN"
title: "概率、采样与 Temperature"
seoTitle: "概率、采样与 Temperature：为什么模型每次回答不同 | Luffy Liu"
description: "沿着下一个 Token 的生成过程，理解概率、采样和 Temperature 为什么会影响回答的稳定性与多样性。"
slug: "probability-temperature"
contentKey: "tutorial.prompt-engineering.probability-temperature"
translation_of: "/tutorials/prompt-engineering/probability-temperature/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 4
tags:
  - id: "prompt-engineering"
    label: "提示工程"
  - id: "model-sampling"
    label: "模型采样"
draft: false
---

## 句子是怎么产生的？

上一章介绍了 Token。

现在，模型已经拿到一串 Token，但它是怎样把这些 Token 继续组成一句话的？

我们先看一段还没写完的文字：

```text
I love
```

下一步可能是什么？

为了帮助理解，我们虚构一个简化的候选列表：

```text
you     30%
this    18%
music   12%
it       8%
...
```

这些数字只是示意，不是真实模型输出。

模型会根据当前上下文，为下一步可能出现的 Token 计算一个概率分布，再按照所使用的解码策略选出一个。

假如它选中了 `you`，当前内容就变成：

```text
I love you
```

接着，模型会把新的内容放回上下文，再预测下一个 Token。

```text
I love
I love you
I love you too
I love you too.
```

这个过程不断重复，直到生成结束标记、达到输出限制，或者被系统以其他方式停止。

需要特别纠正一点：Tokenizer 只负责文本与 Token ID 之间的转换。它不会在切分文字时，给每个 Token 分配一个永远不变的回答概率。

概率是模型在生成时，根据当前上下文计算出来的。同一个词放进不同句子，后面更可能出现的内容也会变化。

## 为什么同一个问题会得到不同答案？

我们可以做一个很简单的实验。

新开两个互不影响的对话窗口，分别输入：

```text
从前有一个小王子
```

两次回答可能从相似的地方开始，后面却走向不同的情节。

为什么？

因为许多生成流程会进行采样，而不是每一步都永远选择分数最高的 Token。一次选择不同，后面的上下文就会不同，整段回答也会沿着另一条路继续生成。

除此之外，模型版本、系统指令、对话历史、工具返回内容和服务端实现，都可能影响结果。

所以，“我输入了同一句话”并不一定代表两次运行的完整条件完全相同。

## Temperature 是什么？

Temperature（温度）是一些模型接口提供的采样参数。

直观地说，它会调整候选 Token 概率分布的集中程度：

- 较低的 Temperature 通常让高概率候选更占优势，输出更集中；
- 较高的 Temperature 通常让更多候选有机会被选中，输出更多样，也可能更不稳定。

它不是“创造力开关”，也不会让事实自动变得更正确。

假如我们在做信息提取、分类或固定格式输出，通常更在意一致性。假如我们在做头脑风暴，可能愿意接受更多变化。

但无论哪一种，结果都要检查。

## Temperature 应该设置成多少？

没有一个适合所有任务的固定数字。

不同模型和接口是否支持 Temperature、允许什么范围、怎样和其他采样参数配合，都可能不同。普通聊天产品也未必会公开每次生成所使用的完整参数。

因此，不要把“网页版默认是 0.7”或“某个值最好”当成通用结论。

更可靠的方法，是拿自己真正要做的事情多试几次，看看不同设置下的结果，再决定用哪个值。

具体接口是否支持 Temperature、可以设置到什么范围，都要以当前使用平台的官方文档为准。即使 Temperature 很低，输出也不一定完全相同，重要结果仍然需要检查。

## 回到提示工程

理解随机性以后，我们就不会把模型当成每次返回同一结果的数据库查询。

Prompt 的作用，是让可能的答案更接近我们需要的范围；验证的作用，是确认这一次结果到底能不能用。

**上一章：** [什么是 Token？](/tutorials/prompt-engineering/tokens/)

**下一章：** [获得优质输出的六大技巧](/tutorials/prompt-engineering/clear-instructions/)
