import * as model from './model.js'
import recipeView from './view/recipeView.js'
import searchView from './view/searchView.js'
import resultsView from './view/resultsView.js'

import 'regenerator-runtime/runtime' // for polyfilling async await
import 'core-js/stable' // for polyfilling everything else
import searchView from './view/searchView.js';
import paginationView from './view/paginationView.js'
import bookMarksView from './view/bookMarksView.js'

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id)

    if (!id) return
    recipeView.renderSpinner() //spinner

    // update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())
    bookMarksView.update(model.state.bookmarks)

    //loading recipe
    await model.loadRecipe(id);

    // rendering the recipe
    recipeView.render(model.state.recipe)

  } catch (err) {
    // alert(err.message)
    recipeView.renderError()
  }
}

// if (module.hot) {
//   module.hot.accept()
// }

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner()
    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) get search results
    await model.loadSearchResult(query);

    // 3) render search results
    const data = model.getSearchResultsPage()
    resultsView.render(data)

    // 4) render initial pagination buttons
    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err)
  }
}

const controlPagination = function (goto) {
  console.log('page controller')
  // 1) render search results
  const data = model.getSearchResultsPage(goto)
  resultsView.render(data)

  // 2) render initial pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function (updateTo) {
  // update the servings
  model.updateServings(updateTo)

  // render the recipe with new servings
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  // add or remove bookmark
  if (!model.state.recipe.isBookmarked)
    model.addBookmark(model.state.recipe)
  else
    model.deleteBookmark(model.state.recipe.id)

  recipeView.update(model.state.recipe)

  // render bookmark
  bookMarksView.render(model.state.bookmarks)
}

// showRecipe()
const init = function () {
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
}
init()