/* ─── Loader ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('gone');
  }, 700);
});

/* ─── Custom Cursor ─── */
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .work-card, .skill-item, .stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
});

/* ─── Canvas Sunrays ─── */
const canvas = document.getElementById('ray-canvas');
const ctx    = canvas.getContext('2d');
let t = 0;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawRays() {
  const W = canvas.width, H = canvas.height;
  const cx = W * 0.36, cy = H * -0.08;
  const R  = Math.sqrt(W * W + H * H) * 1.3;
  const N  = 16;

  /* Background gradient */
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0,    '#FFFBE8');
  bg.addColorStop(0.45, '#F7F3EB');
  bg.addColorStop(1,    '#F7F3EB');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* Rays */
  for (let i = 0; i < N; i++) {
    const angle = (i / N) * Math.PI * 2 + t;
    const hw    = 0.055 + Math.sin(i * 1.57) * 0.025;
    const a1    = angle - hw, a2 = angle + hw;

    const gx = cx + Math.cos(angle) * R * .6;
    const gy = cy + Math.sin(angle) * R * .6;
    const g  = ctx.createLinearGradient(cx, cy, gx, gy);

    const bright = i % 3 === 0;
    g.addColorStop(0,   bright ? 'rgba(255,215,30,0.55)' : 'rgba(255,210,50,0.28)');
    g.addColorStop(0.5, bright ? 'rgba(255,200,20,0.14)' : 'rgba(255,210,50,0.06)');
    g.addColorStop(1,   'rgba(255,220,50,0)');

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a1) * R, cy + Math.sin(a1) * R);
    ctx.lineTo(cx + Math.cos(a2) * R, cy + Math.sin(a2) * R);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
  }

  /* Center glow */
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, H * .75);
  glow.addColorStop(0,    'rgba(255,230,80,0.45)');
  glow.addColorStop(0.35, 'rgba(255,220,50,0.12)');
  glow.addColorStop(1,    'rgba(255,220,50,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  t += 0.0018;
  requestAnimationFrame(drawRays);
}
drawRays();

/* ─── Hero Parallax ─── */
const heroName = document.getElementById('hero-name');
window.addEventListener('scroll', () => {
  heroName.style.transform = `translateY(${window.scrollY * 0.28}px)`;
}, { passive: true });

/* ─── Ticker ─── */
const words = [
  'Product Manager','◆','Content PM','◆','Project Manager','◆',
  'Marketer','◆','AI 탐구자','◆','B2B 교육','◆',
  'OpenPath','◆','Duotone','◆','Meta Ads','◆',
  'WBS 일정관리','◆','커리큘럼 기획','◆','이해관계자 조율','◆'
];
const ticker = document.getElementById('ticker');
const build = () => words.map(w =>
  `<span${w === '◆' ? ' class="sep"' : ''}>${w}</span>`
).join('');
ticker.innerHTML = build() + build();

/* ─── Scroll Reveal ─── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── Mobile Nav ─── */
const mobBtn = document.getElementById('mob-btn');
const mobNav = document.getElementById('mob-nav');

mobBtn.addEventListener('click', () => {
  const isOpen = mobBtn.classList.toggle('open');
  mobNav.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mob-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobBtn.classList.remove('open');
    mobNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── Active Nav ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => navObs.observe(s));
