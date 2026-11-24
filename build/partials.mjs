import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = ROOT;
const recipes = JSON.parse(fs.readFileSync(path.join(SITE, "data", "recipes.json"), "utf8"));

const SITE_URL = "https://theflavorfind.netlify.app";
const SITE_NAME = "TheFlavorFind";
const TODAY = new Date().toISOString().slice(0, 10);

const CATEGORIES = [
  { slug: "pequeno-almoco", name: "Pequeno-almoço", short: "Começar bem o dia",
    intro: "Panquecas, papas de aveia, ovos e tostas: receitas para manhãs com tempo e para dias em que é preciso sair de casa depressa.",
    icon: "coffee" },
  { slug: "massas", name: "Massas", short: "Conforto em forma de prato",
    intro: "Da carbonara ao risoto de massa, molhos que se fazem enquanto a água ferve. Receitas italianas e adaptações portuguesas.",
    icon: "pasta" },
  { slug: "carne", name: "Carne", short: "Assados e guisados",
    intro: "Frango no forno, bifes selados, guisados de tacho e clássicos portugueses. Técnicas simples explicadas passo a passo.",
    icon: "steak" },
  { slug: "peixe", name: "Peixe", short: "Do mar para a mesa",
    intro: "Bacalhau, salmão, dourada e atum, com métodos que respeitam o produto e evitam que o peixe seque.",
    icon: "fish" },
  { slug: "vegetarianas", name: "Vegetarianas", short: "Legumes com protagonismo",
    intro: "Pratos vegetarianos completos, com leguminosas, cereais e legumes, pensados para saciar e não apenas para acompanhar.",
    icon: "leaf" },
  { slug: "sobremesas", name: "Sobremesas", short: "O final feliz",
    intro: "Pastéis de nata, bolos húmidos, tartes e mousses. Sobremesas caseiras com instruções honestas sobre os pontos críticos.",
    icon: "cake" }
];

const catBySlug = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));
const recipeBySlug = Object.fromEntries(recipes.map((r) => [r.slug, r]));

/* --------------------------------- ícones --------------------------------- */

const icon = {
  pan: `<svg class="brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="44" height="44" rx="13" fill="#FF6B1A"/>
    <path d="M13 22h18a2 2 0 0 1 2 2v3a8 8 0 0 1-8 8h-6a8 8 0 0 1-8-8v-5Z" fill="#0A0A0A"/>
    <path d="M33 24h3a2 2 0 0 1 0 4h-3" stroke="#0A0A0A" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M19 17c0-2 2-2 2-4M25 17c0-2 2-2 2-4" stroke="#0A0A0A" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.2a3 3 0 0 1 0 5.6M17 14.2c2.3.6 4 2.8 4 5.8"/></svg>`,
  chef: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 13a4 4 0 0 1-1-7.9A4.5 4.5 0 0 1 12 3a4.5 4.5 0 0 1 7 2.1A4 4 0 0 1 18 13"/><path d="M6 13h12v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6Z"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 4C10 4 4 9 4 16c0 2 1 4 1 4s2-9 15-11"/><path d="M4 20c2-8 8-12 16-16"/></svg>`,
  coffee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z"/><path d="M16 10h2a2.5 2.5 0 0 1 0 5h-2M7 4c0 1-1 1.5-1 2.5M11 4c0 1-1 1.5-1 2.5"/></svg>`,
  pasta: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 11h18c0 5-4 9-9 9s-9-4-9-9Z"/><path d="M7 8c0-2 2-2 2-4M12 8c0-2 2-2 2-4M17 8c0-2 2-2 2-4"/></svg>`,
  steak: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 9a6 6 0 0 1 6-6h3a8 8 0 0 1 5 14l-5 4a4 4 0 0 1-5-1l-3-4a6 6 0 0 1-1-7Z"/><circle cx="11" cy="9" r="2"/></svg>`,
  fish: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 12c4-6 10-7 15-4l3-3v14l-3-3c-5 3-11 2-15-4Z"/><circle cx="8" cy="11" r="1" fill="currentColor"/></svg>`,
  cake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 20h16v-6a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v6Z"/><path d="M4 15c3 2 5-1 8 0s5 1 8 0M12 8V5M12 3v.5"/></svg>`
};

const CATEGORY_ICON = { coffee: "coffee", pasta: "pasta", steak: "steak", fish: "fish", leaf: "leaf", cake: "cake" };

/* -------------------------------- utilitários ------------------------------ */

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const timeLabel = (min) => {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
};
const iso = (min) => `PT${min >= 60 ? Math.floor(min / 60) + "H" : ""}${min % 60 ? (min % 60) + "M" : ""}` || "PT0M";

function head({ title, description, canonical, image, type = "website", jsonld = null, noindex = false }) {
  return `<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  ${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
  <meta name="google-adsense-account" content="ca-pub-3918165477241157">
  <meta name="theme-color" content="#0A0A0A">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:locale" content="pt_PT">
  <meta property="og:type" content="${type}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  ${image ? `<meta property="og:image" content="${SITE_URL}${image}">` : ""}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  ${image ? `<meta name="twitter:image" content="${SITE_URL}${image}">` : ""}
  <link rel="icon" href="/icons/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/icons/icon-192.png">
  <link rel="manifest" href="/manifest.json">


  <link rel="stylesheet" href="/style.css">
  <script src="/scripts.js" defer></script>
  ${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
</head>
<body>
<a class="skip-link" href="#conteudo">Saltar para o conteúdo</a>`;
}

function header(active = "") {
  const link = (href, label, key) =>
    `<a href="${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`;
  return `
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="TheFlavorFind — início">
      ${icon.pan}
      <span class="brand-word"><span class="the">THE</span><span class="flavor">FLAVOR</span><span class="find">FIND</span></span>
    </a>
    <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="menu-principal" aria-label="Abrir menu">
      ${icon.menu}
    </button>
    <nav class="site-nav" id="menu-principal" data-nav aria-label="Navegação principal">
      ${link("/", "Início", "home")}
      ${link("/receitas/", "Receitas", "recipes")}
      ${link("/categorias/", "Categorias", "categories")}
      ${link("/sobre.html", "Sobre", "about")}
      <a class="header-cta" href="/receitas/">Explorar receitas ${icon.arrow}</a>
    </nav>
  </div>
</header>`;
}

function footer() {
  return `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/" aria-label="TheFlavorFind — início">
          ${icon.pan}
          <span class="brand-word"><span class="the">THE</span><span class="flavor">FLAVOR</span><span class="find">FIND</span></span>
        </a>
        <p>Receitas originais em português de Portugal, explicadas com detalhe e sem promessas exageradas. Cozinha real, para pessoas reais.</p>
      </div>
      <div class="footer-col">
        <h3>Explorar</h3>
        <ul>
          <li><a href="/receitas/">Todas as receitas</a></li>
          <li><a href="/categorias/">Categorias</a></li>
          <li><a href="/politica-editorial.html">Como escrevemos</a></li>
          <li><a href="/sobre.html">Sobre o projeto</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Categorias</h3>
        <ul>
          ${CATEGORIES.slice(0, 4).map((c) => `<li><a href="/categorias/${c.slug}.html">${c.name}</a></li>`).join("")}
        </ul>
      </div>
      <div class="footer-col">
        <h3>Informação</h3>
        <ul>
          <li><a href="/contacto.html">Contacto</a></li>
          <li><a href="/politica-editorial.html">Política editorial</a></li>
          <li><a href="/privacidade.html">Privacidade</a></li>
          <li><a href="/cookies.html">Cookies</a></li>
          <li><a href="/termos.html">Termos de utilização</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} TheFlavorFind. Todos os direitos reservados.</span>
      <span>As imagens das receitas são ilustrativas e foram geradas por inteligência artificial.</span>
    </div>
  </div>
</footer>
</body>
</html>`;
}

function card(r, index = 0) {
  return `
<article class="recipe-card reveal" style="transition-delay:${Math.min(index * 45, 300)}ms">
  <a href="/receitas/${r.slug}.html" aria-label="Ver receita: ${esc(r.name)}">
    <div class="recipe-card-media">
      <img src="${r.imageThumb}" alt="${esc(r.imageAlt)}" loading="lazy" width="600" height="400">
      <span class="recipe-badge">${esc(r.categoryName)}</span>
    </div>
    <div class="recipe-card-body">
      <h3>${esc(r.name)}</h3>
      <p>${esc(r.description)}</p>
      <div class="recipe-meta">
        <span>${icon.clock}${timeLabel(r.prepTime + r.cookTime)}</span>
        <span>${icon.users}${r.servings} doses</span>
        <span class="difficulty">${esc(r.difficulty)}</span>
      </div>
    </div>
  </a>
</article>`;
}

export { icon, esc, timeLabel, iso, head, header, footer, card,
  CATEGORIES, catBySlug, recipes, recipeBySlug, SITE, SITE_URL, SITE_NAME, TODAY };
