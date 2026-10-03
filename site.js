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

  document.querySelectorAll('.why-list, .gallery-grid, .products-grid, .process-grid, .windows-grid')
    .forEach(el => el.classList.add('reveal-stagger'));
  document.querySelectorAll('.configurator, .wizard-wrap, .avis-form-card')
    .forEach(el => el.classList.add('reveal-scale'));

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
  { label: 'Moustiquaire de fenêtre', url: 'fenetre.html', keywords: 'fenetre fenêtre window disponible' },
  { label: 'Moustiquaire de porte', url: 'porte.html', keywords: 'porte door entree entrée' },
  { label: 'Moustiquaire baie vitrée', url: 'baie-vitree.html', keywords: 'baie vitree vitrée coulissante' },
  { label: 'Moustiquaire Velux', url: 'velux.html', keywords: 'velux toit fenetre de toit' },
  { label: 'Prendre rendez-vous', url: 'rdv.html', keywords: 'rdv rendez vous rendezvous reservation' },
  { label: 'Tarifs & configurateur', url: 'index.html#tarifs', keywords: 'tarif prix devis configurateur' },
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
      '<a class="btn-primary" href="avis.html">Oui, ma moustiquaire est posée</a>' +
      '<button class="btn-secondary" onclick="gateNotYet()">Pas encore, je vais en commander une</button></div>' +
      '<div class="gate-step" id="gate-no" hidden><h3>Merci, à très vite !</h3>' +
      '<p>Une fois la pose terminée, revenez ici : votre avis sera le bienvenu. En attendant, réservez votre créneau en 1 minute.</p>' +
      '<a class="btn-primary" href="rdv.html">Prendre rendez-vous</a>' +
      '<button class="btn-secondary" onclick="closeAvisGate()">Fermer</button></div></div>';
    m.addEventListener('click', ev => { if (ev.target === m) closeAvisGate(); });
    document.body.appendChild(m);
  }
  document.getElementById('gate-q').hidden = false;
  document.getElementById('gate-no').hidden = true;
  m.classList.add('open');
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
];

function initReviews() {
  const track = document.getElementById('reviews-track');
  if (!track) return;
  const score = document.getElementById('reviews-score');
  const google = document.getElementById('avis-container');
  if (!REVIEWS.length) {
    track.innerHTML = '<div class="rv-empty">Les premiers avis arrivent bientôt.<br>Votre moustiquaire est posée ? Donnez votre avis juste en dessous.</div>';
    return;
  }
  if (google) google.style.display = 'none';
  const avg = REVIEWS.reduce((s, r) => s + r.note, 0) / REVIEWS.length;
  const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
  score.innerHTML = '<div class="rs-note">' + avg.toFixed(1).replace('.', ',') + '<small>/5</small></div>' +
    '<div class="rs-stars">' + stars(Math.round(avg)) + '</div>' +
    '<div class="rs-count">' + REVIEWS.length + ' avis</div>';
  track.innerHTML = REVIEWS.map(r =>
    '<div class="rv-card"><div class="rv-stars">' + stars(r.note) + '</div>' +
    '<p class="rv-text">' + r.texte + '</p><span class="rv-quote">”</span>' +
    '<div class="rv-author"><div class="rv-avatar">' + r.nom.charAt(0) + '</div>' +
    '<div><b>' + r.nom + '</b><small>' + r.commune + ' · ' + r.date + '</small></div>' +
    '<div class="rv-verified">✓ Client<br>MoustiKO</div></div></div>').join('');
}
function scrollReviews(dir) {
  const t = document.getElementById('reviews-track');
  if (t) t.scrollBy({ left: dir * 284, behavior: 'smooth' });
}

/* ============ BOUTON RDV FLOTTANT (mobile) ============ */
function initStickyCta() {
  if (/rdv|avis/.test(location.pathname)) return;
  const a = document.createElement('a');
  a.className = 'sticky-rdv';
  a.href = 'rdv.html';
  a.textContent = 'Prendre rendez-vous · dès 45 €';
  document.body.appendChild(a);
  document.body.classList.add('has-sticky');
  const foot = document.querySelector('footer');
  if (foot) new IntersectionObserver(en => a.classList.toggle('hide', en[0].isIntersecting)).observe(foot);
}

initReviews();
initStickyCta();
