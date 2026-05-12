/* ── Cart – localStorage-backed ── */
const Cart = (() => {
  const KEY = 'mlb_cart';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }

  function save(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    render();
    updateCount();
  }

  function add(productId, qty = 1) {
    const items = load();
    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      const p = PRODUCTS.find(p => p.id === productId);
      if (!p) return;
      items.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty });
    }
    save(items);
    showToast(`"${PRODUCTS.find(p => p.id === productId)?.name}" zum Warenkorb hinzugefügt`);
    openDrawer();
  }

  function remove(productId) {
    save(load().filter(i => i.id !== productId));
  }

  function updateQty(productId, delta) {
    const items = load();
    const item = items.find(i => i.id === productId);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    save(items);
  }

  function total() {
    return load().reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function count() {
    return load().reduce((sum, i) => sum + i.qty, 0);
  }

  function render() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    const items = load();

    if (!items.length) {
      container.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛍️</div>
          <p>Dein Warenkorb ist noch leer.</p>
          <a href="shop.html" class="btn btn--outline" style="margin-top:16px">Zum Shop</a>
        </div>`;
    } else {
      container.innerHTML = items.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item__img"><img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'" /></div>
          <div class="cart-item__info">
            <div class="cart-item__name">${item.name}</div>
            <div class="cart-item__price">${fmt(item.price * item.qty)}</div>
            <div class="cart-item__qty">
              <button onclick="Cart.updateQty(${item.id}, -1)">−</button>
              <span>${item.qty}</span>
              <button onclick="Cart.updateQty(${item.id}, +1)">+</button>
            </div>
          </div>
          <button class="cart-item__remove" onclick="Cart.remove(${item.id})" aria-label="Entfernen">×</button>
        </div>`).join('');
    }

    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = fmt(total());

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.style.display = items.length ? '' : 'none';
  }

  function updateCount() {
    const el = document.getElementById('cartCount');
    if (!el) return;
    const n = count();
    el.textContent = n;
    el.classList.toggle('visible', n > 0);
  }

  function openDrawer() {
    document.getElementById('cartDrawer')?.classList.add('open');
    document.getElementById('cartOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    document.getElementById('cartDrawer')?.classList.remove('open');
    document.getElementById('cartOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function init() {
    render();
    updateCount();
    document.getElementById('cartBtn')?.addEventListener('click', openDrawer);
    document.getElementById('cartClose')?.addEventListener('click', closeDrawer);
    document.getElementById('cartOverlay')?.addEventListener('click', closeDrawer);
    document.getElementById('continueBtn')?.addEventListener('click', closeDrawer);
  }

  function fmt(n) {
    return n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  }

  return { add, remove, updateQty, total, count, load, openDrawer, closeDrawer, init, fmt };
})();

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}
