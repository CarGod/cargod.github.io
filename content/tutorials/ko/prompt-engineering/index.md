---
locale: "ko"
title: "Prompt Engineering이란 무엇인가?"
seoTitle: "Prompt Engineering이란? 프롬프트 엔지니어링 입문 | Luffy Liu"
description: "알라딘의 요술 램프에 비는 소원에서 출발해 Prompt Engineering이 무엇인지, 표현이 명확할수록 모델이 유용한 결과를 내기 쉬운 이유를 알아봅니다."
slug: "prompt-engineering"
contentKey: "tutorial.prompt-engineering"
translation_of: "/tutorials/prompt-engineering/"
published: "2026-08-30"
updated: "2026-08-31"
series: "prompt-engineering"
order: 1
tags:
  - id: "prompt-engineering"
    label: "프롬프트 엔지니어링"
  - id: "ai-basics"
    label: "AI 입문"
draft: false
---

Prompt Engineering(프롬프트 엔지니어링)은 대규모 언어 모델을 사용할 때 Prompt(프롬프트)를 설계하고 작성하며 개선하는 과정입니다.

이 설명만으로는 조금 추상적일 수 있으니 예를 하나 들어 보겠습니다.

지금 알라딘의 요술 램프가 있고, 램프의 요정이 세 가지 소원을 말해 보라고 한다고 가정해 봅시다. 우리는 먼저 어떻게 말해야 요정이 소원을 분명히 이해할지 생각할 것입니다.

원래는 요정에게 우리를 세상에서 가장 부유한 사람으로 만들어 달라고 하고 싶었는데, 소원을 제대로 말하지 않아 요정이 다른 뜻으로 이해했다면 결국 원하는 결과를 얻지 못할 것입니다.

또는 우리가 원하는 것은 1조 달러인데 요정에게 단지 “1조를 주세요”라고 말했다고 해 봅시다.

무엇이 1조라는 뜻일까요?

어떤 통화인지, 언제 받을지, 어떤 방식으로 받을지 전혀 말하지 않았습니다.

요정에게 비는 소원이 바로 Prompt라는 점을 어렵지 않게 알 수 있습니다. 소원이 기대한 대로 이루어지는지는 우리가 정말 원하는 내용을 분명히 말했는지에 크게 달려 있습니다.

대규모 언어 모델에서도 마찬가지입니다. 요정은 모델에, 소원은 모델에 보내는 Prompt에 비유할 수 있습니다.

물론 이것은 이해를 돕기 위한 비유일 뿐입니다. 실제 모델은 소원을 진정으로 이해하지 않으며, Prompt를 잘 썼다고 반드시 정답을 내놓는 것도 아닙니다. 여전히 정보를 빠뜨리거나 오래된 내용을 제시하거나 모르는 사실을 그럴듯하게 말할 수 있습니다.

## 자연어가 새로운 조작 방식이 되고 있습니다

예전에는 컴퓨터에 어떤 일을 시키려면 Python이나 Java 같은 프로그래밍 언어를 배워야 하는 경우가 많았습니다. 이제 대규모 언어 모델 덕분에 더 많은 사람이 한국어, 영어, 일본어 같은 자연어로 직접 작업을 설명할 수 있습니다.

진입 장벽이 낮아진 것은 사실입니다.

하지만 이것이 프로그래밍, 전문 지식 또는 업계 경험의 가치가 사라진다는 뜻은 아닙니다.

모델에게 계약서를 분석하게 하면서 어떤 조항이 정말 중요한지 우리가 모른다면, 무엇을 빠뜨렸는지 알아내기 어렵습니다. 모델에게 프로그램을 작성하게 할 때도 마찬가지입니다. 코드를 전혀 이해하지 못하면 실행 가능한지, 보안 문제가 있는지 판단할 수 없습니다.

따라서 프롬프트 엔지니어링은 “아무 지식도 배울 필요가 없는” 지름길이 아닙니다.

오히려 다양한 업무에 활용할 수 있는 역량에 가깝습니다. 문제를 명확히 생각하고, 작업을 분명히 설명하고, 결과를 정의한 뒤 모델이 실제로 해냈는지 확인하는 능력입니다.

## 프롬프트 엔지니어링을 잘 배우려면?

먼저 이른바 “만능 Prompt”부터 찾으려고 서두르지 마세요.

더 간단한 몇 가지 질문에서 시작할 수 있습니다.

1. 모델은 텍스트를 어떻게 처리하는가?
2. 같은 질문에도 왜 다른 답이 나올 수 있는가?
3. 어떤 정보를 명확히 말하지 않으면 모델이 추측할 수밖에 없는가?
4. 긴 자료, 복잡한 단계, 출력 형식을 어떻게 구성할 것인가?
5. 모델이 답을 내놓은 뒤 어떻게 확인할 것인가?

다음 장부터 이 흐름을 따라 한 단계씩 살펴보겠습니다.

## AI가 사람의 학습을 멈추게 할까요?

어떻게 사용하느냐에 달려 있습니다.

답을 그대로 복사하고 출처를 전혀 확인하지 않는다면 AI는 오류를 키울 수 있고, 우리가 작업을 이해하는 능력을 점차 잃게 만들 수도 있습니다.

반대로 토론, 연습, 빠진 부분 점검, 검증을 위한 도구로 사용하면 문제를 더 빠르게 탐색하는 데 도움을 줄 수 있습니다.

의료, 법률, 재무, 안전 같은 고위험 내용은 모델의 말이 유창하다는 이유만으로 바로 채택해서는 안 됩니다. 계정 비밀번호, API Key, 영업 비밀, 불필요한 개인정보도 대화창에 함부로 붙여 넣으면 안 됩니다.

간단히 말해 AI는 우리를 도울 수 있지만, 결과를 어떻게 사용할지 최종적으로 판단하는 일은 여전히 사람의 몫입니다.

## 시작하기 전에 무엇을 준비해야 할까요?

대규모 언어 모델에 접속할 수 있는 컴퓨터나 휴대전화면 충분합니다.

정상적으로 이용할 수 있는 공식 제품을 선택하세요.

- [ChatGPT](https://chatgpt.com/)
- [Claude](https://claude.ai/)
- [Grok](https://grok.com/)
- [Gemini](https://gemini.google.com/)
- [통이첸원 / Qwen](https://chat.qwen.ai/)
- [더우바오](https://www.doubao.com/)
- [텐센트 위안바오](https://yuanbao.tencent.com/)
- [DeepSeek](https://chat.deepseek.com/)

제품, 모델, 접속 경로에 따라 기능은 달라질 수 있습니다. 이 시리즈는 다른 환경에도 적용할 수 있는 사고방식을 다루지만, 구체적인 효과는 실제로 사용하는 모델에서 테스트해야 합니다.

> **주의:** 신뢰할 수 있는 공식 경로를 통해 모델에 접속하세요. 출처가 불분명한 미러 사이트를 사용하지 말고, 미러 사이트에 비밀번호, 키 또는 비공개 데이터를 제출하지 마세요.

## 시리즈 목차

1. **소개: Prompt Engineering이란 무엇인가?**
2. [첫 대화](/tutorials/prompt-engineering/first-conversation/)
3. [Token이란 무엇인가?](/tutorials/prompt-engineering/tokens/)
4. [확률, 샘플링과 Temperature](/tutorials/prompt-engineering/probability-temperature/)
5. [좋은 출력을 얻는 여섯 가지 방법](/tutorials/prompt-engineering/clear-instructions/)
6. [구조화 Prompt 템플릿과 활용법](/tutorials/prompt-engineering/structured-prompts/)
7. [모델에서 JSON 데이터 출력하기](/tutorials/prompt-engineering/json-output/)
8. [XML 태그 제대로 활용하기](/tutorials/prompt-engineering/xml-delimiters/)
9. [복잡한 작업: 분해, 계산과 검증](/tutorials/prompt-engineering/complex-tasks/)

**다음 장:** [첫 대화](/tutorials/prompt-engineering/first-conversation/)
