---
locale: "zh-TW"
title: "什麼是 Prompt Engineering？"
seoTitle: "什麼是 Prompt Engineering？提示工程入門 | Luffy Liu"
description: "從阿拉丁神燈的願望說起，理解 Prompt Engineering 是什麼，以及為什麼表達越清楚，模型越容易給出可用結果。"
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
    label: "AI 入門"
draft: false
---

Prompt Engineering（提示工程）是指使用大型語言模型時，設計、撰寫及改善 Prompt（提示）的過程。

這麼說可能比較抽象，我們來看一個例子。

假如現在你有一盞阿拉丁神燈，燈神讓你許三個願望。我們首先會思考：要怎麼把願望說清楚，燈神才能理解？

如果原本想讓燈神把我們變成世界上最富有的人，卻沒有把願望說好，燈神理解成另一件事，最後得到的自然不是我們想要的結果。

又或者，我們想要的是一兆美元，對燈神說的卻只是：「請給我一兆。」

一兆什麼？

是哪一種貨幣？什麼時候給？用什麼方式給？這些都沒有說。

不難發現，我們向燈神許下的願望就是 Prompt。願望能不能如預期實現，很大程度取決於我們是否把真正想要的內容說清楚。

放到大型語言模型裡也是一樣：燈神可以類比成模型，願望就是我們傳送給模型的 Prompt。

當然，這只是一個幫助理解的類比。現實中的模型不會真正理解願望，也不會因為 Prompt 寫得很好就保證正確。它仍然可能遺漏資訊、給出過時內容，或把不知道的事情說得煞有其事。

## 自然語言正在成為一種新的操作方式

過去，我們想讓電腦完成一件事，往往需要學習 Python、Java 之類的程式語言。現在，大型語言模型讓更多人可以直接使用中文、英文、日文等自然語言描述任務。

門檻確實降低了。

但這不代表程式設計、專業知識或產業經驗會失去價值。

假如我們讓模型分析一份合約，卻不知道哪些條款真正重要，就很難發現它漏掉了什麼。讓模型寫一段程式也是如此：如果我們完全看不懂程式碼，就無法判斷它能不能執行，或有沒有安全問題。

所以，提示工程不是一條「不需要學習任何知識」的捷徑。

它更像是一項可以放進許多工作裡的能力：把問題想清楚、把任務說明白、把結果定義清楚，然後檢查模型到底有沒有做到。

## 如何學好提示工程？

先不要急著找所謂的「萬用 Prompt」。

我們可以從幾個更簡單的問題開始：

1. 模型如何處理文字？
2. 為什麼同一個問題可能得到不同答案？
3. 哪些資訊沒有說清楚，會讓模型只能猜？
4. 如何組織長篇材料、複雜步驟和輸出格式？
5. 模型給出答案後，我們要怎麼檢查？

接下來的章節會沿著這條路，一步一步往下走。

## AI 會讓人停止學習嗎？

這取決於我們怎麼使用它。

如果只是複製答案，從來不檢查來源，AI 可能會放大錯誤，也可能讓我們逐漸失去對任務的理解。

但如果把它當成討論、練習、查漏和驗證的工具，它也可以幫助我們更快探索一個問題。

需要注意的是，醫療、法律、財務、安全等高風險內容，不能因為模型說得流暢就直接採用。帳號密碼、API Key、商業機密和非必要的個人資訊，也不應該隨手貼進對話。

簡單來說：AI 可以幫助我們，但最後如何使用結果，仍然需要人來判斷。

## 開始之前需要準備什麼？

一台可以存取大型語言模型的電腦或手機就夠了。

你可以選擇自己能夠正常使用的官方產品：

- [ChatGPT](https://chatgpt.com/)
- [Claude](https://claude.ai/)
- [Grok](https://grok.com/)
- [Gemini](https://gemini.google.com/)
- [通義千問 / Qwen](https://chat.qwen.ai/)
- [豆包](https://www.doubao.com/)
- [騰訊元寶](https://yuanbao.tencent.com/)
- [DeepSeek](https://chat.deepseek.com/)

不同產品、模型和入口的能力會變化。本系列講的是可以遷移的思考方法，具體效果仍要在你實際使用的模型上測試。

> **注意：** 請透過可信的官方入口存取模型，不要使用來源不明的鏡像網站，更不要向鏡像網站提交密碼、金鑰或未公開資料。

## 系列目錄

1. **導讀：什麼是 Prompt Engineering？**
2. [第一次對話](/tutorials/prompt-engineering/first-conversation/)
3. [什麼是 Token？](/tutorials/prompt-engineering/tokens/)
4. [機率、取樣與 Temperature](/tutorials/prompt-engineering/probability-temperature/)
5. [獲得優質輸出的六大技巧](/tutorials/prompt-engineering/clear-instructions/)
6. [結構化 Prompt 範本與技巧](/tutorials/prompt-engineering/structured-prompts/)
7. [讓模型輸出 JSON 資料](/tutorials/prompt-engineering/json-output/)
8. [善用 XML 標籤](/tutorials/prompt-engineering/xml-delimiters/)
9. [複雜任務：拆解、計算與驗證](/tutorials/prompt-engineering/complex-tasks/)

**下一章：** [第一次對話](/tutorials/prompt-engineering/first-conversation/)
