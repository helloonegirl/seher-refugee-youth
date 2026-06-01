// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

if (navToggle && nav) {
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenu(!nav.classList.contains('open'));
  });

  // Close the menu after tapping a link (mobile)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  // Close when tapping the dimmed area outside the menu
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !navToggle.contains(e.target)) {
      setMenu(false);
    }
  });
}

// ---- Footer year ----
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Contact form (Formspree AJAX, stays on page) ----
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

if (form) form.addEventListener('submit', async (e) => {
  // If the Formspree endpoint hasn't been set yet, let the normal mailto-style flow be obvious.
  if (form.action.includes('YOUR_FORM_ID')) {
    e.preventDefault();
    status.textContent = 'Form not connected yet — email us at seher.refugeeyouth@gmail.com';
    status.className = 'form-status err';
    return;
  }

  e.preventDefault();
  status.textContent = 'Sending…';
  status.className = 'form-status';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      form.reset();
      status.textContent = 'Thank you! We’ll be in touch soon. 🌅';
      status.className = 'form-status ok';
    } else {
      status.textContent = 'Something went wrong. Please email us directly instead.';
      status.className = 'form-status err';
    }
  } catch {
    status.textContent = 'Network error. Please email us at seher.refugeeyouth@gmail.com';
    status.className = 'form-status err';
  }
});

// ---- Smooth page transition: gently fade out before going to another page ----
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  document.querySelectorAll('a[href]').forEach((link) => {
    if (link.target === '_blank' || link.hasAttribute('download')) return;
    const href = link.getAttribute('href');
    // Only intercept real page-to-page links (skip same-page #anchors, email, tel, external http links)
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('tel:') || href.startsWith('http')) return;

    link.addEventListener('click', (e) => {
      // Let Ctrl/Cmd/Shift-click open in a new tab as usual
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(() => { window.location.href = href; }, 260);
    });
  });
}

// Restore opacity if the page is shown again from the browser's back/forward cache
window.addEventListener('pageshow', () => {
  document.body.classList.remove('is-leaving');
});
