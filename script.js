/* ── Navbar scroll effect ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Mobile nav toggle ────────────────────────────────────── */
const hamburger = document.querySelector('.nav-hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.textContent = '☰';
  });
});

/* ── Scroll reveal ────────────────────────────────────────── */
const revealSelectors = '.reveal, .reveal-fade, .reveal-left, .reveal-right, .reveal-up';

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll(revealSelectors).forEach(el => {
  revealObserver.observe(el);
});

/* ── Particles ────────────────────── */
function createParticles() {
  const container = document.getElementById('particles') || document.querySelector('.hero-gif-bg');
  if (!container) return;

  let pContainer = document.querySelector('.particles-js-container');
  if(!pContainer){
    pContainer = document.createElement('div');
    pContainer.className = 'particles-js-container';
    pContainer.style.cssText = 'position:absolute; inset:0; pointer-events:none; z-index:1;';
    container.appendChild(pContainer);
  }

  const count = 25;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 4 + 1.5;
    const left = Math.random() * 100;
    const dur  = Math.random() * 10 + 7;
    const del  = Math.random() * 12;

    p.style.cssText = `
      position: absolute;
      background: rgba(0, 229, 200, 0.4);
      border-radius: 50%;
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      --dur: ${dur}s;
      --delay: ${del}s;
      animation: float-up var(--dur) ease-in var(--delay) infinite;
    `;
    pContainer.appendChild(p);
  }
}
window.addEventListener('DOMContentLoaded', createParticles);

/* ── Toast Feedback ───────────────────── */
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: rgba(3, 21, 40, 0.9);
    border: 1px solid rgba(0, 229, 200, 0.4);
    color: #f0f8ff;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-family: 'Raleway', sans-serif;
    backdrop-filter: blur(10px);
    z-index: 10000;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 100);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

document.querySelectorAll('a[href^="#"], .nav-cta, .btn-primary, .btn-ghost').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const href = btn.getAttribute('href');

    if (href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    } 
    else if (href === '#' || href === '') {
      e.preventDefault();
      showToast('O acesso ao Ripple será liberado em breve! Fique atento.');
    } 
    else {
      showToast('Redirecionando para o download de Ripple...');
    }
  });
});

/* ── Keyboard nav (Presentation Mode) ─────────────────────── */
const sectionIds = ['hero', 'about', 'mechanics', 'media', 'team', 'download'];
let currentSection = 0;

document.addEventListener('keydown', (e) => {
  if (['ArrowDown', 'PageDown'].includes(e.key)) {
    e.preventDefault();
    currentSection = Math.min(currentSection + 1, sectionIds.length - 1);
    scrollToSection(sectionIds[currentSection]);
  }
  if (['ArrowUp', 'PageUp'].includes(e.key)) {
    e.preventDefault();
    currentSection = Math.max(currentSection - 1, 0);
    scrollToSection(sectionIds[currentSection]);
  }
});

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    const offset = 70; // Compensação da altura da navbar fixa
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = target.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

/* ── Parallax  ───────────────────────────────── */
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    const val = window.scrollY * 0.4;
    if(heroContent) heroContent.style.transform = `translateY(${val}px)`;
  }
}, { passive: true });
