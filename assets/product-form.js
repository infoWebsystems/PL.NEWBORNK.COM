const getRandomNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max - min));
}

document.addEventListener('DOMContentLoaded', () => {
  const product = document.querySelector('.product');
  const selects = product.querySelectorAll('select');
  const buttoLabel = product.querySelector('form.form').getAttribute('data-button-label');

  selects.forEach((select, index) => {
    select.addEventListener('change', (evt) => {
      product.querySelector('form [type="submit"]').setAttribute('data-product-added', '');
    });             
  });
  
  let timerId = setInterval(() => {
    if (document.querySelector('.shopify-payment-button__button')) {
      let bynowButton = document.querySelector('.shopify-payment-button__button');
      if (bynowButton.innerText == 'Buy it now') {
        bynowButton.innerText = buttoLabel;
        bynowButton.style.color = '#fff';
        clearInterval(timerId);
      }
    } 
  }, 50);
  setTimeout(() => { clearInterval(timerId); }, 5000); 
});

class ProductForm extends HTMLElement {
  constructor() {
    super();   

    this.form = this.querySelector('form');
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cartNotification = document.querySelector('cart-notification');
  }
  
  onSubmitHandler(evt) {
    evt.preventDefault();
    this.cartNotification.setActiveElement(document.activeElement);
    
    const submitButton = this.querySelector('[type="submit"]');
    
    const ADD_TO_CART = submitButton.getAttribute('data-add-to-cart');
    const VIEW_CART = submitButton.getAttribute('data-view-cart');
    
    const HAS_PRODUCT_ADDED = submitButton.getAttribute('data-product-added');
    
    if (HAS_PRODUCT_ADDED) {
      location.href = location.origin + "/cart";
      return false;
    }

    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('loading');
    
    const uniqueId = {
      properties: {
        "unique_id": Date.now() + "_" + getRandomNumber(0, Date.now())
      } 
    };

    const body = JSON.stringify({
      ...JSON.parse(serializeForm(this.form)),
      ...uniqueId,
      sections: this.cartNotification.getSectionsToRender().map((section) => section.id),
      sections_url: window.location.pathname
    });

    fetch(`${routes.cart_add_url}`, { ...fetchConfig('javascript'), body })
      .then((response) => response.json())
      .then((parsedState) => {
        console.log(parsedState);
        this.cartNotification.renderContents(parsedState);
        submitButton.setAttribute('data-product-added', "true");
        submitButton.textContent = VIEW_CART;
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        submitButton.classList.remove('loading');
        submitButton.removeAttribute('disabled');
      });
  }
}

customElements.define('product-form', ProductForm);


/*setTimeout(function(){
  document.querySelector('.shopify-payment-button__button').innerText = 'Швидка покупка';
  document.querySelector('.shopify-payment-button__button').style.color = '#fff';
},3000);*/


