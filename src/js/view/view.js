import icons from "url:../../img/icons.svg" // importing icons

export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    this._clear();
    this._parentEle.insertAdjacentHTML('afterbegin', markup)
  }

  update(data) {

    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup)
    const newElements = Array.from(newDOM.querySelectorAll('*'))
    const currElements = Array.from(this._parentEle.querySelectorAll('*'))

    newElements.forEach((newEle, i) => {
      const currEle = currElements[i]
      // console.log(currEle, newEle.isEqualNode(currEle))

      // udpates changed text
      if(!newEle.isEqualNode(currEle) && newEle.firstChild?.nodeValue.trim() !== ''){
        currEle.textContent = newEle.textContent
      }

      // udpates changed attributes
      if(!newEle.isEqualNode(currEle)){
        Array.from(newEle.attributes).forEach(attr=>{
          currEle.setAttribute(attr.name,attr.value)
        })
      }
    });

  }

  _clear() {
    this._parentEle.innerHTML = ''
  }

  renderSpinner = function () {
    const markup = `
              <div class="spinner"> 
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>
            `
    this._clear();
    this._parentEle.insertAdjacentHTML('afterbegin', markup)
  }

  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `
    this._clear();
    this._parentEle.insertAdjacentHTML('afterbegin', markup)
  }

  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `
    this._clear();
    this._parentEle.insertAdjacentHTML('afterbegin', markup)
  }
}