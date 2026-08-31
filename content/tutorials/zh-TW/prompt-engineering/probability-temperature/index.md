---
locale: "zh-TW"
title: "機率、取樣與 Temperature"
seoTitle: "機率、取樣與 Temperature：為什麼模型每次回答不同 | Luffy Liu"
description: "沿著下一個 Token 的生成過程，理解機率、取樣和 Temperature 為什麼會影響回答的穩定性與多樣性。"
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
    label: "模型取樣"
draft: false
---

## 句子是怎麼產生的？

上一章介紹了 Token。

現在，模型已經拿到一串 Token，但它是如何把這些 Token 繼續組成一句話的？

我們先看一段還沒寫完的文字：

```text
I love
```

下一步可能是什麼？

為了幫助理解，我們虛構一份簡化的候選清單：

```text
you     30%
this    18%
music   12%
it       8%
...
```

這些數字只是示意，不是真實模型的輸出。

模型會根據目前的上下文，為下一步可能出現的 Token 計算一個機率分布，再按照所使用的解碼策略選出一個。

假如它選中 `you`，目前內容就會變成：

```text
I love you
```

接著，模型會把新的內容放回上下文，再預測下一個 Token。

```text
I love
I love you
I love you too
I love you too.
```

這個過程不斷重複，直到生成結束標記、達到輸出限制，或被系統用其他方式停止。

需要特別釐清一點：Tokenizer 只負責文字與 Token ID 之間的轉換。它不會在切分文字時，為每個 Token 分配一個永遠不變的回答機率。

機率是模型在生成時根據目前上下文計算出來的。同一個詞放進不同句子，後面更可能出現的內容也會改變。

## 為什麼同一個問題會得到不同答案？

我們可以做一個很簡單的實驗。

開啟兩個互不影響的新對話視窗，分別輸入：

```text
從前有一個小王子
```

兩次回答可能從相似的地方開始，後面卻走向不同的情節。

為什麼？

因為許多生成流程會進行取樣，而不是每一步都永遠選擇分數最高的 Token。一次選擇不同，後面的上下文就會不同，整段回答也會沿著另一條路繼續生成。

除此之外，模型版本、系統指令、對話歷史、工具傳回內容和伺服器端實作，都可能影響結果。

所以，「我輸入了同一句話」不一定代表兩次執行的完整條件完全相同。

## Temperature 是什麼？

Temperature（溫度）是一些模型介面提供的取樣參數。

直觀來說，它會調整候選 Token 機率分布的集中程度：

- 較低的 Temperature 通常讓高機率候選更占優勢，輸出更集中；
- 較高的 Temperature 通常讓更多候選有機會被選中，輸出更多樣，也可能更不穩定。

它不是「創造力開關」，也不會讓事實自動變得更正確。

假如我們在做資訊擷取、分類或固定格式輸出，通常會更重視一致性。假如我們在做腦力激盪，可能願意接受更多變化。

但無論哪一種，結果都要檢查。

## Temperature 應該設定成多少？

沒有一個適合所有任務的固定數字。

不同模型和介面是否支援 Temperature、允許什麼範圍，以及如何與其他取樣參數搭配，都可能不同。一般聊天產品也未必會公開每次生成所使用的完整參數。

因此，不要把「網頁版預設是 0.7」或「某個值最好」當成通用結論。

更可靠的方法，是拿自己真正要做的事情多試幾次，看看不同設定下的結果，再決定使用哪個值。

具體介面是否支援 Temperature、可以設定到什麼範圍，都要以目前使用平台的官方文件為準。即使 Temperature 很低，輸出也不一定完全相同，重要結果仍然需要檢查。

## 回到提示工程

理解隨機性之後，我們就不會把模型當成每次傳回相同結果的資料庫查詢。

Prompt 的作用，是讓可能的答案更接近我們需要的範圍；驗證的作用，是確認這一次的結果到底能不能用。

**上一章：** [什麼是 Token？](/tutorials/prompt-engineering/tokens/)

**下一章：** [獲得優質輸出的六大技巧](/tutorials/prompt-engineering/clear-instructions/)
