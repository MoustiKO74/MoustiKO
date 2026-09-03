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
