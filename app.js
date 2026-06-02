// ── Nav scroll effect ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile menu ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Typed text effect ──
const lines = [
  'מפתחת Full Stack',
  'מעצבת UI/UX',
  'יוצרת חוויות דיגיטליות',
  'אוהבת קוד יפה',
];
let lineIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const current = lines[lineIdx];
  const cursor = '<span class="cursor"></span>';

  if (!deleting) {
    charIdx++;
    typedEl.innerHTML = current.slice(0, charIdx) + cursor;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    charIdx--;
    typedEl.innerHTML = current.slice(0, charIdx) + cursor;
    if (charIdx === 0) {
      deleting = false;
      lineIdx = (lineIdx + 1) % lines.length;
    }
  }
  setTimeout(type, deleting ? 55 : 90);
}
type();

// ── Particle canvas ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 1.5 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(124,106,247,${this.alpha})`;
    ctx.fill();
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });

  // Draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124,106,247,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── Intersection Observer for reveal animations ──
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('visible'), +delay);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal, .skill-card').forEach(el => observer.observe(el));

// Add reveal class to section elements
document.querySelectorAll('.about-grid, .contact-wrapper, .projects-grid, .section-header').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ── Animated counter ──
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 16);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── Skill cards staggered animation ──
document.querySelectorAll('.skill-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});

// ── Contact form ──
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');

form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type=submit]');
  btn.textContent = 'שולח...';
  btn.disabled = true;

  setTimeout(() => {
    form.reset();
    btn.textContent = 'שלח הודעה ✦';
    btn.disabled = false;
    successMsg.classList.add('show');
    setTimeout(() => successMsg.classList.remove('show'), 5000);
  }, 1200);
});

// ── Smooth parallax on hero orbs ──
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  document.querySelector('.orb-1').style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
  document.querySelector('.orb-2').style.transform = `translate(${-x * 0.3}px, ${-y * 0.3}px)`;
  document.querySelector('.orb-3').style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
});
