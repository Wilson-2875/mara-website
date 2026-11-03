const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const root = path.join(__dirname, '..');

// Allow the server to read JSON data
app.use(cors());
app.use(express.json());

function readOrders() {
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

// Serve the website files
for (const dir of ['data', 'scripts', 'styles', 'images']) {
  app.use(`/${dir}`, express.static(path.join(root, dir)));
}
for (const page of ['Mara', 'checkout', 'orders', 'tracking']) {
  app.get(`/${page}.html`, (req, res) =>
    res.sendFile(path.join(root, `${page}.html`)));
}
app.get('/', (req, res) => res.sendFile(path.join(root, 'Mara.html')));

// Place an order
app.post('/orders', (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const order = {
    id: crypto.randomUUID(),
    placedAt: new Date().toISOString(),
    items: items.map(i => ({
      productId: i.productId,
      quantity: Number(i.quantity),
      deliveryOptionId: i.deliveryOptionId
    }))
  };

  const orders = readOrders();
  orders.unshift(order);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));

  res.status(201).json(order);
});

// List orders
app.get('/orders', (req, res) => {
  res.json(readOrders());
});

// Start the server
app.listen(PORT, () => {
  console.log(`MARA server is running at http://localhost:${PORT}`);
});

