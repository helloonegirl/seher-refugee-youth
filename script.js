// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

// Close the menu after tapping a link (mobile)
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---- Footer year ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Contact form (Formspree AJAX, stays on page) ----
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
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
