// ==========================================================
// Dhanush Gubala — Portfolio interactions
// ==========================================================

document.getElementById('year').textContent = new Date().getFullYear();

const reducedMotionGlobal = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Typing role animation ---------- */
const typedRoleEl = document.getElementById('typedRole');
const roles = [
  'Turning ideas into interactive websites',
  'Building clean, modern UI',
  'Bringing designs to life in code'
];

if (typedRoleEl && !reducedMotionGlobal) {
  let roleIndex = 0, charIndex = roles[0].length, deleting = false;

  function typeLoop(){
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      if (charIndex > current.length) { charIndex = current.length; deleting = true; setTimeout(typeLoop, 1800); return; }
    } else {
      charIndex--;
      if (charIndex < 0) { charIndex = 0; deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    }
    typedRoleEl.textContent = current.slice(0, charIndex);
    setTimeout(typeLoop, deleting ? 28 : 46);
  }
  // start after the initial static text has shown briefly
  setTimeout(() => { charIndex = roles[0].length; deleting = true; typeLoop(); }, 2000);
}

/* ---------- Mobile menu ---------- */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function closeMenu(){
  menuBtn.classList.remove('open');
  mobileMenu.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}

menuBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('#mobileMenu a').forEach(a => {
  a.addEventListener('click', closeMenu);
});

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Active nav link on scroll ---------- */
const navLinks = document.querySelectorAll('[data-nav]');
const sections = document.querySelectorAll('main .section');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      document
        .querySelectorAll('a[href="#' + entry.target.id + '"]')
        .forEach(l => l.classList.add('active'));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => navObserver.observe(s));

/* ---------- Cursor spotlight (pointer devices only) ---------- */
const spotlight = document.getElementById('spotlight');
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hasFinePointer && !reducedMotion) {
  window.addEventListener('pointermove', (e) => {
    spotlight.style.setProperty('--x', e.clientX + 'px');
    spotlight.style.setProperty('--y', e.clientY + 'px');
  }, { passive: true });
} else if (spotlight) {
  spotlight.style.display = 'none';
}

/* ---------- Theme switcher ---------- */
const themeBtn = document.getElementById('themeBtn');
const themePanel = document.getElementById('themePanel');
const swatches = document.querySelectorAll('.swatch');

function safeGetTheme(){
  try { return localStorage.getItem('dg-theme') || ''; }
  catch (e) { return ''; }
}
function safeSetTheme(name){
  try { localStorage.setItem('dg-theme', name); }
  catch (e) { /* storage unavailable — theme just won't persist */ }
}

function markActiveSwatch(name){
  swatches.forEach(s => s.classList.toggle('active', s.dataset.theme === name));
}
markActiveSwatch(safeGetTheme());

function openPanel(){
  themePanel.classList.add('open');
  themeBtn.setAttribute('aria-expanded', 'true');
}
function closePanel(){
  themePanel.classList.remove('open');
  themeBtn.setAttribute('aria-expanded', 'false');
}

themeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  themePanel.classList.contains('open') ? closePanel() : openPanel();
});
document.addEventListener('click', (e) => {
  if (!themePanel.contains(e.target) && e.target !== themeBtn) closePanel();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });

function liquidThemeChange(newTheme, originEl){
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const maxDist = Math.hypot(
    Math.max(cx, window.innerWidth - cx),
    Math.max(cy, window.innerHeight - cy)
  );
  const size = maxDist * 2.4;

  // pull the target theme's gradient straight from the clicked swatch
  const dot = originEl.querySelector('.swatch-dot');
  const bg = dot ? getComputedStyle(dot).backgroundImage : 'var(--gradient)';

  if (reducedMotion) {
    document.documentElement.setAttribute('data-theme', newTheme);
    safeSetTheme(newTheme);
    markActiveSwatch(newTheme);
    return;
  }

  const ripple = document.createElement('div');
  ripple.className = 'theme-ripple';
  ripple.style.left = cx + 'px';
  ripple.style.top = cy + 'px';
  ripple.style.width = size + 'px';
  ripple.style.height = size + 'px';
  ripple.style.background = bg;
  document.body.appendChild(ripple);

  const expand = ripple.animate([
    { transform: 'translate(-50%,-50%) scale(0)', borderRadius: '50%' },
    { transform: 'translate(-50%,-50%) scale(.55)', borderRadius: '46% 54% 60% 40% / 50% 45% 55% 50%', offset: 0.55 },
    { transform: 'translate(-50%,-50%) scale(1.05)', borderRadius: '50%' }
  ], { duration: 620, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });

  expand.onfinish = () => {
    document.documentElement.setAttribute('data-theme', newTheme);
    safeSetTheme(newTheme);
    markActiveSwatch(newTheme);

    const fade = ripple.animate([
      { opacity: 1, transform: 'translate(-50%,-50%) scale(1.05)' },
      { opacity: 0, transform: 'translate(-50%,-50%) scale(1.35)' }
    ], { duration: 550, easing: 'ease-out', fill: 'forwards' });

    fade.onfinish = () => ripple.remove();
  };
}

swatches.forEach(swatch => {
  swatch.addEventListener('click', () => {
    const newTheme = swatch.dataset.theme;
    if (newTheme === safeGetTheme()) { closePanel(); return; }
    liquidThemeChange(newTheme, swatch);
    closePanel();
  });
});

/* ---------- Scroll progress bar + back-to-top ---------- */
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

function onScrollUpdate(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
  if (backToTop) backToTop.classList.toggle('visible', scrollTop > window.innerHeight * 0.6);
}
window.addEventListener('scroll', onScrollUpdate, { passive: true });
onScrollUpdate();

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotionGlobal ? 'auto' : 'smooth' });
  });
}

/* ---------- Project modal ---------- */
const projectModal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalCover = document.getElementById('modalCover');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTags = document.getElementById('modalTags');
const modalLink = document.getElementById('modalLink');
const projectCards = document.querySelectorAll('.project-card');
let lastFocusedEl = null;

function openProjectModal(card){
  const cover = card.querySelector('.project-cover');
  modalCover.className = 'modal-cover ' + (cover.classList.contains('cover-orange') ? 'cover-orange' : 'cover-red');
  modalCover.innerHTML = cover.innerHTML;
  modalTitle.textContent = card.querySelector('h3').textContent;
  modalDesc.textContent = card.querySelector('.project-body > p').textContent;
  modalTags.innerHTML = card.querySelector('.project-body .tags').innerHTML;
  const link = card.querySelector('.project-link');
  modalLink.href = link.getAttribute('href');

  lastFocusedEl = document.activeElement;
  projectModal.classList.add('open');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeProjectModal(){
  projectModal.classList.remove('open');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedEl) lastFocusedEl.focus();
}

projectCards.forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('.project-link')) return;
    openProjectModal(card);
  });
  card.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.project-link')) {
      e.preventDefault();
      openProjectModal(card);
    }
  });
});

modalClose.addEventListener('click', closeProjectModal);
projectModal.addEventListener('click', (e) => { if (e.target === projectModal) closeProjectModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && projectModal.classList.contains('open')) closeProjectModal(); });

/* ---------- Contact form ---------- */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const cfSubmit = document.getElementById('cf-submit');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const actionUrl = contactForm.getAttribute('action');
    const name = document.getElementById('cf-name').value;
    const email = document.getElementById('cf-email').value;
    const message = document.getElementById('cf-message').value;

    // Formspree endpoint not yet configured — fall back to opening the mail client
    if (!actionUrl || actionUrl.includes('YOUR_FORM_ID')) {
      const subject = encodeURIComponent('Portfolio contact from ' + name);
      const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      window.location.href = `mailto:dhanush7yadav@gmail.com?subject=${subject}&body=${body}`;
      formStatus.textContent = 'Opening your email app to send this…';
      formStatus.className = 'form-status success';
      return;
    }

    cfSubmit.disabled = true;
    cfSubmit.textContent = 'Sending…';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const res = await fetch(actionUrl, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      });
      if (res.ok) {
        formStatus.textContent = 'Message sent — thanks! I\'ll get back to you soon.';
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        throw new Error('Request failed');
      }
    } catch (err) {
      formStatus.textContent = 'Something went wrong — please email me directly instead.';
      formStatus.className = 'form-status error';
    } finally {
      cfSubmit.disabled = false;
      cfSubmit.textContent = 'Send message';
    }
  });
}

/* ---------- Copy email + toast ---------- */
const copyEmailBtn = document.getElementById('copyEmailBtn');
const toast = document.getElementById('toast');
let toastTimer;

function showToast(text){
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', async () => {
    const email = copyEmailBtn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied to clipboard');
    } catch (err) {
      showToast('Copy failed — email is ' + email);
    }
  });
}

/* ---------- QR code ---------- */
const qrBox = document.getElementById('qrcode');
if (qrBox && window.QRCode) {
  try {
    new QRCode(qrBox, {
      text: window.location.href,
      width: 88,
      height: 88,
      colorDark: '#111111',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  } catch (err) { /* QR library unavailable — box stays empty */ }
}

