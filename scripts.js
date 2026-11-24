/* TheFlavorFind — pesquisa e navegação da página inicial */

(function () {
  "use strict";

  const state = {
    recipes: [],
    query: "",
    category: "todas",
    usingApi: true
  };

  const els = {
    form: document.querySelector("[data-search-form]"),
    input: document.querySelector("[data-search-input]"),
    grid: document.querySelector("[data-results-grid]"),
    bar: document.querySelector("[data-results-bar]"),
    empty: document.querySelector("[data-empty]"),
    filters: document.querySelector("[data-filters]"),
    menuBtn: document.querySelector("[data-menu-toggle]"),
    nav: document.querySelector("[data-nav]")
  };

  const normalize = (text) =>
    String(text)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

  function timeLabel(min) {
    if (min < 60) return min + " min";
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h} h ${m} min` : `${h} h`;
  }

  function cardMarkup(r, index) {
    const delay = Math.min(index * 45, 320);
    return `
      <article class="recipe-card reveal" style="transition-delay:${delay}ms">
        <a href="${r.custom ? "/receita.html?slug=" + encodeURIComponent(r.slug) : "/receitas/" + encodeURIComponent(r.slug) + ".html"}" aria-label="Ver receita: ${escapeHtml(r.name)}">
          <div class="recipe-card-media">
            <img src="${escapeHtml(r.imageThumb || r.image)}" alt="${escapeHtml(r.imageAlt)}"
                 loading="lazy" width="600" height="400">
            <span class="recipe-badge">${escapeHtml(r.categoryName)}</span>
          </div>
          <div class="recipe-card-body">
            <h3>${escapeHtml(r.name)}</h3>
            <p>${escapeHtml(r.description)}</p>
            <div class="recipe-meta">
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                ${timeLabel(r.totalTime || (r.prepTime + r.cookTime))}
              </span>
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 11h16M12 4v16"/></svg>
                ${escapeHtml(r.servings)} doses
              </span>
              <span class="difficulty">${escapeHtml(r.difficulty)}</span>
            </div>
          </div>
        </a>
      </article>`;
  }

  function render(list) {
    if (!els.grid) return;
    if (!list.length) {
      els.grid.innerHTML = "";
      if (els.empty) els.empty.hidden = false;
      if (els.bar) els.bar.hidden = true;
      return;
    }
    if (els.empty) els.empty.hidden = true;
    if (els.bar) {
      els.bar.hidden = false;
      const q = state.query.trim();
      els.bar.innerHTML = q
        ? `<p><strong>${list.length}</strong> ${list.length === 1 ? "receita encontrada" : "receitas encontradas"} para “${escapeHtml(q)}”</p>`
        : `<p>A mostrar <strong>${list.length}</strong> receitas</p>`;
    }
    els.grid.innerHTML = list.map(cardMarkup).join("");
    observeReveals();
  }

  function filterLocally() {
    const q = normalize(state.query.trim());
    return state.recipes.filter((r) => {
      const inCategory = state.category === "todas" || r.category === state.category;
      if (!inCategory) return false;
      if (!q) return true;
      const haystack = [r.name, r.description, r.categoryName, ...(r.keywords || [])]
        .map(normalize).join(" ");
      const ingredientMatch = (r.ingredientNames || []).some((i) => normalize(i).includes(q));
      return haystack.includes(q) || ingredientMatch;
    });
  }

  let searchVersion = 0;
  async function search() {
    const version = ++searchVersion;
    const q = state.query.trim();
    if (!state.usingApi) {
      render(filterLocally());
      return;
    }
    const params = new URLSearchParams({limit: "100"});
    if (q) params.set("q", q);
    if (state.category !== "todas") params.set("category", state.category);
    try {
      const res = await fetch("/api/recipes?" + params.toString(), {
        headers: { Accept: "application/json" }
      });
      if (!res.ok) throw new Error("API indisponível");
      const data = await res.json();
      if (version === searchVersion) render(data.recipes || []);
    } catch (err) {
      if (version === searchVersion) render(filterLocally());
    }
  }

  async function loadInitial() {
    try {
      const res = await fetch("/data/recipes-summary.json");
      if (!res.ok) throw new Error("Falha ao carregar");
      const data = await res.json();
      state.recipes = data.recipes || data;
      if (state.query || state.category !== "todas") await search();
      else if (!searchVersion) render(state.recipes.slice(0, Number(els.grid?.dataset.limit) || 9));
    } catch (err) {
      if (els.grid) {
        els.grid.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1">
            <h3>Não foi possível mostrar as receitas</h3>
            <p>Verifique a ligação e tente novamente.</p>
            <button type="button" onclick="location.reload()">Recarregar</button>
          </div>`;
      }
    }
  }

  let debounce;
  if (els.input) {
    const params = new URLSearchParams(location.search);
    if (params.get("q")) {
      els.input.value = params.get("q");
      state.query = params.get("q");
    }

    els.input.addEventListener("input", () => {
      clearTimeout(debounce);
      state.query = els.input.value;
      debounce = setTimeout(() => {
        search();
        const results = document.querySelector("#receitas");
        if (results && state.query.length > 1 && window.scrollY < results.offsetTop - 100) return;
      }, 280);
    });

    els.form.addEventListener("submit", (e) => {
      e.preventDefault();
      state.query = els.input.value;
      search();
      document.querySelector("#receitas")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  document.querySelectorAll("[data-hint]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!els.input) return;
      els.input.value = btn.dataset.hint;
      state.query = btn.dataset.hint;
      search();
      document.querySelector("#receitas")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  if (els.filters) {
    els.filters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-category]");
      if (!btn) return;
      state.category = btn.dataset.category;
      els.filters.querySelectorAll("[data-category]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === btn))
      );
      search();
      document.querySelector("#receitas")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  document.querySelectorAll("[data-reset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      ++searchVersion;
      clearTimeout(debounce);
      state.query = "";
      state.category = "todas";
      if (els.input) els.input.value = "";
      els.filters?.querySelectorAll("[data-category]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.category === "todas"))
      );
      render(state.recipes.slice(0, Number(els.grid?.dataset.limit) || 9));
    });
  });

  if (els.menuBtn) {
    els.menuBtn.addEventListener("click", () => {
      const open = els.nav.classList.toggle("is-open");
      els.menuBtn.setAttribute("aria-expanded", String(open));
    });
    els.nav?.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        els.nav.classList.remove("is-open");
        els.menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  let observer;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    }
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => observer.observe(el));
  }

  observeReveals();
  if (els.grid) loadInitial();

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }
})();
