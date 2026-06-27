/* =========================================================
   HealthCenter – Enhanced JavaScript
   ========================================================= */

/* ---- Hero Slider ---- */
const slides     = document.querySelectorAll('.slide');
const dotsWrap   = document.getElementById('sliderDots');
const prevBtn    = document.getElementById('sliderPrev');
const nextBtn    = document.getElementById('sliderNext');
let   currentIdx = 0;
let   autoTimer;

// Build dots
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('role', 'tab');
  dot.setAttribute('aria-label', `Slide ${i + 1}`);
  dot.addEventListener('click', () => goToSlide(i));
  dotsWrap.appendChild(dot);
});

function goToSlide(n) {
  slides[currentIdx].classList.remove('active');
  dotsWrap.children[currentIdx].classList.remove('active');
  currentIdx = (n + slides.length) % slides.length;
  slides[currentIdx].classList.add('active');
  dotsWrap.children[currentIdx].classList.add('active');
  resetTimer();
}

function nextSlide() { goToSlide(currentIdx + 1); }
function prevSlide() { goToSlide(currentIdx - 1); }

function resetTimer() {
  clearInterval(autoTimer);
  autoTimer = setInterval(nextSlide, 5000);
}

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);
autoTimer = setInterval(nextSlide, 5000);

// Keyboard navigation for slider
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

// Touch/swipe support
let touchStartX = 0;
const sliderEl = document.getElementById('hero');
sliderEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
sliderEl.addEventListener('touchend',   e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
});

/* ---- Sticky Navbar Scroll Effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNavLink();
  toggleBackToTop();
}, { passive: true });

/* ---- Mobile Hamburger Menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

// Create overlay element
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

function toggleMenu(state) {
  const isOpen = state !== undefined ? state : !navLinks.classList.contains('open');
  hamburger.classList.toggle('open', isOpen);
  navLinks.classList.toggle('open', isOpen);
  overlay.classList.toggle('visible', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleMenu());
overlay.addEventListener('click', () => toggleMenu(false));

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

/* ---- Active Nav Link on Scroll ---- */
const sections   = document.querySelectorAll('section[id], div[id="top"]');
const navAnchors = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
  let current = '';
  document.querySelectorAll('section[id]').forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current || (current === '' && a.getAttribute('href') === '#top'));
  });
}

/* ---- Animated Stats Counter ---- */
const statNums = document.querySelectorAll('.stat-num');
let statsDone  = false;

function animateStats() {
  if (statsDone) return;
  const statsStrip = document.querySelector('.stats-strip');
  if (!statsStrip) return;
  const rect = statsStrip.getBoundingClientRect();
  if (rect.top < window.innerHeight - 80) {
    statsDone = true;
    statNums.forEach(num => {
      const target  = +num.dataset.target;
      const duration = 2000;
      const step     = target / (duration / 16);
      let   current  = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        num.textContent = Math.floor(current).toLocaleString();
      }, 16);
    });
  }
}

/* ---- Scroll Reveal ---- */
const revealEls = document.querySelectorAll('.reveal');

function checkReveal() {
  revealEls.forEach((el, i) => {
    if (el.getBoundingClientRect().top < window.innerHeight - 60) {
      setTimeout(() => el.classList.add('visible'), i * 80);
    }
  });
  animateStats();
}

window.addEventListener('scroll', checkReveal, { passive: true });
window.addEventListener('load',   checkReveal);
checkReveal();

/* ---- Back to Top ---- */
const backBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  backBtn.classList.toggle('visible', window.scrollY > 400);
}

backBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- Appointment Form ---- */
const form        = document.getElementById('appointmentForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled    = true;

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Appointment';
      submitBtn.disabled  = false;
      formSuccess.classList.add('show');
      form.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    }, 1500);
  });
}

/* ---- Dynamic Footer Year ---- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---- Smooth scroll polyfill for older Safari ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});