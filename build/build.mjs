import fs from "node:fs";
import path from "node:path";
import {
  icon, esc, timeLabel, iso, head, header, footer, card,
  CATEGORIES, catBySlug, recipes, recipeBySlug, SITE, SITE_URL, SITE_NAME, TODAY
} from "./partials.mjs";

const write = (rel, content) => {
  const p = path.join(SITE, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  console.log("  ✓", rel);
};

const featured = recipes.filter((r) => r.featured).slice(0, 6);
const countByCat = Object.fromEntries(CATEGORIES.map((c) => [c.slug, recipes.filter((r) => r.category === c.slug).length]));

/* ================================ HOME ================================== */

const homeJson = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL + "/",
  inLanguage: "pt-PT",
  description: "Receitas originais em português de Portugal, com ingredientes, tempos, dificuldade e instruções detalhadas.",
  potentialAction: {
    "@type": "SearchAction",
    target: SITE_URL + "/receitas/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

write("index.html", `${head({
  title: "TheFlavorFind — Receitas originais em português de Portugal",
  description: "Receitas originais em português de Portugal, com ingredientes reais, tempos honestos e instruções passo a passo. Pequeno-almoço, massas, carne, peixe, vegetarianas e sobremesas.",
  canonical: SITE_URL + "/",
  image: recipes[0].image,
  jsonld: homeJson
})}
${header("home")}
<main id="conteudo">

  <section class="hero">
    <div class="wrap hero-inner">
      <div>
        <span class="eyebrow">Cozinha portuguesa, sem complicações</span>
        <h1>Receitas que valem <em>a pena</em> cozinhar.</h1>
        <p class="hero-lead">${recipes.length} receitas originais, escritas em português de Portugal, com quantidades realistas, tempos honestos e explicações que fazem sentido à primeira leitura.</p>
        <div class="search-panel">
          <form class="search-form" data-search-form role="search" action="/receitas/" method="get">
            ${icon.search}
            <label class="sr-only" for="pesquisa">Pesquisar receitas por nome, ingrediente ou categoria</label>
            <input id="pesquisa" data-search-input name="q" type="search" placeholder="Receita, ingrediente ou categoria…" autocomplete="off">
            <button type="submit">Pesquisar</button>
          </form>
          <div class="search-hints">
            <span>Experimente:</span>
            <button class="hint-chip" type="button" data-hint="frango">frango</button>
            <button class="hint-chip" type="button" data-hint="chocolate">chocolate</button>
            <button class="hint-chip" type="button" data-hint="vegetariano">vegetariano</button>
            <button class="hint-chip" type="button" data-hint="bacalhau">bacalhau</button>
          </div>
        </div>
        <div class="hero-stats">
          <div><strong>${recipes.length}</strong><span>receitas completas</span></div>
          <div><strong>${CATEGORIES.length}</strong><span>categorias</span></div>
          <div><strong>0</strong><span>receitas copiadas</span></div>
        </div>
      </div>
      <a class="hero-visual" href="/receitas/${featured[0].slug}.html" aria-label="Ver receita em destaque: ${esc(featured[0].name)}">
        <img src="${featured[0].image}" alt="${esc(featured[0].imageAlt)}" width="1200" height="800" fetchpriority="high">
        <span class="hero-visual-tag"><span class="dot"></span> Em destaque · ${esc(featured[0].name)}</span>
      </a>
    </div>
  </section>

  <section class="section section-tight" aria-labelledby="titulo-categorias">
    <div class="wrap">
      <div class="section-head">
        <div>
          <span class="kicker">Por onde começar</span>
          <h2 id="titulo-categorias">Categorias</h2>
          <p>Seis formas de organizar a semana. Cada categoria reúne receitas com o mesmo tipo de técnica e de momento.</p>
        </div>
        <a class="link-more" href="/categorias/">Ver todas ${icon.arrow}</a>
      </div>
      <div class="category-grid">
        ${CATEGORIES.map((c) => `
          <a class="category-card reveal" href="/categorias/${c.slug}.html">
            <span class="cat-icon">${icon[c.icon]}</span>
            <h3>${c.name}</h3>
            <span>${countByCat[c.slug]} receitas</span>
          </a>`).join("")}
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="titulo-destaque">
    <div class="wrap">
      <div class="section-head">
        <div>
          <span class="kicker">Escolhidas pela redação</span>
          <h2 id="titulo-destaque">Receitas em destaque</h2>
          <p>Pratos que representam bem o tipo de cozinha que queremos aqui: claros, saborosos e possíveis numa cozinha normal.</p>
        </div>
        <a class="link-more" href="/receitas/">Ver todas as receitas ${icon.arrow}</a>
      </div>
      <div class="recipe-grid">
        ${featured.map((r, i) => card(r, i)).join("")}
      </div>
    </div>
  </section>

  <section class="section section-alt" id="receitas" aria-labelledby="titulo-receitas">
    <div class="wrap">
      <div class="section-head">
        <div>
          <span class="kicker">Pesquisar e filtrar</span>
          <h2 id="titulo-receitas">Todas as receitas</h2>
          <p>Pesquise por nome, ingrediente ou categoria. Os resultados aparecem à medida que escreve.</p>
        </div>
      </div>
      <div class="filters" data-filters role="group" aria-label="Filtrar por categoria">
        <button class="filter-chip" type="button" data-category="todas" aria-pressed="true">Todas</button>
        ${CATEGORIES.map((c) => `<button class="filter-chip" type="button" data-category="${c.slug}" aria-pressed="false">${c.name}</button>`).join("")}
      </div>
      <div class="results-bar" data-results-bar hidden></div>
      <div class="recipe-grid" data-results-grid data-limit="30">
        <div class="skeleton" style="grid-column:1/-1"></div>
      </div>
      <div class="empty-state" data-empty hidden>
        <h3>Nenhuma receita encontrada</h3>
        <p>Tente outro ingrediente, como “frango”, “tomate” ou “chocolate”, ou escolha uma categoria diferente.</p>
        <button type="button" data-reset>Limpar pesquisa</button>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="titulo-metodo">
    <div class="wrap">
      <div class="section-head">
        <div>
          <span class="kicker">Como trabalhamos</span>
          <h2 id="titulo-metodo">Receitas escritas para funcionar</h2>
          <p>Não publicamos listas de ingredientes sem contexto. Cada receita explica o que importa e onde é fácil errar.</p>
        </div>
      </div>
      <div class="category-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="category-card reveal" style="padding:26px">
          <span class="cat-icon">${icon.chef}</span>
          <h3>Instruções completas</h3>
          <p style="color:var(--muted);font-size:14.5px;margin:8px 0 0">Cada passo indica temperaturas, tempos e sinais visuais. Sem “cozinhe até estar pronto”.</p>
        </div>
        <div class="category-card reveal" style="padding:26px">
          <span class="cat-icon">${icon.leaf}</span>
          <h3>Ingredientes reais</h3>
          <p style="color:var(--muted);font-size:14.5px;margin:8px 0 0">Quantidades para doses concretas, com alternativas para quem não tem tudo em casa.</p>
        </div>
        <div class="category-card reveal" style="padding:26px">
          <span class="cat-icon">${icon.info}</span>
          <h3>Transparência</h3>
          <p style="color:var(--muted);font-size:14.5px;margin:8px 0 0">Indicamos alergénios, conservação e que as imagens são ilustrativas. Sem promessas falsas.</p>
        </div>
      </div>
      <div style="margin-top:34px">
        <div class="cta-band">
          <div>
            <h2>Porque é que este site existe</h2>
            <p>O TheFlavorFind nasceu da vontade de reunir receitas em português de Portugal que não obriguem a comprar ingredientes impossíveis nem a adivinhar tempos. Leia os nossos princípios editoriais.</p>
          </div>
          <a class="btn-primary" href="/sobre.html">Conhecer o projeto ${icon.arrow}</a>
        </div>
      </div>
    </div>
  </section>

</main>
${footer()}
`);

/* ============================== RECEITA ================================= */

function recipeJsonLd(r) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: r.name,
    description: r.description,
    image: [SITE_URL + r.image],
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL + "/sobre.html" },
    publisher: { "@type": "Organization", name: SITE_NAME },
    url: `${SITE_URL}/receitas/${r.slug}.html`,
    datePublished: TODAY,
    recipeCategory: r.categoryName,
    recipeCuisine: "Portuguesa",
    prepTime: iso(r.prepTime),
    cookTime: iso(r.cookTime),
    totalTime: iso(r.prepTime + r.cookTime),
    recipeYield: r.servingsLabel,
    difficulty: r.difficulty,
    keywords: r.keywords.join(", "),
    recipeIngredient: r.ingredients.map((i) => `${i.quantity} ${i.item}`),
    recipeInstructions: r.instructions.map((s) => ({
      "@type": "HowToStep",
      name: s.title,
      text: s.text
    })),
    nutrition: undefined
  };
}

for (const r of recipes) {
  const related = recipes.filter((x) => x.category === r.category && x.slug !== r.slug).slice(0, 3);
  const fill = related.length < 3 ? recipes.filter((x) => x.slug !== r.slug && !related.includes(x)).slice(0, 3 - related.length) : [];
  const rel = [...related, ...fill];

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "Receitas", item: SITE_URL + "/receitas/" },
      { "@type": "ListItem", position: 3, name: r.categoryName, item: `${SITE_URL}/categorias/${r.category}.html` },
      { "@type": "ListItem", position: 4, name: r.name, item: `${SITE_URL}/receitas/${r.slug}.html` }
    ]
  };

  write(`receitas/${r.slug}.html`, `${head({
    title: `${r.name} — Receita ${r.categoryName} | ${SITE_NAME}`,
    description: `${r.description.length > 110 ? r.description.slice(0, 107).replace(/\s+\S*$/, "") + "…" : r.description} ${r.servings} doses, ${timeLabel(r.prepTime + r.cookTime)} no total, dificuldade ${r.difficulty.toLowerCase()}.`,
    canonical: `${SITE_URL}/receitas/${r.slug}.html`,
    image: r.image,
    type: "article",
    jsonld: { "@context": "https://schema.org", "@graph": [recipeJsonLd(r), breadcrumb] }
  })}
${header("recipes")}
<main id="conteudo">
  <article>
    <header class="recipe-hero">
      <div class="recipe-hero-bg">
        <img src="${r.image}" alt="${esc(r.imageAlt)}" width="1200" height="800" fetchpriority="high">
      </div>
      <div class="wrap recipe-hero-inner">
        <nav class="breadcrumbs" aria-label="Caminho">
          <a href="/">Início</a><span class="sep">/</span>
          <a href="/receitas/">Receitas</a><span class="sep">/</span>
          <a href="/categorias/${r.category}.html">${r.categoryName}</a>
        </nav>
        <h1>${esc(r.name)}</h1>
        <p class="lead">${esc(r.description)}</p>
        <div class="recipe-quickmeta">
          <span class="quickmeta-pill">${icon.clock}<b>${timeLabel(r.prepTime + r.cookTime)}</b> no total</span>
          <span class="quickmeta-pill">${icon.users}<b>${r.servings}</b> doses</span>
          <span class="quickmeta-pill">${icon.chef}Dificuldade <b>${r.difficulty.toLowerCase()}</b></span>
          <span class="quickmeta-pill">${icon.pan}<b>${esc(r.categoryName)}</b></span>
        </div>
      </div>
    </header>

    <div class="wrap">
      <div class="recipe-layout">
        <aside class="ingredients-card" aria-labelledby="titulo-ingredientes">
          <h2 id="titulo-ingredientes">Ingredientes</h2>
          <ul class="ingredient-list">
            ${r.ingredients.map((i) => `<li><span class="qty">${esc(i.quantity)}</span><span>${esc(i.item)}</span></li>`).join("")}
          </ul>
          <p class="servings-note">Rende <strong>${esc(r.servingsLabel)}</strong>. Preparação: ${timeLabel(r.prepTime)} · Confeção: ${timeLabel(r.cookTime)}.</p>
        </aside>

        <div>
          <section class="recipe-section" aria-labelledby="titulo-preparacao">
            <h2 id="titulo-preparacao">Preparação passo a passo</h2>
            <ol class="steps">
              ${r.instructions.map((s) => `<li><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}
            </ol>
          </section>

          <section class="recipe-section" aria-labelledby="titulo-dicas">
            <h2 id="titulo-dicas">Dicas de culinária</h2>
            <div class="info-panel">
              <ul>${r.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
            </div>
          </section>

          <section class="recipe-section" aria-labelledby="titulo-alternativas">
            <h2 id="titulo-alternativas">Alternativas para ingredientes</h2>
            <table class="subs-table">
              <thead><tr><th scope="col">Ingrediente</th><th scope="col">Alternativa</th></tr></thead>
              <tbody>
                ${r.substitutions.map((s) => `<tr><td>${esc(s.for)}</td><td>${esc(s.alternative)}</td></tr>`).join("")}
              </tbody>
            </table>
          </section>

          <div class="info-grid">
            <section class="info-panel" aria-labelledby="titulo-alergenios">
              <h3 id="titulo-alergenios">${icon.info} Alergénios</h3>
              <div class="allergen-list">
                ${r.allergens.map((a) => `<span class="allergen-tag">${esc(a)}</span>`).join("")}
              </div>
              <p>${esc(r.allergenNote)}</p>
            </section>
            <section class="info-panel" aria-labelledby="titulo-conservacao">
              <h3 id="titulo-conservacao">${icon.info} Conservação</h3>
              <p>${esc(r.storage)}</p>
            </section>
          </div>

          <div class="disclaimer">
            ${icon.info}
            <p><strong>Nota de transparência:</strong> a fotografia desta receita é ilustrativa e foi gerada por inteligência artificial, pelo que pode não representar exatamente o resultado final. As quantidades, tempos e instruções foram revistos editorialmente, mas não foram testados em laboratório. Ajuste sempre os temperos e os tempos ao seu forno e aos ingredientes que tem em casa. <a href="/politica-editorial.html" style="color:var(--orange-soft)">Saiba como trabalhamos</a>.</p>
          </div>
        </div>
      </div>

      <section class="recipe-section" style="padding-top:20px" aria-labelledby="titulo-relacionadas">
        <h2 id="titulo-relacionadas">Também pode gostar</h2>
        <div class="related-grid">
          ${rel.map((x, i) => card(x, i)).join("")}
        </div>
      </section>

      <div style="padding:8px 0 64px">
        <a class="btn-ghost" href="/categorias/${r.category}.html">← Mais receitas de ${r.categoryName}</a>
      </div>
    </div>
  </article>
</main>
${footer()}
`);
}

/* ============================== CATEGORIAS =============================== */

const categoryContent = {
  "pequeno-almoco": {
    lead: "Pequeno-almoços que valem a pena acordar: panquecas fofas, papas cremosas, ovos bem cozinhados e tigelas frescas.",
    body: [
      "O pequeno-almoço é a refeição em que a diferença entre um resultado banal e um excelente está quase sempre no detalhe: a temperatura da frigideira, o tempo de repouso da massa ou o ponto exato dos ovos. As receitas desta categoria foram escritas a pensar nisso, com indicações que se podem verificar na cozinha — bolhas na superfície, cor, textura — em vez de instruções vagas.",
      "Há opções para todos os ritmos. As panquecas e as papas de aveia pedem 20 a 30 minutos e recompensam quem os tem ao fim de semana. As tostas e os ovos mexidos resolvem-se em menos de 15 minutos e servem tanto para um dia de trabalho como para um brunch improvisado. A tigela de iogurte com granola caseira é a mais versátil: a granola dura semanas e o resto monta-se em dois minutos."
    ],
    tips: [
      "Prepare os ingredientes antes de ligar o lume. No pequeno-almoço, a diferença entre ovos cremosos e ovos secos são 30 segundos.",
      "Aqueça bem a frigideira antes de deitar massa de panquecas; o primeiro teste diz-lhe se o lume está certo.",
      "Se costuma acordar com pressa, deixe a mistura seca da granola ou da massa preparada na noite anterior."
    ]
  },
  massas: {
    lead: "Massas com molhos que se fazem enquanto a água ferve, de clássicos italianos a adaptações para todos os dias.",
    body: [
      "A massa é provavelmente o melhor sítio para aprender técnica sem gastar muito dinheiro. Um molho de tomate bem apurado, uma emulsão de ovos e queijo ou cogumelos dourados em manteiga ensinam lições que servem para o resto da cozinha: controlar a humidade, respeitar a temperatura e usar a água da cozedura como ingrediente e não como desperdício.",
      "Nesta categoria encontrará clássicos como a carbonara e a arrabbiata, pratos de forno como a lasanha e opções rápidas como o esparguete com alho e azeite. Todas as receitas indicam a quantidade de água da cozedura a reservar, porque é ela que liga o molho à massa e evita pratos secos ou oleosos.",
      "Uma nota importante: a massa deve ficar al dente. Retire-a 1 a 2 minutos antes do tempo da embalagem e termine a cozedura no molho. É o pequeno gesto que separa uma massa correta de uma massa memorável."
    ],
    tips: [
      "Salgue a água como se fosse para o mar: é a única oportunidade de temperar a massa por dentro.",
      "Reserve sempre uma caneca de água da cozedura antes de escorrer. O amido ajuda o molho a aderir.",
      "Não lave a massa depois de escorrer; retira o amido que faz o molho agarrar."
    ]
  },
  carne: {
    lead: "Assados dourados, bifes com crosta e guisados de tacho que ficam melhores no dia seguinte.",
    body: [
      "Cozinhar carne é sobretudo uma questão de temperatura e de paciência. Um bife precisa de uma frigideira muito quente e de repouso depois de sair do lume; um assado precisa de tempo e de ser regado; um guisado precisa de lume baixo para as fibras se desfazerem sem secar. As receitas desta categoria explicam estes princípios em vez de os darem por adquiridos.",
      "Incluímos clássicos portugueses, como a carne de porco à alentejana, ao lado de pratos de inspiração italiana e de receitas de forno para partilhar. Sempre que possível, indicamos temperaturas internas ou sinais visuais que permitem saber se a carne está no ponto, porque o tempo varia com o forno, a espessura e a peça escolhida.",
      "A qualidade da carne importa, mas o tempero e o descanso importam tanto ou mais. Um bife barato bem selado e descansado é muitas vezes melhor do que uma peça cara cozinhada com pressa."
    ],
    tips: [
      "Retire a carne do frigorífico 30 minutos antes de cozinhar. O centro cozinha de forma mais uniforme.",
      "Seque bem a superfície antes de selar: a humidade transforma-se em vapor e impede a crosta.",
      "Deixe repousar qualquer peça de carne 5 a 15 minutos antes de cortar, para os sucos se redistribuírem."
    ]
  },
  peixe: {
    lead: "Bacalhau, salmão, dourada e atum, com técnicas que respeitam o produto e evitam o erro mais comum: cozinhar demais.",
    body: [
      "O peixe perde qualidade em minutos. É por isso que quase todas as receitas desta categoria insistem em dois pontos: secar bem o peixe antes de o cozinhar e retirá-lo do lume antes de estar completamente opaco. A diferença entre um filete suculento e um filete seco raramente está no tempero; está no tempo.",
      "Reunimos preparações para todos os níveis. O salmão com crosta de ervas e o bacalhau à Brás são rápidos e tolerantes; a caldeirada e a dourada grelhada exigem um pouco mais de atenção, mas ensinam a cozinhar peixe inteiro e a construir um caldo. O atum selado é o prato mais técnico da seleção e depende de peixe muito fresco.",
      "Sempre que a receita usa peixe inteiro, indicamos o peso, porque é o peso e não o número de peixes que determina o tempo de cozedura. Peça ao peixeiro para limpar e escamar: é um serviço gratuito na maioria das peixarias e poupa bastante trabalho."
    ],
    tips: [
      "Compre peixe com olhos claros e brânquias vermelhas; se cheirar a amoníaco, não compre.",
      "Seque o peixe com papel de cozinha por dentro e por fora antes de temperar.",
      "Retire o peixe do lume quando o centro ainda estiver ligeiramente translúcido: termina de cozinhar no prato."
    ]
  },
  vegetarianas: {
    lead: "Pratos vegetarianos completos, com leguminosas, cereais e legumes, pensados para saciar e não apenas para acompanhar.",
    body: [
      "Uma refeição vegetariana só funciona quando tem estrutura: uma fonte de proteína, uma base de hidratos, gordura suficiente e acidez para equilibrar. As receitas desta categoria foram construídas com essa lógica. O curry de grão-de-bico combina leguminosa, coco e tomate; o risoto assenta no arroz e no queijo; a quiche usa ovos e queijo como base proteica.",
      "Há também uma preocupação com textura, que é muitas vezes o que falta nos pratos vegetarianos. As almôndegas de lentilhas são assadas para ficarem firmes, o ratatouille é cozinhado em duas fases para os legumes não se desfazerem e o alho-francês da quiche é caramelizado para ganhar doçura. Nenhum destes passos é decorativo: todos mudam o resultado.",
      "As receitas indicam substituições para versões veganas sempre que possível, mas leia com atenção os alergénios e os rótulos: queijos, caldos e massas prontas podem conter ingredientes de origem animal ou vestígios que não são óbvios."
    ],
    tips: [
      "Tempere as leguminosas com sal, acidez e gordura: é o que as torna saborosas e não apenas “saudáveis”.",
      "Doure os legumes em vez de os cozinhar a vapor sempre que quiser profundidade de sabor.",
      "Junte um ingrediente crocante no fim — sementes, pão torrado, cebola frita — para o prato não ficar mole."
    ]
  },
  sobremesas: {
    lead: "Pastéis de nata, bolos húmidos, tartes e mousses, com atenção aos pontos críticos de cada técnica.",
    body: [
      "A pastelaria caseira tem fama de ser difícil, mas a maior parte dos problemas vem de três coisas: temperaturas erradas, misturas demasiado trabalhadas e falta de descanso. As receitas desta categoria explicam quando é que a massa deve estar fria, porque é que o chocolate não pode apanhar água e porque é que um bolo precisa de arrefecer antes de ser desenformado.",
      "Começamos pelos clássicos portugueses — pastéis de nata e arroz doce — e juntamos sobremesas de forno e de colher que não exigem equipamento especial. Nenhuma receita pede termómetro de açúcar ou batedeira profissional, embora uma balança de cozinha ajude bastante.",
      "Uma nota sobre o açúcar: todas as receitas podem ser ligeiramente reduzidas, mas isso altera a textura. Em bolos e mousses, o açúcar não é apenas doce, é estrutura. Se reduzir, faça-o aos poucos e espere diferenças na humidade e no volume."
    ],
    tips: [
      "Pese os ingredientes em vez de os medir por volume; a diferença é especialmente grande na farinha.",
      "Pré-aqueça o forno pelo menos 15 minutos antes de assar. Um forno frio arruína bolos e tartes.",
      "Deixe as sobremesas arrefecer completamente antes de as guardar; o vapor torna tudo mole."
    ]
  }
};

write("categorias/index.html", `${head({
  title: `Categorias de receitas | ${SITE_NAME}`,
  description: "Explore as seis categorias do TheFlavorFind: pequeno-almoço, massas, carne, peixe, vegetarianas e sobremesas.",
  canonical: SITE_URL + "/categorias/"
})}
${header("categories")}
<main id="conteudo">
  <section class="page-hero">
    <div class="wrap">
      <nav class="breadcrumbs"><a href="/">Início</a><span class="sep">/</span><span>Categorias</span></nav>
      <h1>Categorias</h1>
      <p>Seis formas de organizar a cozinha da semana, cada uma com receitas completas e instruções detalhadas.</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="recipe-grid">
        ${CATEGORIES.map((c, i) => {
          const rs = recipes.filter((r) => r.category === c.slug);
          return `<a class="recipe-card reveal" href="/categorias/${c.slug}.html" style="transition-delay:${i * 40}ms">
            <div class="recipe-card-media">
              <img src="${rs[0].imageThumb}" alt="${esc(rs[0].imageAlt)}" loading="lazy" width="600" height="400">
              <span class="recipe-badge">${rs.length} receitas</span>
            </div>
            <div class="recipe-card-body">
              <h3>${c.name}</h3>
              <p>${c.intro}</p>
              <div class="recipe-meta"><span>${icon.arrow} Explorar categoria</span></div>
            </div>
          </a>`;
        }).join("")}
      </div>
    </div>
  </section>
</main>
${footer()}
`);

for (const c of CATEGORIES) {
  const content = categoryContent[c.slug];
  const rs = recipes.filter((r) => r.category === c.slug);
  const others = CATEGORIES.filter((x) => x.slug !== c.slug);
  const catJson = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Receitas de ${c.name}`,
    url: `${SITE_URL}/categorias/${c.slug}.html`,
    description: content.lead,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL + "/" }
  };
  write(`categorias/${c.slug}.html`, `${head({
    title: `Receitas de ${c.name} — ${rs.length} receitas | ${SITE_NAME}`,
    description: content.lead,
    canonical: `${SITE_URL}/categorias/${c.slug}.html`,
    image: rs[0].image,
    jsonld: catJson
  })}
${header("categories")}
<main id="conteudo">
  <section class="page-hero category-hero">
    <div class="wrap">
      <nav class="breadcrumbs"><a href="/">Início</a><span class="sep">/</span><a href="/categorias/">Categorias</a><span class="sep">/</span><span>${c.name}</span></nav>
      <span class="eyebrow">${c.short}</span>
      <h1>Receitas de ${c.name.toLowerCase()}</h1>
      <p>${esc(content.lead)} <span class="count">${rs.length} receitas completas.</span></p>
    </div>
  </section>

  <section class="section-tight">
    <div class="wrap">
      <div class="recipe-grid">
        ${rs.map((r, i) => card(r, i)).join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap" style="display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:56px;align-items:start">
      <div class="prose" style="padding:0;max-width:none">
        <h2>Sobre esta categoria</h2>
        ${content.body.map((p) => `<p>${esc(p)}</p>`).join("")}
      </div>
      <aside class="info-panel">
        <h3>${icon.chef} Antes de começar</h3>
        <ul>${content.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        <div style="margin-top:22px;padding-top:18px;border-top:1px solid var(--border)">
          <h3 style="margin-bottom:10px">Outras categorias</h3>
          <ul style="list-style:none;padding:0">
            ${others.map((o) => `<li><a href="/categorias/${o.slug}.html" style="color:var(--orange-soft)">${o.name}</a></li>`).join("")}
          </ul>
        </div>
      </aside>
    </div>
  </section>
</main>
${footer()}
`);
}

console.log("Receitas:", recipes.length);
