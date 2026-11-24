/**
 * TheFlavorFind — API própria de receitas (Netlify Function)
 *
 * GET  /api/recipes                      lista e pesquisa
 *      ?q=          texto livre (nome, descrição, ingrediente, categoria)
 *      ?ingredient= ingrediente específico
 *      ?category=   pequeno-almoco | massas | carne | peixe | vegetarianas | sobremesas
 *      ?featured=1  apenas receitas em destaque
 *      ?limit= &offset=
 * GET  /api/recipes/:id                  receita completa (id ou slug)
 * GET  /api/categories                   categorias e contagens
 * GET  /api/health                       estado do serviço
 * POST /api/recipes                      adiciona receita (requer ADMIN_TOKEN)
 *
 * As receitas base vivem em data/recipes.json (versionado no repositório).
 * As receitas adicionadas pela API são guardadas em Netlify Blobs, sem tocar
 * no ficheiro original, para que um novo deploy não as apague.
 */

import seed from "./_seed.mjs";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token"
};

const CATEGORIES = {
  "pequeno-almoco": "Pequeno-almoço",
  massas: "Massas",
  carne: "Carne",
  peixe: "Peixe",
  vegetarianas: "Vegetarianas",
  sobremesas: "Sobremesas"
};

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const summary = (r) => ({
  custom: !!r.custom,
  id: r.id,
  slug: r.slug,
  name: r.name,
  description: r.description,
  category: r.category,
  categoryName: r.categoryName,
  image: r.image,
  imageThumb: r.imageThumb,
  imageAlt: r.imageAlt,
  prepTime: r.prepTime,
  cookTime: r.cookTime,
  totalTime: r.prepTime + r.cookTime,
  servings: r.servings,
  servingsLabel: r.servingsLabel,
  difficulty: r.difficulty,
  featured: !!r.featured,
  keywords: r.keywords || [],
  ingredientNames: (r.ingredients || []).map((i) => i.item)
});

async function customRecipes() {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("theflavorfind");
    const stored = await store.get("custom-recipes", { type: "json" });
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    // Em desenvolvimento local, sem o contexto da Netlify, a API funciona
    // apenas com as receitas base.
    console.warn("Netlify Blobs indisponível:", error.message);
    return [];
  }
}

function json(statusCode, body, extra = {}) {
  return {
    statusCode,
    headers: { ...JSON_HEADERS, ...extra },
    body: JSON.stringify(body, null, 0)
  };
}

function validateRecipe(input) {
  const errors = [];
  if (!input || typeof input !== "object") return ["Corpo do pedido inválido."];
  if (typeof input.name !== "string" || String(input.name).trim().length < 3) errors.push("name é obrigatório (mínimo 3 caracteres).");
  if (!Object.hasOwn(CATEGORIES, input.category)) errors.push(`category deve ser um de: ${Object.keys(CATEGORIES).join(", ")}.`);
  if (typeof input.description !== "string" || String(input.description).trim().length < 20) errors.push("description é obrigatória (mínimo 20 caracteres).");
  if (!Array.isArray(input.ingredients) || input.ingredients.length < 2) errors.push("ingredients deve ser uma lista com pelo menos 2 itens.");
  if (!Array.isArray(input.instructions) || input.instructions.length < 2) errors.push("instructions deve ser uma lista com pelo menos 2 passos.");
  if (!Number.isFinite(input.prepTime) || input.prepTime < 0) errors.push("prepTime deve ser um número de minutos.");
  if (!Number.isFinite(input.cookTime) || input.cookTime < 0) errors.push("cookTime deve ser um número de minutos.");
  if (!Number.isFinite(input.servings) || input.servings < 1) errors.push("servings deve ser um número maior do que zero.");
  if (Array.isArray(input.ingredients) && input.ingredients.some(i => !i || typeof i.item !== "string" || typeof i.quantity !== "string")) errors.push("Ingredientes inválidos.");
  if (Array.isArray(input.instructions) && input.instructions.some(i => !i || typeof i.title !== "string" || typeof i.text !== "string")) errors.push("Passos inválidos.");
  return errors;
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: JSON_HEADERS, body: "" };
  }

  const fullPath = event.path || "";
  let sub = "";
  if (fullPath.includes("/api/")) sub = fullPath.split("/api/")[1];
  else if (fullPath.includes("/.netlify/functions/recipes")) sub = fullPath.split("/.netlify/functions/recipes")[1] || "";
  sub = sub.replace(/^\/+/, "").replace(/^recipes\/?/, "");
  const segments = sub.split("/").filter(Boolean);
  const params = event.queryStringParameters || {};
  const all = [...seed, ...(await customRecipes())];

  /* ------------------------------- GET ---------------------------------- */

  if (event.httpMethod === "GET") {
    if (segments[0] === "health") {
      return json(200, {
        status: "ok",
        service: "TheFlavorFind Recipes API",
        recipes: all.length,
        seed: seed.length,
        custom: all.length - seed.length,
        writable: Boolean(process.env.ADMIN_TOKEN)
      });
    }

    if (segments[0] === "categories") {
      const counts = Object.entries(CATEGORIES).map(([slug, name]) => ({
        slug,
        name,
        count: all.filter((r) => r.category === slug).length
      }));
      return json(200, { categories: counts, total: all.length });
    }

    if (segments.length > 0) {
      let key; try { key = decodeURIComponent(segments[0]); } catch { return json(400, {error: "Endereço inválido."}); }
      const recipe = all.find((r) => r.id === key || r.slug === key);
      if (!recipe) return json(404, { error: "Receita não encontrada.", id: key });
      return json(200, recipe);
    }

    let results = all.slice();
    const q = normalize(params.q);
    const category = params.category;

    if (category) {
      if (!Object.hasOwn(CATEGORIES, category)) {
        return json(400, { error: "Categoria inválida.", validCategories: Object.keys(CATEGORIES) });
      }
      results = results.filter((r) => r.category === category);
    }

    if (params.ingredient) {
      const ingredient = normalize(params.ingredient);
      results = results.filter((r) =>
        (r.ingredients || []).some((i) => normalize(i.item).includes(ingredient))
      );
    }

    if (q) {
      const terms = q.split(/\s+/).filter(Boolean);
      results = results.filter((r) => {
        const ingredients = (r.ingredients || []).map((i) => normalize(i.item)).join(" ");
        const haystack = normalize(
          [r.name, r.description, r.categoryName, ...(r.keywords || []), ingredients].join(" ")
        );
        return terms.every((t) => haystack.includes(t));
      });
    }

    if (params.featured === "1" || params.featured === "true") {
      results = results.filter((r) => r.featured);
    }

    const sort = params.sort || "editorial";
    if (sort === "quick") {
      results.sort((a, b) => a.prepTime + a.cookTime - (b.prepTime + b.cookTime));
    } else if (sort === "name") {
      results.sort((a, b) => a.name.localeCompare(b.name, "pt"));
    }

    const total = results.length;
    const limit = Math.min(Math.max(parseInt(params.limit, 10) || 30, 1), 100);
    const offset = Math.max(parseInt(params.offset, 10) || 0, 0);
    const page = results.slice(offset, offset + limit);

    return json(200, {
      total,
      count: page.length,
      limit,
      offset,
      recipes: page.map(params.full === "1" ? (r) => r : summary)
    });
  }

  /* ------------------------------- POST --------------------------------- */

  if (event.httpMethod === "POST") {
    const token = process.env.ADMIN_TOKEN;
    const provided = (event.headers || {})["x-admin-token"] || (event.headers || {})["X-Admin-Token"];

    if (!token) {
      return json(503, {
        error: "A API está em modo de leitura. Defina a variável de ambiente ADMIN_TOKEN na Netlify para ativar a adição de receitas."
      });
    }
    if (!provided || provided !== token) {
      return json(401, { error: "Token de administração inválido." });
    }

    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return json(400, { error: "JSON inválido." });
    }

    const errors = validateRecipe(body);
    if (errors.length) return json(422, { error: "Dados incompletos.", details: errors });

    const slug = body.slug ? slugify(body.slug) : slugify(body.name);
    if (!slug) return json(422, { error: "Não foi possível gerar um slug a partir do nome." });
    if (all.some((r) => r.slug === slug)) {
      return json(409, { error: "Já existe uma receita com este slug.", slug });
    }

    const recipe = {
      id: body.id || `custom-${slug}`,
      slug,
      name: body.name.trim(),
      category: body.category,
      categoryName: CATEGORIES[body.category],
      description: body.description.trim(),
      image: body.image || "/images/placeholder-receita.svg",
      imageThumb: body.imageThumb || body.image || "/images/placeholder-receita.svg",
      imageAlt: body.imageAlt || `Fotografia ilustrativa de ${body.name.trim()}`,
      prepTime: body.prepTime,
      cookTime: body.cookTime,
      servings: body.servings,
      servingsLabel: body.servingsLabel || `${body.servings} doses`,
      difficulty: ["Fácil", "Médio", "Difícil"].includes(body.difficulty) ? body.difficulty : "Médio",
      ingredients: body.ingredients,
      instructions: body.instructions,
      tips: Array.isArray(body.tips) ? body.tips : [],
      substitutions: Array.isArray(body.substitutions) ? body.substitutions : [],
      allergens: Array.isArray(body.allergens) ? body.allergens : [],
      allergenNote: body.allergenNote || "Verifique sempre os rótulos dos ingredientes utilizados.",
      storage: body.storage || "Consumir em 2 a 3 dias, guardado no frigorífico.",
      keywords: Array.isArray(body.keywords) ? body.keywords : [],
      featured: false,
      imageIllustrative: true,
      createdAt: new Date().toISOString(),
      custom: true
    };

    try {
      const { getStore } = await import("@netlify/blobs");
      const store = getStore("theflavorfind");
      const stored = (await store.get("custom-recipes", { type: "json" })) || [];
      stored.push(recipe);
      await store.setJSON("custom-recipes", stored);
    } catch (error) {
      return json(500, {
        error: "Não foi possível guardar a receita. Confirme que a Netlify Blobs está disponível neste site.",
        detail: "Verifique os registos da função na Netlify."
      });
    }

    return json(201, { message: "Receita criada.", recipe }, { "Cache-Control": "no-store" });
  }

  return json(405, { error: "Método não permitido." });
}
