import { products } from "../data/products.js";
import { addToCart, updateCartQuantity, cart, calculateCartQuantity } from "../data/cart.js";

import { calculatePercentChange } 
from "../data/money.js";

/*
const products =
[{
  image: 'images/products/backpack.jpg',
name: 'backpack',
rating: {
  image: "images/rating.png",
  stars:  3.9,
  count : '(1396)'
},
prices: {
  currentPrice: 1200,
  previousPrice:1500,
},
dropPricePercent: '20%'
},


{
  image: 'images/products/men-athletic-shoes-green.jpg',
name: 'mens-athletic-shoes-green',
rating: {
  image: "images/rating.png",
  stars:  5.9,
  count : '(555)'
},
prices: {
  currentPrice: 2500,
  previousPrice:3500,
},
dropPricePercent: '-28%'
},


{
  image: 'images/products/intermediate-composite-basketball.jpg',
name: 'Intermediate Size Basketball',
rating: {
  image: "images/rating.png",
  stars:  4.5,
  count : '(495)'
},
prices: {
  currentPrice: 4000,
  previousPrice:5500,
},
dropPricePercent: '-27%'
},
];
*/

export let productHTML = '';

products.forEach((product) =>{

  const percentChange = calculatePercentChange(
    product.prices.currentPrice,
    product.prices.previousPrice
  );

  productHTML += `
   <div class="product-container">
    <div class="image-container">
      <img src="${product.image}" alt="" class="product-image">
    </div>
    <span class="product-name">${product.name}</span>

    <div class="rating-container">
       <img src="${product.rating.image}" alt="" class="rating-icon">
       <span>${product.rating.stars}</span>
       <span class="rating-count">${product.rating.count}</span>  
    </div>
     <div class="price-container">
        <span class="current-price js-current-price">Ksh. ${product.prices.currentPrice}</span>
        <span class="price-drop js-previous-price">Ksh. ${product.prices.previousPrice}<div class="drop-percent js-percent-change">${percentChange}%</div></span>
       </div>

    <div class="add-to-cart-button-container">
       <button class="add-to-cart-button js-add-to-cart"
       data-product-id = "${product.id}">Add to Cart</button>
    </div>


  </div>
  `;
});
document.querySelector('.js-products-grid').innerHTML = productHTML;

updateCartQuantity()

document.querySelectorAll('.js-add-to-cart').forEach(button => {
  button.addEventListener('click', () =>{
    const productId = button.dataset.productId;
    addToCart(productId);
    updateCartQuantity();
  });
});



document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();
//reading the value for prices for calculating percent change
const current = Number(document.querySelector('.js-current-price').textContent);
const previous = Number(document.querySelector('.js-previous-price').textContent);
const change = calculatePercentChange(current, previous);
document.querySelector('.js-percent-change').textContent = `${change}%`;