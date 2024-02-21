import { API_URL, RESULTS_PER_PAGE } from './config'
import { getJSON } from './helper'

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RESULTS_PER_PAGE,
        page: 1
    },
    bookmarks: []
}

export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}/${id}`)

        // console.log(res,data)
        const { recipe } = data.data
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients
        }

        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.isBookmarked = true
        else
            state.recipe.isBookmarked = false
        console.log(state.recipe)
    } catch (err) {
        console.error(`${err} 💥💥`)
        throw err;
    }

}

export const loadSearchResult = async function (query) {
    try {
        state.search.query = query
        state.search.page = 1
        const data = await getJSON(`${API_URL}?search=${query}`)
        // console.log(data)
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
            }
        })

        console.log(state.search.results)
    } catch (err) {
        console.error(`${err} 💥💥`)
        throw err;
    }
}

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage
    const end = page * state.search.resultsPerPage

    return state.search.results.slice(start, end)
}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings // (oldQty * newServings)/oldServings
    });

    state.recipe.servings = newServings
}

export const addBookmark = function (recipe) {
    // add bookmark
    state.bookmarks.push(recipe)

    // mark current recipe as bookmark
    if (recipe.id === state.recipe.id) {
        state.recipe.isBookmarked = true
    }
}

export const deleteBookmark = function (id) {
    // delete bookmark
    const index = state.bookmarks.findIndex(ele => ele.id === id)
    state.bookmarks.splice(index, 1);

    // mark current recipe as not a bookmark
    if (id === state.recipe.id)
        state.recipe.isBookmarked = false
}