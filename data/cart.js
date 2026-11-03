

export let cart = JSON.parse(localStorage.getItem('cart')) || [
{
  productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
  quantity: 1,
  deliveryOptionId: '1'
},

{
  productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
  quantity: 1,
  deliveryOptionId: '2'
}
];

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
  const match = cart.find(item => item.productId === productId);

  if (match) {
    match.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1, deliveryOptionId: '1' });
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  saveToStorage();
}
// calculating the number of item in the cart
export function calculateCartQuantity() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function clearCart() {
  cart = [];
  saveToStorage();
}

export function updateCartQuantity(){
const cartQuantity = calculateCartQuantity();
const element = document.querySelector('.js-cart-quantity');
if(element) {
element.innerHTML = cartQuantity;
  }  
}

export function updateQuantity(productId, newQuantity) {
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.quantity = newQuantity;
    saveToStorage();
  }
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  const item = cart.find(i => i.productId === productId);
  if (!item) return;
  item.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}