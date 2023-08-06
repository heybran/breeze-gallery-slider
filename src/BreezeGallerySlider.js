import css from "./BreezeGallerySlider.css?inline";

export default class BreezeGallerySlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupMainImage();
    this.setupThumbnails();
  }

  get article() {
    return this.shadowRoot.querySelector('article');
  }

  get picture() {
    return this.shadowRoot.querySelector('picture');
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <header>
        <picture></picture>
      </header>
      <article>
      </article>
    `;
  }

  setupMainImage() {
    const image = document.createElement('img');
    image.src = this.querySelector('img').src;
    this.picture.append(image);
  }

  setupThumbnails() {
    this.images = this.querySelectorAll('img');
    Array.from(this.images).forEach((img, index) => {
      const button = document.createElement('button');
      button.addEventListener('click', this.switchImage.bind(this));
      button.addEventListener('focusin', this.switchImage.bind(this));
      const slot = document.createElement('slot');
      button.append(slot);
      const connection = 'img-' + index;
      slot.setAttribute('name', connection);
      img.setAttribute('slot', connection);
      button.setAttribute('data-connection', connection);
      if (index === 0) button.classList.add('active');
      this.article.append(button);
    });
  }

  switchImage(e) {
    /** @type {HTMLButtonElement} */
    let button;
    const activeButton = this.shadowRoot.querySelector('button.active');
    if (e.type === 'focusin') {
      button = e.target;
    } else if (e.type === 'click') {
      const img = e.target;
      button = this.shadowRoot.querySelector(`button[data-connection=${img.slot}]`);
    }
    
    if (activeButton === button) {
      return;
    } 

    activeButton.classList.remove('active');
    button.classList.add('active');
    this.picture.querySelector('img').src = button.firstElementChild.assignedElements()[0].src;
  }
}

customElements.define('breeze-gallery-slider', BreezeGallerySlider);