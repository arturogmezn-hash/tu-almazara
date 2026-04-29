/* Tu Almazara — main.js
   Carga todos los _data/*.json y productos/*.json
   y renderiza la página dinámicamente.
   Compatible con Cloudflare Pages (archivos estáticos). */

// ── UTILIDADES ────────────────────────────────────────────
async function loadJSON(path) {
  try {
    const r = await fetch(path);
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

function set(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ── ICONOS SVG para señales de confianza ─────────────────
const trustIcons = [
  '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2L13.5 8H20L14.5 12L16.5 18L11 14.5L5.5 18L7.5 12L2 8H8.5L11 2Z" stroke="#c8a94a" stroke-width="1.3" fill="none"/></svg>',
  '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="5" width="16" height="14" rx="2" stroke="#c8a94a" stroke-width="1.3"/><path d="M7 5V4a4 4 0 018 0v1" stroke="#c8a94a" stroke-width="1.3"/><path d="M8 12l2 2 4-4" stroke="#c8a94a" stroke-width="1.3" fill="none"/></svg>',
  '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="#c8a94a" stroke-width="1.3"/><path d="M11 7v4l3 2" stroke="#c8a94a" stroke-width="1.3" stroke-linecap="round"/></svg>',
  '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 11h16M11 3l8 8-8 8" stroke="#c8a94a" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
];

// SVG ilustraciones para productos sin imagen
const productSVGs = [
  '<svg width="52" height="52" viewBox="0 0 52 52" fill="none"><ellipse cx="26" cy="26" rx="13" ry="20" fill="#c8a94a" opacity="0.25"/><ellipse cx="26" cy="26" rx="8" ry="14" fill="#c8a94a" opacity="0.45"/><circle cx="26" cy="26" r="4" fill="#c8a94a"/></svg>',
  '<svg width="52" height="52" viewBox="0 0 52 52" fill="none"><rect x="18" y="10" width="16" height="30" rx="3" fill="#3d6428" opacity="0.2"/><rect x="21" y="14" width="10" height="22" rx="2" fill="#3d6428" opacity="0.45"/><rect x="22" y="8" width="8" height="7" rx="1" fill="#3d6428" opacity="0.6"/></svg>',
  '<svg width="52" height="52" viewBox="0 0 52 52" fill="none"><ellipse cx="26" cy="32" rx="16" ry="10" fill="#5a8a2a" opacity="0.18"/><ellipse cx="26" cy="27" rx="11" ry="8" fill="#5a8a2a" opacity="0.35"/><ellipse cx="26" cy="22" rx="6" ry="5" fill="#5a8a2a" opacity="0.65"/></svg>',
  '<svg width="52" height="52" viewBox="0 0 52 52" fill="none"><rect x="14" y="18" width="24" height="20" rx="2" fill="#c8a94a" opacity="0.2"/><rect x="18" y="14" width="16" height="8" rx="2" fill="#c8a94a" opacity="0.35"/><rect x="22" y="10" width="8" height="6" rx="1" fill="#c8a94a" opacity="0.55"/></svg>',
  '<svg width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="16" fill="#2d4a1e" opacity="0.15"/><circle cx="26" cy="26" r="10" fill="#2d4a1e" opacity="0.3"/><circle cx="26" cy="26" r="5" fill="#2d4a1e" opacity="0.6"/></svg>',
  '<svg width="52" height="52" viewBox="0 0 52 52" fill="none"><rect x="12" y="22" width="28" height="18" rx="3" fill="#854f0b" opacity="0.15"/><rect x="16" y="16" width="20" height="10" rx="2" fill="#854f0b" opacity="0.25"/><circle cx="26" cy="14" r="4" fill="#854f0b" opacity="0.4"/></svg>'
];

// ── RENDER FUNCIONES ──────────────────────────────────────

function renderHero(d) {
  if (!d) return;
  setText('hero-badge', d.badge);
  set('hero-title', `${d.titulo1}<br><em>${d.titulo2}</em>`);
  setText('hero-desc', d.descripcion);
  const input = document.getElementById('hero-search');
  if (input) input.placeholder = d.placeholder;
  if (d.tags) {
    set('hero-tags', d.tags.map(t =>
      `<span class="ta-tag" onclick="document.getElementById('marketplace').scrollIntoView({behavior:'smooth'})">${t}</span>`
    ).join(''));
  }
}

function renderStats(d) {
  if (!d || !d.items) return;
  const last = d.items.length - 1;
  set('stats-bar', d.items.map((it, i) =>
    `<div class="ta-stat"${i === last ? ' style="border-right:none"' : ''}>
      <div class="ta-stat-n">${it.numero}</div>
      <div class="ta-stat-l">${it.etiqueta}</div>
    </div>`
  ).join(''));
}

function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  if (!grid || !products.length) return;

  const sorted = products
    .filter(p => p.destacado !== false)
    .sort((a, b) => (a.orden || 99) - (b.orden || 99));

  grid.innerHTML = sorted.map((p, i) => {
    const imgContent = p.imagen
      ? `<img src="${p.imagen}" alt="${p.nombre}" style="max-height:90px;max-width:90%;object-fit:contain;" />`
      : productSVGs[i % productSVGs.length];
    const badgeClass = p.eco ? 'ta-product-badge badge-eco' : 'ta-product-badge';
    return `
    <div class="ta-product-card" data-cat="${p.categoria || ''}">
      <div class="ta-product-img">${imgContent}</div>
      <div class="ta-product-body">
        <div class="${badgeClass}">${p.badge || ''}</div>
        <div class="ta-product-name">${p.nombre}</div>
        <div class="ta-product-origin">${p.origen || ''}</div>
        <div class="ta-product-meta">
          ${p.vol_min ? `<span class="ta-meta-pill">${p.vol_min}</span>` : ''}
          ${p.formato ? `<span class="ta-meta-pill">${p.formato}</span>` : ''}
          ${p.info_extra ? `<span class="ta-meta-pill">${p.info_extra}</span>` : ''}
        </div>
        <button class="ta-product-cta" onclick="document.getElementById('rfq').scrollIntoView({behavior:'smooth'})">Solicitar cotización</button>
      </div>
    </div>`;
  }).join('');
}

function renderHow(d) {
  if (!d) return;
  setText('how-title', d.titulo);
  if (d.pasos) {
    set('how-grid', d.pasos.map(p =>
      `<div class="ta-how-step">
        <div class="ta-how-num">${p.num} — ${p.nombre}</div>
        <div class="ta-how-title">${p.titulo}</div>
        <div class="ta-how-desc">${p.desc}</div>
      </div>`
    ).join(''));
  }
}

function renderTrust(d) {
  if (!d || !d.items) return;
  set('trust-grid', d.items.map((it, i) =>
    `<div class="ta-trust-item">
      <div class="ta-trust-icon">${trustIcons[i % trustIcons.length]}</div>
      <div class="ta-trust-title">${it.titulo}</div>
      <div class="ta-trust-desc">${it.desc}</div>
    </div>`
  ).join(''));
}

function renderRFQ(d) {
  if (!d) return;
  set('rfq-title', d.titulo.replace(/\n/g, '<br>'));
  setText('rfq-desc', d.descripcion);

  if (d.bullets) {
    set('rfq-bullets', d.bullets.map(b =>
      `<div class="ta-rfq-bullet"><div class="ta-rfq-dot"></div>${b}</div>`
    ).join(''));
  }

  // Opciones tipo producto
  const selTipo = document.getElementById('rfq-tipo');
  if (selTipo && d.tipos_producto) {
    d.tipos_producto.forEach(op => {
      const opt = document.createElement('option');
      opt.textContent = op;
      selTipo.appendChild(opt);
    });
  }

  // Opciones volumen
  const selVol = document.getElementById('rfq-volumen');
  if (selVol && d.volumenes) {
    d.volumenes.forEach(op => {
      const opt = document.createElement('option');
      opt.textContent = op;
      selVol.appendChild(opt);
    });
  }

  // Nota legal
  const notaEl = document.getElementById('rfq-nota-legal');
  if (notaEl) notaEl.innerHTML = d.nota_legal || '';

  // Éxito
  setText('rfq-msg-exito', d.msg_exito);
  setText('rfq-desc-exito', d.desc_exito);

  // Action del formulario
  const form = document.getElementById('rfqForm');
  if (form && d.form_action && d.form_action !== 'https://formspree.io/f/TUCODIGO') {
    form.action = d.form_action;
    form.method = 'POST';
  }
}

function renderPrecios(d) {
  if (!d || !d.planes) return;
  setText('precios-title', d.titulo);
  set('pricing-grid', d.planes.map(p => {
    const featuresHTML = (p.features || []).map(f =>
      `<div class="ta-plan-feature ${f.incluido ? 'ta-feature-yes' : 'ta-feature-no'}">${f.texto}</div>`
    ).join('');
    const badgeHTML = p.badge ? `<div class="ta-plan-badge">${p.badge}</div>` : '';
    const ctaClass = p.destacado ? 'ta-plan-cta featured-cta' : 'ta-plan-cta';
    const sufijo = p.precio_sufijo ? ` <span>${p.precio_sufijo}</span>` : '';
    return `
    <div class="ta-plan${p.destacado ? ' featured' : ''}">
      ${badgeHTML}
      <div class="ta-plan-name">${p.nombre}</div>
      <div class="ta-plan-price">${p.precio}${sufijo}</div>
      <div class="ta-plan-desc">${p.descripcion}</div>
      <div class="ta-plan-features">${featuresHTML}</div>
      <button class="${ctaClass}">${p.cta_texto}</button>
    </div>`;
  }).join(''));
}

function renderCTA(d) {
  if (!d) return;
  setText('cta-titulo', d.titulo);
  setText('cta-desc', d.descripcion);
  setText('cta-btn1', d.btn_primario);
  setText('cta-btn2', d.btn_secundario);
}

function renderGeneral(d) {
  if (!d) return;
  const titleEl = document.getElementById('page-title');
  const descEl = document.getElementById('page-desc');
  if (titleEl) titleEl.textContent = `${d.nombre_sitio} — Marketplace B2B de Aceite de Oliva`;
  if (descEl) descEl.content = d.meta_desc || '';
  setText('nav-logo', d.nombre_sitio);
  setText('nav-sub', d.subtitulo_nav);
  setText('footer-logo', d.nombre_sitio);
  setText('footer-ciudad1', d.ciudad1);
  setText('footer-ciudad2', d.ciudad2);
  const year = new Date().getFullYear();
  setText('footer-copy', `© ${year} ${d.nombre_sitio}. Todos los derechos reservados.`);
}

// ── FILTROS ───────────────────────────────────────────────
function initFilters() {
  document.querySelectorAll('.ta-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ta-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.ta-product-card').forEach(card => {
        if (filter === 'todos' || card.dataset.cat === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ── MENÚ MÓVIL ────────────────────────────────────────────
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ── FORMULARIO RFQ ────────────────────────────────────────
function initForm() {
  const form = document.getElementById('rfqForm');
  const success = document.getElementById('rfqSuccess');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    if (!form.action || form.action === window.location.href) {
      e.preventDefault();
      form.style.display = 'none';
      if (success) success.style.display = 'block';
      return;
    }
    // Si hay action real (Formspree/Web3Forms), dejamos submit normal
    // pero mostramos éxito si responde OK
    e.preventDefault();
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (res.ok) {
        form.style.display = 'none';
        if (success) success.style.display = 'block';
      } else {
        alert('Hubo un error al enviar. Por favor intenta de nuevo.');
      }
    } catch {
      alert('Hubo un error al enviar. Por favor intenta de nuevo.');
    }
  });
}

// ── CARGA DE PRODUCTOS ────────────────────────────────────
async function loadProducts() {
  // Intenta cargar el índice de productos; si no existe,
  // carga los archivos por nombre conocido.
  const index = await loadJSON('productos/index.json');
  if (index && Array.isArray(index)) {
    const all = await Promise.all(index.map(f => loadJSON(`productos/${f}`)));
    return all.filter(Boolean);
  }
  // Fallback: carga los tres de ejemplo
  const files = [
    'aove-premium-picual.json',
    'aove-arbequina-ecologico.json',
    'mezcla-hojiblanca-cornicabra.json'
  ];
  const all = await Promise.all(files.map(f => loadJSON(`productos/${f}`)));
  return all.filter(Boolean);
}

// ── INIT PRINCIPAL ────────────────────────────────────────
async function init() {
  const [general, hero, stats, how, trust, rfq, precios, cta, products] = await Promise.all([
    loadJSON('_data/general.json'),
    loadJSON('_data/hero.json'),
    loadJSON('_data/estadisticas.json'),
    loadJSON('_data/como_funciona.json'),
    loadJSON('_data/confianza.json'),
    loadJSON('_data/rfq.json'),
    loadJSON('_data/precios.json'),
    loadJSON('_data/cta_final.json'),
    loadProducts()
  ]);

  renderGeneral(general);
  renderHero(hero);
  renderStats(stats);
  renderProducts(products);
  renderHow(how);
  renderTrust(trust);
  renderRFQ(rfq);
  renderPrecios(precios);
  renderCTA(cta);

  initFilters();
  initMobileMenu();
  initForm();
}

document.addEventListener('DOMContentLoaded', init);
