(() => {
  const storageKey = "luffy-language-preference";
  const supported = ["zh-CN", "zh-TW", "en", "ja", "ko", "es"];
  const normalize = (value = "") => {
    const lower = value.toLowerCase();
    if (lower === "zh-tw" || lower === "zh-hk" || lower === "zh-hant") return "zh-TW";
    if (lower.startsWith("zh")) return "zh-CN";
    return supported.find((locale) => lower === locale.toLowerCase() || lower.startsWith(`${locale.toLowerCase()}-`)) || null;
  };

  document.querySelectorAll("a[data-language]").forEach((link) => {
    link.addEventListener("click", () => {
      const locale = normalize(link.dataset.language);
      if (locale) try { localStorage.setItem(storageKey, locale); } catch (_) {}
    });
  });

  const current = normalize(document.documentElement.lang) || "zh-CN";
  let saved = null;
  try { saved = normalize(localStorage.getItem(storageKey)); } catch (_) {}
  const detected = (navigator.languages || [navigator.language]).map(normalize).find(Boolean);
  const preferred = saved || detected;
  if (!preferred || preferred === current) return;

  const alternate = document.querySelector(`link[rel="alternate"][hreflang="${preferred}"]`);
  const switchLink = document.querySelector(`a[data-language="${preferred}"]`);
  const isContentDetail = Boolean(document.querySelector("[data-pagefind-body]"));
  const target = alternate?.href || (!isContentDetail ? switchLink?.href : null);
  if (!target || new URL(target, location.href).pathname === location.pathname) return;

  const labels = { "zh-CN": "简体中文", "zh-TW": "繁體中文", en: "English", ja: "日本語", ko: "한국어", es: "Español" };
  const fallbackCopy = {
    "zh-CN": { message: "此页面也有{language}版本；我们不会自动跳转。", action: "切换语言", dismiss: "关闭语言提示" },
    "zh-TW": { message: "此頁面也有{language}版本；我們不會自動跳轉。", action: "切換語言", dismiss: "關閉語言提示" },
    en: { message: "This page is also available in {language}; we will not redirect automatically.", action: "Switch language", dismiss: "Dismiss language suggestion" },
    ja: { message: "このページには{language}版もあります。自動的には移動しません。", action: "言語を切り替える", dismiss: "言語の案内を閉じる" },
    ko: { message: "이 페이지는 {language}로도 볼 수 있으며 자동으로 이동하지 않습니다.", action: "언어 전환", dismiss: "언어 안내 닫기" },
    es: { message: "Esta página también está disponible en {language}; no te redirigiremos automáticamente.", action: "Cambiar idioma", dismiss: "Cerrar sugerencia de idioma" }
  };
  let pageCopy = null;
  try { pageCopy = JSON.parse(document.querySelector("#language-copy")?.textContent || "null"); } catch (_) {}
  const message = (pageCopy?.switchRecommended || fallbackCopy[current].message).replace("{language}", labels[preferred]);
  const action = pageCopy?.switchAction || fallbackCopy[current].action;
  const banner = document.createElement("aside");
  banner.className = "language-recommendation";
  banner.setAttribute("aria-label", "Language recommendation");
  banner.innerHTML = `<span>${message}</span><a href="${target}" data-language="${preferred}">${action}</a><button type="button" aria-label="${fallbackCopy[current].dismiss}">×</button>`;
  banner.querySelector("a").addEventListener("click", () => {
    try { localStorage.setItem(storageKey, preferred); } catch (_) {}
  });
  banner.querySelector("button").addEventListener("click", () => banner.remove());
  document.body.append(banner);
})();
