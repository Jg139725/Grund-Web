(() => {
  const header = document.querySelector('header');
  const nav = document.getElementById('main-nav');
  const toggle = document.querySelector('.menu-toggle');
  if (!header || !nav || !toggle) return;
  const links = [...nav.querySelectorAll('a')];
  const compact = window.matchMedia('(max-width: 1100px)');
  function setOpen(open) {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  }
  header.classList.add('nav-ready');
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  links.forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setOpen(false);
  });
  compact.addEventListener('change', () => setOpen(false));
  function updateActive() {
    let id = 'start';
    const boundary = header.getBoundingClientRect().height + 24;
    document.querySelectorAll('main section[id]').forEach(section => {
      if (section.getBoundingClientRect().top <= boundary && links.some(link => link.hash === '#' + section.id)) id = section.id;
    });
    links.forEach(link => {
      const active = link.hash === '#' + id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive();
})();
