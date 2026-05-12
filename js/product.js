/* ── product.js – Single product detail page ── */

document.addEventListener('DOMContentLoaded', () => {
  const id = Number(new URLSearchParams(window.location.search).get('id'));
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) { document.getElementById('productDetail').innerHTML = '<p style="text-align:center;padding:60px">Produkt nicht gefunden.</p>'; return; }

  document.title = `${product.name} – My Little Baby`;
  document.getElementById('breadcrumbName').textContent = product.name;

  let qty = 1;
  let activeImg = 0;

  function optionsHTML() {
    if (!product.options) return '';
    return Object.entries(product.options).map(([key, values]) => `
      <div class="product-options">
        <label>${key.charAt(0).toUpperCase() + key.slice(1)}</label>
        <div class="option-chips">
          ${values.map((v, i) => `<button class="option-chip ${i === 0 ? 'active' : ''}" onclick="selectChip(this)">${v}</button>`).join('')}
        </div>
      </div>`).join('');
  }

  function render() {
    const imgs = product.images || [product.image];
    document.getElementById('productDetail').innerHTML = `
      <div class="product-gallery">
        <div class="product-gallery__main">
          <img id="mainImg" src="${imgs[activeImg]}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'" />
        </div>
        ${imgs.length > 1 ? `<div class="product-gallery__thumbs">
          ${imgs.map((src, i) => `<div class="product-gallery__thumb ${i === activeImg ? 'active' : ''}" onclick="switchImg(${i})">
            <img src="${src}" alt="${product.name} ${i+1}" onerror="this.src='images/placeholder.jpg'" />
          </div>`).join('')}
        </div>` : ''}
      </div>
      <div class="product-info">
        <div class="product-info__cat">${product.catLabel}</div>
        <h1 class="product-info__name">${product.name}</h1>
        <div class="product-info__stars">
          <span class="stars">${'★'.repeat(Math.round(product.rating))}</span>
          ${product.rating} (${product.reviews} Bewertungen)
        </div>
        <div class="product-info__price">
          ${product.oldPrice ? `<span style="font-size:18px;color:var(--text-light);text-decoration:line-through;font-family:var(--font-sans);font-weight:400;margin-right:10px">${Cart.fmt(product.oldPrice)}</span>` : ''}
          ${Cart.fmt(product.price)} <span style="font-size:14px;font-weight:400;font-family:var(--font-sans);color:var(--text-light)">/ Stück (ab Menge)</span>
        </div>
        <p class="product-info__desc">${product.desc}</p>
        ${optionsHTML()}
        <div class="product-qty">
          <label>Menge</label>
          <div class="qty-control">
            <button onclick="changeQty(-1)">−</button>
            <span id="qtyDisplay">1</span>
            <button onclick="changeQty(+1)">+</button>
          </div>
        </div>
        <div class="product-actions">
          <button class="btn btn--primary" onclick="addToCart()">In den Warenkorb</button>
          <button class="btn btn--outline" onclick="toggleWishlist()">🤍 Wunschliste</button>
        </div>
        <div class="product-perks">
          <div class="product-perk">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Sicher bezahlen mit PayPal, Klarna & Kreditkarte
          </div>
          <div class="product-perk">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Versand in 2–4 Werktagen
          </div>
          <div class="product-perk">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Personalisierung auf Wunsch möglich
          </div>
          <div class="product-perk">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            30 Tage Rückgaberecht
          </div>
        </div>
      </div>`;
  }

  render();

  window.switchImg = function(i) {
    activeImg = i;
    render();
  };

  window.changeQty = function(delta) {
    qty = Math.max(1, qty + delta);
    document.getElementById('qtyDisplay').textContent = qty;
  };

  window.addToCart = function() {
    Cart.add(product.id, qty);
  };

  window.selectChip = function(btn) {
    btn.closest('.option-chips').querySelectorAll('.option-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
  };

  window.toggleWishlist = function() {
    showToast('Zur Wunschliste hinzugefügt 🤍');
  };

  // Related products
  const related = PRODUCTS.filter(p => p.id !== product.id && p.tags.some(t => product.tags.includes(t))).slice(0, 4);
  const rGrid = document.getElementById('relatedGrid');
  if (rGrid) rGrid.innerHTML = related.map(p => productCard(p)).join('');
});
