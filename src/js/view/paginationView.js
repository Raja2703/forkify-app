import View from './view'
import icons from "url:../../img/icons.svg" // importing icons

class PaginationView extends View {
  _parentEle = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEle.addEventListener('click', function (e) {
      const button = e.target.closest('.btn--inline')

      if (!button) return;

      const goto = +button.dataset.goto
      console.log(goto)
      handler(goto);
    })
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numberOfPages = Math.ceil(this._data.results.length / this._data.resultsPerPage)
    // console.log(numberOfPages)

    // Page 1 and there are more pages
    if (currentPage === 1 && currentPage < numberOfPages) {
      return this.renderNextButton(currentPage)
    }

    // last page
    if (currentPage === numberOfPages) {
      return this.renderPrevButton(currentPage)
    }

    // other page
    if (currentPage < numberOfPages) {
      const buttons = this.renderPrevButton(currentPage) + this.renderNextButton(currentPage)
      return buttons
    }

    // Page 1 and there are no other pages
    return ``
  }

  renderPrevButton(currentPage) {
    return `
        <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
      `
  }

  renderNextButton(currentPage) {
    return `
        <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `
  }
}

export default new PaginationView();