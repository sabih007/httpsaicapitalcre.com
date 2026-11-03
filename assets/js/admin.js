/* =========================================================
   AI Capital CRE — listing manager
   ---------------------------------------------------------
   Add, edit, delete and reorder listings; upload photos from
   the local machine; export the whole set to listings.json
   for backup or for handing to a real backend later.

   Uploaded photos are downscaled in the browser before they
   are stored, because localStorage is capped at roughly 5MB
   per origin and a single phone photo can exceed that alone.
   ========================================================= */

const MAX_IMAGES = 6;
const MAX_EDGE = 1600;   // px — longest side after downscaling
const JPEG_QUALITY = 0.78;

let pendingImages = [];  // data URLs staged for the listing being edited
let editingId = null;

/* ---------- Image handling ---------- */

/** Read a File, downscale it on a canvas, return a JPEG data URL. */
function processImage(file) {
  return new Promise((resolve, reject) => {
    if (!/^image\//.test(file.type)) {
      reject(new Error(file.name + ' is not an image'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read ' + file.name));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode ' + file.name));
      img.onload = () => {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';          // flatten any transparency for JPEG
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function addFiles(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return;

  const room = MAX_IMAGES - pendingImages.length;
  if (room <= 0) {
    toast('Maximum of ' + MAX_IMAGES + ' photos per listing.');
    return;
  }

  for (const file of files.slice(0, room)) {
    try {
      pendingImages.push(await processImage(file));
    } catch (err) {
      toast(err.message);
    }
  }
  if (files.length > room) toast('Only the first ' + room + ' photo(s) were added.');
  renderThumbs();
}

function renderThumbs() {
  const host = document.getElementById('thumbs');
  const hint = document.getElementById('photo-hint');
  if (!host) return;

  host.innerHTML = pendingImages.map((src, i) =>
    '<div class="thumb">' +
      '<img src="' + src + '" alt="Photo ' + (i + 1) + '">' +
      (i === 0 ? '<span class="cover">Cover</span>' : '') +
      '<button type="button" data-rm="' + i + '" aria-label="Remove photo">&times;</button>' +
    '</div>'
  ).join('');

  host.querySelectorAll('[data-rm]').forEach(btn => {
    btn.addEventListener('click', () => {
      pendingImages.splice(Number(btn.getAttribute('data-rm')), 1);
      renderThumbs();
    });
  });

  if (hint) {
    hint.textContent = pendingImages.length
      ? pendingImages.length + ' of ' + MAX_IMAGES + ' photos — the first is used as the cover image.'
      : 'No photos yet. Listings without a photo show the branded placeholder tile.';
  }
}

function initDropzone() {
  const drop = document.getElementById('dropzone');
  const input = document.getElementById('file-input');
  if (!drop || !input) return;

  drop.addEventListener('click', () => input.click());
  drop.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
  });
  input.addEventListener('change', () => { addFiles(input.files); input.value = ''; });

  ['dragenter', 'dragover'].forEach(ev =>
    drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); })
  );
  ['dragleave', 'drop'].forEach(ev =>
    drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); })
  );
  drop.addEventListener('drop', e => {
    if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
  });
}

/* ---------- Form <-> listing ---------- */

function initSelects() {
  const type = document.getElementById('l-type');
  const status = document.getElementById('l-status');
  const market = document.getElementById('l-market');
  if (!type) return;

  PROPERTY_TYPES.forEach(t => type.add(new Option(t, t)));
  STATUSES.forEach(s => status.add(new Option(s, s)));

  const known = Array.from(new Set(MARKETS.concat(Store.all().map(l => l.market)))).sort();
  const dl = document.getElementById('market-list');
  if (dl) dl.innerHTML = known.map(m => '<option value="' + escapeHtml(m) + '"></option>').join('');
  if (market) market.setAttribute('list', 'market-list');
}

function val(id) {
  const el = document.getElementById(id);
  return el ? String(el.value).trim() : '';
}
function numVal(id) {
  const v = val(id);
  return v === '' ? null : Number(v);
}

function formToListing() {
  const lines = val('l-highlights')
    .split('\n').map(s => s.trim()).filter(Boolean).slice(0, 8);

  return {
    id: editingId || Store.newId(),
    title: val('l-title'),
    address: val('l-address'),
    market: val('l-market'),
    state: val('l-state') || 'CA',
    zip: val('l-zip'),
    type: val('l-type'),
    status: val('l-status'),
    price: numVal('l-price'),
    priceUnit: val('l-price-unit') || 'total',
    sf: numVal('l-sf'),
    lotSf: numVal('l-lot'),
    year: numVal('l-year'),
    units: numVal('l-units'),
    parking: numVal('l-parking'),
    capRate: numVal('l-cap'),
    noi: numVal('l-noi'),
    occupancy: numVal('l-occupancy'),
    zoning: val('l-zoning'),
    broker: val('l-broker') || 'Investment Sales Desk',
    featured: document.getElementById('l-featured').checked,
    highlights: lines,
    description: val('l-description'),
    images: pendingImages.slice()
  };
}

function listingToForm(l) {
  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.value = (v === null || v === undefined) ? '' : v;
  };

  set('l-title', l.title);
  set('l-address', l.address);
  set('l-market', l.market);
  set('l-state', l.state);
  set('l-zip', l.zip);
  set('l-type', l.type);
  set('l-status', l.status);
  set('l-price', l.price);
  set('l-price-unit', l.priceUnit || 'total');
  set('l-sf', l.sf);
  set('l-lot', l.lotSf);
  set('l-year', l.year);
  set('l-units', l.units);
  set('l-parking', l.parking);
  set('l-cap', l.capRate);
  set('l-noi', l.noi);
  set('l-occupancy', l.occupancy);
  set('l-zoning', l.zoning);
  set('l-broker', l.broker);
  set('l-highlights', (l.highlights || []).join('\n'));
  set('l-description', l.description);

  document.getElementById('l-featured').checked = !!l.featured;

  pendingImages = (l.images || []).slice();
  renderThumbs();
}

function resetForm() {
  const form = document.getElementById('listing-form');
  if (form) form.reset();
  editingId = null;
  pendingImages = [];
  renderThumbs();

  document.getElementById('form-mode').textContent = 'New listing';
  document.getElementById('form-sub').textContent =
    'Fields marked with an asterisk are required. Everything else is optional and simply hidden when left blank.';
  document.getElementById('save-btn').textContent = 'Publish Listing';
  const cancel = document.getElementById('cancel-edit');
  if (cancel) cancel.hidden = true;
  renderList();
}

function startEdit(id) {
  const l = Store.find(id);
  if (!l) return;

  editingId = id;
  listingToForm(l);

  document.getElementById('form-mode').textContent = 'Editing ' + id.toUpperCase();
  document.getElementById('form-sub').textContent = l.title;
  document.getElementById('save-btn').textContent = 'Save Changes';
  document.getElementById('cancel-edit').hidden = false;

  renderList();
  document.getElementById('listing-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- Saved listings panel ---------- */

function renderList() {
  const host = document.getElementById('admin-list');
  if (!host) return;

  const list = Store.all();

  if (!list.length) {
    host.innerHTML = '<p style="color:var(--text-2);margin:0">No listings yet. Add the first one with the form.</p>';
  } else {
    host.innerHTML = list.map(l => {
      const cover = (l.images && l.images[0])
        ? '<img src="' + escapeHtml(l.images[0]) + '" alt="" onerror="this.remove()">'
        : '';
      return '' +
      '<div class="adm-row' + (l.id === editingId ? ' editing' : '') + '">' +
        '<div class="im">' + cover + '</div>' +
        '<div class="info">' +
          '<strong>' + escapeHtml(l.title || '(untitled)') + '</strong>' +
          '<span>' + escapeHtml(l.type) + ' · ' + escapeHtml(l.status) + ' · ' +
            (l.priceUnit === 'total' ? money(l.price) : '$' + Number(l.price || 0).toFixed(2) + '/SF/MO') +
          '</span>' +
        '</div>' +
        '<div class="acts">' +
          '<a class="icon-btn" href="property.html?id=' + encodeURIComponent(l.id) + '" title="View listing" aria-label="View listing">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>' +
          '</a>' +
          '<button class="icon-btn" data-edit="' + escapeHtml(l.id) + '" title="Edit" aria-label="Edit listing">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>' +
          '</button>' +
          '<button class="icon-btn danger" data-del="' + escapeHtml(l.id) + '" title="Delete" aria-label="Delete listing">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>';
    }).join('');

    host.querySelectorAll('[data-edit]').forEach(b =>
      b.addEventListener('click', () => startEdit(b.getAttribute('data-edit')))
    );
    host.querySelectorAll('[data-del]').forEach(b =>
      b.addEventListener('click', () => askDelete(b.getAttribute('data-del')))
    );
  }

  renderStats(list);
}

/* Two-step delete — the second click within 4s confirms, so no blocking dialog. */
const pendingDeletes = {};
function askDelete(id) {
  const btn = document.querySelector('[data-del="' + id + '"]');
  if (pendingDeletes[id]) {
    clearTimeout(pendingDeletes[id]);
    delete pendingDeletes[id];
    const l = Store.find(id);
    Store.remove(id);
    if (editingId === id) resetForm(); else renderList();
    toast('Deleted “' + (l ? l.title : id) + '”.');
    return;
  }
  if (btn) {
    btn.style.borderColor = 'var(--red)';
    btn.style.color = 'var(--red)';
    btn.title = 'Click again to confirm';
  }
  toast('Click the bin again to permanently delete this listing.');
  pendingDeletes[id] = setTimeout(() => {
    delete pendingDeletes[id];
    renderList();
  }, 4000);
}

function renderStats(list) {
  list = list || Store.all();
  const forSale = list.filter(l => l.status === 'For Sale');
  const totalValue = forSale.reduce((sum, l) => sum + (l.priceUnit === 'total' ? (l.price || 0) : 0), 0);
  const totalSf = list.reduce((sum, l) => sum + (l.sf || 0), 0);

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('stat-total', list.length);
  set('stat-sale', forSale.length);
  set('stat-lease', list.filter(l => l.status === 'For Lease').length);
  set('stat-value', totalValue >= 1e6 ? '$' + (totalValue / 1e6).toFixed(1) + 'M' : money(totalValue));
  set('stat-sf', (totalSf / 1000).toFixed(0) + 'K');

  // Rough storage usage, so the user knows when photos are filling the quota.
  try {
    const bytes = new Blob([localStorage.getItem(STORAGE_KEY) || '']).size;
    set('stat-storage', (bytes / 1048576).toFixed(2) + ' MB');
  } catch (e) {
    set('stat-storage', '—');
  }
}

/* ---------- Export / import ---------- */

function exportJson() {
  const data = JSON.stringify(Store.all(), null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'listings.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast('Exported ' + Store.all().length + ' listings to listings.json');
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!Array.isArray(parsed)) throw new Error('Expected a JSON array of listings');

      // Keep only entries that look like listings, and fill in safe defaults.
      const clean = parsed
        .filter(l => l && typeof l === 'object' && l.title)
        .map((l, i) => Object.assign({
          id: 'aic-' + (2000 + i),
          type: 'Office',
          status: 'For Sale',
          priceUnit: 'total',
          state: 'CA',
          images: [],
          highlights: []
        }, l));

      if (!clean.length) throw new Error('No valid listings found in that file');

      Store.write(clean);
      resetForm();
      toast('Imported ' + clean.length + ' listings.');
    } catch (err) {
      toast('Import failed: ' + err.message);
    }
  };
  reader.readAsText(file);
}

/* ---------- Boot ---------- */

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('listing-form')) return;

  initSelects();
  initDropzone();
  renderThumbs();
  renderList();

  const form = document.getElementById('listing-form');
  form.addEventListener('submit', e => {
    e.preventDefault();

    const listing = formToListing();
    if (!listing.title || !listing.address || !listing.market) {
      toast('Title, address and submarket are required.');
      return;
    }

    const wasEditing = !!editingId;
    const ok = Store.save(listing);

    if (!ok) {
      toast('Could not save — browser storage is full. Remove some photos or export and clear old listings.');
      return;
    }
    toast(wasEditing
      ? 'Listing updated.'
      : 'Listing published — view it under Properties.');
    resetForm();
  });

  // "Clear Form" must also drop the staged photos, not just the text fields.
  form.addEventListener('reset', () => setTimeout(resetForm, 0));

  document.getElementById('cancel-edit').addEventListener('click', resetForm);

  document.getElementById('export-btn').addEventListener('click', exportJson);

  const importInput = document.getElementById('import-input');
  document.getElementById('import-btn').addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', () => {
    if (importInput.files[0]) importJson(importInput.files[0]);
    importInput.value = '';
  });

  let resetArmed = false;
  const resetBtn = document.getElementById('reset-demo');
  resetBtn.addEventListener('click', () => {
    if (!resetArmed) {
      resetArmed = true;
      resetBtn.textContent = 'Click again to confirm';
      toast('This replaces every listing with the eight sample assets. Click again to confirm.');
      setTimeout(() => { resetArmed = false; resetBtn.textContent = 'Restore Sample Data'; }, 4000);
      return;
    }
    Store.reset();
    resetArmed = false;
    resetBtn.textContent = 'Restore Sample Data';
    resetForm();
    toast('Sample inventory restored.');
  });
});
