import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSET_ROOT = path.join(
  REPO_ROOT,
  "content/blog/2026/08/enterprise-ai-four-stages/assets"
);

const FONTS = {
  "zh-TW": "PingFang TC, Noto Sans CJK TC, Microsoft JhengHei, sans-serif",
  en: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif",
  ja: "Hiragino Sans, Yu Gothic, Noto Sans CJK JP, sans-serif",
  ko: "Apple SD Gothic Neo, Noto Sans CJK KR, Malgun Gothic, sans-serif",
  es: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif"
};

export const localeData = {
  "zh-TW": {
    fileLocale: "zh-tw",
    mascotLabel: "原創雲舟人物主持人",
    cover: {
      brand: "劉路飛",
      title: "企業老系統如何接入 AI？先看這四個階段",
      description: "劉路飛文章封面，原創科技探索者雲舟與三顆小星球出現在藍白天空中，左側為文章標題。",
      lines: ["企業老系統如何接入 AI？", "先看這四個階段"],
      titleSize: 52
    },
    diagram01: {
      titleMeta: "企業系統接入 AI 的四個階段與四層能力",
      title: "四個階段，四層能力",
      subtitle: "每向前一步，系統都要多回答一個問題",
      questions: ["知道多少？", "能做多少？", "能否自行推進？", "誰為結果負責？"],
      capabilities: ["資料治理", "工具治理", "意圖與狀態", "系統化監管"],
      footer: ["可以跳過版本上線，不能跳過能力建設與驗證"]
    },
    diagram02: {
      titleMeta: "使用者表達逐層收斂為可執行的訂單任務",
      title: "從一句話，到可執行任務",
      subtitle: "先找業務領域，再拆具體意圖，最後進入正確的工作流程",
      labels: ["使用者表達", "業務領域", "具體意圖", "執行順序"],
      values: [
        "「物流三天沒更新，我要投訴並退款」",
        "訂單售後",
        "物流異常 + 投訴 + 退款申請",
        "先查物流，再判斷退款，最後進入投訴流程"
      ],
      footer: "走錯工作流程，後面執行得再順也沒有意義"
    },
    diagram03: {
      titleMeta: "Copilot 的人工確認與 Agent 的系統護欄",
      title: "人工檢查，轉為系統護欄",
      subtitle: "無人值守不等於無人監管",
      copilotNote: "關鍵節點由人確認",
      flow: ["目標", "執行", "人"],
      copilotSummary: "風險由人工逐筆接住",
      copilotControls: "檢查 · 駁回 · 接管",
      agentNote: "在約定邊界內自主運行",
      agentFlow: "目標 → 執行 → 結果",
      guardrail: "系統護欄持續生效",
      controls1: "權限　預算　監控",
      controls2: "熔斷　稽核　恢復",
      accountability: "責任主體與事故回應",
      footer: "Agent 是邊界內的責任承諾"
    },
    diagram04: {
      titleMeta: "企業從知識、工具、工作流程與治理四層判斷需要補齊的能力",
      title: "先補自己缺的那一層",
      subtitle: "先別問「如何做一個 Agent」",
      layers: [
        ["知識", ["回答有沒有依據？不知道時會不會承認？"]],
        ["工具", ["入口是否清楚、安全，而且可以追蹤？"]],
        ["工作流程", ["任務能否持續推進，變化後能否接著走？"]],
        ["治理", ["邊界內出了問題，誰處理、誰負責？"]]
      ],
      footer: "找出目前最薄弱的一層，從那裡開始"
    }
  },
  en: {
    fileLocale: "en",
    mascotLabel: "Original Yunzhou mascot host",
    cover: {
      brand: "Luffy Liu",
      title: "How Should Legacy Enterprise Systems Adopt AI? Start with These Four Stages",
      description: "Luffy Liu article cover with the original Yunzhou technology explorer and three planets on the right and the article title on the left.",
      lines: ["How Should Enterprise", "Legacy Systems Adopt AI?", "Start with These Four Stages"],
      titleSize: 40
    },
    diagram01: {
      titleMeta: "Four stages and four capability layers for adding AI to enterprise systems",
      title: "Four Stages, Four Capability Layers",
      subtitle: "Each step forward adds one more question for the system",
      questions: ["How much does it know?", "How much can it do?", ["Can it keep moving", "on its own?"], "Who owns the outcome?"],
      capabilities: ["Data governance", "Tool governance", "Intent and state", "Systematic oversight"],
      footer: ["You can skip a product release,", "but not capability building or validation"]
    },
    diagram02: {
      titleMeta: "A user request narrows into an executable order task",
      title: "From One Sentence to an Executable Task",
      subtitle: "Find the business domain, split the intents, then enter the right workflow",
      labels: ["User request", "Business domain", "Specific intents", "Execution order"],
      values: [
        ["“Tracking has not updated for three days.", "I want to complain and get a refund.”"],
        "Order after-sales",
        "Logistics exception + Complaint + Refund request",
        ["Check logistics; assess the refund;", "then open the complaint workflow"]
      ],
      footer: "The wrong workflow makes flawless execution pointless"
    },
    diagram03: {
      titleMeta: "Human confirmation for Copilot and system guardrails for Agent",
      title: "Human Checks Become System Guardrails",
      subtitle: "Unattended operation does not mean ungoverned operation",
      copilotNote: "Key steps require human confirmation",
      flow: ["Goal", "Execute", "Human"],
      copilotSummary: "People catch risk case by case",
      copilotControls: "Review · Reject · Take over",
      agentNote: ["Runs autonomously within", "agreed boundaries"],
      agentFlow: "Goal → Execute → Outcome",
      guardrail: "System guardrails stay active",
      controls1: "Permissions　Budget　Monitoring",
      controls2: "Circuit breaker　Audit　Recovery",
      accountability: ["Accountability and", "incident response"],
      footer: "Agent commits to responsibility within boundaries"
    },
    diagram04: {
      titleMeta: "Assessing the missing capability across knowledge, tools, workflow, and governance",
      title: "Build the Layer You Are Missing First",
      subtitle: "Do not start with “How do we build an Agent?”",
      layers: [
        ["Knowledge", ["Are answers evidence-based?", "Does it admit when it does not know?"]],
        ["Tools", ["Are access points clear, safe, and traceable?"]],
        ["Workflow", ["Can the task keep moving and resume after a change?"]],
        ["Governance", ["When something goes wrong within the boundary,", "who responds and who owns it?"]]
      ],
      footer: "Find the weakest layer and start there"
    }
  },
  ja: {
    fileLocale: "ja",
    mascotLabel: "オリジナルキャラクター雲舟",
    cover: {
      brand: "Luffy Liu",
      title: "企業のレガシーシステムに AI を導入するには？ まず四つの段階を考える",
      description: "劉路飛の記事カバー。右側にオリジナルのテクノロジー探検者・雲舟と三つの惑星、左側に記事タイトルを配置。",
      lines: ["企業のレガシーシステムに", "AI を導入するには？", "まず四つの段階を考える"],
      titleSize: 40
    },
    diagram01: {
      titleMeta: "企業システムに AI を導入する四段階と四つの能力層",
      title: "四つの段階、四つの能力層",
      subtitle: "一段進むたびに、システムが答える問いが一つ増える",
      questions: ["どこまで知っている？", "どこまでできる？", "自力で進められる？", ["結果の責任は", "誰が負う？"]],
      capabilities: ["データガバナンス", "ツールガバナンス", "意図と状態", "体系的な監督"],
      footer: ["中間版は飛ばせても、能力構築と検証は飛ばせない"]
    },
    diagram02: {
      titleMeta: "ユーザーの表現を実行可能な注文タスクへ絞り込む",
      title: "一つの発話から、実行可能なタスクへ",
      subtitle: "業務領域を特定し、具体的な意図に分け、正しいワークフローへ進む",
      labels: ["ユーザーの表現", "業務領域", "具体的な意図", "実行順序"],
      values: [
        "「配送が3日動いていません。苦情と返金をお願いします」",
        "注文のアフターサービス",
        "配送異常 + 苦情 + 返金申請",
        "まず配送確認、次に返金判断、最後に苦情対応へ"
      ],
      footer: "ワークフローを誤れば、その後が順調でも意味はない"
    },
    diagram03: {
      titleMeta: "Copilot の人による確認と Agent のシステムガードレール",
      title: "人による確認を、システムのガードレールへ",
      subtitle: "無人運用は、無監督という意味ではない",
      copilotNote: "重要な節目は人が確認",
      flow: ["目標", "実行", "人"],
      copilotSummary: "リスクを人が一件ずつ受け止める",
      copilotControls: "確認 · 却下 · 引き継ぎ",
      agentNote: "合意した境界内で自律運用",
      agentFlow: "目標 → 実行 → 結果",
      guardrail: "システムのガードレールが常時作動",
      controls1: "権限　予算　監視",
      controls2: "自動停止　監査　復旧",
      accountability: "責任体制とインシデント対応",
      footer: "Agent は境界内の責任を引き受ける約束"
    },
    diagram04: {
      titleMeta: "知識、ツール、ワークフロー、ガバナンスの四層から次の能力を判断する",
      title: "足りない層から先に整える",
      subtitle: "最初から「Agent をどう作るか」と問わない",
      layers: [
        ["知識", ["回答に根拠はあるか？ 分からないと認められるか？"]],
        ["ツール", ["入口は明確で、安全かつ追跡可能か？"]],
        ["ワークフロー", ["タスクを進め続け、変化後も再開できるか？"]],
        ["ガバナンス", ["境界内で問題が起きたら、誰が対応し責任を負うか？"]]
      ],
      footer: "最も弱い層を見つけ、そこから始める"
    }
  },
  ko: {
    fileLocale: "ko",
    mascotLabel: "오리지널 캐릭터 윈저우",
    cover: {
      brand: "Luffy Liu",
      title: "기업 레거시 시스템에 AI를 도입하려면? 먼저 네 단계를 살펴보자",
      description: "Luffy Liu의 글 표지. 오른쪽에는 오리지널 테크 탐험가 윈저우와 세 개의 행성, 왼쪽에는 글 제목이 있다.",
      lines: ["기업 레거시 시스템에", "AI를 도입하려면?", "먼저 네 단계를 살펴보자"],
      titleSize: 42
    },
    diagram01: {
      titleMeta: "기업 시스템의 AI 도입 네 단계와 네 겹의 역량",
      title: "네 단계, 네 겹의 역량",
      subtitle: "한 단계 나아갈 때마다 시스템이 답할 질문이 하나씩 늘어난다",
      questions: ["얼마나 알고 있는가?", "얼마나 할 수 있는가?", ["스스로 계속 진행할", "수 있는가?"], ["결과는 누가", "책임지는가?"]],
      capabilities: ["데이터 거버넌스", "도구 거버넌스", "의도와 상태", "체계적 감독"],
      footer: ["중간 버전 출시는 건너뛰어도", "역량 구축과 검증은 건너뛸 수 없다"]
    },
    diagram02: {
      titleMeta: "사용자 표현을 실행 가능한 주문 작업으로 좁히는 과정",
      title: "한 문장에서 실행 가능한 작업으로",
      subtitle: "업무 영역을 찾고 구체적 의도로 나눈 뒤 올바른 워크플로로 들어간다",
      labels: ["사용자 표현", "업무 영역", "구체적 의도", "실행 순서"],
      values: [
        "“배송이 사흘째 멈췄어요. 민원을 넣고 환불받고 싶어요.”",
        "주문 사후 지원",
        "배송 이상 + 민원 + 환불 신청",
        "먼저 배송 조회, 다음 환불 판단, 마지막 민원 처리"
      ],
      footer: "잘못된 워크플로에 들어가면 뒤의 실행이 순조로워도 의미가 없다"
    },
    diagram03: {
      titleMeta: "Copilot의 사람 확인과 Agent의 시스템 가드레일",
      title: "사람의 확인을 시스템 가드레일로",
      subtitle: "무인 운영은 무감독 운영이 아니다",
      copilotNote: "핵심 단계는 사람이 확인",
      flow: ["목표", "실행", "사람"],
      copilotSummary: "위험을 사람이 건별로 떠안는다",
      copilotControls: "확인 · 거절 · 인수",
      agentNote: "합의된 경계 안에서 자율 실행",
      agentFlow: "목표 → 실행 → 결과",
      guardrail: "시스템 가드레일 상시 작동",
      controls1: "권한　예산　모니터링",
      controls2: "서킷 브레이커　감사　복구",
      accountability: "책임 체계와 사고 대응",
      footer: "Agent는 경계 안의 결과를 책임지겠다는 약속이다"
    },
    diagram04: {
      titleMeta: "지식, 도구, 워크플로, 거버넌스 네 층에서 다음 역량을 판단한다",
      title: "부족한 층부터 먼저 채운다",
      subtitle: "처음부터 ‘Agent를 어떻게 만들까?’라고 묻지 않는다",
      layers: [
        ["지식", ["답변에 근거가 있는가? 모르면 모른다고 인정하는가?"]],
        ["도구", ["진입점이 명확하고 안전하며 추적 가능한가?"]],
        ["워크플로", ["작업을 계속 진행하고 변화 뒤에도 이어갈 수 있는가?"]],
        ["거버넌스", ["경계 안에서 문제가 생기면 누가 처리하고 책임지는가?"]]
      ],
      footer: "가장 약한 층을 찾아 그곳에서 시작한다"
    }
  },
  es: {
    fileLocale: "es",
    mascotLabel: "Personaje original Yunzhou",
    cover: {
      brand: "Luffy Liu",
      title: "¿Cómo incorporar IA a los sistemas heredados de una empresa? Empieza por estas cuatro etapas",
      description: "Portada del artículo de Luffy Liu con el explorador tecnológico original Yunzhou y tres planetas a la derecha y el título a la izquierda.",
      lines: ["¿Cómo incorporar IA a los", "sistemas heredados de una empresa?", "Empieza por estas cuatro etapas"],
      titleSize: 35
    },
    diagram01: {
      titleMeta: "Cuatro etapas y cuatro capas de capacidad para integrar IA en sistemas empresariales",
      title: "Cuatro Etapas, Cuatro Capas de Capacidad",
      subtitle: "Cada paso añade una pregunta que el sistema debe responder",
      questions: ["¿Cuánto sabe?", "¿Cuánto puede hacer?", ["¿Puede avanzar", "por sí solo?"], ["¿Quién asume", "el resultado?"]],
      capabilities: ["Gobernanza de datos", ["Gobernanza de", "herramientas"], "Intención y estado", ["Supervisión", "sistemática"]],
      footer: ["Se puede omitir un lanzamiento,", "pero no las capacidades ni la validación"]
    },
    diagram02: {
      titleMeta: "Una petición se concreta hasta convertirse en una tarea ejecutable",
      title: "De una Frase a una Tarea Ejecutable",
      subtitle: "Identifica el dominio, separa las intenciones y entra en el flujo correcto",
      labels: ["Petición", "Dominio de negocio", "Intenciones concretas", "Orden de ejecución"],
      values: [
        ["«El seguimiento lleva tres días sin cambiar.", "Quiero reclamar y pedir un reembolso»"],
        "Posventa de pedidos",
        "Anomalía logística + Reclamación + Reembolso",
        ["Revisar logística; evaluar reembolso;", "abrir reclamación"]
      ],
      footer: "Si el flujo es incorrecto, ejecutarlo bien no sirve de nada"
    },
    diagram03: {
      titleMeta: "Confirmación humana de Copilot y barreras del sistema de Agent",
      title: "La Revisión Humana se Convierte en Barreras del Sistema",
      subtitle: "Operación desatendida no significa operación sin control",
      copilotNote: ["Los puntos clave requieren", "confirmación humana"],
      flow: ["Objetivo", "Ejecución", "Persona"],
      copilotSummary: ["Las personas absorben el riesgo", "caso por caso"],
      copilotControls: "Revisar · Rechazar · Tomar el control",
      agentNote: ["Opera de forma autónoma dentro", "de límites acordados"],
      agentFlow: "Objetivo → Ejecución → Resultado",
      guardrail: "Las barreras del sistema siguen activas",
      controls1: "Permisos　Presupuesto　Monitorización",
      controls2: "Interrupción　Auditoría　Recuperación",
      accountability: ["Responsabilidad y respuesta", "a incidentes"],
      footer: "Agent asume responsabilidad dentro de límites"
    },
    diagram04: {
      titleMeta: "Evaluación de capacidades en conocimiento, herramientas, flujo de trabajo y gobernanza",
      title: "Completa Primero la Capa que Falta",
      subtitle: "No empieces por «¿cómo construimos un Agent?»",
      layers: [
        ["Conocimiento", ["¿La respuesta tiene respaldo?", "¿Admite cuando no sabe?"]],
        ["Herramientas", ["¿El acceso es claro, seguro y trazable?"]],
        ["Flujo de trabajo", ["¿La tarea sigue avanzando y puede retomarse", "tras un cambio?"]],
        ["Gobernanza", ["Si algo falla dentro del límite,", "¿quién responde y quién asume el resultado?"]]
      ],
      footer: "Encuentra la capa más débil y empieza allí"
    }
  }
};

export const originals = {
  diagram01: {
    source: "diagram-01-four-stages-original-v6.svg",
    output: "diagram-01-four-stages",
    width: 1080,
    height: 760
  },
  diagram02: {
    source: "diagram-02-intent-tree-original-v6.svg",
    output: "diagram-02-intent-tree",
    width: 1080,
    height: 820
  },
  diagram03: {
    source: "diagram-03-governance-original-v6.svg",
    output: "diagram-03-governance",
    width: 1080,
    height: 820
  },
  diagram04: {
    source: "diagram-04-upgrade-checklist-original-v6.svg",
    output: "diagram-04-upgrade-checklist",
    width: 1080,
    height: 880
  },
  cover: {
    source: "cover-liu-lufei-original-v8.svg",
    output: "cover-liu-lufei",
    width: 1410,
    height: 600
  }
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function setAttribute(attributes, name, value) {
  const escapedValue = escapeXml(value);
  const matcher = new RegExp(`\\s${escapeRegExp(name)}="[^"]*"`);
  if (matcher.test(attributes)) {
    return attributes.replace(matcher, ` ${name}="${escapedValue}"`);
  }
  return `${attributes} ${name}="${escapedValue}"`;
}

function normalizeSpec(spec) {
  if (typeof spec === "string") return { lines: [spec] };
  if (Array.isArray(spec)) return { lines: spec };
  return { ...spec, lines: Array.isArray(spec.lines) ? spec.lines : [spec.text] };
}

function replaceText(svg, sourceText, rawSpec) {
  const spec = normalizeSpec(rawSpec);
  const source = escapeXml(sourceText);
  const matcher = new RegExp(`<text([^>]*)>${escapeRegExp(source)}</text>`);
  const match = svg.match(matcher);
  if (!match) throw new Error(`Text node not found: ${sourceText}`);

  let attributes = match[1];
  for (const [name, value] of Object.entries(spec.attrs ?? {})) {
    attributes = setAttribute(attributes, name, String(value));
  }

  if (spec.lines.length === 1) {
    return svg.replace(matcher, `<text${attributes}>${escapeXml(spec.lines[0])}</text>`);
  }

  const xMatch = attributes.match(/\sx="([^"]+)"/);
  const yMatch = attributes.match(/\sy="([^"]+)"/);
  const x = spec.attrs?.x ?? xMatch?.[1];
  const y = spec.attrs?.y ?? yMatch?.[1];
  if (x === undefined || y === undefined) throw new Error(`Multiline text lacks x/y: ${sourceText}`);
  const lineHeight = spec.lineHeight ?? 28;
  const numericY = Number(y);
  if (!Number.isFinite(numericY)) throw new Error(`Multiline text has a non-numeric y coordinate: ${sourceText}`);
  const textLines = spec.lines
    .map((line, index) => {
      const lineAttributes = setAttribute(attributes, "y", String(numericY + index * lineHeight));
      return `<text${lineAttributes}>${escapeXml(line)}</text>`;
    })
    .join("");
  return svg.replace(matcher, `<g data-multiline="true">${textLines}</g>`);
}

function replaceTitle(svg, source, target) {
  const matcher = new RegExp(`<title([^>]*)>${escapeRegExp(escapeXml(source))}</title>`);
  if (!matcher.test(svg)) throw new Error(`SVG title not found: ${source}`);
  return svg.replace(matcher, `<title$1>${escapeXml(target)}</title>`);
}

function localizeBase(svg, locale, data) {
  const localeFont = FONTS[locale];
  svg = svg.replace("<svg ", `<svg lang="${locale}" data-locale="${locale}" `);
  svg = svg
    .replaceAll("PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans CJK SC, sans-serif", localeFont)
    .replaceAll("PingFang SC, Microsoft YaHei, sans-serif", localeFont)
    .replaceAll("原创云舟人物主持人", data.mascotLabel);
  return svg;
}

function localizeCover(svg, locale, data) {
  const cover = data.cover;
  svg = localizeBase(svg, locale, data);
  svg = replaceTitle(svg, "企业老系统如何接入 AI？先看这四个阶段", cover.title);
  svg = svg.replace(
    "刘路飞微信公众号文章封面，原创科技探索者云舟与三颗小星球出现在蓝白天空中，左侧为文章标题。",
    escapeXml(cover.description)
  );
  svg = replaceText(svg, "刘路飞", {
    lines: [cover.brand],
    attrs: {
      "font-size": cover.brand === "Luffy Liu" ? 25 : 27,
      "letter-spacing": cover.brand === "Luffy Liu" ? 1.5 : 4
    }
  });
  if (cover.lines.length === 2) {
    svg = replaceText(svg, "企业老系统如何接入 AI？", {
      lines: [cover.lines[0]],
      attrs: { "font-size": cover.titleSize, y: 246 }
    });
    svg = replaceText(svg, "先看这四个阶段", {
      lines: [cover.lines[1]],
      attrs: { "font-size": cover.titleSize, y: 321 }
    });
  } else {
    svg = replaceText(svg, "企业老系统如何接入 AI？", {
      lines: [cover.lines[0], cover.lines[1]],
      attrs: { "font-size": cover.titleSize, y: 224, "letter-spacing": 0 },
      lineHeight: 58
    });
    svg = replaceText(svg, "先看这四个阶段", {
      lines: [cover.lines[2]],
      attrs: { "font-size": cover.titleSize, y: 340, "letter-spacing": 0 }
    });
  }
  return svg;
}

const stageQuestionSources = ["知道多少？", "能做多少？", "能否自己推进？", "谁为结果负责？"];
const stageCapabilitySources = ["数据治理", "工具治理", "意图与状态", "系统化治理"];

function localizeDiagram01(svg, locale, data) {
  const diagram = data.diagram01;
  svg = localizeBase(svg, locale, data);
  svg = replaceTitle(svg, "企业系统接入 AI 的四个阶段与四层能力", diagram.titleMeta);
  svg = replaceText(svg, "四个阶段，四层能力", {
    lines: [diagram.title],
    attrs: { "font-size": locale === "es" ? 35 : locale === "en" ? 38 : 40 }
  });
  svg = replaceText(svg, "每向前一步，系统都要多回答一个问题", {
    lines: [diagram.subtitle],
    attrs: { "font-size": locale === "ko" || locale === "es" ? 19 : 20 }
  });
  for (let index = 0; index < 4; index += 1) {
    svg = replaceText(svg, stageQuestionSources[index], {
      lines: Array.isArray(diagram.questions[index]) ? diagram.questions[index] : [diagram.questions[index]],
      attrs: { "font-size": locale === "zh-TW" ? 20 : 17, y: 421 },
      lineHeight: 22
    });
    svg = replaceText(svg, stageCapabilitySources[index], {
      lines: Array.isArray(diagram.capabilities[index]) ? diagram.capabilities[index] : [diagram.capabilities[index]],
      attrs: { "font-size": locale === "zh-TW" ? 20 : 16, y: 464 },
      lineHeight: 21
    });
  }
  svg = replaceText(svg, "可以跳过版本上线，不能跳过能力建设和验证", {
    lines: diagram.footer,
    attrs: { "font-size": diagram.footer.length > 1 ? 20 : locale === "ko" ? 21 : 25, y: diagram.footer.length > 1 ? 615 : 630 },
    lineHeight: 27
  });
  return svg;
}

const diagram02LabelSources = ["用户表达", "业务域", "具体意图", "执行顺序"];
const diagram02ValueSources = [
  "“快递三天没动了，我要投诉并退款”",
  "订单售后",
  "物流异常  +  投诉  +  退款申请",
  "先查物流，再判断退款，最后进入投诉流程"
];

function localizeDiagram02(svg, locale, data) {
  const diagram = data.diagram02;
  svg = localizeBase(svg, locale, data);
  svg = replaceTitle(svg, "用户表达逐层收敛为可执行的订单任务", diagram.titleMeta);
  svg = replaceText(svg, "从一句话，到可执行任务", {
    lines: [diagram.title],
    attrs: { "font-size": locale === "en" || locale === "es" ? 35 : 38 }
  });
  svg = replaceText(svg, "先找业务域，再拆具体意图，最后进入正确的工作流", {
    lines: [diagram.subtitle],
    attrs: { "font-size": locale === "en" || locale === "es" ? 18 : locale === "ko" ? 18 : 19 }
  });
  for (let index = 0; index < 4; index += 1) {
    svg = replaceText(svg, diagram02LabelSources[index], {
      lines: [diagram.labels[index]],
      attrs: { "font-size": locale === "en" || locale === "es" ? 16 : 18 }
    });
    const valueLines = Array.isArray(diagram.values[index]) ? diagram.values[index] : [diagram.values[index]];
    const rowY = [246, 372, 498, 624][index];
    const needsTwoLines = valueLines.length > 1;
    svg = replaceText(svg, diagram02ValueSources[index], {
      lines: valueLines,
      attrs: {
        "font-size": index === 0 ? (needsTwoLines ? 20 : locale === "ko" || locale === "es" ? 21 : 23) : locale === "en" || locale === "es" ? 21 : 25,
        y: needsTwoLines ? rowY - 15 : rowY
      },
      lineHeight: 26
    });
  }
  svg = replaceText(svg, "走错工作流，后面执行得再顺也没有意义", {
    lines: [diagram.footer],
    attrs: { "font-size": locale === "en" || locale === "es" ? 21 : locale === "ko" ? 20 : 23 }
  });
  return svg;
}

function localizeDiagram03(svg, locale, data) {
  const diagram = data.diagram03;
  svg = localizeBase(svg, locale, data);
  svg = replaceTitle(svg, "Copilot 的人工确认与 Agent 的系统护栏", diagram.titleMeta);
  const replacements = [
    ["人工检查，变成系统护栏", diagram.title, { "font-size": locale === "es" ? 31 : locale === "en" ? 35 : 38 }],
    ["无人值守不等于无人监管", diagram.subtitle, { "font-size": locale === "en" || locale === "es" ? 18 : 20 }],
    ["关键节点由人确认", diagram.copilotNote, { "font-size": locale === "en" || locale === "es" ? 16 : 18 }],
    ["目标", diagram.flow[0], { "font-size": locale === "en" || locale === "es" ? 15 : 18 }],
    ["执行", diagram.flow[1], { "font-size": locale === "en" || locale === "es" ? 14 : 18 }],
    ["人", diagram.flow[2], { "font-size": locale === "en" || locale === "es" ? 13 : 18 }],
    ["风险由人工逐笔接住", diagram.copilotSummary, { "font-size": locale === "en" || locale === "es" ? 18 : 22 }],
    ["检查 · 驳回 · 接管", diagram.copilotControls, { "font-size": locale === "en" || locale === "es" ? 16 : 18 }],
    ["在约定边界内自主运行", diagram.agentNote, { "font-size": locale === "en" || locale === "es" ? 16 : 18 }],
    ["目标 → 执行 → 结果", diagram.agentFlow, { "font-size": locale === "en" || locale === "es" ? 20 : 23 }],
    ["系统护栏持续生效", diagram.guardrail, { "font-size": locale === "en" || locale === "es" ? 15 : 18 }],
    ["权限　预算　监控", diagram.controls1, { "font-size": locale === "en" || locale === "es" ? 15 : 18 }],
    ["熔断　审计　恢复", diagram.controls2, { "font-size": locale === "en" || locale === "es" ? 15 : 18 }],
    ["责任主体与事故响应", diagram.accountability, { "font-size": locale === "en" || locale === "es" ? 17 : 20 }],
    ["Agent 是边界内的责任承诺", diagram.footer, { "font-size": locale === "en" || locale === "es" ? 21 : locale === "ko" ? 22 : 25 }]
  ];
  for (const [source, target, attrs] of replacements) {
    const lines = Array.isArray(target) ? target : [target];
    const defaultY = source === "在约定边界内自主运行" ? 273 : source === "责任主体与事故响应" ? 556 : source === "风险由人工逐笔接住" ? 454 : undefined;
    svg = replaceText(svg, source, {
      lines,
      attrs: { ...attrs, ...(lines.length > 1 && defaultY ? { y: defaultY - 12 } : {}) },
      lineHeight: 22
    });
  }
  return svg;
}

const diagram04LayerSources = ["知识", "工具", "工作流", "治理"];
const diagram04QuestionSources = [
  "回答有没有依据？不知道时会不会承认？",
  "入口是否清楚、安全并且可以追踪？",
  "任务能否持续推进，变化以后能否接着走？",
  "边界内出了问题，谁处理，谁负责？"
];

function localizeDiagram04(svg, locale, data) {
  const diagram = data.diagram04;
  svg = localizeBase(svg, locale, data);
  svg = replaceTitle(svg, "企业从知识、工具、工作流和治理四层判断需要补齐的能力", diagram.titleMeta);
  svg = replaceText(svg, "先补自己缺的那一层", {
    lines: [diagram.title],
    attrs: { "font-size": locale === "en" || locale === "es" ? 35 : 38 }
  });
  svg = replaceText(svg, "不要一开始就问“怎样做 Agent”", {
    lines: [diagram.subtitle],
    attrs: { "font-size": locale === "en" || locale === "es" ? 18 : 20 }
  });
  const rowY = [289, 413, 537, 661];
  for (let index = 0; index < 4; index += 1) {
    const [label, questionLines] = diagram.layers[index];
    svg = replaceText(svg, diagram04LayerSources[index], {
      lines: [label],
      attrs: { "font-size": locale === "en" || locale === "es" ? 22 : locale === "ko" ? 24 : 27 }
    });
    svg = replaceText(svg, diagram04QuestionSources[index], {
      lines: questionLines,
      attrs: {
        "font-size": locale === "en" || locale === "es" ? 18 : locale === "ko" ? 19 : 21,
        y: questionLines.length > 1 ? rowY[index] - 12 : rowY[index]
      },
      lineHeight: 23
    });
  }
  svg = replaceText(svg, "找到当前最薄弱的一层，从那里开始", {
    lines: [diagram.footer],
    attrs: { "font-size": locale === "en" || locale === "es" ? 22 : locale === "ko" ? 21 : 24 }
  });
  return svg;
}

const localizers = {
  cover: localizeCover,
  diagram01: localizeDiagram01,
  diagram02: localizeDiagram02,
  diagram03: localizeDiagram03,
  diagram04: localizeDiagram04
};

export function generateLocalizedVisuals({ svgOnly = false } = {}) {
  const generated = [];
  for (const [locale, data] of Object.entries(localeData)) {
    for (const [assetKey, asset] of Object.entries(originals)) {
      const sourcePath = path.join(ASSET_ROOT, asset.source);
      const outputStem = `${asset.output}-${data.fileLocale}-v1`;
      const svgPath = path.join(ASSET_ROOT, `${outputStem}.svg`);
      const pngPath = path.join(ASSET_ROOT, `${outputStem}.png`);
      const source = readFileSync(sourcePath, "utf8");
      const localized = `${localizers[assetKey](source, locale, data).trim()}\n`;
      writeFileSync(svgPath, localized, "utf8");
      generated.push({ svgPath, pngPath, width: asset.width, height: asset.height });
    }
  }

  if (!svgOnly) {
    if (process.platform !== "darwin") {
      throw new Error("PNG rendering currently requires macOS. Run with --svg-only on other platforms.");
    }
    const tempRoot = mkdtempSync(path.join(tmpdir(), "luffy-svg-render-"));
    const renderer = path.join(tempRoot, "render-svg");
    try {
      const compile = spawnSync(
        "swiftc",
        ["-module-cache-path", path.join(tempRoot, "swift-cache"), path.join(REPO_ROOT, "scripts/render-svg.swift"), "-o", renderer],
        { encoding: "utf8" }
      );
      if (compile.status !== 0) {
        throw new Error(`Swift renderer compilation failed:\n${compile.stderr || compile.stdout}`);
      }
      for (const item of generated) {
        const render = spawnSync(renderer, [item.svgPath, item.pngPath, String(item.width), String(item.height)], {
          encoding: "utf8"
        });
        if (render.status !== 0) {
          throw new Error(`PNG rendering failed for ${item.svgPath}:\n${render.stderr || render.stdout}`);
        }
      }
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  }

  return generated;
}

if (path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  const svgOnly = process.argv.includes("--svg-only");
  const generated = generateLocalizedVisuals({ svgOnly });
  console.log(`Generated ${generated.length} localized SVG${svgOnly ? "" : "/PNG"} pairs.`);
}
