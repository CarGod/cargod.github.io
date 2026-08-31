---
locale: "ko"
title: "첫 대화"
seoTitle: "대규모 언어 모델과 나누는 첫 대화 | Luffy Liu"
description: "Hello, ChatGPT로 첫 Prompt를 작성하며 입력, 출력과 생성 결과의 무작위성을 알아봅니다."
slug: "first-conversation"
contentKey: "tutorial.prompt-engineering.first-conversation"
translation_of: "/tutorials/prompt-engineering/first-conversation/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 2
tags:
  - id: "prompt-engineering"
    label: "프롬프트 엔지니어링"
  - id: "ai-basics"
    label: "AI 입문"
draft: false
---

예전에는 프로그래밍 언어를 배울 때 흔히 `Hello, World.` 예제로 시작했습니다.

오늘은 이 전통을 따라 대규모 언어 모델과의 대화를 시작해 보겠습니다.

사용 중인 공식 제품을 열고 다음 Prompt를 입력하세요.

```text
Hello, ChatGPT.
```

다음과 비슷한 답을 볼 수 있습니다.

```text
Hello! How can I assist you today?
```

이 시리즈에서는 모델에 보내는 내용을 **Prompt**라고 하고, 모델이 돌려주는 내용을 **출력**이라고 부릅니다.

`Hello! How can I assist you today?`와 다른 답이 보이더라도 걱정하지 마세요.

왜 그럴까요?

생성형 모델의 출력은 언제나 완전히 같지는 않기 때문입니다. 같은 내용을 보내도 모델, 맥락, 샘플링 방식이 다르면 최종 표현도 달라질 수 있습니다.

그렇다고 Prompt를 반드시 잘못 썼다는 뜻은 아닙니다.

이제 첫 번째 Prompt를 완성했습니다.

아주 간단해 보이죠?

다음부터는 이 가장 간단한 대화에서 출발해 텍스트가 모델에 들어간 뒤 어떤 일이 일어나는지, 그리고 모델의 결과가 매번 달라질 수 있는 이유를 살펴보겠습니다.

> **주의:** 연습할 때는 공개된 내용이나 가상의 내용을 사용하세요. 비밀번호, API Key, 영업 비밀, 신분증 정보 또는 불필요한 개인정보를 제출하지 마세요.

**이전 장:** [Prompt Engineering이란 무엇인가?](/tutorials/prompt-engineering/)

**다음 장:** [Token이란 무엇인가?](/tutorials/prompt-engineering/tokens/)
