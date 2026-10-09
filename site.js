/* HTTPS forcé */
if (location.protocol === 'http:' && !/^(localhost|127\.)/.test(location.hostname)) { location.replace('https:' + location.href.substring(location.protocol.length)); }
/* ============ SCRIPT PARTAGÉ — pages produits ============ */
/* Léger : lightbox photo, bandeau cookies, animations au scroll. */

/* Lightbox */
function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-overlay').classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox-overlay').classList.remove('open');
}

/* Scroll top au chargement */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
window.addEventListener('load', () => window.scrollTo(0, 0));

/* Bandeau cookies */
function toggleCookieDetails() {
  document.getElementById('cookie-details').classList.toggle('visible');
}
function handleCookie() {
  document.getElementById('cookie-banner').classList.remove('visible');
  try { localStorage.setItem('moustiko_cookie_seen', '1'); } catch (e) {}
}
function initCookieBanner() {
  if (!document.getElementById('cookie-banner')) return;
  let seen = false;
  try { seen = localStorage.getItem('moustiko_cookie_seen') === '1'; } catch (e) {}
  if (!seen) {
    setTimeout(() => document.getElementById('cookie-banner').classList.add('visible'), 600);
  }
}

/* Animations au scroll */
function setupScrollReveal() {
  document.querySelectorAll('.section-header, .about-card, .source-card, .photo-hero, .photo-detail-card, .payment-card, .estimate-box')
    .forEach(el => el.classList.add('reveal'));

  document.querySelectorAll('.why-list, .gallery-grid, .products-grid, .pcards, .process-grid, .windows-grid')
    .forEach(el => el.classList.add('reveal-stagger'));
  document.querySelectorAll('.configurator, .wizard-wrap, .avis-form-card')
    .forEach(el => el.classList.add('reveal-scale'));

  document.querySelectorAll('.section > *, .why-card, .pp-gallery, .pp-info, .cat-page > *, .cart-page > *, .legal > *')
    .forEach(el => { if (!el.matches('.reveal-stagger, .reveal-scale')) el.classList.add('reveal'); });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-stagger, .reveal-scale')
    .forEach(el => observer.observe(el));
}

function initSite() {
  setupScrollReveal();
  initCookieBanner();
}

initSite();

/* Description produit dépliable */
function toggleIntro(btn) {
  const box = btn.closest('.product-intro');
  const expanded = box.classList.toggle('expanded');
  btn.textContent = expanded ? 'Afficher moins' : 'Afficher plus';
}
/* ============ RECHERCHE ============ */
const SEARCH_ITEMS = [
  { label: 'Moustiquaire fenêtre', url: 'fenetre.html', keywords: 'fenetre fenêtre window disponible' },
  { label: 'Moustiquaire aimantée sur mesure', url: 'moustiquaire-aimantee.html', keywords: 'aimantee aimantée magnetique magnétique sur mesure' },
  { label: 'Moustiquaire de porte', url: 'porte.html', keywords: 'porte door entree entrée' },
  { label: 'Moustiquaire baie vitrée', url: 'baie-vitree.html', keywords: 'baie vitree vitrée coulissante' },
  { label: 'Moustiquaire Velux', url: 'velux.html', keywords: 'velux toit fenetre de toit' },
  { label: 'Mon panier', url: 'panier.html', keywords: 'panier commande achat' },
  { label: 'Prendre rendez-vous', url: 'rdv.html', keywords: 'rdv rendez vous rendezvous reservation' },
  { label: 'Avis clients', url: 'index.html#avis', keywords: 'avis review commentaire' },
];

function toggleSearch() {
  const overlay = document.getElementById('search-overlay');
  overlay.classList.toggle('open');
  if (overlay.classList.contains('open')) {
    renderSearchResults('');
    const input = document.getElementById('search-input');
    input.value = '';
    setTimeout(() => input.focus(), 50);
  }
}
function closeSearch() {
  document.getElementById('search-overlay').classList.remove('open');
}
function renderSearchResults(query) {
  const q = query.trim().toLowerCase();
  const list = document.getElementById('search-results');
  const filtered = SEARCH_ITEMS.filter(it => !q || it.label.toLowerCase().includes(q) || it.keywords.includes(q));
  list.innerHTML = filtered.length
    ? filtered.map(it => '<a class="search-result" href="' + it.url + '">' + it.label + '</a>').join('')
    : '<p class="search-empty">Aucun résultat</p>';
}
function filterSearch() {
  renderSearchResults(document.getElementById('search-input').value);
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSearch();
});

function toggleTarif(btn) {
  const box = document.getElementById('tarif-reveal');
  const open = box.classList.toggle('open');
  btn.textContent = open ? 'Masquer les tarifs' : 'Voir les tarifs →';
}

/* ============ TOAST ============ */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ============ DONNER AVIS : message préalable ============ */
function openAvisGate(e) {
  if (e) e.preventDefault();
  let m = document.getElementById('avis-gate');
  if (!m) {
    m = document.createElement('div');
    m.id = 'avis-gate';
    m.className = 'gate-overlay';
    m.innerHTML = '<div class="gate-box" role="dialog" aria-modal="true">' +
      '<button class="gate-close" onclick="closeAvisGate()" aria-label="Fermer">✕</button>' +
      '<div class="gate-step" id="gate-q"><h3>Votre moustiquaire est posée ?</h3>' +
      '<p>Pour garder des avis 100 % authentiques, ils sont réservés aux clients que j\'ai équipés.</p>' +
      '<button class="btn-primary" onclick="gateYes()">Oui, ma moustiquaire est posée</button>' +
      '<button class="btn-secondary" onclick="gateNotYet()">Pas encore, je vais en commander une</button></div>' +
      '<div class="gate-step" id="gate-mot" hidden><h3>Merci beaucoup !</h3>' +
      '<p>Votre avis Google est la meilleure aide pour MoustiKO. Dernière étape : un petit mot, directement ici (30 secondes).</p>' +
      '<a class="btn-primary" href="avis.html">Écrire mon petit mot</a>' +
      '<button class="btn-secondary" onclick="closeAvisGate()">Plus tard</button></div>' +
      '<div class="gate-step" id="gate-no" hidden><h3>Merci, à très vite !</h3>' +
      '<p>Une fois la pose terminée, revenez ici : votre avis sera le bienvenu. En attendant, réservez votre créneau en 1 minute.</p>' +
      '<a class="btn-primary" href="rdv.html">Prendre rendez-vous</a>' +
      '<button class="btn-secondary" onclick="closeAvisGate()">Fermer</button></div></div>';
    m.addEventListener('click', ev => { if (ev.target === m) closeAvisGate(); });
    document.body.appendChild(m);
  }
  document.getElementById('gate-q').hidden = false;
  document.getElementById('gate-no').hidden = true;
  document.getElementById('gate-mot').hidden = true;
  m.classList.add('open');
}
const GOOGLE_REVIEW_URL = 'https://g.page/r/CV-AxGSiEaj2EBM/review';
function gateYes() {
  window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener');
  document.getElementById('gate-q').hidden = true;
  document.getElementById('gate-mot').hidden = false;
}
function gateNotYet() {
  document.getElementById('gate-q').hidden = true;
  document.getElementById('gate-no').hidden = false;
}
function closeAvisGate() {
  const m = document.getElementById('avis-gate');
  if (m) m.classList.remove('open');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAvisGate(); });

/* ============ AVIS CLIENTS (carrousel) ============ */
/* Ajoutez ici vos vrais avis, un par ligne :
   { nom: 'Camille D.', commune: 'Annecy', note: 5, date: '12/09/2026', texte: 'Rapide et soigné, je recommande.' }, */
const REVIEWS = [
  { nom: 'Rik L.', commune: '', note: 5, date: 'Sept. 2026', texte: 'Pose impeccable, jeune homme très sympathique' },
];

/* Avis Google automatiques : renseignez ces 2 valeurs (clé API restreinte à moustiko74.fr) */
const GOOGLE_PLACE_ID = '';
const GOOGLE_API_KEY = '';
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function shortName(n) {
  const p = (n || 'Client').trim().split(/\s+/);
  return p.length > 1 ? p[0] + ' ' + p[1][0].toUpperCase() + '.' : p[0];
}
function renderReviews(list, avg, count) {
  const track = document.getElementById('reviews-track');
  const wrap = document.querySelector('.reviews-wrap');
  if (!list.length) { wrap.style.display = 'none'; return; }
  wrap.style.display = '';
  avg = avg || list.reduce((s, r) => s + r.note, 0) / list.length;
  count = count || list.length;
  const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
  document.getElementById('reviews-score').innerHTML =
    '<div class="rs-note">' + avg.toFixed(1).replace('.', ',') + '<small>/5</small></div>' +
    '<div class="rs-stars">' + stars(Math.round(avg)) + '</div>' +
    '<div class="rs-count">' + count + ' avis</div>' +
    '<a class="rs-link" href="avis.html" onclick="openAvisGate(event)">Donner mon avis →</a>';
  track.innerHTML = list.map(r =>
    '<div class="rv-card"><div class="rv-head"><span class="rv-medal">★</span>' +
    '<span class="rv-stars">' + stars(r.note) + '</span><span class="rv-info">i</span></div>' +
    '<p class="rv-text">' + esc(r.texte) + '</p><span class="rv-quote">”</span>' +
    '<div class="rv-author"><div class="rv-avatar">' + esc(r.nom.charAt(0)) + '</div>' +
    '<div><b>' + esc(r.nom) + '</b><small>' + esc([r.commune, r.date].filter(Boolean).join(' · ')) + '</small></div>' +
    '<div class="rv-verified">✔ ' + (r.g ? 'AVIS<br>GOOGLE' : 'CLIENT<br>AUTHENTIQUE') + '</div></div></div>').join('');
  const over = track.scrollWidth > track.clientWidth + 2;
  document.querySelectorAll('.rv-arrow').forEach(b => { b.style.display = over ? '' : 'none'; });
}
async function initReviews() {
  if (!document.getElementById('reviews-track')) return;
  renderReviews(REVIEWS);
  if (!GOOGLE_PLACE_ID || !GOOGLE_API_KEY) return;
  try {
    const r = await fetch('https://places.googleapis.com/v1/places/' + GOOGLE_PLACE_ID + '?languageCode=fr', {
      headers: { 'X-Goog-Api-Key': GOOGLE_API_KEY, 'X-Goog-FieldMask': 'rating,userRatingCount,reviews' }
    });
    const d = await r.json();
    const list = (d.reviews || []).filter(v => v.text && v.text.text).map(v => ({
      nom: shortName(v.authorAttribution && v.authorAttribution.displayName), note: v.rating,
      date: v.relativePublishTimeDescription || '', commune: '', texte: v.text.text, g: true
    }));
    if (list.length) renderReviews(list, d.rating, d.userRatingCount);
  } catch (e) { /* on garde les avis saisis à la main */ }
}
function scrollReviews(dir) {
  const t = document.getElementById('reviews-track');
  if (t) t.scrollBy({ left: dir * 284, behavior: 'smooth' });
}

initReviews();

function toggleCat(btn) {
  const open = document.getElementById('cat-intro').classList.toggle('open');
  btn.textContent = open ? 'Lire moins' : 'Lire la suite';
}

/* ============ PRIX, PROMO & PANIER (sans compte) ============ */
const UNIT_PRICE = 45;
const PROMO_PCT = 10; /* % affiché comme économie (prix barré). Mettre 0 pour désactiver. */
function calcUnits(w, h) { return Math.max(1, Math.ceil((w / 100) * (h / 100))); }
function calcPrice(w, h, qty) { return calcUnits(w, h) * qty * UNIT_PRICE; }
function promoOld(p) { return PROMO_PCT ? Math.round(p / (1 - PROMO_PCT / 100)) : p; }
function eur(n) { return n.toFixed(2).replace('.', ',') + ' €'; }
function getCart() { try { return JSON.parse(localStorage.getItem('moustiko_cart') || '[]'); } catch (e) { return []; } }
function saveCart(c) { try { localStorage.setItem('moustiko_cart', JSON.stringify(c)); } catch (e) {} updateCartBadge(); }
function addToCart(item) { const c = getCart(); c.push(item); saveCart(c); }
function updateCartBadge() {
  const n = getCart().reduce((s, i) => s + (i.qty || 1), 0);
  const b = document.getElementById('cart-count');
  if (b) { b.textContent = n; b.style.display = n ? '' : 'none'; }
}
function initNavCart() {
  const nav = document.querySelector('nav');
  if (!nav || document.getElementById('cart-count')) return;
  const a = document.createElement('a');
  a.className = 'nav-cart';
  a.href = 'panier.html';
  a.setAttribute('aria-label', 'Panier');
  a.innerHTML = '🛒<span class="cart-count" id="cart-count"></span>';
  nav.appendChild(a);
  updateCartBadge();
}
initNavCart();

const FREE_SHIP = 40; /* livraison offerte dès ce montant (€) */

/* ============ ANTI-SPAM (leurre + délai minimal) ============ */
const __t0 = Date.now();
function looksLikeSpam() {
  const h = document.getElementById('hp-field');
  return !!(h && h.value) || Date.now() - __t0 < 3000;
}

/* ============ MESURE D'AUDIENCE SANS COOKIE (GoatCounter) ============ */
const GOATCOUNTER_CODE = ''; /* ex. 'moustiko' après création gratuite sur goatcounter.com */
if (GOATCOUNTER_CODE) {
  const gs = document.createElement('script');
  gs.async = true; gs.src = 'https://gc.zgo.at/count.js';
  gs.dataset.goatcounter = 'https://' + GOATCOUNTER_CODE + '.goatcounter.com/count';
  document.head.appendChild(gs);
}
