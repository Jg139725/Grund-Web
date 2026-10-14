/* GRUND WEB · navigation, request and FAQ */
(() => {
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('main-nav');
  const toggle = document.querySelector('.menu-toggle');
  if (header && nav && toggle) {
    const links = [...nav.querySelectorAll('a')];
    const compact = window.matchMedia('(max-width: 1180px)');
    const setOpen = open => {
      header.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    };
    header.classList.add('nav-ready');
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    links.forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('click', event => { if (!header.contains(event.target)) setOpen(false); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    compact.addEventListener('change', () => setOpen(false));
    let queued = false;
    function updateActive() {
      queued = false;
      let id = 'start';
      const boundary = header.getBoundingClientRect().height + 36;
      document.querySelectorAll('main section[id]').forEach(section => {
        if (section.getBoundingClientRect().top <= boundary && links.some(link => link.hash === '#' + section.id)) id = section.id;
      });
      links.forEach(link => {
        const active = link.hash === '#' + id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    }
    window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateActive); } }, { passive: true });
    window.addEventListener('resize', updateActive);
    updateActive();
  }

  const form = document.getElementById('gwProjectForm');
  if (form) {
    const steps = [...form.querySelectorAll('.gw-step')];
    const bars = [...form.querySelectorAll('.gw-progress span')];
    const next = form.querySelector('.gw-next');
    const back = form.querySelector('.gw-back');
    const submit = form.querySelector('.gw-submit');
    const status = document.getElementById('gwFormStatus');
    const website = document.getElementById('websiteArt');
    const customer = document.getElementById('kundenTyp');
    const existing = document.getElementById('existingSite');
    const urlWrap = document.getElementById('urlWrap');
    const url = urlWrap.querySelector('input');
    const packageIncludes = {
      'Onepage': ['Kontaktformular'],
      'Business Website': ['Kontaktformular', 'Galerie', 'Team'],
      'Business Plus': ['Kontaktformular', 'Galerie', 'Team', 'News'],
      'Relaunch': [], 'Noch nicht sicher': []
    };
    const bonusFeatures = ['Login / Mitgliederbereich', 'Besondere / individuelle Funktion'];
    let bonusOrder = [];
    let current = 0;
    form.noValidate = true;
    form.querySelector('[name="_next"]').value = new URL('danke.html', window.location.href).href;
    form.querySelector('[name="_url"]').value = window.location.origin + '/#projektanfrage';
    const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const message = text => { status.textContent = text; };

    function applyPackageFeatures() {
      const type = website.value;
      const included = packageIncludes[type] || [];
      const selectedBonuses = bonusOrder.filter(feature => form.querySelector('.gw-check[data-feature="' + feature + '"] input').checked);
      form.querySelectorAll('.gw-check[data-feature]').forEach(label => {
        const cb = label.querySelector('input');
        const feature = label.dataset.feature;
        const isIncluded = included.includes(feature);
        const bonus = type === 'Business Plus' && bonusFeatures.includes(feature);
        label.classList.toggle('is-included', isIncluded);
        label.classList.toggle('is-bonus-choice', bonus);
        label.classList.remove('is-bonus-extra');
        let badge = label.querySelector('.gw-included-badge');
        if (!badge) {
          badge = document.createElement('span'); badge.className = 'gw-included-badge';
          label.insertBefore(badge, label.querySelector('.gw-info'));
        }
        badge.textContent = 'Inklusive';
        if (isIncluded) { cb.checked = true; cb.disabled = true; }
        else { if (cb.disabled) cb.checked = false; cb.disabled = false; }
        if (bonus) {
          const rank = selectedBonuses.indexOf(feature);
          badge.textContent = rank === 0 ? 'Inklusive' : rank > 0 ? 'Zusatzleistung' : '1 davon inklusive';
          label.classList.toggle('is-bonus-extra', rank > 0);
        }
      });
      const allIncluded = [...included];
      if (type === 'Business Plus' && selectedBonuses.length) allIncluded.push(selectedBonuses[0] + ' (inklusive Bonus-Auswahl)');
      document.getElementById('gwIncludedFeatures').value = allIncluded.join(', ') || 'Keine pauschal festgelegt';
      const note = document.getElementById('gwPackageNote');
      if (type === 'Relaunch') note.innerHTML = '<strong>Relaunch:</strong> Welche Funktionen bereits enthalten sind, hängt von deiner bestehenden Website und dem gewünschten Umfang ab.';
      else if (type === 'Noch nicht sicher') note.innerHTML = '<strong>Noch nicht sicher?</strong> Wähle einfach die Funktionen aus, die dir wichtig sind. Das passende Paket klären wir gemeinsam.';
      else if (type === 'Business Plus') note.innerHTML = '<strong>Business Plus gewählt:</strong> Die markierten Standardfunktionen sind inklusive. Zusätzlich ist <strong>eine</strong> der beiden Optionen <strong>Login / Mitgliederbereich</strong> oder <strong>besondere / individuelle Funktion</strong> ohne Aufpreis enthalten.' + (selectedBonuses.length === 2 ? ' Du hast <strong>beide</strong> ausgewählt – die zuerst gewählte Option ist inklusive, die zweite wird als <strong>Zusatzleistung individuell kalkuliert</strong>.' : ' Du kannst auch beide auswählen; die zweite wird dann individuell kalkuliert.');
      else if (type) note.innerHTML = '<strong>' + type + ' gewählt:</strong> Mit <span class="gw-mini-badge">Inklusive</span> markierte Funktionen sind in diesem Paket bereits eingeplant. Weitere Wünsche kannst du zusätzlich auswählen.';
    }

    form.querySelectorAll('.gw-options').forEach(group => group.querySelectorAll('.gw-option').forEach(option => {
      option.addEventListener('click', () => {
        group.querySelectorAll('.gw-option').forEach(item => { item.classList.remove('selected'); item.setAttribute('aria-pressed', 'false'); });
        option.classList.add('selected'); option.setAttribute('aria-pressed', 'true');
        document.getElementById(group.dataset.target).value = option.dataset.value;
        if (group.dataset.target === 'websiteArt') applyPackageFeatures();
        message('');
      });
    }));
    form.querySelectorAll('.gw-check input').forEach(cb => cb.addEventListener('change', () => {
      const feature = cb.closest('.gw-check').dataset.feature;
      if (bonusFeatures.includes(feature)) { bonusOrder = bonusOrder.filter(item => item !== feature); if (cb.checked) bonusOrder.push(feature); }
      applyPackageFeatures();
    }));
    function show(focus = false) {
      steps.forEach((step, i) => { step.classList.toggle('active', i === current); step.setAttribute('aria-hidden', String(i !== current)); });
      bars.forEach((bar, i) => bar.classList.toggle('on', i <= current));
      form.querySelector('.gw-progress').setAttribute('aria-label', 'Schritt ' + (current + 1) + ' von ' + steps.length);
      back.style.visibility = current ? 'visible' : 'hidden';
      next.style.display = current === steps.length - 1 ? 'none' : 'inline-block';
      submit.style.display = current === steps.length - 1 ? 'inline-block' : 'none';
      if (focus) {
        const title = steps[current].querySelector('h3');
        title.focus({ preventScroll: true });
        form.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
      }
    }
    function goNext() {
      if (current === 0 && !website.value) { message('Bitte wähle zuerst aus, was du umsetzen möchtest.'); steps[0].querySelector('.gw-option').focus(); return; }
      if (current === 1 && !customer.value) { message('Bitte wähle aus, für wen die Website ist.'); steps[1].querySelector('.gw-option').focus(); return; }
      if (current === 1 && !url.disabled && !url.reportValidity()) return;
      message(''); current = Math.min(current + 1, steps.length - 1); show(true);
    }
    next.addEventListener('click', goNext);
    back.addEventListener('click', () => { message(''); current = Math.max(current - 1, 0); show(true); });
    function updateExisting() { const hasWebsite = existing.value === 'Ja'; urlWrap.style.display = hasWebsite ? 'block' : 'none'; url.disabled = !hasWebsite; }
    existing.addEventListener('change', updateExisting); updateExisting();
    form.addEventListener('submit', event => {
      if (current < steps.length - 1) { event.preventDefault(); goNext(); return; }
      if (!form.reportValidity()) { event.preventDefault(); return; }
      submit.disabled = true; submit.textContent = 'Anfrage wird gesendet …';
    });
    window.addEventListener('pageshow', () => { submit.disabled = false; submit.textContent = 'Projekt unverbindlich anfragen →'; });
    show();
  }

  document.querySelectorAll('.gw-faq-q').forEach(button => button.addEventListener('click', () => {
    const item = button.closest('.gw-faq-item');
    const open = !item.classList.contains('open');
    item.classList.toggle('open', open); button.setAttribute('aria-expanded', String(open));
  }));
})();
