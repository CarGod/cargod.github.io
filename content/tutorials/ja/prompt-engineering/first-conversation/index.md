---
locale: "ja"
title: "初めての対話"
seoTitle: "大規模言語モデルとの初めての対話 | Luffy Liu"
description: "Hello, ChatGPT から最初の Prompt を書き始め、入力、出力、生成結果のランダム性を学びます。"
slug: "first-conversation"
contentKey: "tutorial.prompt-engineering.first-conversation"
translation_of: "/tutorials/prompt-engineering/first-conversation/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 2
tags:
  - id: "prompt-engineering"
    label: "プロンプトエンジニアリング"
  - id: "ai-basics"
    label: "AI 入門"
draft: false
---

以前から、プログラミング言語の学習は `Hello, World.` という例から始めることがよくあります。

今日は私たちもこの伝統にならい、大規模言語モデルとの対話への扉を開きましょう。

利用している公式サービスを開き、次の Prompt を入力してください。

```text
Hello, ChatGPT.
```

次のような返答が表示されるかもしれません。

```text
Hello! How can I assist you today?
```

このシリーズでは、モデルに送る内容を **Prompt（プロンプト）**、モデルから返される内容を**出力**と呼びます。

表示された返答が `Hello! How can I assist you today?` でなくても、心配はいりません。

なぜでしょうか？

生成モデルの出力は、いつも完全に同じとは限らないからです。同じ内容を送っても、モデル、コンテキスト、サンプリング方法が異なれば、最終的な表現も変わることがあります。

だからといって、Prompt が間違っているとは限りません。

これで、最初の Prompt を送ることができました。

とても簡単に見えますよね？

次からは、この最も簡単な対話を出発点に、文字がモデルに入った後に何が起きるのか、モデルの結果が毎回異なることがあるのはなぜかを見ていきます。

> **注意：** 練習には、公開情報または架空の内容を使ってください。パスワード、API Key、営業秘密、本人確認書類、不要な個人情報を送信しないでください。

**前の章：** [Prompt Engineering とは？](/tutorials/prompt-engineering/)

**次の章：** [Token とは？](/tutorials/prompt-engineering/tokens/)
