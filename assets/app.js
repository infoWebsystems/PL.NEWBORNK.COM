const DEBUG = false;

const ANNOUNCEMENT = document.querySelector('.announcement-bar');
const HEADER = document.querySelector('.announcement-bar');

const createElement = (tag) => {
    const element = document.createElement(tag);

    return element;
}

const iframeShopifyChat = (delay = 500) => {
    if (DEBUG) console.log('iframeShopifyChat();');

    const interval = setInterval(() => {

        const chatWindow = document.getElementById('ShopifyChat');
  
        if (chatWindow) {
          
          clearInterval(interval);
          
          const rewrite = () => {
            const iframeDocument = chatWindow.contentDocument;
            const body = iframeDocument.querySelector('body');
          
            if (!body.querySelector('.trm-styles')) {
              const styleElement = createElement('style');
              styleElement.classList.add('trm-styles');

              styleElement.textContent = `
              .interstitial-view__welcome .store-info h2,
              .interstitial-view__welcome .store-info p,
              .chat-app button.interstitial-view__return-to-chat {
              color: #000;
              }

              .interstitial-view__return-to-chat svg * {
              fill: #000;
              }`;

              body.appendChild(styleElement);
            }
            
            
            const textarea = body.querySelector('.composer-bar-form textarea');
            textarea.setAttribute('placeholder', 'Напишіть нам');
            textarea.setAttribute('aria-label', 'Напишіть нам');

            const FAQInterval = setInterval(() => {
                const button = body.querySelector(`.chat-app .interstitial-view__faqs [data-testid]`);

                if (button) {
                    clearInterval(FAQInterval);
                    button.parentNode.remove();
                }

            }, 100);
          }
          

          // Конфигурация observer (за какими изменениями наблюдать)
          const config = {
            attributes: true
          };

          // Колбэк-функция при срабатывании мутации
          const callback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
              if (mutation.attributeName === 'isopen') {
                if (mutation.target.getAttribute('isopen')) rewrite();
              }
            }
          };

          // Создаём экземпляр наблюдателя с указанной функцией колбэка
          const observer = new MutationObserver(callback);

          // Начинаем наблюдение за настроенными изменениями целевого элемента
          observer.observe(chatWindow, config);
  
          rewrite();
        }

    }, delay)

}

const getHeight = (el) => el.offsetHeight;

const product = {
    sticky() {
        const product = document.querySelector('.product');

        if (!product) return false;

        const block = product.querySelector('.product__info-container--sticky');

        const height = Math.ceil(getHeight(block) / 3);

        block.style.top = '-' + height + 'px';
    },
    modal() {
      const modal = document.getElementById('PopupModal-sizeQuide');
      
      if (!modal) return false;
      
      const closeButton = modal.querySelector('.product-popup-modal__button');
      
      const closeButtonHandle = () => modal.removeAttribute('open');
      
      closeButton.addEventListener('click', closeButtonHandle);
      
      const announcementOffset = getHeight(ANNOUNCEMENT);
      const headerOffset = getHeight(HEADER);
      
      const setModalOffsetTop = () => modal.style.height = (window.innerHeight - (announcementOffset + headerOffset + 6)) + 'px';
      
      const modalOffset = () => {
        if (window.innerWidth <= 576) {
          setModalOffsetTop();
        } else  {
          modal.style.height = '';
        }
      }
      
      window.addEventListener('resize', modalOffset);
      modalOffset();
    },
    init() {
      this.sticky();
      this.modal();
    }
};


const collection = {
    sticky() {
        const collection = document.querySelector('.template-collection');

        if (!collection) return false;

        const filters = collection.querySelector('.collection-filters');
        const nav = filters.querySelector('.header__inline-menu');

        const announcementOffset = getHeight(ANNOUNCEMENT);
        const headerOffset = getHeight(HEADER);

        nav.style.top = Math.ceil((announcementOffset + headerOffset) * 1.5) + 'px';
    },
    init() {
        this.sticky();
    }
}

const init = () => {
    if (DEBUG) console.log('init();');

    iframeShopifyChat();

    product.init();
    collection.init();
}

document.addEventListener('DOMContentLoaded', init);