/* 
 lógica de programção 

    [x] pegar a informção do input, quando o botão for clicado
    [x] Ir ate a API, e trazer as receitas
    [x] Coolocar as receitas na tela
    [x] Saber quando o usuário clicou na receita
    [x] Buscar informaçoes da receita individual, na API
    [x] Colocar a receita da individual na tela
 */




const form = document.querySelector('.search-form');
const recipeList = document.querySelector('.recipe-list');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const inputValue = form.querySelector('input').value.trim();

    if (inputValue === '') {
        return;
    }

    searchRecipes(inputValue);
});


async function searchRecipes(ingredient) {
    recipeList.innerHTML = '<p>A procurar receitas...</p>';

    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
        );

        const data = await response.json();

        showRecipes(data.meals);

    } catch (error) {
        console.log(error);
        recipeList.innerHTML = '<p>Erro ao procurar receitas.</p>';
    }
}


function showRecipes(recipes) {

    if (!recipes) {
        recipeList.innerHTML = '<p>Nenhuma receita encontrada!</p>';
        return;
    }

    recipeList.innerHTML = recipes.map((item) => `
        <div class="recipe-card" onclick="getRecipeDetails('${item.idMeal}')">

            <img src="${item.strMealThumb}" alt="${item.strMeal}">

            <h3>${item.strMeal}</h3>

        </div>
    `).join('');
}


async function getRecipeDetails(id) {

    recipeList.innerHTML = '<p>A carregar receita...</p>';

    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );

        const data = await response.json();

        if (!data.meals) {
            recipeList.innerHTML = '<p>Receita não encontrada!</p>';
            return;
        }

        const recipe = data.meals[0];

        let ingredients = '';

        for (let i = 1; i <= 20; i++) {

            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];

            if (ingredient && ingredient.trim() !== '') {

                ingredients += `
                    <li>
                        ${ingredient} - ${measure || ''}
                    </li>
                `;

            }
        }


        // Vídeo do YouTube

        let videoId = '';

        if (recipe.strYoutube) {

            try {
                const url = new URL(recipe.strYoutube);

                if (url.hostname.includes('youtu.be')) {
                    videoId = url.pathname.slice(1);
                } else {
                    videoId = url.searchParams.get('v') ||
                        url.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1] || '';
                }

            } catch (error) {
                console.log('Vídeo inválido');
            }
        }


        // Mostrar detalhes da receita

        recipeList.innerHTML = `

            <div class="recipe-details">

                <h2>${recipe.strMeal}</h2>

                <img
                    src="${recipe.strMealThumb}"
                    alt="${recipe.strMeal}"
                >

                <div class="ingredients">

                    <h3>Ingredientes</h3>

                    <ul>
                        ${ingredients}
                    </ul>

                </div>

                <div class="instructions">

                    <h3>Como preparar</h3>

                    <p>${recipe.strInstructions}</p>

                </div>

                <div class="recipe-video">

                    <h3>Vídeo da receita</h3>

                    ${
                        videoId
                        ? `
                            <iframe
                                src="https://www.youtube-nocookie.com/embed/${videoId}"
                                title="Como preparar ${recipe.strMeal}"
                                allowfullscreen>
                            </iframe>
                        `
                        : '<p>Vídeo não disponível.</p>'
                    }

                </div>

                <button onclick="searchRecipes(form.querySelector('input').value)">
                    Voltar às receitas
                </button>

            </div>

        `;

    } catch (error) {

        console.log(error);

        recipeList.innerHTML = '<p>Erro ao carregar os detalhes da receita.</p>';

    }
}



function goHome() {
    const input = document.querySelector('.search-form input');

    if (input) {
        searchRecipes(input.value.trim());
    }

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}




async function loadFeaturedRecipes() {

    const featuredRecipes = document.querySelector('#featured-recipes');

    try {
        const response = await fetch(
            'https://www.themealdb.com/api/json/v1/1/search.php?f=a'
        );

        const data = await response.json();

        if (!data.meals) {
            featuredRecipes.innerHTML = '<p>No recipes found.</p>';
            return;
        }

        featuredRecipes.innerHTML = data.meals.slice(0, 6).map((item) => `
            <div class="featured-card" onclick="getRecipeDetails('${item.idMeal}')">

                <img src="${item.strMealThumb}" alt="${item.strMeal}">

                <h3>${item.strMeal}</h3>

                <span>View Recipe →</span>

            </div>
        `).join('');

    } catch (error) {
        console.log(error);
        featuredRecipes.innerHTML = '<p>Could not load recipes.</p>';
    }
}

loadFeaturedRecipes();
