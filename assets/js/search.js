const form = document.querySelector("#blog-search-form");
const input = document.querySelector("#blog-search-input");
const type = document.querySelector("#blog-search-type");
const tag = document.querySelector("#blog-search-tag");
const year = document.querySelector("#blog-search-year");
const sort = document.querySelector("#blog-search-sort");
const submit = form?.querySelector(".search-submit");
const status = document.querySelector("#blog-search-status");
const results = document.querySelector("#blog-search-results");
const more = document.querySelector("#blog-search-more");
const configNode = document.querySelector("#blog-search-config");

if (form && input && type && tag && year && sort && submit && status && results && more && configNode) {
  const config = JSON.parse(configNode.textContent);
  const batchSize = 20;
  let pagefindPromise;
  let generation = 0;
  let activeStubs = [];
  let renderedCount = 0;
  let sortIsAutomatic = true;

  const loadPagefind = () => {
    pagefindPromise ||= import("/pagefind/pagefind.js").then(async (pagefind) => {
      await pagefind.options({ excerptLength: 30 });
      return pagefind;
    });
    return pagefindPromise;
  };

  const currentFilters = () => {
    const filters = {};
    if (type.value) filters.section = type.value;
    if (tag.value) filters.tag = tag.value;
    if (year.value) filters.year = year.value;
    return filters;
  };

  const hasCriteria = () => Boolean(input.value.trim() || type.value || tag.value || year.value);

  const updateUrl = () => {
    const params = new URLSearchParams();
    const query = input.value.trim();
    if (query) params.set("q", query);
    if (tag.value) params.set("tag", tag.value);
    if (year.value) params.set("year", year.value);
    if (type.value) params.set("type", type.value);
    if (hasCriteria()) params.set("sort", sort.value);
    history.replaceState(null, "", params.size ? `${location.pathname}?${params}` : location.pathname);
  };

  const setStatus = (state, message, focus = false) => {
    status.dataset.state = state;
    status.textContent = message;
    if (focus) status.focus({ preventScroll: true });
  };

  const setBusy = (busy) => {
    form.setAttribute("aria-busy", String(busy));
    results.setAttribute("aria-busy", String(busy));
    submit.disabled = busy;
  };

  const renderSkeletons = () => {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 3; index += 1) {
      const skeleton = document.createElement("div");
      skeleton.className = "search-skeleton";
      skeleton.setAttribute("aria-hidden", "true");
      skeleton.innerHTML = "<span></span><strong></strong><i></i><i></i>";
      fragment.append(skeleton);
    }
    results.replaceChildren(fragment);
  };

  const appendTrustedExcerpt = (container, html) => {
    const template = document.createElement("template");
    template.innerHTML = html;
    for (const element of [...template.content.querySelectorAll("*")]) {
      if (element.tagName !== "MARK") element.replaceWith(...element.childNodes);
    }
    container.append(template.content);
  };

  const resultCard = (item) => {
    const article = document.createElement("article");
    article.className = "search-result";

    const pathname = new URL(item.url, location.origin).pathname;
    const contentType = pathname.includes("/tutorials/") ? config.tutorialType : config.blogType;
    const tagValues = Array.isArray(item.meta.tag) ? item.meta.tag : [item.meta.tag];
    const metaValues = [contentType, item.meta.date, ...tagValues].filter(Boolean);

    const meta = document.createElement("p");
    meta.className = "search-result-meta";
    meta.textContent = metaValues.join(" · ");

    const heading = document.createElement("h2");
    const link = document.createElement("a");
    link.href = item.url;
    link.textContent = item.meta.title || config.untitled;
    heading.append(link);

    const excerpt = document.createElement("p");
    excerpt.className = "search-result-excerpt";
    if (item.excerpt) appendTrustedExcerpt(excerpt, item.excerpt);
    else excerpt.textContent = item.meta.description || "";

    const action = document.createElement("a");
    action.className = "search-result-action";
    action.href = item.url;
    action.textContent = `${config.read} →`;

    article.append(meta, heading, excerpt, action);
    return article;
  };

  const summaryText = () => config.summary
    .replace("{total}", String(activeStubs.length))
    .replace("{shown}", String(renderedCount));

  const appendBatch = async (run, focusStatus = false) => {
    const batch = activeStubs.slice(renderedCount, renderedCount + batchSize);
    if (!batch.length) return;
    more.disabled = true;
    if (renderedCount) setStatus("loading", config.loadingMore);
    const loaded = await Promise.all(batch.map((stub) => stub.data()));
    if (run !== generation) return;
    const fragment = document.createDocumentFragment();
    for (const item of loaded) fragment.append(resultCard(item));
    results.append(fragment);
    renderedCount += loaded.length;
    more.hidden = renderedCount >= activeStubs.length;
    more.disabled = false;
    setStatus("results", summaryText(), focusStatus);
  };

  const runSearch = async ({ debounced = false, focusStatus = false } = {}) => {
    const run = ++generation;
    const query = input.value.trim();
    if (!hasCriteria()) {
      activeStubs = [];
      renderedCount = 0;
      results.replaceChildren();
      more.hidden = true;
      setBusy(false);
      setStatus("initial", config.prompt, focusStatus);
      updateUrl();
      return;
    }

    updateUrl();
    setBusy(true);
    more.hidden = true;
    setStatus("loading", config.loading);
    renderSkeletons();

    try {
      const pagefind = await loadPagefind();
      const options = { filters: currentFilters() };
      if (sort.value === "newest") options.sort = { date: "desc" };
      if (sort.value === "oldest") options.sort = { date: "asc" };
      const response = debounced && query
        ? await pagefind.debouncedSearch(query, options, 280)
        : await pagefind.search(query || null, options);
      if (run !== generation || response === null) return;

      activeStubs = response.results;
      renderedCount = 0;
      results.replaceChildren();
      if (!activeStubs.length) {
        setStatus("empty", config.none, focusStatus);
        return;
      }
      await appendBatch(run, focusStatus);
    } catch (error) {
      if (run !== generation) return;
      console.error("Pagefind search failed", error);
      activeStubs = [];
      renderedCount = 0;
      results.replaceChildren();
      more.hidden = true;
      setStatus("error", config.error, focusStatus);
    } finally {
      if (run === generation) setBusy(false);
    }
  };

  const setSelectValue = (select, value, fallback = "") => {
    select.value = value || fallback;
    if (select.selectedIndex < 0) select.value = fallback;
  };

  const params = new URLSearchParams(location.search);
  input.value = params.get("q") || "";
  setSelectValue(type, params.get("type"));
  setSelectValue(tag, params.get("tag"));
  setSelectValue(year, params.get("year"));
  sortIsAutomatic = !params.has("sort");
  setSelectValue(sort, params.get("sort"), input.value.trim() ? "relevance" : "newest");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch({ focusStatus: true });
  });
  input.addEventListener("input", () => {
    if (sortIsAutomatic) sort.value = input.value.trim() ? "relevance" : "newest";
    runSearch({ debounced: Boolean(input.value.trim()) });
  });
  for (const select of [type, tag, year]) select.addEventListener("change", () => runSearch());
  sort.addEventListener("change", () => {
    sortIsAutomatic = false;
    runSearch();
  });
  form.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      sortIsAutomatic = true;
      sort.value = "newest";
      input.focus();
      runSearch();
    });
  });
  more.addEventListener("click", async () => {
    const run = generation;
    try {
      await appendBatch(run, true);
    } catch (error) {
      if (run !== generation) return;
      console.error("Pagefind result loading failed", error);
      more.disabled = false;
      setStatus("error", config.error, true);
    }
  });

  if (hasCriteria()) runSearch();
}
