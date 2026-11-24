import fs from "node:fs";
import path from "node:path";
import {
  icon, esc, timeLabel, head, header, footer, card,
  CATEGORIES, catBySlug, recipes, SITE, SITE_URL, SITE_NAME, TODAY
} from "./partials.mjs";

const write = (rel, content) => {
  const p = path.join(SITE, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  console.log("  ✓", rel);
};

/* ---------------------------- índice de receitas --------------------------- */

write("receitas/index.html", `${head({
  title: `Todas as receitas — ${recipes.length} receitas originais | ${SITE_NAME}`,
  description: `Explore as ${recipes.length} receitas do TheFlavorFind: pequeno-almoço, massas, carne, peixe, vegetarianas e sobremesas. Pesquise por nome, ingrediente ou categoria.`,
  canonical: SITE_URL + "/receitas/"
})}
${header("recipes")}
<main id="conteudo">
  <section class="page-hero">
    <div class="wrap">
      <nav class="breadcrumbs"><a href="/">Início</a><span class="sep">/</span><span>Receitas</span></nav>
      <span class="eyebrow">${recipes.length} receitas completas</span>
      <h1>Todas as receitas</h1>
      <p>Pesquise por nome, ingrediente ou categoria. Cada receita inclui ingredientes com quantidades, tempos, dificuldade, instruções passo a passo, dicas, alternativas, alergénios e conservação.</p>
      <div class="search-panel" style="margin-top:26px">
        <form class="search-form" data-search-form role="search">
          ${icon.search}
          <label class="sr-only" for="pesquisa-receitas">Pesquisar receitas</label>
          <input id="pesquisa-receitas" data-search-input name="q" type="search" placeholder="Ex.: frango, tomate, sobremesa…" autocomplete="off">
          <button type="submit">Pesquisar</button>
        </form>
      </div>
    </div>
  </section>

  <section class="section" id="receitas">
    <div class="wrap">
      <div class="filters" data-filters role="group" aria-label="Filtrar por categoria">
        <button class="filter-chip" type="button" data-category="todas" aria-pressed="true">Todas</button>
        ${CATEGORIES.map((c) => `<button class="filter-chip" type="button" data-category="${c.slug}" aria-pressed="false">${c.name}</button>`).join("")}
      </div>
      <div class="results-bar" data-results-bar hidden></div>
      <div class="recipe-grid" data-results-grid data-limit="${recipes.length}">
        ${recipes.map((r, i) => card(r, i)).join("")}
      </div>
      <div class="empty-state" data-empty hidden>
        <h3>Nenhuma receita encontrada</h3>
        <p>Tente outro termo ou escolha “Todas” para voltar a ver o catálogo completo.</p>
        <button type="button" data-reset>Limpar pesquisa</button>
      </div>
    </div>
  </section>
</main>
${footer()}
`);

/* -------------------------------- Sobre ---------------------------------- */

write("sobre.html", `${head({
  title: `Sobre o TheFlavorFind — quem escreve e como trabalhamos`,
  description: "Conheça o TheFlavorFind: um projeto editorial independente de receitas em português de Portugal, com princípios claros sobre originalidade, imagens e transparência.",
  canonical: SITE_URL + "/sobre.html"
})}
${header("about")}
<main id="conteudo">
  <section class="page-hero">
    <div class="wrap">
      <nav class="breadcrumbs"><a href="/">Início</a><span class="sep">/</span><span>Sobre</span></nav>
      <h1>Receitas honestas, explicadas a sério.</h1>
      <p>O TheFlavorFind é um projeto editorial independente dedicado a receitas em português de Portugal. Não agregamos receitas de outros sites nem publicamos textos gerados em série: cada página é escrita e revista para ser útil na cozinha.</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap" style="display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:56px;align-items:start">
      <div class="prose" style="padding:0;max-width:none">
        <h2>Porque é que este projeto existe</h2>
        <p>A maior parte das receitas que se encontram online é difícil de usar: quantidades vagas, tempos irreais, listas intermináveis de ingredientes que ninguém tem em casa e instruções que assumem que o leitor já sabe o que fazer. O TheFlavorFind nasceu para resolver isso, com receitas que dizem o essencial e explicam o porquê de cada passo.</p>
        <p>Começámos com ${recipes.length} receitas em seis categorias — pequeno-almoço, massas, carne, peixe, vegetarianas e sobremesas. O catálogo cresce devagar, com receitas novas adicionadas apenas quando estão completas: descrição, ingredientes, tempos, dificuldade, passos, dicas, alternativas, alergénios e conservação.</p>

        <h2>Como são escritas as receitas</h2>
        <p>Cada receita é desenvolvida pela redação com base em técnicas culinárias conhecidas e na comparação de várias abordagens para o mesmo prato. Traduzimos essas técnicas para uma linguagem simples e para tempos que funcionam numa cozinha doméstica. Depois, revemos a estrutura para garantir que o leitor encontra sempre a mesma informação no mesmo lugar.</p>
        <p>Há uma coisa que não fazemos: afirmar que uma receita foi testada quando não foi. As receitas são revistas editorialmente em cozinha doméstica, mas não passam por um laboratório de testes com medições instrumentais. Quando indicamos um tempo ou uma temperatura, fazemo-lo como orientação — o seu forno, as suas panelas e os seus ingredientes podem exigir ajustes.</p>

        <h2>Imagens: ilustrativas e identificadas</h2>
        <p>Todas as fotografias de receitas neste site foram geradas por inteligência artificial e são apresentadas como ilustrações. Não são fotografias do resultado real de cada receita e podem conter diferenças de aspeto, quantidade ou apresentação. Sempre que possível, descrevemos o resultado esperado no texto, para que a imagem não seja a única referência.</p>
        <p>Preferimos ser transparentes sobre isto do que apresentar imagens de banco como se fossem pratos nossos. Se no futuro usarmos fotografias originais, cada página indicará claramente qual é o caso.</p>

        <h2>Independência editorial</h2>
        <p>O site pode vir a ser financiado por publicidade display. Os anunciantes não têm qualquer influência sobre o conteúdo, as receitas escolhidas ou as marcas mencionadas. Não publicamos artigos patrocinados disfarçados de receitas e não recomendamos produtos que não usaríamos.</p>

        <h2>Correções</h2>
        <p>Se encontrar um erro numa receita — uma quantidade, um tempo, um alergénio em falta —, escreva-nos para <a href="mailto:maywebproject@gmail.com">maywebproject@gmail.com</a>. As correções são feitas com prioridade, sobretudo quando envolvem segurança alimentar.</p>
      </div>
      <aside class="info-panel">
        <h3>${icon.info} Em resumo</h3>
        <ul>
          <li><strong>${recipes.length} receitas</strong> em seis categorias, todas com informação completa.</li>
          <li><strong>Português de Portugal</strong> em todo o site.</li>
          <li><strong>Sem receitas copiadas</strong> de outros sites ou livros.</li>
          <li><strong>Imagens ilustrativas</strong> geradas por IA e identificadas.</li>
          <li><strong>Sem promessas de testes</strong> que não foram feitos.</li>
          <li><strong>Alergénios indicados</strong> em todas as receitas.</li>
        </ul>
        <div style="margin-top:22px;padding-top:18px;border-top:1px solid var(--border)">
          <h3>Contacto</h3>
          <p style="color:var(--muted);font-size:14px">Dúvidas, correções ou sugestões:<br>
          <a href="mailto:maywebproject@gmail.com" style="color:var(--orange-soft)">maywebproject@gmail.com</a></p>
          <a class="btn-ghost" href="/politica-editorial.html" style="margin-top:8px">Política editorial</a>
        </div>
      </aside>
    </div>
  </section>
</main>
${footer()}`);

/* ---------------------------- Política editorial -------------------------- */

write("politica-editorial.html", `${head({
  title: `Política editorial | ${SITE_NAME}`,
  description: "Os princípios do TheFlavorFind: originalidade, rigor, transparência sobre imagens geradas por IA, alergénios, correções e independência publicitária.",
  canonical: SITE_URL + "/politica-editorial.html"
})}
${header("")}
<main id="conteudo">
  <section class="page-hero"><div class="wrap">
    <nav class="breadcrumbs"><a href="/">Início</a><span class="sep">/</span><span>Política editorial</span></nav>
    <h1>Política editorial</h1>
    <p>Última atualização: ${TODAY}. Estas regras aplicam-se a todas as receitas e páginas publicadas no TheFlavorFind.</p>
  </div></section>
  <section class="section"><div class="wrap"><div class="prose">
    <h2>1. Originalidade</h2>
    <p>Todo o texto do site é escrito pela redação. Não copiamos receitas, descrições ou instruções de outros sites, livros ou aplicações. Quando uma receita é inspirada num prato tradicional, explicamos o contexto e apresentamos a nossa própria versão, com quantidades e método próprios.</p>
    <p>Não usamos traduções automáticas de conteúdos estrangeiros como base de publicação. Se uma técnica ou preparação é comum a várias fontes, reescrevemo-la de forma original e adaptada ao público português.</p>

    <h2>2. Informação completa</h2>
    <p>Cada receita publicada inclui, no mínimo: nome, descrição, imagem identificada como ilustrativa, ingredientes com quantidades, tempo de preparação, tempo de confeção, número de doses, dificuldade, instruções passo a passo, dicas, alternativas de ingredientes, alergénios e recomendações de conservação.</p>

    <h2>3. Testes e limitações</h2>
    <p>As receitas são desenvolvidas e revistas editorialmente, mas não são testadas em laboratório nem por uma equipa profissional de cozinha em todas as ocasiões. Por isso, não afirmamos que uma receita foi “testada e aprovada”. Indicamos tempos e temperaturas como orientações e explicamos os sinais visuais que ajudam a decidir o ponto certo.</p>
    <p>Fornos, panelas, tamanhos de peixe e variedades de ingredientes variam. O leitor deve ajustar tempos e temperos ao seu equipamento e provar ao longo da preparação.</p>

    <h2>4. Imagens geradas por inteligência artificial</h2>
    <p>Todas as imagens de receitas são ilustrativas e foram criadas com ferramentas de geração de imagem por IA. Não representam necessariamente o resultado exato da receita. Estão identificadas junto à receita e no rodapé do site. Não usamos imagens de outros sites, marcas ou fotografias de terceiros sem autorização.</p>

    <h2>5. Alergénios e segurança alimentar</h2>
    <p>A lista de alergénios é construída a partir dos ingredientes indicados e das orientações dos 14 alergénios de declaração obrigatória na União Europeia. Pode não detetar vestígios provenientes de produtos processados. Quem tem alergias ou intolerâncias deve ler sempre os rótulos dos ingredientes que utiliza e, em caso de dúvida, contactar o fabricante.</p>
    <p>As recomendações de conservação são orientações gerais e não substituem boas práticas de higiene nem as instruções do fabricante.</p>

    <h2>6. Publicidade e independência</h2>
    <p>O site pode apresentar anúncios display através do Google AdSense. A publicidade é claramente separada do conteúdo editorial. Os anunciantes não influenciam a escolha, a ordem ou o conteúdo das receitas. Não aceitamos pagamento para publicar avaliações positivas de produtos.</p>

    <h2>7. Correções e atualizações</h2>
    <p>Quando detetamos um erro, corrigimo-lo e, sempre que a correção seja relevante, indicamos a data de atualização. Se encontrar um problema, escreva para <a href="mailto:maywebproject@gmail.com">maywebproject@gmail.com</a> com o endereço da página e a descrição do erro.</p>

    <h2>8. Contacto</h2>
    <p>Responsável editorial: redação do TheFlavorFind.<br>
    Correio eletrónico: <a href="mailto:maywebproject@gmail.com">maywebproject@gmail.com</a>.</p>
  </div></div></section>
</main>
${footer()}`);

/* ------------------------------ Privacidade ------------------------------- */

write("privacidade.html", `${head({
  title: `Política de privacidade | ${SITE_NAME}`,
  description: "Que dados o TheFlavorFind recolhe, para que servem, durante quanto tempo são guardados e como exercer os seus direitos ao abrigo do RGPD.",
  canonical: SITE_URL + "/privacidade.html"
})}
${header("")}
<main id="conteudo">
  <section class="page-hero"><div class="wrap">
    <nav class="breadcrumbs"><a href="/">Início</a><span class="sep">/</span><span>Privacidade</span></nav>
    <h1>Política de privacidade</h1>
    <p>Última atualização: ${TODAY}. Esta política explica que dados pessoais podem ser recolhidos quando utiliza o TheFlavorFind e como são tratados.</p>
  </div></section>
  <section class="section"><div class="wrap"><div class="prose">
    <h2>1. Responsável pelo tratamento</h2>
    <p>O responsável pelo tratamento dos dados é o projeto editorial TheFlavorFind. Para qualquer questão relacionada com privacidade, utilize o endereço <a href="mailto:maywebproject@gmail.com">maywebproject@gmail.com</a>.</p>

    <h2>2. Que dados recolhemos</h2>
    <p>O site não exige registo, não tem área de utilizador e não recolhe dados pessoais para navegação normal. As únicas situações em que podem ser tratados dados pessoais são:</p>
    <ul>
      <li><strong>Contacto por e-mail:</strong> se nos escrever, recebemos o seu endereço de e-mail, o nome que indicar e o conteúdo da mensagem.</li>
      <li><strong>Dados técnicos do servidor:</strong> o alojamento na Netlify pode registar endereços IP e informações técnicas em registos de acesso, para segurança e funcionamento do serviço.</li>
      <li><strong>Publicidade:</strong> se forem apresentados anúncios Google AdSense, a Google e os seus parceiros podem utilizar cookies e identificadores para personalizar ou medir publicidade, conforme as escolhas que fizer no banner de consentimento.</li>
    </ul>

    <h2>3. Finalidades e fundamentos</h2>
    <p>Os dados de contacto são utilizados apenas para responder à mensagem e, se necessário, para corrigir informação editorial. O fundamento é o interesse legítimo em responder a quem nos contacta ou o consentimento, quando aplicável. Os registos técnicos são tratados para segurança e melhoria do serviço. A publicidade personalizada depende do seu consentimento.</p>

    <h2>4. Conservação</h2>
    <p>As mensagens de e-mail são conservadas apenas durante o tempo necessário para responder e resolver o assunto, salvo se existir uma obrigação legal de conservação. Os registos técnicos do alojamento seguem os prazos definidos pelo fornecedor.</p>

    <h2>5. Partilha com terceiros</h2>
    <p>Não vendemos nem alugamos dados pessoais. Podemos recorrer a prestadores de serviços que atuam como subcontratantes, nomeadamente alojamento web (Netlify), serviços de e-mail e, se a publicidade estiver ativa, Google AdSense. Estes prestadores tratam os dados de acordo com as suas próprias políticas e com as obrigações contratuais aplicáveis.</p>

    <h2>6. Os seus direitos</h2>
    <p>Tem direito a aceder, corrigir, apagar, limitar ou opor-se ao tratamento dos seus dados, bem como à portabilidade quando aplicável. Pode exercer estes direitos escrevendo para <a href="mailto:maywebproject@gmail.com">maywebproject@gmail.com</a>. Tem também o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD).</p>

    <h2>7. Segurança</h2>
    <p>O site é servido exclusivamente por HTTPS. Não armazenamos dados sensíveis nem credenciais de utilizadores no navegador. As mensagens recebidas são tratadas de forma confidencial.</p>

    <h2>8. Alterações</h2>
    <p>Esta política pode ser atualizada para refletir alterações no site ou na legislação. A data de atualização é sempre indicada no topo da página.</p>
  </div></div></section>
</main>
${footer()}`);

/* -------------------------------- Cookies -------------------------------- */

write("cookies.html", `${head({
  title: `Política de cookies | ${SITE_NAME}`,
  description: "Como o TheFlavorFind utiliza cookies e armazenamento local, e como pode gerir as suas preferências de publicidade.",
  canonical: SITE_URL + "/cookies.html"
})}
${header("")}
<main id="conteudo">
  <section class="page-hero"><div class="wrap">
    <nav class="breadcrumbs"><a href="/">Início</a><span class="sep">/</span><span>Cookies</span></nav>
    <h1>Política de cookies</h1>
    <p>Última atualização: ${TODAY}.</p>
  </div></section>
  <section class="section"><div class="wrap"><div class="prose">
    <h2>1. O que são cookies</h2>
    <p>Cookies são pequenos ficheiros de texto guardados no dispositivo quando visita um site. Permitem reconhecer o navegador, manter preferências e medir a utilização do serviço. Tecnologias semelhantes, como o armazenamento local (localStorage), funcionam de forma próxima.</p>

    <h2>2. Cookies que utilizamos</h2>
    <p>Atualmente, o TheFlavorFind <strong>não instala cookies próprios de análise, publicidade ou redes sociais</strong>. O funcionamento do site não depende de cookies. O service worker guarda temporariamente ficheiros estáticos no seu dispositivo para acelerar o carregamento e permitir consulta offline básica; essa cache pode ser apagada nas definições do navegador.</p>

    <h2>3. Serviços de terceiros</h2>
    <p>O site utiliza tipos de letra disponíveis no dispositivo, sem carregar Google Fonts.</p>
    <p>Se a publicidade Google AdSense estiver ativa, a Google pode utilizar cookies para limitar a frequência dos anúncios, medir o desempenho e, com consentimento, personalizar a publicidade. Antes de ativar anúncios, será necessário configurar uma plataforma de gestão de consentimento certificada pela Google, quando aplicável. Atualmente não carregamos anúncios.</p>

    <h2>4. Gerir preferências</h2>
    <p>Pode gerir ou apagar cookies nas definições do seu navegador (Chrome, Firefox, Safari, Edge). Também pode rever as preferências de publicidade da Google em <a href="https://adssettings.google.com" rel="noopener noreferrer nofollow" target="_blank">adssettings.google.com</a> e consultar <a href="https://www.youronlinechoices.com/pt/" rel="noopener noreferrer nofollow" target="_blank">youronlinechoices.com</a>.</p>
    <p>Bloquear cookies pode afetar a forma como alguns conteúdos ou anúncios são apresentados, mas não impede a leitura das receitas.</p>

    <h2>5. Contacto</h2>
    <p>Para dúvidas sobre cookies ou privacidade: <a href="mailto:maywebproject@gmail.com">maywebproject@gmail.com</a>.</p>
  </div></div></section>
</main>
${footer()}`);

/* --------------------------------- Termos -------------------------------- */

write("termos.html", `${head({
  title: `Termos de utilização | ${SITE_NAME}`,
  description: "Condições de utilização do TheFlavorFind, direitos de autor, limitações de responsabilidade e regras sobre conteúdo culinário.",
  canonical: SITE_URL + "/termos.html"
})}
${header("")}
<main id="conteudo">
  <section class="page-hero"><div class="wrap">
    <nav class="breadcrumbs"><a href="/">Início</a><span class="sep">/</span><span>Termos</span></nav>
    <h1>Termos de utilização</h1>
    <p>Última atualização: ${TODAY}.</p>
  </div></section>
  <section class="section"><div class="wrap"><div class="prose">
    <h2>1. Aceitação</h2>
    <p>Ao utilizar o TheFlavorFind, aceita estes termos. Se não concordar, deve abster-se de utilizar o site. O acesso é gratuito e não requer registo.</p>

    <h2>2. Conteúdo e direitos de autor</h2>
    <p>Os textos, a estrutura editorial, o design e os elementos gráficos do site pertencem ao TheFlavorFind, salvo indicação em contrário. Pode imprimir ou guardar receitas para uso pessoal e familiar. Não é permitida a reprodução integral ou substancial do conteúdo para publicação noutros sites, aplicações, livros ou materiais comerciais sem autorização escrita.</p>
    <p>As imagens são geradas por inteligência artificial e disponibilizadas apenas como ilustração editorial. Não podem ser apresentadas como fotografias reais dos pratos nem utilizadas para fins comerciais sem autorização.</p>

    <h2>3. Utilização da informação culinária</h2>
    <p>As receitas são orientações culinárias. Os resultados podem variar em função de ingredientes, equipamento, altitude, humidade e experiência do cozinheiro. O TheFlavorFind não garante um resultado específico.</p>

    <h2>4. Alergénios e responsabilidade</h2>
    <p>A informação sobre alergénios é indicativa e baseada nos ingredientes listados. Podem existir vestígios não declarados em produtos processados. É responsabilidade do utilizador verificar os rótulos e adaptar as receitas às suas necessidades alimentares. O site não substitui aconselhamento médico ou nutricional.</p>

    <h2>5. Ligações externas</h2>
    <p>O site pode conter ligações a páginas de terceiros. Não controlamos esses conteúdos nem somos responsáveis pelas suas práticas de privacidade ou exatidão.</p>

    <h2>6. Disponibilidade</h2>
    <p>Procuramos manter o site disponível e correto, mas não garantimos funcionamento ininterrupto. Podemos alterar, suspender ou remover conteúdos sem aviso prévio.</p>

    <h2>7. Limitação de responsabilidade</h2>
    <p>Na medida permitida por lei, o TheFlavorFind não é responsável por danos resultantes da utilização das receitas, de imprecisões involuntárias ou de indisponibilidade do serviço. Nada nestes termos exclui responsabilidades que não possam ser excluídas por lei.</p>

    <h2>8. Lei aplicável</h2>
    <p>Estes termos regem-se pela lei portuguesa. Para litígios de consumo, o consumidor pode recorrer às entidades de resolução alternativa de litígios competentes.</p>

    <h2>9. Contacto</h2>
    <p><a href="mailto:maywebproject@gmail.com">maywebproject@gmail.com</a></p>
  </div></div></section>
</main>
${footer()}`);

/* -------------------------------- Contacto ------------------------------- */

write("contacto.html", `${head({
  title: `Contacto | ${SITE_NAME}`,
  description: "Contacte a redação do TheFlavorFind para correções, dúvidas sobre receitas, sugestões ou questões de privacidade.",
  canonical: SITE_URL + "/contacto.html"
})}
${header("")}
<main id="conteudo">
  <section class="page-hero"><div class="wrap">
    <nav class="breadcrumbs"><a href="/">Início</a><span class="sep">/</span><span>Contacto</span></nav>
    <h1>Falar com a redação</h1>
    <p>Correções, dúvidas sobre uma receita ou sugestões de temas são bem-vindas. Respondemos normalmente em poucos dias úteis.</p>
  </div></section>
  <section class="section"><div class="wrap">
    <div class="contact-grid">
      <div class="contact-card">
        <h2>Correio eletrónico</h2>
        <p>Para qualquer assunto, incluindo correções de receitas, alergénios ou pedidos de privacidade:</p>
        <p><a href="mailto:maywebproject@gmail.com">maywebproject@gmail.com</a></p>
      </div>
      <div class="contact-card">
        <h2>Antes de escrever</h2>
        <p>Se o assunto for uma receita, indique o nome e o endereço da página. Se for um erro, descreva o passo ou a quantidade em causa. Isso ajuda-nos a corrigir mais depressa.</p>
        <p>Não envie dados sensíveis por e-mail.</p>
      </div>
    </div>
    <div class="prose" style="padding-top:24px">
      <h2>O que fazemos com a sua mensagem</h2>
      <p>Usamos o seu e-mail apenas para responder e, quando necessário, para confirmar uma correção. Não o adicionamos a listas de marketing nem o partilhamos com terceiros. Pode pedir a eliminação da conversa em qualquer momento.</p>
      <h2>Reportar um problema de segurança alimentar</h2>
      <p>Se detectar uma informação de alergénios potencialmente perigosa, escreva com o assunto “Urgente — alergénios”. Estes casos são tratados com prioridade.</p>
    </div>
  </div></section>
</main>
${footer()}`);

/* ---------------------------------- 404 ---------------------------------- */

write("404.html", `${head({
  title: `Página não encontrada | ${SITE_NAME}`,
  description: "A página que procura não existe. Explore as receitas do TheFlavorFind.",
  canonical: SITE_URL + "/404.html",
  noindex: true
})}
${header("")}
<main id="conteudo">
  <section class="section" style="padding:110px 0">
    <div class="wrap" style="text-align:center;max-width:640px">
      <span class="eyebrow" style="justify-content:center">Erro 404</span>
      <h1 style="font-family:var(--font-display);font-size:clamp(38px,6vw,64px);letter-spacing:-.03em;margin:0 0 16px">Esta página saiu da cozinha.</h1>
      <p style="color:var(--muted);margin:0 0 30px">O endereço pode estar errado ou a receita pode ter sido movida. Volte ao início ou explore o catálogo completo.</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <a class="btn-primary" href="/">Voltar ao início</a>
        <a class="btn-ghost" href="/receitas/">Ver todas as receitas</a>
      </div>
    </div>
  </section>
</main>
${footer()}`);

/* ------------------------------ dados estáticos --------------------------- */

const summaries = recipes.map((r) => ({
  id: r.id, slug: r.slug, name: r.name, description: r.description,
  category: r.category, categoryName: r.categoryName,
  image: r.image, imageThumb: r.imageThumb, imageAlt: r.imageAlt,
  prepTime: r.prepTime, cookTime: r.cookTime, totalTime: r.prepTime + r.cookTime,
  servings: r.servings, servingsLabel: r.servingsLabel, difficulty: r.difficulty,
  featured: !!r.featured, keywords: r.keywords,
  ingredientNames: r.ingredients.map((i) => i.item)
}));
write("data/recipes-summary.json", JSON.stringify({ total: summaries.length, recipes: summaries }, null, 0));

/* Semente para a função (evita imports JSON no runtime) */
fs.writeFileSync(
  path.join(SITE, "netlify/functions/_seed.mjs"),
  "// Gerado automaticamente por build/build.mjs — não editar à mão.\n" +
  "export default " + JSON.stringify(recipes, null, 0) + ";\n"
);
console.log("  ✓ netlify/functions/_seed.mjs");

/* -------------------------------- sitemap -------------------------------- */

const urls = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/receitas/", priority: "0.9", changefreq: "weekly" },
  { loc: "/categorias/", priority: "0.8", changefreq: "monthly" },
  ...CATEGORIES.map((c) => ({ loc: `/categorias/${c.slug}.html`, priority: "0.8", changefreq: "monthly" })),
  ...recipes.map((r) => ({ loc: `/receitas/${r.slug}.html`, priority: "0.7", changefreq: "monthly" })),
  { loc: "/sobre.html", priority: "0.5", changefreq: "yearly" },
  { loc: "/contacto.html", priority: "0.4", changefreq: "yearly" },
  { loc: "/politica-editorial.html", priority: "0.4", changefreq: "yearly" },
  { loc: "/privacidade.html", priority: "0.3", changefreq: "yearly" },
  { loc: "/cookies.html", priority: "0.3", changefreq: "yearly" },
  { loc: "/termos.html", priority: "0.3", changefreq: "yearly" }
];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`);

write("robots.txt", `User-agent: *
Allow: /
Disallow: /netlify/
Disallow: /admin.html
Disallow: /build/

Sitemap: ${SITE_URL}/sitemap.xml
`);

/* -------------------------------- manifest ------------------------------- */

write("manifest.json", JSON.stringify({
  name: "TheFlavorFind",
  short_name: "FlavorFind",
  description: "Receitas originais em português de Portugal, com ingredientes, tempos e instruções detalhadas.",
  lang: "pt-PT",
  start_url: "/",
  scope: "/",
  display: "standalone",
  orientation: "portrait",
  background_color: "#0A0A0A",
  theme_color: "#0A0A0A",
  icons: [
    { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
  ]
}, null, 2));

/* ------------------------------- placeholder ------------------------------ */

write("images/placeholder-receita.svg", `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-label="Imagem ilustrativa indisponível">
  <rect width="1200" height="800" fill="#151515"/>
  <circle cx="600" cy="400" r="150" fill="none" stroke="#FF6B1A" stroke-width="6" opacity="0.6"/>
  <path d="M540 420h120a10 10 0 0 1 10 10v20a55 55 0 0 1-55 55h-30a55 55 0 0 1-55-55v-30Z" fill="#FF6B1A" opacity="0.85"/>
  <path d="M670 435h14a14 14 0 0 1 0 28h-14" stroke="#FF6B1A" stroke-width="10" fill="none"/>
  <text x="600" y="600" font-family="Arial, sans-serif" font-size="26" fill="#8a8a8a" text-anchor="middle">Imagem ilustrativa indisponível</text>
</svg>`);

/* -------------------------------- ficheiros ------------------------------- */

write("_redirects", `/api/*  /.netlify/functions/recipes/:splat  200
/receitas  /receitas/  301
/categorias  /categorias/  301
`);

write("netlify.toml", `[build]
  command = "node build/build.mjs && node build/pages.mjs"
  publish = "."
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "20"

[functions]
  node_bundler = "esbuild"
  included_files = ["data/**"]

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/recipes/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/receitas"
  to = "/receitas/"
  status = 301

[[redirects]]
  from = "/categorias"
  to = "/categorias/"
  status = 301

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/style.css"
  [headers.values]
    Cache-Control = "public, max-age=86400"

[[headers]]
  for = "/scripts.js"
  [headers.values]
    Cache-Control = "public, max-age=86400"
`);

write("package.json", JSON.stringify({
  name: "theflavorfind",
  version: "2.1.0",
  private: true,
  type: "module",
  description: "TheFlavorFind — receitas originais em português de Portugal, com API própria em Netlify Functions.",
  scripts: {
    build: "node build/build.mjs && node build/pages.mjs",
    dev: "npx netlify dev",
    preview: "python3 -m http.server 4173"
  },
  dependencies: {
    "@netlify/blobs": "^8.1.0"
  }
}, null, 2));

console.log("Páginas geradas:", urls.length);

write('receita.html', `${head({title:'Receita | TheFlavorFind',description:'Consultar uma receita adicionada ao catálogo.',canonical:SITE_URL+'/receita.html',noindex:true})}${header('receitas')}<main id="conteudo" class="wrap" style="padding:40px 0"><article id="dynamic-recipe" aria-live="polite">A carregar receita…</article></main>${footer()}<script src="/receita.js" defer></script>`);
