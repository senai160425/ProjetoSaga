/* ═══════════════════════════════════════════════════════════
   FlowState — script.js
   Scroll animations, particles, nav, interactions
   ═══════════════════════════════════════════════════════════ */

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

/* ── Particles ────────────────────────────────────────────── */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 28;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 4 + 1.5;
    const left = Math.random() * 100;
    const dur  = Math.random() * 10 + 7;
    const del  = Math.random() * 12;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: ${Math.random() * 20}%;
      --dur: ${dur}s;
      --delay: ${del}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ── Active nav highlight on scroll ──────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── Timeline items reveal on scroll ─────────────────────── */
const tlItems = document.querySelectorAll('.tl-item');
const tlObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = entry.target.classList.contains('done') ? '1' : '.45';
        entry.target.style.transition = 'opacity .5s ease, transform .5s ease';
      }, i * 150);
    }
  });
}, { threshold: 0.2 });
tlItems.forEach(item => tlObserver.observe(item));

/* ── Stat cards counter animation ────────────────────────── */
function animateValue(el, start, end, duration) {
  const range = end - start;
  const startTime = performance.now();
  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(start + range * ease).toLocaleString('pt-BR');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ── Download button placeholder feedback ────────────────── */
const downloadBtn = document.getElementById('download-btn');
const webglBtn    = document.getElementById('webgl-btn');

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: rgba(0,229,200,.15);
    border: 1px solid rgba(0,229,200,.4);
    color: #f0f8ff;
    padding: .9rem 1.8rem;
    border-radius: 50px;
    font-size: .88rem;
    font-family: 'Raleway', sans-serif;
    letter-spacing: .05em;
    backdrop-filter: blur(12px);
    z-index: 9999;
    opacity: 0;
    transition: opacity .3s, transform .3s;
    pointer-events: none;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

if (downloadBtn) {
  downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Download em breve! Acompanhe o projeto no Itch.io.');
  });
}

if (webglBtn) {
  webglBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Versão WebGL em produção — disponível na Fase 3!');
  });
}

/* ── Smooth parallax on hero ──────────────────────────────── */
const hero = document.getElementById('hero');
if (hero) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroHeight = hero.offsetHeight;
    if (scrolled < heroHeight) {
      const ratio = scrolled / heroHeight;
      const heroContent = hero.querySelector('.hero-content');
      if (heroContent) {
        heroContent.style.transform = `translateY(${ratio * 50}px)`;
        heroContent.style.opacity   = `${1 - ratio * 1.3}`;
      }
    }
  }, { passive: true });
}

/* ── Keyboard nav for presentation mode ──────────────────── */
const sectionIds = ['hero','about','problem','audience','mechanics','gameplay',
                    'business','diferential','roadmap','download','guardiao','team'];
let currentSection = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
    e.preventDefault();
    currentSection = Math.min(currentSection + 1, sectionIds.length - 1);
    const target = document.getElementById(sectionIds[currentSection]);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    currentSection = Math.max(currentSection - 1, 0);
    const target = document.getElementById(sectionIds[currentSection]);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }
});

/* Track current section from scroll */
const allSections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
window.addEventListener('scroll', () => {
  const middle = window.scrollY + window.innerHeight / 2;
  for (let i = allSections.length - 1; i >= 0; i--) {
    if (allSections[i].offsetTop <= middle) {
      currentSection = i;
      break;
    }
  }
}, { passive: true });
