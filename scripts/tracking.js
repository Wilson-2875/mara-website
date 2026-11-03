import { products } from '../data/products.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
import { updateCartQuantity } from '../data/cart.js';

async function renderTracking() {
  const container = document.querySelector('.js-order-tracking');
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId');
  const productId = params.get('productId');

  let orders;
  try {
    const response = await fetch('/orders');
    orders = await response.json();
  } catch (err) {
    container.innerHTML = '<div>Could not load this order. Is the server running?</div>';
    return;
  }

  const order = orders.find(o => o.id === orderId);
  const item = order && order.items.find(i => i.productId === productId);
  const product = products.find(p => p.id === productId);

  if (!order || !item || !product) {
    container.innerHTML = `
      <a class="back-to-orders-link" href="orders.html">View all orders</a>
      <div>Order not found.</div>`;
    return;
  }

  const option = deliveryOptions.find(o => o.id === item.deliveryOptionId);
  const placed = dayjs(order.placedAt);
  const arrival = placed.add(option.deliveryDays, 'days');

  // How far along the delivery is, from 0 to 100
  const progress = Math.min(100, Math.max(0,
    ((dayjs() - placed) / (arrival - placed)) * 100
  ));
  const status = progress < 50 ? 'Preparing' : progress < 100 ? 'Shipped' : 'Delivered';

  container.innerHTML = `
    <a class="back-to-orders-link" href="orders.html">View all orders</a>

    <div class="delivery-date">Arriving on ${arrival.format('dddd, MMMM D')}</div>
    <div class="product-info">${product.name}</div>
    <div class="product-info">Quantity: ${item.quantity}</div>
    <img class="product-image" src="${product.image}" alt="">

    <div class="progress-labels-container">
      <div class="progress-label ${status === 'Preparing' ? 'current-status' : ''}">Preparing</div>
      <div class="progress-label ${status === 'Shipped' ? 'current-status' : ''}">Shipped</div>
      <div class="progress-label ${status === 'Delivered' ? 'current-status' : ''}">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progress}%"></div>
    </div>
  `;
}

renderTracking();
updateCartQuantity();