---
locale: "zh-TW"
title: "第一次對話"
seoTitle: "第一次與大型語言模型對話 | Luffy Liu"
description: "從 Hello, ChatGPT 開始寫下第一條 Prompt，認識輸入、輸出和生成結果的隨機性。"
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
    label: "AI 入門"
draft: false
---

過去，學習一門程式語言時，往往會從一個 `Hello, World.` 的例子開始。

今天，我們也遵循這個傳統，打開與大型語言模型對話的大門。

開啟你正在使用的官方產品，輸入下面的 Prompt：

```text
Hello, ChatGPT.
```

你可能會看到類似這樣的回覆：

```text
Hello! How can I assist you today?
```

在這個系列裡，我們把傳送給模型的內容稱為 **Prompt**，把模型傳回的內容稱為**輸出**。

如果你看到的回覆不是 `Hello! How can I assist you today?`，也不用擔心。

為什麼？

因為生成式模型的輸出不一定每次都完全相同。即使傳送相同內容，只要模型、上下文或取樣方式不同，最後的措辭也可能不同。

這不代表你的 Prompt 一定寫錯了。

現在，你已經完成了第一條 Prompt。

看起來很簡單，對吧？

後面我們會從這句最簡單的對話開始，繼續看看文字進入模型之後發生了什麼，以及模型每次給出的結果為什麼可能不一樣。

> **注意：** 練習時請使用公開或虛構內容。不要提交密碼、API Key、商業機密、身分證明或非必要的個人資訊。

**上一章：** [什麼是 Prompt Engineering？](/tutorials/prompt-engineering/)

**下一章：** [什麼是 Token？](/tutorials/prompt-engineering/tokens/)
