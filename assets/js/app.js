/* =========================================================
   AI Capital CRE — front-end behaviour
   Header, scroll reveals, listing grids, filters, detail page
   ========================================================= */

/* ---------- Inline icon set ---------- */
const ICON = {
  pin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  area: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3z"/><path d="M9 3v18M3 9h18"/></svg>',
  door: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v17"/><path d="M2 21h20"/><circle cx="13" cy="12" r="1"/></svg>',
  car: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M5 17a2 2 0 1 1-4 0V11l2-5h16l2 5v6a2 2 0 1 1-4 0"/><path d="M3 11h18"/></svg>',
  cal: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  heart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  building: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 9h2M13 9h2M9 13h2M13 13h2M9 17h2M13 17h2"/></svg>',
  arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>'
};

/* ---------- Header + nav ---------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', e => {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
  }

  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mark the current page in the nav.
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === here) a.classList.add('active');
  });
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  items.forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 80 + 'ms';
    io.observe(el);
  });
}

/* ---------- Saved / favourite listings ---------- */
const FAV_KEY = 'aicapitalcre.saved.v1';

function getFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
  catch (e) { return []; }
}
function toggleFav(id) {
  const favs = getFavs();
  const i = favs.indexOf(id);
  if (i > -1) favs.splice(i, 1); else favs.push(id);
  try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) {}
  return i === -1;
}

/* ---------- Listing card ---------- */
function cardHtml(l) {
  const img = (l.images && l.images[0]) ? l.images[0] : '';
  const media = img
    ? '<img src="' + escapeHtml(img) + '" alt="' + escapeHtml(l.title) + '" loading="lazy" onerror="imgFallback(this)">'
    : '<div class="ph">' + ICON.building + '</div>';

  const specs = [];
  if (l.sf) specs.push('<div>' + ICON.area + '<strong>' + num(l.sf) + '</strong> SF</div>');
  if (l.units) specs.push('<div>' + ICON.door + '<strong>' + num(l.units) + '</strong> ' + (l.type === 'Self-Storage' ? 'Units' : l.units === 1 ? 'Suite' : 'Units') + '</div>');
  if (!l.sf && l.lotSf) specs.push('<div>' + ICON.area + '<strong>' + acres(l.lotSf) + '</strong></div>');
  if (l.parking) specs.push('<div>' + ICON.car + '<strong>' + num(l.parking) + '</strong></div>');
  if (l.year) specs.push('<div>' + ICON.cal + '<strong>' + l.year + '</strong></div>');

  const isFav = getFavs().indexOf(l.id) > -1;

  return '' +
  '<article class="card reveal">' +
    '<a class="card-media" href="property.html?id=' + encodeURIComponent(l.id) + '" aria-label="' + escapeHtml(l.title) + '">' +
      media +
      '<div class="card-badges">' +
        '<span class="badge ' + statusClass(l.status) + '">' + escapeHtml(l.status) + '</span>' +
        (l.featured ? '<span class="badge">Featured</span>' : '') +
      '</div>' +
    '</a>' +
    '<button class="card-fav' + (isFav ? ' on' : '') + '" data-fav="' + escapeHtml(l.id) + '" ' +
      'aria-label="Save this listing" title="Save this listing">' + ICON.heart + '</button>' +
    '<div class="card-body">' +
      '<div class="card-type">' + escapeHtml(l.type) + '</div>' +
      '<h3 class="card-title"><a href="property.html?id=' + encodeURIComponent(l.id) + '">' + escapeHtml(l.title) + '</a></h3>' +
      '<p class="card-addr">' + ICON.pin + '<span>' + escapeHtml(l.address) + ', ' + escapeHtml(l.market) + ', ' + escapeHtml(l.state || 'CA') + '</span></p>' +
      (specs.length ? '<div class="card-specs">' + specs.slice(0, 3).join('') + '</div>' : '') +
      '<div class="card-foot">' +
        '<div class="card-price">' + priceLabel(l) + '</div>' +
        (l.capRate ? '<div class="card-cap">' + l.capRate + '% Cap</div>' : '') +
      '</div>' +
    '</div>' +
  '</article>';
}

/* Swap a broken image for the branded placeholder tile. */
function imgFallback(imgEl) {
  const host = imgEl.parentNode;
  if (!host) return;
  const ph = document.createElement('div');
  ph.className = host.classList.contains('pd-main') || host.classList.contains('t') ? 'ph-fill' : 'ph';
  ph.innerHTML = ICON.building;
  host.replaceChild(ph, imgEl);
}
window.imgFallback = imgFallback;

function wireFavs(scope) {
  (scope || document).querySelectorAll('[data-fav]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      btn.classList.toggle('on', toggleFav(btn.getAttribute('data-fav')));
    });
  });
}

function emptyHtml(msg) {
  return '' +
  '<div class="empty">' +
    '<div class="ico">' + ICON.building + '</div>' +
    '<h3>No properties match those filters</h3>' +
    '<p>' + (msg || 'Try widening your price range or clearing a filter. New assignments are added weekly.') + '</p>' +
    '<a class="btn btn--ink" href="contact.html">Tell us what you\'re looking for</a>' +
  '</div>';
}

/* ---------- Home: featured grid ---------- */
function initFeatured() {
  const host = document.getElementById('featured-grid');
  if (!host) return;

  const all = Store.all();
  const featured = all.filter(l => l.featured);
  const show = (featured.length ? featured : all).slice(0, 6);

  host.innerHTML = show.length ? show.map(cardHtml).join('') : emptyHtml();
  wireFavs(host);

  const count = document.getElementById('inventory-count');
  if (count) count.textContent = all.length;
}

/* ---------- Home: search bar hands off to properties.html ---------- */
function initHeroSearch() {
  const form = document.getElementById('hero-search');
  if (!form) return;

  const typeSel = form.querySelector('[name="type"]');
  const mktSel = form.querySelector('[name="market"]');

  if (typeSel) {
    PROPERTY_TYPES.forEach(t => typeSel.add(new Option(t, t)));
  }
  if (mktSel) {
    const markets = Array.from(new Set(Store.all().map(l => l.market))).sort();
    markets.forEach(m => mktSel.add(new Option(m, m)));
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const params = new URLSearchParams();
    new FormData(form).forEach((v, k) => { if (v) params.set(k, v); });
    location.href = 'properties.html' + (params.toString() ? '?' + params : '');
  });
}

/* ---------- Home: sector counts ---------- */
function initSectorCounts() {
  const nodes = document.querySelectorAll('[data-sector-count]');
  if (!nodes.length) return;
  const all = Store.all();
  nodes.forEach(node => {
    const type = node.getAttribute('data-sector-count');
    const n = all.filter(l => l.type === type).length;
    node.textContent = n + (n === 1 ? ' Listing' : ' Listings');
  });
}

/* =========================================================
   Properties page
   ========================================================= */
function initProperties() {
  const grid = document.getElementById('results-grid');
  if (!grid) return;

  const form = document.getElementById('filters');
  const countEl = document.getElementById('results-count');
  const sortEl = document.getElementById('sort');
  const chips = Array.from(document.querySelectorAll('[data-chip]'));

  // Populate selects
  const typeSel = form.querySelector('[name="type"]');
  const mktSel = form.querySelector('[name="market"]');
  const statusSel = form.querySelector('[name="status"]');
  PROPERTY_TYPES.forEach(t => typeSel.add(new Option(t, t)));
  STATUSES.forEach(s => statusSel.add(new Option(s, s)));
  Array.from(new Set(Store.all().map(l => l.market))).sort()
    .forEach(m => mktSel.add(new Option(m, m)));

  // Seed from the URL (hero search / sector links deep-link into here)
  const params = new URLSearchParams(location.search);
  ['q', 'type', 'market', 'status', 'min', 'max'].forEach(k => {
    const val = params.get(k);
    const fld = form.querySelector('[name="' + k + '"]');
    if (val && fld) fld.value = val;
  });

  let activeChip = params.get('status') || '';

  function syncChips() {
    chips.forEach(c => c.classList.toggle('on', c.getAttribute('data-chip') === activeChip));
  }

  function matches(l, f) {
    if (f.q) {
      const hay = [l.title, l.address, l.market, l.type, l.zip, l.id].join(' ').toLowerCase();
      if (hay.indexOf(f.q.toLowerCase()) === -1) return false;
    }
    if (f.type && l.type !== f.type) return false;
    if (f.market && l.market !== f.market) return false;
    if (f.status && l.status !== f.status) return false;

    // Price filters only apply to lump-sum pricing; lease rates are per SF.
    if (l.priceUnit === 'total') {
      if (f.min && l.price < Number(f.min)) return false;
      if (f.max && l.price > Number(f.max)) return false;
    }
    return true;
  }

  function sortList(list, mode) {
    const key = l => (l.priceUnit === 'total' ? l.price : 0);
    const by = {
      'price-desc': (a, b) => key(b) - key(a),
      'price-asc': (a, b) => key(a) - key(b),
      'sf-desc': (a, b) => (b.sf || 0) - (a.sf || 0),
      'cap-desc': (a, b) => (b.capRate || 0) - (a.capRate || 0),
      'newest': (a, b) => String(b.id).localeCompare(String(a.id))
    };
    return list.slice().sort(by[mode] || by.newest);
  }

  function render() {
    const f = {};
    new FormData(form).forEach((v, k) => { f[k] = String(v).trim(); });
    if (activeChip) f.status = activeChip;

    const list = sortList(Store.all().filter(l => matches(l, f)), sortEl ? sortEl.value : 'newest');

    grid.innerHTML = list.length ? list.map(cardHtml).join('') : emptyHtml();
    wireFavs(grid);
    grid.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));

    if (countEl) {
      countEl.innerHTML = '<strong>' + list.length + '</strong> ' +
        (list.length === 1 ? 'property' : 'properties') + ' available';
    }
    syncChips();
  }

  form.addEventListener('input', render);
  form.addEventListener('submit', e => { e.preventDefault(); render(); });
  if (sortEl) sortEl.addEventListener('change', render);

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute('data-chip');
      activeChip = (activeChip === val) ? '' : val;
      if (activeChip) statusSel.value = '';
      render();
    });
  });

  const reset = document.getElementById('reset-filters');
  if (reset) {
    reset.addEventListener('click', () => {
      form.reset();
      activeChip = '';
      render();
    });
  }

  render();
}

/* =========================================================
   Property detail page
   ========================================================= */
function initDetail() {
  const root = document.getElementById('detail');
  if (!root) return;

  const id = new URLSearchParams(location.search).get('id');
  const l = id ? Store.find(id) : null;

  if (!l) {
    root.innerHTML = '<div class="wrap section">' + emptyHtml(
      'That listing is no longer available or the link has expired. Browse the current inventory instead.'
    ) + '</div>';
    return;
  }

  document.title = l.title + ' — ' + SITE.name;
  const crumb = document.getElementById('crumb-current');
  if (crumb) crumb.textContent = l.title;

  const imgs = (l.images && l.images.length) ? l.images : [];
  const mainImg = imgs.length
    ? '<img id="pd-main-img" src="' + escapeHtml(imgs[0]) + '" alt="' + escapeHtml(l.title) + '" onerror="imgFallback(this)">'
    : '<div class="ph-fill">' + ICON.building + '</div>';

  const thumbs = imgs.slice(0, 3).map((src, i) =>
    '<div class="t' + (i === 0 ? ' on' : '') + '" data-src="' + escapeHtml(src) + '">' +
      '<img src="' + escapeHtml(src) + '" alt="View ' + (i + 1) + '" onerror="imgFallback(this)">' +
    '</div>'
  ).join('') || (
    '<div class="t"><div class="ph-fill">' + ICON.building + '</div></div>' +
    '<div class="t"><div class="ph-fill">' + ICON.building + '</div></div>' +
    '<div class="t"><div class="ph-fill">' + ICON.building + '</div></div>'
  );

  const keys = [];
  if (l.sf) keys.push(['Building Size', sf(l.sf)]);
  if (l.lotSf) keys.push(['Lot Size', acres(l.lotSf)]);
  if (l.units) keys.push([l.type === 'Multifamily' || l.type === 'Mixed-Use' ? 'Units' : 'Suites', num(l.units)]);
  if (l.capRate) keys.push(['Cap Rate', l.capRate + '%']);
  if (l.year) keys.push(['Year Built', l.year]);
  if (l.occupancy || l.occupancy === 0) keys.push(['Occupancy', l.occupancy + '%']);

  const specs = [
    ['Property Type', l.type],
    ['Listing Status', l.status],
    ['Submarket', l.market],
    ['Building Size', sf(l.sf)],
    ['Lot Size', l.lotSf ? num(l.lotSf) + ' SF (' + acres(l.lotSf) + ')' : '—'],
    ['Year Built', l.year || '—'],
    ['Zoning', l.zoning || '—'],
    ['Parking', l.parking ? num(l.parking) + ' spaces' : '—'],
    ['Net Operating Income', l.noi ? money(l.noi) : '—'],
    ['Cap Rate', l.capRate ? l.capRate + '%' : '—'],
    ['Price Per SF', pricePerSf(l) || '—'],
    ['Listing ID', l.id.toUpperCase()]
  ];

  const highlights = (l.highlights || []).filter(Boolean);

  root.innerHTML = '' +
  '<div class="wrap section section--tight">' +
    '<div class="pd-gallery">' +
      '<div class="pd-main">' + mainImg + '</div>' +
      '<div class="pd-thumbs">' + thumbs + '</div>' +
    '</div>' +

    '<div class="pd-layout">' +
      '<div>' +
        '<div class="pd-head">' +
          '<div class="card-type">' + escapeHtml(l.type) + ' · ' + escapeHtml(l.status) + '</div>' +
          '<h1>' + escapeHtml(l.title) + '</h1>' +
          '<p class="addr">' + ICON.pin + escapeHtml(l.address) + ', ' + escapeHtml(l.market) + ', ' +
            escapeHtml(l.state || 'CA') + ' ' + escapeHtml(l.zip || '') + '</p>' +
          '<div class="pd-price">' +
            '<div class="big">' + priceLabel(l) + '</div>' +
            (pricePerSf(l) ? '<div class="per">' + pricePerSf(l) + '</div>' : '') +
            (l.noi ? '<div class="per">NOI ' + money(l.noi) + '</div>' : '') +
          '</div>' +
        '</div>' +

        (keys.length ? '<div class="pd-keys">' + keys.map(k =>
          '<div><div class="k">' + k[0] + '</div><div class="v">' + k[1] + '</div></div>'
        ).join('') + '</div>' : '') +

        (highlights.length ? '<div class="pd-block">' +
          '<h2>Investment Highlights</h2>' +
          '<ul class="checklist">' + highlights.map(h =>
            '<li><span class="check-ico">' + ICON.check + '</span><span>' + escapeHtml(h) + '</span></li>'
          ).join('') + '</ul>' +
        '</div>' : '') +

        '<div class="pd-block">' +
          '<h2>Property Overview</h2>' +
          '<p>' + escapeHtml(l.description || 'Full offering memorandum available on request.') + '</p>' +
        '</div>' +

        '<div class="pd-block">' +
          '<h2>Property Details</h2>' +
          '<ul class="pd-specs">' + specs.map(s =>
            '<li><span>' + s[0] + '</span><strong>' + escapeHtml(s[1]) + '</strong></li>'
          ).join('') + '</ul>' +
        '</div>' +
      '</div>' +

      '<aside class="pd-aside">' +
        '<div class="panel">' +
          '<div class="broker">' +
            '<div class="av">' + initials(l.broker || SITE.name) + '</div>' +
            '<div>' +
              '<strong>' + escapeHtml(l.broker || 'Investment Sales Desk') + '</strong>' +
              '<span>' + SITE.name + ' · ' + SITE.license + '</span>' +
            '</div>' +
          '</div>' +
          '<h3>Request the offering</h3>' +
          '<p class="sub">We will send the OM, rent roll and T-12 within one business day.</p>' +
          '<form data-inquiry="' + escapeHtml(l.id) + '">' +
            '<div class="field"><label for="iq-name">Full name</label><input id="iq-name" name="name" required></div>' +
            '<div class="field"><label for="iq-email">Email</label><input id="iq-email" name="email" type="email" required></div>' +
            '<div class="field"><label for="iq-phone">Phone</label><input id="iq-phone" name="phone" type="tel"></div>' +
            '<div class="field"><label for="iq-msg">Message</label><textarea id="iq-msg" name="message">I would like the offering memorandum for ' + escapeHtml(l.title) + '.</textarea></div>' +
            '<button class="btn btn--gold btn--block" type="submit">Request Information</button>' +
          '</form>' +
        '</div>' +
        '<div class="panel">' +
          '<h3>Speak with the desk</h3>' +
          '<p class="sub">Direct line to the listing broker.</p>' +
          '<a class="btn btn--ink btn--block" href="' + SITE.phoneHref + '">' + SITE.phone + '</a>' +
          '<a class="btn btn--ghost btn--block" style="margin-top:10px" href="mailto:' + SITE.email +
            '?subject=' + encodeURIComponent(l.title + ' — ' + l.id.toUpperCase()) + '">Email the Broker</a>' +
        '</div>' +
      '</aside>' +
    '</div>' +
  '</div>';

  // Gallery swapping
  const mainEl = document.getElementById('pd-main-img');
  root.querySelectorAll('.pd-thumbs .t[data-src]').forEach(t => {
    t.addEventListener('click', () => {
      if (!mainEl) return;
      mainEl.src = t.getAttribute('data-src');
      root.querySelectorAll('.pd-thumbs .t').forEach(x => x.classList.remove('on'));
      t.classList.add('on');
    });
  });

  initForms(root);
  renderSimilar(l);
}

function renderSimilar(l) {
  const host = document.getElementById('similar-grid');
  if (!host) return;
  const list = Store.all()
    .filter(x => x.id !== l.id && (x.type === l.type || x.market === l.market))
    .slice(0, 3);
  const section = host.closest('section');
  if (!list.length) { if (section) section.style.display = 'none'; return; }
  host.innerHTML = list.map(cardHtml).join('');
  host.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  wireFavs(host);
}

/* =========================================================
   Forms — no backend, so confirm locally and hand off to email
   ========================================================= */
function initForms(scope) {
  (scope || document).querySelectorAll('form[data-inquiry], form[data-contact]').forEach(form => {
    if (form.dataset.wired) return;
    form.dataset.wired = '1';

    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = {};
      new FormData(form).forEach((v, k) => { d[k] = v; });

      const ref = form.getAttribute('data-inquiry');
      const subject = ref
        ? 'Listing inquiry — ' + ref.toUpperCase()
        : 'Website inquiry — ' + (d.name || 'New contact');

      const body = [
        'Name: ' + (d.name || ''),
        'Email: ' + (d.email || ''),
        'Phone: ' + (d.phone || ''),
        d.interest ? 'Interest: ' + d.interest : '',
        '',
        d.message || ''
      ].filter(Boolean).join('\n');

      window.location.href = 'mailto:' + SITE.email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      toast('Thank you — opening your email client to send this to ' + SITE.email);
      form.reset();
    });
  });
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.innerHTML = ICON.check + '<span>' + escapeHtml(msg) + '</span>';
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 4200);
}

/* ---------- Year stamps ---------- */
function initYear() {
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initYear();
  initHeroSearch();
  initFeatured();
  initSectorCounts();
  initProperties();
  initDetail();
  initForms(document);
  initReveal();
});
