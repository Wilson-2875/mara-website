const bar = document.querySelector('.search-bar');
const button = document.querySelector('.search-button');
const grid = document.querySelector('.js-products-grid');

function filterProducts(term) {
  const query = term.trim().toLowerCase();
  let visible = 0;

  document.querySelectorAll('.product-container').forEach(card => {
    const name = card.querySelector('.product-name').textContent.toLowerCase();
    const show = name.includes(query);
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  let msg = document.querySelector('.js-no-results');
  if (!msg) {
    msg = document.createElement('div');
    msg.className = 'js-no-results';
    grid.before(msg);
  }
  msg.textContent = visible === 0 ? `No products found for "${term}"` : '';
}

function search() {
  if (grid) {
    filterProducts(bar.value);
  } else {
    // On checkout, orders and tracking pages, go to the home page with the search
    window.location.href = `Mara.html?search=${encodeURIComponent(bar.value.trim())}`;
  }
}

button.addEventListener('click', search);
bar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') search();
});

// Apply a search that arrived in the address
if (grid) {
  const initial = new URLSearchParams(window.location.search).get('search');
  if (initial) {
    bar.value = initial;
    filterProducts(initial);
  }
}