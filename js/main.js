/* ── main.js – Homepage & global UI ── */

document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
  initHeader();
  initNav();
  renderBestsellers();
  initNewsletter();
  initScrollAnimations();
});

/* Sticky header shadow */
function initHeader() {
  const h = document.getElementById('site-header');
  if (!h) return;
  const onScroll = () => h.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Mobile nav toggle */
function initNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav__links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const isOpen = links.classList.contains('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
  links.querySelectorAll('.nav__link').forEach(l =>
    l.addEventListener('click', () => links.classList.remove('open'))
  );
}

/* Render bestseller cards on homepage */
function renderBestsellers() {
  const grid = document.getElementById('bestsellerGrid');
  if (!grid) return;
  const items = PRODUCTS.filter(p => p.bestseller).slice(0, 4);
  grid.innerHTML = items.map(p => productCard(p)).join('');
  bindAddToCart(grid);
}

function productCard(p) {
  return `
    <article class="product-card animate-up" onclick="window.location='product.html?id=${p.id}'">
      <div class="product-card__img">
        ${p.badge ? `<span class="product-card__badge">${p.badge}</span>` : ''}
        <button class="product-card__wish" aria-label="Wunschliste" onclick="event.stopPropagation(); toggleWish(this, ${p.id})">🤍</button>
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='images/placeholder.jpg'" />
      </div>
      <div class="product-card__body">
        <div class="product-card__cat">${p.catLabel}</div>
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__stars">
          ${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}
          <span>(${p.reviews})</span>
        </div>
        <div class="product-card__foot">
          <div class="product-card__price">
            ${p.oldPrice ? `<span class="old">${Cart.fmt(p.oldPrice)}</span>` : ''}
            ${Cart.fmt(p.price)}
          </div>
          <button class="btn-add" data-id="${p.id}" onclick="event.stopPropagation(); Cart.add(${p.id})" aria-label="In den Warenkorb">+</button>
        </div>
      </div>
    </article>`;
}

function bindAddToCart(container) {
  container.querySelectorAll('[data-id]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      Cart.add(Number(btn.dataset.id));
    });
  });
}

function toggleWish(btn, id) {
  btn.classList.toggle('active');
  btn.textContent = btn.classList.contains('active') ? '❤️' : '🤍';
}

/* Newsletter form */
function initNewsletter() {
  document.getElementById('newsletterForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = e.target.querySelector('input[type=email]').value;
    showToast(`Danke! ${email} wurde angemeldet. 🌸`);
    e.target.reset();
  });
}

/* Scroll-triggered fade animations */
function initScrollAnimations() {
  const els = document.querySelectorAll('.animate-up, .product-card, .testimonial, .category-card, .trust-item');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.style.opacity = 1);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '';
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => {
    el.style.opacity = 0;
    io.observe(el);
  });
}

/* Expose for inline use */
window.productCard = productCard;
window.toggleWish = toggleWish;
