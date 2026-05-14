/* ══════════════════════════════════════════════
   My Little Baby – Hochzeits-Konfigurator
   ══════════════════════════════════════════════

   SETUP: Replace the token below with your
   Dropbox access token (generated in the
   Dropbox App Console → Settings → OAuth 2
   → Generate access token).
   The folder /MLB-Bestellungen must exist in
   your Dropbox, or set dropboxFolder to a
   path you prefer.
   ══════════════════════════════════════════════ */

const CFG = {
  dropboxToken:  'YOUR_DROPBOX_ACCESS_TOKEN',
  dropboxFolder: '/MLB-Bestellungen'
};

/* ─── STATE ─── */
const state = {
  step:      1,
  type:      null,
  data:      {},
  svgString: '',
  orderId:   null
};

/* ─── FORM DEFINITIONS ─── */
const FORMS = {
  schild: {
    title:    'Hochzeitsschild / Poster',
    subtitle: 'Personalisiere dein Schild mit den Namen des Brautpaares.',
    fields: [
      { id: 'braut',      label: 'Name der Braut',          type: 'text',     ph: 'z.B. Julia',                        req: true  },
      { id: 'braeutigam', label: 'Name des Bräutigams',     type: 'text',     ph: 'z.B. Marco',                        req: true  },
      { id: 'datum',      label: 'Hochzeitsdatum',          type: 'text',     ph: 'z.B. 14. Juni 2025',                req: true  },
      { id: 'ort',        label: 'Hochzeitsort (optional)', type: 'text',     ph: 'z.B. Schloss Neuschwanstein',       req: false },
      { id: 'stil',       label: 'Schriftstil',             type: 'select',   options: ['Klassisch-Kursiv','Modern-Schlicht','Verspielt-Romantisch'], req: true },
      { id: 'format',     label: 'Format',                  type: 'select',   options: ['DIN A4 (21 × 29,7 cm)','DIN A3 (29,7 × 42 cm)','DIN A2 (42 × 59,4 cm)','Wunschformat (bitte in Notizfeld angeben)'], req: true }
    ]
  },
  tischkarte: {
    title:    'Tischkarte / Platzkarte',
    subtitle: 'Individuelle Karte für jeden Gast mit Name und Tischnummer.',
    fields: [
      { id: 'brautpaar', label: 'Namen des Brautpaares',    type: 'text',   ph: 'z.B. Julia & Marco',         req: true  },
      { id: 'datum',     label: 'Hochzeitsdatum',           type: 'text',   ph: 'z.B. 14. Juni 2025',         req: true  },
      { id: 'gast',      label: 'Name des Gastes',          type: 'text',   ph: 'z.B. Lena Müller',           req: true  },
      { id: 'tisch',     label: 'Tischnummer / Tischname',  type: 'text',   ph: 'z.B. 4  oder  Rosen',        req: true  },
      { id: 'format',    label: 'Format',                   type: 'select', options: ['DIN A6 quer (14,8 × 10,5 cm)','DIN A6 hoch (10,5 × 14,8 cm)','Zelt-Karte gefaltet'], req: true }
    ]
  },
  menue: {
    title:    'Menükarte',
    subtitle: 'Elegante Menükarte mit der Speisefolge für eure Hochzeitsfeier.',
    fields: [
      { id: 'brautpaar',  label: 'Namen des Brautpaares',  type: 'text',     ph: 'z.B. Julia & Marco',                             req: true  },
      { id: 'datum',      label: 'Hochzeitsdatum',         type: 'text',     ph: 'z.B. 14. Juni 2025',                             req: true  },
      { id: 'vorspeise',  label: 'Vorspeise',              type: 'textarea', ph: 'z.B. Tomatensuppe mit Basilikum-Öl',             req: true  },
      { id: 'hauptgang',  label: 'Hauptgang',              type: 'textarea', ph: 'z.B. Rinderfilet mit Kartoffelgratin & Gemüse',  req: true  },
      { id: 'dessert',    label: 'Dessert',                type: 'textarea', ph: 'z.B. Panna Cotta mit Erdbeersauce',              req: true  },
      { id: 'getraenke',  label: 'Getränke (optional)',    type: 'textarea', ph: 'z.B. Weißwein, Rotwein, Wasser',                 req: false }
    ]
  }
};

/* ─── HELPERS ─── */
function ex(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrap(text, max) {
  const words = String(text || '').split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (t.length > max && line) { lines.push(line); line = w; }
    else line = t;
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function uid() {
  return 'MLB-' + Date.now().toString(36).toUpperCase() +
         '-' + Math.random().toString(36).slice(2, 5).toUpperCase();
}

/* ─── SVG FONT DEFS (reused in all templates) ─── */
const SVG_FONTS = `<defs><style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&amp;family=DM+Sans:wght@300;400;500');
</style></defs>`;

/* ─── SVG: HOCHZEITSSCHILD A4 portrait (viewBox 210×297 mm) ─── */
function buildSchildSVG(d, forExport) {
  const braut  = d.braut      || 'Braut';
  const brtg   = d.braeutigam || 'Bräutigam';
  const datum  = d.datum      || 'Datum';
  const ort    = d.ort        || '';
  const italic = (d.stil === 'Modern-Schlicht') ? '' : 'font-style="italic"';
  const dims   = forExport ? 'width="210mm" height="297mm"' : '';

  const fs = (name) => {
    const l = name.length;
    if (l <= 6)  return 44;
    if (l <= 10) return 38;
    if (l <= 14) return 32;
    if (l <= 18) return 26;
    return 22;
  };

  const bfs  = fs(braut);
  const bgfs = fs(brtg);
  const ortEl = ort
    ? `<text x="105" y="268" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="9" fill="#7a7075">${ex(ort)}</text>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" ${dims} viewBox="0 0 210 297" preserveAspectRatio="xMidYMid meet">
${SVG_FONTS}
<rect width="210" height="297" fill="#FFFFFF"/>
<rect x="7" y="7" width="196" height="283" rx="2.5" fill="none" stroke="#c4908a" stroke-width="0.8"/>
<rect x="11" y="11" width="188" height="275" rx="1.5" fill="none" stroke="#c4908a" stroke-width="0.25"/>
<path d="M7,22 L7,7 L22,7" fill="none" stroke="#c4908a" stroke-width="0.9"/>
<path d="M188,7 L203,7 L203,22" fill="none" stroke="#c4908a" stroke-width="0.9"/>
<path d="M7,275 L7,290 L22,290" fill="none" stroke="#c4908a" stroke-width="0.9"/>
<path d="M188,290 L203,290 L203,275" fill="none" stroke="#c4908a" stroke-width="0.9"/>
<line x1="28" y1="44" x2="88" y2="44" stroke="#c4908a" stroke-width="0.5"/>
<polygon points="105,41 109,44 105,47 101,44" fill="#c4908a"/>
<line x1="122" y1="44" x2="182" y2="44" stroke="#c4908a" stroke-width="0.5"/>
<text x="105" y="62" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="7.5" letter-spacing="4" fill="#7a7075">WIR HEIRATEN</text>
<text x="105" y="128" text-anchor="middle" font-family="'Playfair Display',Georgia,serif" font-size="${bfs}" ${italic} fill="#4a4548">${ex(braut)}</text>
<text x="105" y="162" text-anchor="middle" font-family="'Playfair Display',Georgia,serif" font-size="28" fill="#c4908a">&amp;</text>
<text x="105" y="200" text-anchor="middle" font-family="'Playfair Display',Georgia,serif" font-size="${bgfs}" ${italic} fill="#4a4548">${ex(brtg)}</text>
<line x1="28" y1="222" x2="88" y2="222" stroke="#c4908a" stroke-width="0.5"/>
<polygon points="105,219 109,222 105,225 101,222" fill="#c4908a"/>
<line x1="122" y1="222" x2="182" y2="222" stroke="#c4908a" stroke-width="0.5"/>
<text x="105" y="248" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" letter-spacing="2" fill="#4a4548">${ex(datum)}</text>
${ortEl}
<line x1="28" y1="282" x2="88" y2="282" stroke="#c4908a" stroke-width="0.4"/>
<polygon points="105,279 109,282 105,285 101,282" fill="#c4908a"/>
<line x1="122" y1="282" x2="182" y2="282" stroke="#c4908a" stroke-width="0.4"/>
</svg>`;
}

/* ─── SVG: TISCHKARTE A6 quer (viewBox 148×105 mm) ─── */
function buildTischkarteSVG(d, forExport) {
  const brautpaar = d.brautpaar || 'Braut & Bräutigam';
  const datum     = d.datum     || 'Datum';
  const gast      = d.gast      || 'Gästename';
  const tisch     = d.tisch     || '1';
  const dims      = forExport ? 'width="148mm" height="105mm"' : '';
  const gastFs    = gast.length <= 12 ? 26 : gast.length <= 18 ? 22 : 18;

  return `<svg xmlns="http://www.w3.org/2000/svg" ${dims} viewBox="0 0 148 105" preserveAspectRatio="xMidYMid meet">
${SVG_FONTS}
<rect width="148" height="105" fill="#FFFFFF"/>
<rect x="5" y="5" width="138" height="95" rx="2" fill="none" stroke="#c4908a" stroke-width="0.8"/>
<path d="M5,15 L5,5 L15,5" fill="none" stroke="#c4908a" stroke-width="0.9"/>
<path d="M133,5 L143,5 L143,15" fill="none" stroke="#c4908a" stroke-width="0.9"/>
<path d="M5,90 L5,100 L15,100" fill="none" stroke="#c4908a" stroke-width="0.9"/>
<path d="M133,100 L143,100 L143,90" fill="none" stroke="#c4908a" stroke-width="0.9"/>
<text x="74" y="24" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="6" letter-spacing="1.5" fill="#a87068">${ex(brautpaar)}  ·  ${ex(datum)}</text>
<line x1="18" y1="30" x2="130" y2="30" stroke="#c4908a" stroke-width="0.3"/>
<text x="74" y="${52 + (26 - gastFs) / 2}" text-anchor="middle" font-family="'Playfair Display',Georgia,serif" font-size="${gastFs}" font-style="italic" fill="#4a4548">${ex(gast)}</text>
<line x1="18" y1="74" x2="130" y2="74" stroke="#c4908a" stroke-width="0.3"/>
<text x="74" y="87" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="7.5" letter-spacing="3" fill="#7a7075">TISCH  ${ex(tisch.toUpperCase())}</text>
</svg>`;
}

/* ─── SVG: MENÜKARTE A5 portrait (viewBox 148×210 mm) ─── */
function buildMenuSVG(d, forExport) {
  const brautpaar = d.brautpaar || 'Braut & Bräutigam';
  const datum     = d.datum     || 'Datum';
  const dims      = forExport ? 'width="148mm" height="210mm"' : '';

  const sections = [
    { label: 'VORSPEISE', text: d.vorspeise },
    { label: 'HAUPTGANG', text: d.hauptgang },
    { label: 'DESSERT',   text: d.dessert   }
  ];
  if (d.getraenke) sections.push({ label: 'GETRÄNKE', text: d.getraenke });

  let y = 94;
  let content = '';
  sections.forEach((sec, idx) => {
    const lines = wrap(sec.text || '', 28).slice(0, 2);
    content += `<text x="74" y="${y}" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="5.5" letter-spacing="2.5" fill="#a87068">${sec.label}</text>`;
    y += 10;
    lines.forEach(line => {
      content += `<text x="74" y="${y}" text-anchor="middle" font-family="'Playfair Display',Georgia,serif" font-size="9" font-style="italic" fill="#4a4548">${ex(line)}</text>`;
      y += 9;
    });
    y += 5;
    if (idx < sections.length - 1) {
      content += `<line x1="30" y1="${y}" x2="118" y2="${y}" stroke="#eeddd9" stroke-width="0.4"/>`;
      y += 9;
    }
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" ${dims} viewBox="0 0 148 210" preserveAspectRatio="xMidYMid meet">
${SVG_FONTS}
<rect width="148" height="210" fill="#FFFFFF"/>
<rect x="6" y="6" width="136" height="198" rx="2" fill="none" stroke="#c4908a" stroke-width="0.8"/>
<rect x="9" y="9" width="130" height="192" rx="1" fill="none" stroke="#c4908a" stroke-width="0.2"/>
<path d="M6,18 L6,6 L18,6" fill="none" stroke="#c4908a" stroke-width="0.9"/>
<path d="M130,6 L142,6 L142,18" fill="none" stroke="#c4908a" stroke-width="0.9"/>
<path d="M6,192 L6,204 L18,204" fill="none" stroke="#c4908a" stroke-width="0.9"/>
<path d="M130,204 L142,204 L142,192" fill="none" stroke="#c4908a" stroke-width="0.9"/>
<text x="74" y="38" text-anchor="middle" font-family="'Playfair Display',Georgia,serif" font-size="22" font-style="italic" fill="#4a4548">${ex(brautpaar)}</text>
<text x="74" y="53" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="7" letter-spacing="2.5" fill="#7a7075">${ex(datum.toUpperCase())}</text>
<line x1="25" y1="62" x2="65" y2="62" stroke="#c4908a" stroke-width="0.5"/>
<polygon points="74,59 77,62 74,65 71,62" fill="#c4908a"/>
<line x1="83" y1="62" x2="123" y2="62" stroke="#c4908a" stroke-width="0.5"/>
<text x="74" y="76" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="6" letter-spacing="3.5" fill="#a87068">MENÜ</text>
<line x1="25" y1="83" x2="65" y2="83" stroke="#c4908a" stroke-width="0.3"/>
<polygon points="74,80 77,83 74,86 71,83" fill="#c4908a"/>
<line x1="83" y1="83" x2="123" y2="83" stroke="#c4908a" stroke-width="0.3"/>
${content}
</svg>`;
}

/* ─── GENERATE SVG (preview vs export) ─── */
function generateSVG(type, data, forExport) {
  if (type === 'schild')     return buildSchildSVG(data, forExport);
  if (type === 'tischkarte') return buildTischkarteSVG(data, forExport);
  if (type === 'menue')      return buildMenuSVG(data, forExport);
  return '';
}

/* ─── STEP NAVIGATION ─── */
function goTo(n) {
  document.querySelectorAll('.cfg-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`panel${n}`).classList.add('active');
  document.querySelectorAll('.cfg-step[data-step]').forEach(s => {
    const sn = +s.dataset.step;
    s.classList.toggle('active', sn === n);
    s.classList.toggle('done',   sn < n);
  });
  state.step = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── FORM RENDERING ─── */
function renderForm(type) {
  const cfg = FORMS[type];
  if (!cfg) return;

  document.getElementById('formTitle').textContent    = cfg.title;
  document.getElementById('formSubtitle').textContent = cfg.subtitle;

  const container = document.getElementById('formFields');
  container.innerHTML = cfg.fields.map(f => {
    const req = f.req ? '<span class="cfg-req" aria-hidden="true">*</span>' : '';
    let ctrl = '';
    if (f.type === 'text') {
      ctrl = `<input type="text" id="f_${f.id}" name="${f.id}" placeholder="${ex(f.ph)}" ${f.req ? 'required' : ''} class="cfg-input" autocomplete="off">`;
    } else if (f.type === 'textarea') {
      ctrl = `<textarea id="f_${f.id}" name="${f.id}" placeholder="${ex(f.ph)}" ${f.req ? 'required' : ''} class="cfg-input cfg-textarea" rows="2"></textarea>`;
    } else if (f.type === 'select') {
      const opts = f.options.map(o => `<option value="${ex(o)}">${ex(o)}</option>`).join('');
      ctrl = `<select id="f_${f.id}" name="${f.id}" class="cfg-input cfg-select">${opts}</select>`;
    }
    return `<div class="cfg-field"><label for="f_${f.id}">${ex(f.label)}${req}</label>${ctrl}</div>`;
  }).join('');

  container.querySelectorAll('.cfg-input').forEach(el => {
    el.addEventListener('input',  updatePreview);
    el.addEventListener('change', updatePreview);
  });

  updatePreview();
}

function collectData() {
  const d = {};
  document.querySelectorAll('#formFields .cfg-input').forEach(el => {
    d[el.name] = el.value;
  });
  return d;
}

/* ─── LIVE PREVIEW ─── */
function updatePreview() {
  state.data = collectData();
  state.svgString = generateSVG(state.type, state.data, false);
  const box = document.getElementById('svgPreview');
  if (box) box.innerHTML = state.svgString;
}

/* ─── STEP 3: RENDER APPROVAL ─── */
function renderApproval() {
  // Refresh SVG
  state.data      = collectData();
  state.svgString = generateSVG(state.type, state.data, false);

  const ap = document.getElementById('approvalPreview');
  if (ap) ap.innerHTML = state.svgString;

  const cfg = FORMS[state.type];
  const summary = document.getElementById('orderSummary');
  if (summary && cfg) {
    const rows = cfg.fields.map(f => {
      const val = state.data[f.id] || '–';
      return `<div class="cfg-summary__row">
        <span class="cfg-summary__key">${ex(f.label)}</span>
        <span class="cfg-summary__val">${ex(val)}</span>
      </div>`;
    }).join('');
    summary.innerHTML = `<h3>Zusammenfassung deiner Angaben</h3>${rows}`;
  }
}

/* ─── VALIDATION ─── */
function validateStep2() {
  const cfg = FORMS[state.type];
  if (!cfg) return false;
  for (const f of cfg.fields) {
    if (f.req && !state.data[f.id]?.trim()) {
      showMsg(`Bitte fülle das Feld „${f.label}" aus.`, 'error');
      document.getElementById(`f_${f.id}`)?.focus();
      return false;
    }
  }
  return true;
}

/* ─── DROPBOX UPLOAD ─── */
async function dropboxUpload(content, filename) {
  const path = `${CFG.dropboxFolder}/${filename}`;
  const res = await fetch('https://content.dropboxapi.com/2/files/upload', {
    method: 'POST',
    headers: {
      'Authorization':   `Bearer ${CFG.dropboxToken}`,
      'Dropbox-API-Arg': JSON.stringify({ path, mode: 'add', autorename: true, mute: false }),
      'Content-Type':    'application/octet-stream'
    },
    body: content
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => res.status);
    throw new Error(`Dropbox: ${res.status} – ${txt}`);
  }
  return res.json();
}

/* ─── APPROVE ─── */
async function handleApprove() {
  const custName  = document.getElementById('custName').value.trim();
  const custEmail = document.getElementById('custEmail').value.trim();
  const custNote  = document.getElementById('custNote').value.trim();

  if (!custName)  { showMsg('Bitte gib deinen Namen an.',             'error'); return; }
  if (!custEmail) { showMsg('Bitte gib deine E-Mail-Adresse an.',     'error'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(custEmail)) {
                    showMsg('Bitte gib eine gültige E-Mail-Adresse an.', 'error'); return; }

  const btn = document.getElementById('approveBtn');
  btn.disabled    = true;
  btn.textContent = 'Wird übermittelt …';

  const orderId = uid();
  state.orderId = orderId;

  const ts       = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
  const safeName = custName.replace(/[^\w\säöüÄÖÜß]/g, '').slice(0, 30).replace(/\s+/g, '_');
  const base     = `${ts}_${orderId}_${safeName}`;

  const cfg   = FORMS[state.type];
  const lines = [
    `Bestellnummer : ${orderId}`,
    `Zeitstempel   : ${new Date().toLocaleString('de-DE')}`,
    `Produkttyp    : ${cfg?.title || state.type}`,
    '',
    'Kundendaten:',
    `  Name   : ${custName}`,
    `  E-Mail : ${custEmail}`,
    custNote ? `  Notiz  : ${custNote}` : '',
    '',
    'Personalisierung:',
    ...(cfg?.fields.map(f => `  ${f.label} : ${state.data[f.id] || '–'}`) || [])
  ].filter(l => l !== undefined).join('\n');

  // Export SVG (with physical dimensions)
  const exportSvg = generateSVG(state.type, state.data, true);

  try {
    await dropboxUpload(exportSvg, `${base}.svg`);
    await dropboxUpload(lines,     `${base}_bestellung.txt`);
    showSuccess(orderId, custName, custEmail, exportSvg);
  } catch (err) {
    console.error(err);
    btn.disabled    = false;
    btn.textContent = '✓ Design freigeben & Datei übermitteln';
    showMsg(
      `Übertragung fehlgeschlagen (${err.message}). Bitte lade die SVG-Datei herunter und sende sie per E-Mail.`,
      'error'
    );
    // Fallback: offer download
    wireDownload(orderId, exportSvg);
    document.getElementById('downloadBtn').style.display = 'inline-flex';
  }
}

/* ─── SUCCESS SCREEN ─── */
function showSuccess(orderId, custName, custEmail, exportSvg) {
  goTo(4);

  const det = document.getElementById('successDetails');
  if (det) {
    det.innerHTML = `
      <div class="cfg-ref-badge">Bestellnummer: <strong>${ex(orderId)}</strong></div>
      <p>Deine Angaben wurden erfolgreich an uns übermittelt.<br>
         Wir melden uns bald unter <strong>${ex(custEmail)}</strong> bei dir.</p>`;
  }

  wireDownload(orderId, exportSvg);
}

function wireDownload(orderId, svgStr) {
  const btn = document.getElementById('downloadBtn');
  if (!btn) return;
  btn.style.display = 'inline-flex';
  btn.onclick = () => {
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: `MLB_Hochzeit_${orderId}.svg` });
    a.click();
    URL.revokeObjectURL(url);
  };
}

/* ─── MESSAGE TOAST ─── */
function showMsg(text, type = 'info') {
  document.querySelectorAll('.cfg-msg').forEach(m => m.remove());
  const el = document.createElement('div');
  el.className = `cfg-msg cfg-msg--${type}`;
  el.textContent = text;
  const panel = document.querySelector('.cfg-panel.active');
  if (panel) panel.prepend(el);
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => el.remove(), 7000);
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {

  /* Step 1 – product type cards */
  document.querySelectorAll('.cfg-type-card').forEach(card => {
    card.addEventListener('click', () => {
      state.type = card.dataset.type;
      renderForm(state.type);
      goTo(2);
    });
  });

  /* Back: panel 2 → 1 */
  document.getElementById('backBtn1')?.addEventListener('click', () => goTo(1));

  /* Step 2 → Step 3 */
  document.getElementById('toStep3Btn')?.addEventListener('click', () => {
    state.data = collectData();
    if (!validateStep2()) return;
    renderApproval();
    goTo(3);
  });

  /* Back: panel 3 → 2 */
  document.getElementById('backBtn2')?.addEventListener('click', () => goTo(2));

  /* Approve */
  document.getElementById('approveBtn')?.addEventListener('click', handleApprove);

  /* Sticky header shadow */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 10), { passive: true });
  }
});
