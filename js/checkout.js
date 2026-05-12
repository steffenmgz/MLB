/* ── checkout.js ── */

document.addEventListener('DOMContentLoaded', () => {
  renderOrderSummary();
  initAddressForm();
  initPaymentForm();
  initPaymentToggle();
});

function renderOrderSummary() {
  const items = Cart.load();
  const orderItems = document.getElementById('orderItems');
  const subtotal = Cart.total();

  if (orderItems) {
    if (!items.length) {
      orderItems.innerHTML = '<p style="color:var(--text-light);font-size:14px">Dein Warenkorb ist leer.</p>';
    } else {
      orderItems.innerHTML = items.map(i => `
        <div class="order-item">
          <div class="order-item__img"><img src="${i.image}" alt="${i.name}" onerror="this.src='images/placeholder.jpg'" /></div>
          <div class="order-item__info">
            <div class="order-item__name">${i.name}</div>
            <div class="order-item__qty">× ${i.qty}</div>
          </div>
          <div class="order-item__price">${Cart.fmt(i.price * i.qty)}</div>
        </div>`).join('');
    }
  }

  const shipping = subtotal >= 29 ? 0 : 4.90;
  const shippingEl = document.getElementById('orderShipping');
  const subtotalEl = document.getElementById('orderSubtotal');
  const totalEl = document.getElementById('orderTotal');

  if (subtotalEl) subtotalEl.textContent = Cart.fmt(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Kostenlos 🎉' : Cart.fmt(shipping);
  if (totalEl) totalEl.textContent = Cart.fmt(subtotal + shipping);
}

let currentStep = 1;
function goStep(n) {
  document.getElementById(`step${currentStep}`).style.display = 'none';
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.toggle('active', i + 1 === n);
    s.classList.toggle('done', i + 1 < n);
  });
  currentStep = n;
  document.getElementById(`step${n}`).style.display = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initAddressForm() {
  document.getElementById('addressForm')?.addEventListener('submit', e => {
    e.preventDefault();
    goStep(2);
  });
}

function initPaymentForm() {
  document.getElementById('paymentForm')?.addEventListener('submit', e => {
    e.preventDefault();
    localStorage.removeItem('mlb_cart');
    goStep(3);
    document.querySelector('.order-summary').style.display = 'none';
  });
}

function initPaymentToggle() {
  document.querySelectorAll('input[name="payment"]').forEach(r => {
    r.addEventListener('change', () => {
      document.getElementById('cardFields').style.display = r.value === 'card' ? '' : 'none';
    });
  });
}

window.goStep = goStep;
