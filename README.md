# TheFlavorFind 2.0

Site de receitas em português de Portugal, sem dependência do TheMealDB e com **API própria** em Netlify Functions.

- 30 receitas originais, completas e distribuídas por 6 categorias
- 30 imagens WebP otimizadas (duas variantes: 1200×800 e miniatura 600×400)
- API própria com pesquisa por nome, ingrediente e categoria
- Páginas estáticas pré-renderizadas por receita (bom para SEO e para o AdSense)
- Design preto / laranja / branco, responsivo, com animações suaves
- Página de administração para adicionar receitas à API

---

## 1. Estrutura do projeto

```text
.
├── index.html                  Página inicial (pesquisa, categorias, destaques)
├── style.css                   Todo o design
├── scripts.js                  Pesquisa, filtros e animações
├── admin.html                  Formulário para adicionar receitas (noindex)
├── receitas/
│   ├── index.html              Catálogo completo
│   └── <slug>.html             30 páginas de receita pré-renderizadas
├── categorias/
│   ├── index.html
│   └── <slug>.html             6 páginas de categoria com texto editorial
├── sobre.html                  Quem escreve e como
├── contacto.html
├── politica-editorial.html     Originalidade, imagens IA, alergénios, correções
├── privacidade.html
├── cookies.html
├── termos.html
├── 404.html
├── images/
│   ├── <slug>.webp             30 imagens principais (1200×800)
│   └── thumbs/<slug>.webp      Miniaturas (600×400)
├── data/recipes.json           Base de dados (fonte de verdade)
├── data/recipes-summary.json   Índice leve usado pela pesquisa (gerado)
├── netlify/functions/
│   ├── recipes.mjs             API
│   └── _seed.mjs               Cópia da base para a função (gerado)
├── build/
│   ├── partials.mjs            Cabeçalho, rodapé, cartões e ícones
│   ├── build.mjs               Gera home, receitas e categorias
│   └── pages.mjs               Gera páginas legais, sitemap, manifest, seed
├── netlify.toml
├── _redirects
├── package.json
├── manifest.json
├── sw.js
├── ads.txt
└── sitemap.xml
```

> O site é 100 % estático, exceto a função da API. Não há chamadas a APIs externas de receitas.

---

## 2. Publicar na Netlify

### Publicação recomendada — GitHub e Netlify existentes

Guarde uma cópia do repositório antigo. Extraia este ZIP e copie os ficheiros para a raiz do repositório já ligado ao site theflavorfind.netlify.app. Faça commit e push. A Netlify instala as dependências e executa o build. Não crie outro site se pretende manter o endereço atual. O upload manual de ficheiros estáticos não compila as Functions; use Git para a API completa.

### Opção B — repositório Git

1. Confirme que `netlify.toml` está na raiz do repositório.
2. Build command: `node build/build.mjs && node build/pages.mjs`
3. Publish directory: `.`
4. Functions directory: `netlify/functions`
5. Defina `ADMIN_TOKEN` nas variáveis de ambiente.

> Se o Netlify pedir uma versão do Node, o `netlify.toml` já fixa `NODE_VERSION = "20"`.

---

## 3. API própria

Base: `https://theflavorfind.netlify.app/api`

### Listar e pesquisar

```http
GET /api/recipes
GET /api/recipes?q=frango
GET /api/recipes?ingredient=tomate
GET /api/recipes?category=sobremesas
GET /api/recipes?q=chocolate&category=sobremesas
GET /api/recipes?featured=1
GET /api/recipes?sort=quick&limit=10&offset=0
```

Resposta (resumida):

```json
{
  "total": 2,
  "count": 2,
  "limit": 30,
  "offset": 0,
  "recipes": [
    {
      "id": "ca-frango-assado-limao",
      "slug": "frango-assado-com-limao-e-ervas",
      "name": "Frango assado com limão e ervas",
      "category": "carne",
      "categoryName": "Carne",
      "image": "/images/frango-assado-com-limao-e-ervas.webp",
      "totalTime": 110,
      "servings": 4,
      "difficulty": "Médio",
      "ingredientNames": ["frango inteiro", "limões", "alho"]
    }
  ]
}
```

`q` ignora acentos e maiúsculas e procura em nome, descrição, categoria, palavras-chave **e ingredientes**. Vários termos funcionam em conjunto (`q=frango limao`).

### Receita completa

```http
GET /api/recipes/esparguete-a-carbonara
GET /api/recipes/<id>
```

Devolve o objeto completo, com ingredientes, instruções, dicas, alternativas, alergénios e conservação.

### Categorias e estado

```http
GET /api/categories
GET /api/health
```

### Adicionar receita

```http
POST /api/recipes
Content-Type: application/json
X-Admin-Token: <ADMIN_TOKEN>

{
  "name": "Arroz de pato tradicional",
  "category": "carne",
  "description": "Descrição original com pelo menos 20 caracteres.",
  "prepTime": 20,
  "cookTime": 45,
  "servings": 4,
  "servingsLabel": "4 pessoas",
  "difficulty": "Médio",
  "image": "/images/arroz-de-pato.webp",
  "ingredients": [
    { "quantity": "300 g", "item": "arroz carolino" },
    { "quantity": "1", "item": "cebola" }
  ],
  "instructions": [
    { "title": "Prepare a base", "text": "Refogue a cebola..." }
  ],
  "tips": ["..."],
  "substitutions": [{ "for": "Manteiga", "alternative": "Azeite" }],
  "allergens": ["Glúten"],
  "allergenNote": "Verifique os rótulos.",
  "storage": "Até 3 dias no frigorífico.",
  "keywords": ["arroz", "pato", "forno"]
}
```

Respostas: `201` criada, `401` token inválido, `422` validação, `503` API em modo de leitura (sem `ADMIN_TOKEN`).

As receitas novas são guardadas em **Netlify Blobs** (store `theflavorfind`, chave `custom-recipes`), por isso sobrevivem a novos deploys. A função junta-as automaticamente às 30 receitas base.

### Página de administração

Abra `/admin.html`, cole o token e preencha o formulário. A receita fica imediatamente disponível na API e na pesquisa.

> **Limitação importante:** as receitas adicionadas pela API não geram automaticamente uma página estática em `/receitas/…`. Para uma página indexável e permanente, acrescente a receita a `data/recipes.json` e volte a correr o build (ver ponto 4).

---

## 4. Adicionar receitas ao catálogo estático

1. Abra `data/recipes.json` (ou um dos ficheiros em `work/data/`, se mantiver os originais).
2. Copie um objeto existente e altere todos os campos. Campos obrigatórios:
   `id`, `slug`, `name`, `category`, `categoryName`, `description`, `image`, `imageThumb`, `imageAlt`, `prepTime`, `cookTime`, `servings`, `servingsLabel`, `difficulty`, `ingredients`, `instructions`, `tips`, `substitutions`, `allergens`, `allergenNote`, `storage`, `keywords`, `featured`, `imageIllustrative`.
3. Coloque a imagem em `images/<slug>.webp` e a miniatura em `images/thumbs/<slug>.webp`.
4. Gere tudo:
   ```bash
   node build/build.mjs && node build/pages.mjs
   ```
   Isto atualiza:
   - 30+ páginas de receita
   - páginas de categoria e contagens
   - home, catálogo e `data/recipes-summary.json`
   - `_seed.mjs` da API
   - `sitemap.xml`

O build valida que `id` e `slug` são únicos e que os campos essenciais existem.

---

## 5. Imagens

- 30 fotografias realistas geradas por IA, uma por receita.
- Formato WebP, orientação horizontal, 1200×800 (principal) e 600×400 (miniaturas).
- Tamanhos entre **64 KB e 175 KB** por imagem principal; total ~3,5 MB para as 30.
- Todas as páginas identificam a imagem como **ilustrativa, gerada por IA** (junto à receita e no rodapé).
- Não há textos, logótipos ou marcas de água nas imagens.

---

## 6. O que mudou em relação à versão anterior

| Antes | Agora |
|---|---|
| Dependência do TheMealDB | Base de dados própria + API própria em Netlify Functions |
| 5 receitas de exemplo | 30 receitas completas em 6 categorias |
| Página única, conteúdo fino | 46 páginas: 30 receitas, 6 categorias, home, catálogo e 8 páginas institucionais |
| Textos em inglês misturados | Tudo em português de Portugal |
| Cartões sem informação | Tempos, doses, dificuldade, descrição e imagem |
| Sem pesquisa por ingrediente/categoria | Pesquisa por nome, ingrediente e categoria (API + cliente) |
| Sem informação de alergénios/conservação | Alergénios, alternativas, dicas e conservação em todas as receitas |
| Sem transparência editorial | Página “Sobre”, política editorial, privacidade, cookies e termos |

O design mantém a identidade: fundo preto, laranja, texto branco, cartões escuros e animações suaves.

---

## 7. Preparar novo pedido ao AdSense

Antes de submeter novamente:

1. **Confirme o domínio** em `sitemap.xml`, `robots.txt`, canonical e Open Graph (todos usam `https://theflavorfind.netlify.app`). Se usar domínio próprio, substitua `SITE_URL` em `build/partials.mjs` e volte a correr o build.
2. **Verifique o ads.txt:** `google.com, pub-3918165477241157, DIRECT, f08c47fec0942fa0`.
3. **Não ative anúncios** até a aprovação. O site atualmente não carrega scripts de anúncios.
4. Confirme que as páginas principais estão acessíveis: `/`, `/sobre.html`, `/contacto.html`, `/politica-editorial.html`, `/privacidade.html`, `/cookies.html`, `/termos.html`.
5. Submeta o sitemap no Google Search Console.
6. Peça revisão no AdSense depois de o site estar indexado.

Motivos do pedido anterior — “conteúdo de baixo valor” — endereçados com: mais páginas, receitas completas e originais, texto editorial próprio em cada categoria, informação de alergénios e conservação, transparência sobre imagens IA, autoria/contacto e políticas legais.

> **Nota honesta:** as receitas foram escritas e revistas editorialmente, mas não foram testadas em laboratório. O site diz isso claramente e não afirma o contrário.

---

## 8. Desenvolvimento local

Pré-visualização estática (a pesquisa recorre ao índice local se a API não estiver disponível):

```bash
python3 -m http.server 4173
# abrir http://localhost:4173
```

Para testar a API e as funções:

```bash
npm install -g netlify-cli
netlify dev
```

Para testar a função diretamente:

```bash
node -e "import('./netlify/functions/recipes.mjs').then(async m => {
  const r = await m.handler({ path: '/api/recipes', httpMethod: 'GET', queryStringParameters: { q: 'frango' }, headers: {} });
  console.log(r.statusCode, JSON.parse(r.body).total);
})"
```

---

## 9. Manutenção

- **Service worker:** versão em `sw.js` (`theflavorfind-v2`). Ao alterar CSS/JS de forma relevante, incremente a versão para forçar atualização.
- **Cache de imagens:** `Cache-Control: immutable` por 1 ano; se substituir uma imagem, use um nome novo.
- **API:** `Cache-Control: public, max-age=60` nas leituras. O POST não é cacheado.
- **Segurança:** o token de administração só existe no ambiente da Netlify. Nunca o coloque em `scripts.js`, `admin.html` ou no repositório.

---

## 10. Limitações conhecidas

- As receitas não foram testadas em laboratório; os tempos são orientações.
- As imagens são ilustrativas e geradas por IA.
- A API em modo de leitura (sem `ADMIN_TOKEN`) recusa `POST` com `503` — comportamento intencional.
- Receitas criadas pela API não geram página estática; para SEO, use o fluxo do ponto 4.
- O e-mail de contacto (`maywebproject@gmail.com`) está em várias páginas e deve ser substituído se quiser um endereço dedicado.
