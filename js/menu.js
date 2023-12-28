"use strict"; 
/*------------------BURGER-MENU-----------------*/
document.addEventListener("DOMContentLoaded", function () {
  let buttons = document.querySelectorAll('.button-burger-content');
  buttons.forEach(function (button) {
      button.addEventListener('click', function (event) {
          buttons.forEach(function (btn) {
              btn.classList.toggle('decomposed');
          });
          document.querySelector('.burger-menu-menu').classList.toggle('decomposed');
          document.body.classList.toggle('lock');
      });
  });
});
/*--------------------MENU---------------------*/
//----------------active-button------------------
let tabs = document.querySelectorAll('.item-tab');

tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        if (!this.classList.contains('choice')) {
            tabs.forEach(otherTab => {
                otherTab.classList.remove('choice');
            });
            this.classList.add('choice');
        }
    });
});
//----------------product-card-------------------
let xhr = new XMLHttpRequest();
xhr.open('GET', '/coffee-house/json/products.json', true);
xhr.onload = function() {
  if (this.status == 200) {
    let data = JSON.parse(this.responseText);
//--------------chooising-category---------------
    let tabs = {
      indexCoffee: document.getElementById('indexCoffee'),
      indexTea: document.getElementById('indexTea'),
      indexDessert: document.getElementById('indexDessert')
    };

    for (let index in tabs) {
      tabs[index].addEventListener('click', function() {
        const container = document.getElementById('product-container');
        container.innerHTML = '';

        let category;
        if (index === 'indexCoffee') {
            category = 'coffee';
        } else if (index === 'indexTea') {
            category = 'tea';
        } else if (index === 'indexDessert') {
            category = 'dessert';
        }

        if (category) {
          let products = data.products.filter(product => product.category === category);
          createProductCards(products, container);
        }
      });
    }

    let coffeeProducts = data.products.filter(product => product.category === 'coffee');
    createProductCards(coffeeProducts, document.getElementById('product-container'));
  }
};
xhr.send();

function createProductCards(products, container) {
  products.forEach((product, index) => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
    <div class="product-card-image">
        <img src="${product.image}" alt="${product.image}" class="product-image">
    </div>
    <div class="product-card-specification">
        <div class="product-card-title">
            <div class="product-card-name">${product.name}</div>
            <div class="product-card-description">${product.description}</div>
        </div>
        <div class="product-card-price">$${product.price}</div>
    </div>
    `;

    if (window.innerWidth <= 768 && index >= 4) {
      productCard.style.display = 'none';
    }
    //----------------open-modal----------------
    productCard.addEventListener('click', () => openModal(product));
    container.appendChild(productCard);
  });
//---------------button-more-load---------------
  let button = document.querySelector('.button-refresh');
  if (!button) {
    if (window.innerWidth <= 768 && products.length > 4) {
      button = document.createElement('button');
      button.className = 'button-refresh';
      button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21.8883 13.5C21.1645 18.3113 17.013 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1006 2 19.6248 4.46819 21.1679 8" stroke="#403F3D" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke="#403F3D" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      `;
      button.addEventListener('click', function() {
        const hiddenCards = document.querySelectorAll('.product-card[style="display: none;"]');
        hiddenCards.forEach(card => card.style.display = 'block');
        button.remove();
      });
      const shopMenuContainer = document.querySelector('.shop-menu-container');
      shopMenuContainer.appendChild(button);
    }
  }
}
  
  window.addEventListener('resize', function() {
    const productCards = document.querySelectorAll('.product-card');
    const button = document.querySelector('.button-refresh');
  
    if (window.innerWidth <= 768) {
      productCards.forEach((card, index) => {
        card.style.display = index >= 4 ? 'none' : 'block';
      });
      if (productCards.length > 4 && button) {
        button.style.display = 'block';
      }
    } else {
      productCards.forEach(card => {
        card.style.display = 'block';
      });
      if (button) {
        button.style.display = 'none';
      }
    }
  });

/*-----------------MODAL-CARD------------------*/
// Функция для открытия модального окна
function openModal(product, selectedSize) {
  let modal = document.querySelector('.modal');
  let productImg = modal.querySelector('.modal-preview-product');
  let productName = modal.querySelector('.modal-specification-name');
  let productDescription = modal.querySelector('.modal-specification-description');
  let sizeTabs = modal.querySelectorAll('.modal-size-tabs .modal-tab');
  let additivesTabs = modal.querySelectorAll('.modal-additives-tabs .modal-tab-item');
  let finalPrice = modal.querySelector('.modal-total-value');

  document.body.style.overflow = 'hidden';

  modal.style.display = 'block';
  productImg.src = product.image;
  productName.textContent = product.name;
  productDescription.textContent = product.description;

  let basePrice = parseFloat(product.price);
  let sizePrice = basePrice;
  let additivesPrice = 0;

  sizeTabs.forEach((tab, index) => {
    let size = Object.keys(product.sizes)[index];
    if (size) {
      tab.querySelector('.modal-value').textContent = product.sizes[size].size;
    }
    tab.addEventListener('click', () => {
      sizeTabs.forEach(tab => {
        tab.classList.remove('one-size');
      });
      tab.classList.add('one-size');

      sizePrice = basePrice + parseFloat(product.sizes[tab.id]['add-price']);

      calculatePrice();
    });
  });

additivesTabs.forEach((tab, index) => {
  let additive = product.additives[index];
  if (additive) {
    tab.querySelector('.modal-additive-name').textContent = additive.name;
  }
  let newTab = tab.cloneNode(true);
  tab.parentNode.replaceChild(newTab, tab);

  newTab.addEventListener('click', () => {
    newTab.classList.toggle('select-multiple');

    additivesPrice = Array.from(modal.querySelectorAll('.select-multiple')).length * parseFloat(additive['add-price']);

    calculatePrice();
  });
});

  function calculatePrice() {
    let totalPrice = sizePrice + additivesPrice;
    finalPrice.textContent = '$' + totalPrice.toFixed(2);
  }

  calculatePrice();

  document.querySelector('.modal-tab#s').classList.add('one-size');
}

function closeModal() {
  let modal = document.querySelector('.modal');
  let sizeTabs = modal.querySelectorAll('.modal-size-tabs .modal-tab');
  let additivesTabs = modal.querySelectorAll('.modal-additives-tabs .modal-tab-item');

  modal.style.display = 'none';

  document.body.style.overflow = '';

  sizeTabs.forEach(tab => {
    tab.classList.remove('one-size');
  });
  additivesTabs.forEach(tab => {
    tab.classList.remove('select-multiple');
  });

  document.querySelector('.modal-tab#s').classList.add('one-size');
}

document.querySelector('.modal-button-secondary').addEventListener('click', closeModal);

window.addEventListener('click', function(event) {
  let modal = document.querySelector('.modal');
  if (event.target == modal) {
    closeModal();
  }
});