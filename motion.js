/* GRUND WEB · Animationen
 * - Scroll-Reveals (gestaffelt)
 * - Hero: leichte Neigung der Vorschau mit der Maus
 * - Projektseiten: Screenshots scrollen durch die ganze Website, solange sichtbar
 * Bei „Bewegung reduzieren“ passiert nichts (Klasse .motion fehlt dann).
 */
(() => {
  const root = document.documentElement;
  if (!root.classList.contains('motion')) return;

  /* ---------- Scroll-Reveals ---------- */
  const groups = [
    // [Auswahl, Verzögerung pro Element in ms]
    ['main section:not(.hero) .over, main section:not(.hero) .gw-kicker', 0],
    ['main section:not(.hero) h2', 0],
    ['.ptop > p, .ptop > a, .gw-included-head > p, .gw-price-head > p, .gw-about-copy > p:not(.over)', 0],
    ['.cards > .project-card', 120],
    ['#leistungen .cols > *, #ablauf .cols > *', 110],
    ['.gw-included-grid > *', 70],
    ['.gw-price-grid > *', 110],
    ['.gw-price-extra > *', 90],
    ['.gw-about-points, .gw-about-cta, .gw-about-photo', 90],
    ['.gw-request-wrap form, .gw-faq-list > *', 60],
    ['.contact > *', 120],
    ['.project-page .k, .project-page h1, .project-page .intro, .project-shot, .live-project-link', 90]
  ];
  const seen = new Set();
  groups.forEach(([selector, step]) => {
    const parents = new Map();
    document.querySelectorAll(selector).forEach(el => {
      if (seen.has(el)) return;
      seen.add(el);
      const parent = el.parentElement;
      const i = parents.get(parent) || 0;
      parents.set(parent, i + 1);
      el.classList.add('rv');
      el.style.setProperty('--rv-d', Math.min(i * step, 600) + 'ms');
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  seen.forEach(el => io.observe(el));

  // Anker-Sprünge (z. B. #projektanfrage): Ziel und alles darüber sofort zeigen
  const revealUpTo = () => {
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (!target) return;
    const limit = target.getBoundingClientRect().bottom + window.innerHeight;
    seen.forEach(el => { if (el.getBoundingClientRect().top < limit) el.classList.add('in'); });
  };
  window.addEventListener('hashchange', revealUpTo);
  revealUpTo();

  /* ---------- Hero: Neigung mit der Maus ---------- */
  const preview = document.querySelector('.hero-preview');
  if (preview && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const hero = document.querySelector('.hero');
    let frame = 0;
    hero.addEventListener('pointermove', e => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        preview.style.setProperty('--tilt-x', (x * -7).toFixed(2) + 'deg');
        preview.style.setProperty('--shift-x', (x * -14).toFixed(1) + 'px');
        preview.style.setProperty('--shift-y', (y * -8).toFixed(1) + 'px');
      });
    });
    hero.addEventListener('pointerleave', () => {
      preview.style.setProperty('--tilt-x', '0deg');
      preview.style.setProperty('--shift-x', '0px');
      preview.style.setProperty('--shift-y', '0px');
    });
  }

  /* ---------- Projektseiten: Screenshot scrollt nur, solange sichtbar ---------- */
  const shot = document.querySelector('.project-shot');
  if (shot) {
    const imgs = [...shot.querySelectorAll('.shot-view img')];
    const measure = () => {
      imgs.forEach(img => {
        const view = img.parentElement;
        const end = Math.max(0, img.offsetHeight - view.clientHeight);
        img.style.setProperty('--end', -end + 'px');
      });
    };
    const ready = () => { measure(); if (imgs.every(i => i.complete)) shot.classList.add('is-ready'); };
    imgs.forEach(img => { if (!img.complete) img.addEventListener('load', ready, { once: true }); });
    window.addEventListener('resize', measure);
    ready();
    new IntersectionObserver(([entry]) => {
      shot.classList.toggle('is-playing', entry.isIntersecting);
    }, { threshold: 0.35 }).observe(shot);
  }
})();
