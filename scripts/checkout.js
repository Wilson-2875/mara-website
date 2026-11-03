import { cart, calculateCartQuantity,
   updateQuantity, removeFromCart, updateDeliveryOption, clearCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { deliveryOptions } from "../data/deliveryOptions.js";



function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';

  deliveryOptions.forEach(option => {
    const date = dayjs().add(option.deliveryDays, 'days').format('dddd, MMMM D');
    const price = option.price === 0 ? 'FREE' : `Ksh ${option.price}`;
    const isChecked = option.id === cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option js-delivery-option"
      data-product-id = "${matchingProduct.id}"
      data-delivery-option-id = "${option.id}">

        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">${date}</div>
          <div class="delivery-option-price">${price} -- shipping</div>
        </div>
      </div>
    `;
  });

  return html;
}

let cartHTML = '';

cart.forEach(cartItem => {
  const matchingProduct = products.find(p => p.id === cartItem.productId);
  const selected = deliveryOptions.find(o => o.id === cartItem.deliveryOptionId);
  const dateString = dayjs().add(selected.deliveryDays, 'days').format('dddd, MMMM D');

  cartHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">

      <div class="delivery-date js-delivery-date-${matchingProduct.id}">Delivery Date: ${dateString}</div>
      <div class="cart-item-details-grid">
        <img src="${matchingProduct.image}" alt="" class="product-image">
        <div class="cart-item-details">
          <div class="product-name">${matchingProduct.name}</div>
          <div class="product-price">Ksh ${matchingProduct.prices.currentPrice}</div>
          <div class="product-quantity">

    
          Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
          <span class="update-quantity-link js-update-link" data-product-id="${matchingProduct.id}">Update</span>
          <input class="quantity-input js-quantity-input-${matchingProduct.id}" type="number" min="1" style="display:none; width:50px">
          <span class="save-quantity-link js-save-link" data-product-id="${matchingProduct.id}" style="display:none">Save</span>
          <span class="delete-quantity-link js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
 

          </div>
        </div>
        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option</div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `;
});

document.querySelector('.js-order-summary').innerHTML = cartHTML;
document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();


function updateCartDisplay() {
  document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();
  renderPaymentSummary();
}

// DELETE
document.querySelectorAll('.js-delete-link').forEach(link => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);
    document.querySelector(`.js-cart-item-container-${productId}`).remove();
    updateCartDisplay();
  });
});

// UPDATE: show the input
document.querySelectorAll('.js-update-link').forEach(link => {
  link.addEventListener('click', () => {
    const id = link.dataset.productId;
    link.style.display = 'none';
    document.querySelector(`.js-quantity-input-${id}`).style.display = 'inline';
    document.querySelector(`.js-save-link[data-product-id="${id}"]`).style.display = 'inline';
  });
});

// SAVE: apply the new quantity
document.querySelectorAll('.js-save-link').forEach(link => {
  link.addEventListener('click', () => {
    const id = link.dataset.productId;
    const input = document.querySelector(`.js-quantity-input-${id}`);
    const newQuantity = Number(input.value);

    if (newQuantity < 1 || newQuantity > 1000) {
      alert('Quantity must be between 1 and 1000');
      return;
    }

    updateQuantity(id, newQuantity);
    document.querySelector(`.js-quantity-label-${id}`).innerHTML = newQuantity;

    input.style.display = 'none';
    link.style.display = 'none';
    document.querySelector(`.js-update-link[data-product-id="${id}"]`).style.display = 'inline';

    updateCartDisplay();
  });
});

// DELIVERY OPTION
document.querySelectorAll('.js-delivery-option').forEach(el => {
  el.addEventListener('click', () => {
    const { productId, deliveryOptionId } = el.dataset;
    const option = deliveryOptions.find(o => String(o.id) === deliveryOptionId);

    updateDeliveryOption(productId, option.id);
    el.querySelector('input').checked = true;

    const date = dayjs().add(option.deliveryDays, 'days').format('dddd, MMMM D');
    document.querySelector(`.js-delivery-date-${productId}`).innerHTML =
      `Delivery Date: ${date}`;

    renderPaymentSummary();
  });
});

function renderPaymentSummary(){
  const quantity = calculateCartQuantity();
  let itemsCost = 0;
  let shipping = 0;
  
 cart.forEach(cartItem => {
  const product = products.find(p => p.id === cartItem.productId);
  const option = deliveryOptions.find(o => o.id === cartItem.deliveryOptionId);
  itemsCost += product.prices.currentPrice * cartItem.quantity;
  shipping += option.price;
 });
 
 const beforeTax = itemsCost + shipping;
 const tax = Math.round(beforeTax * 0.1);
 const total = beforeTax + tax;

document.querySelector('.js-payment-summary').innerHTML = `
  <div class="payment-summary-title">Payment summary</div>
     <div class="payment-summary-row">
      <div>Items (${quantity}):</div>
      <div class="payment-summary-money">Ksh ${itemsCost}</div>
     </div>


     <div class="payment-summary-row">
      <div>Shipping & handling:</div>
      <div class="payment-summary-money">Ksh ${shipping}</div>
     </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">Ksh ${beforeTax}</div>
     </div>

 
   <div class="payment-summary-row subtotal-row">
      <div>Estimated tax(10%):</div>
      <div class="payment-summary-money">Ksh ${tax}</div>
    </div>

   <div class="payment-summary-row subtotal-row">
      <div>Order total:</div>
      <div class="payment-summary-money">Ksh ${total}</div>
    </div>

 <button class="place-order-button button-primary"> 
  Place your order
 </button> 
`;
}
renderPaymentSummary();

document.querySelector('.js-payment-summary').addEventListener('click', async (e) => {
  if (!e.target.classList.contains('place-order-button')) return;

  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart })
    });

    if (!response.ok) throw new Error('Order failed');

    clearCart();
    window.location.href = 'orders.html';
  } catch (err) {
    console.error(err);
    alert('Could not place your order. Is the server running?');
  }
});