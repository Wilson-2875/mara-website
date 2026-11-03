import { products } from '../data/products.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
import { updateCartQuantity } from '../data/cart.js';

function calculateOrderTotal(order) {
  let subtotal = 0;
  order.items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    const option = deliveryOptions.find(o => o.id === item.deliveryOptionId);
    subtotal += product.prices.currentPrice * item.quantity + option.price;
  });
  return Math.round(subtotal * 1.1);
}

function orderItemsHTML(order) {
  let html = '';
  order.items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    const option = deliveryOptions.find(o => o.id === item.deliveryOptionId);
    const arrival = dayjs(order.placedAt).add(option.deliveryDays, 'days').format('MMMM D');

    html += `
      <div class="product-image-container">
        <img src="${product.image}" alt="">
      </div>
      <div class="product-details">
        <div class="product-name">${product.name}</div>
        <div class="product-delivery-date">Arriving on: ${arrival}</div>
        <div class="product-quantity">Quantity: ${item.quantity}</div>
      </div>
      <div class="product-actions">
        <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
          <button class="track-package-button button-secondary">Track package</button>
        </a>
      </div>
    `;
  });
  return html;
}

async function renderOrders() {
  const container = document.querySelector('.js-orders-grid');
  let orders;

  try {
    const response = await fetch('http://localhost:3000/orders');
    orders = await response.json();
  } catch (err) {
    container.innerHTML = '<div>Could not load orders. Is the server running?</div>';
    return;
  }

  if (orders.length === 0) {
    container.innerHTML = '<div>You have no orders yet.</div>';
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${dayjs(order.placedAt).format('MMMM D')}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>Ksh ${calculateOrderTotal(order)}</div>
          </div>
        </div>
        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id}</div>
        </div>
      </div>
      <div class="order-details-grid">${orderItemsHTML(order)}</div>
    </div>
  `).join('');
}

renderOrders();
updateCartQuantity();