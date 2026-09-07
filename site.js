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
  document.querySelectorAll('.section-header, .about-card, .source-card, .photo-hero, .photo-detail-card')
    .forEach(el => el.classList.add('reveal'));

  document.querySelectorAll('.why-list, .gallery-grid, .products-grid')
    .forEach(el => el.classList.add('reveal-stagger'));

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
