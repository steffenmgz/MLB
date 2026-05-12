/* ── shop.js – Filterable product grid ── */

document.addEventListener('DOMContentLoaded', () => {
  initCatPills();
  renderShop();
  initFilters();
  initSort();
  handleURLParams();
});

let activeCat = 'all';

function handleURLParams() {
  const cat = new URLSearchParams(window.location.search).get('cat');
  if (cat) setActiveCat(cat);
}

function setActiveCat(cat) {
  activeCat = cat;
  document.querySelectorAll('.cat-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.cat === cat);
  });
  renderShop();
}

function initCatPills() {
  const container = document.getElementById('catPills');
  if (!container) return;
  container.innerHTML = CATEGORIES.map(c => `
    <button class="cat-pill ${c.id === 'all' ? 'active' : ''}" data-cat="${c.id}">${c.label}</button>
  `).join('');
  container.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => setActiveCat(pill.dataset.cat));
  });

  const style = document.createElement('style');
  style.textContent = `.cat-pill{padding:8px 18px;border-radius:999px;border:2px solid var(--beige);font-size:14px;font-weight:500;cursor:pointer;transition:var(--transition);background:var(--white);color:var(--text-light)}.cat-pill:hover,.cat-pill.active{border-color:var(--pink-dark);background:var(--pink);color:var(--text)}`;
  document.head.appendChild(style);
}

function getFiltered() {
  let items = [...PRODUCTS];
  if (activeCat !== 'all') {
    items = items.filter(p => p.tags.includes(activeCat));
  }

  const cats = [...document.querySelectorAll('.filter-cat:checked')].map(el => el.value);
  if (cats.length) items = items.filter(p => cats.some(c => p.tags.includes(c)));

  const prices = [...document.querySelectorAll('.filter-price:checked')].map(el => el.value);
  if (prices.length) {
    items = items.filter(p => prices.some(range => {
      const [lo, hi] = range.split('-').map(Number);
      return p.price >= lo && p.price <= hi;
    }));
  }

  const tags = [...document.querySelectorAll('.filter-tag:checked')].map(el => el.value);
  if (tags.includes('bestseller')) items = items.filter(p => p.bestseller);
  if (tags.includes('sale')) items = items.filter(p => p.badge === 'Sale');

  const sort = document.getElementById('shopSort')?.value;
  if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);
  if (sort === 'rating') items.sort((a, b) => b.rating - a.rating);

  return items;
}

function renderShop() {
  const grid = document.getElementById('shopGrid');
  const count = document.getElementById('shopCount');
  if (!grid) return;

  const items = getFiltered();
  if (count) count.textContent = `${items.length} Produkt${items.length !== 1 ? 'e' : ''}`;

  if (!items.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--text-light)"><div style="font-size:48px;margin-bottom:16px">🔍</div><p>Keine Produkte gefunden.</p><button onclick="setActiveCat('all')" class="btn btn--outline" style="margin-top:16px">Alle anzeigen</button></div>`;
    return;
  }

  grid.innerHTML = items.map(p => productCard(p)).join('');
  initScrollAnimations();
}

function initFilters() {
  document.querySelectorAll('.filter-cat, .filter-price, .filter-tag').forEach(el => {
    el.addEventListener('change', renderShop);
  });
}

function initSort() {
  document.getElementById('shopSort')?.addEventListener('change', renderShop);
}
