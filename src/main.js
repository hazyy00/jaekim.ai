const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

function init() {
  const root = document.getElementById('siteRoot');
  const loader = document.getElementById('loader');
  const pctEl = document.getElementById('loaderPct');
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const skewWrap = document.getElementById('skewWrap');
  const heroType = document.getElementById('heroType');
  const sigStamp = document.getElementById('sigStamp');

  document.body.style.background = '#141412';

  // ── loader ──
  const finishLoader = () => {
    loader.style.transform = 'translateY(-100%)';
    loader.style.pointerEvents = 'none';
    // restart hero animations for the post-loader reveal
    document.querySelectorAll('[data-hero-l]').forEach((el) => {
      const anim = el.style.animation;
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = anim;
      // once risen, drop the fill-mode animation so the :hover skew can apply
      el.addEventListener('animationend', () => { el.style.animation = 'none'; }, { once: true });
    });
    const sigImg = sigStamp.querySelector('img');
    if (sigImg) {
      const anim = sigImg.style.animation;
      sigImg.style.animation = 'none';
      void sigImg.offsetWidth;
      sigImg.style.animation = anim;
    }
  };
  if (motion) {
    const t0 = performance.now();
    const DUR = 1300;
    let done = false;
    const finishOnce = () => { if (!done) { done = true; finishLoader(); } };
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / DUR);
      const eased = 1 - Math.pow(1 - p, 3);
      pctEl.textContent = Math.round(eased * 100);
      if (p < 1 && !done) requestAnimationFrame(tick);
      else setTimeout(finishOnce, 250);
    };
    requestAnimationFrame(tick);
    // guaranteed fallback: rAF may be throttled in background tabs
    setTimeout(() => { pctEl.textContent = '100'; finishOnce(); }, 2000);
  } else {
    pctEl.textContent = '100';
    finishLoader();
  }

  // ── custom cursor ──
  const mouse = { x: -100, y: -100 };
  const pos = { dx: -100, dy: -100, rx: -100, ry: -100 };
  if (!isTouch) {
    root.style.cursor = 'none';
    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      dot.style.opacity = '1'; ring.style.opacity = '1';
    });
    document.querySelectorAll('a, button, [data-hover], [data-exp-row]').forEach((el) => {
      el.style.cursor = 'none';
    });
    const grow = () => { ring.style.width = '72px'; ring.style.height = '72px'; ring.style.margin = '-36px 0 0 -36px'; };
    const shrink = () => { ring.style.width = '42px'; ring.style.height = '42px'; ring.style.margin = '-21px 0 0 -21px'; };
    document.querySelectorAll('a, button, [data-hover], [data-exp-row]').forEach((el) => {
      el.addEventListener('mouseenter', grow);
      el.addEventListener('mouseleave', shrink);
    });
  } else {
    dot.style.display = 'none';
    ring.style.display = 'none';
  }

  // ── project card arrow flight ──
  document.querySelectorAll('[data-arrow]').forEach((ar) => {
    const card = ar.closest('a');
    if (!card) return;
    card.addEventListener('mouseenter', () => { ar.style.transform = 'translate(6px, -6px)'; });
    card.addEventListener('mouseleave', () => { ar.style.transform = 'translate(0, 0)'; });
  });

  // ── re-snap to nearest section after viewport resize ──
  let rzT;
  window.addEventListener('resize', () => {
    clearTimeout(rzT);
    rzT = setTimeout(() => {
      const secs = Array.from(document.querySelectorAll('section[id]'));
      if (!secs.length) return;
      const nearest = secs.reduce((a, b) =>
        Math.abs(b.getBoundingClientRect().top) < Math.abs(a.getBoundingClientRect().top) ? b : a);
      window.scrollTo({ top: window.scrollY + nearest.getBoundingClientRect().top, behavior: 'auto' });
    }, 150);
  });

  // ── scroll reveals ──
  const reveals = document.querySelectorAll('[data-reveal]');
  reveals.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = (el.style.transform ? el.style.transform + ' ' : '') + 'translateY(40px)';
    el.style.transition = (el.style.transition ? el.style.transition + ', ' : '') + 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.2, 0.65, 0.2, 1)';
    el.dataset.baseTransform = el.style.transform.replace(' translateY(40px)', '').replace('translateY(40px)', '');
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = el.dataset.baseTransform || 'none';
      }, delay);
      io.unobserve(el);
    });
  }, { threshold: 0.15 });
  reveals.forEach((el) => io.observe(el));

  // ── word-by-word statement ──
  const statement = document.getElementById('statement');
  const words = statement.querySelectorAll('[data-word]');
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      words.forEach((w, i) => {
        w.style.transitionDelay = (i * 70) + 'ms';
        w.style.transform = 'translateY(0)';
      });
      io2.unobserve(statement);
    });
  }, { threshold: 0.4 });
  io2.observe(statement);

  // ── experience row hover expand ──
  document.querySelectorAll('[data-exp-row]').forEach((row) => {
    const desc = row.querySelector('[data-exp-desc]');
    row.addEventListener('mouseenter', () => {
      row.style.background = 'var(--ink)';
      row.style.color = 'var(--bg)';
      desc.style.maxHeight = desc.scrollHeight + 'px';
      desc.style.opacity = '1';
    });
    row.addEventListener('mouseleave', () => {
      row.style.background = 'transparent';
      row.style.color = 'var(--ink)';
      desc.style.maxHeight = '0';
      desc.style.opacity = '0';
    });
  });

  // ── size exp descriptions to match title column width ──
  const sizeExpDescs = () => {
    if (window.innerWidth < 900) {
      document.querySelectorAll('[data-exp-row] [data-exp-desc] p').forEach((p) => { p.style.width = 'auto'; });
      return;
    }
    // shared right cap: right edge of the rendered company title in the first row
    let capRight = window.innerWidth / 2;
    const firstCompany = document.querySelector('[data-exp-row] > div:first-child > span:nth-child(2)');
    if (firstCompany) {
      const r = document.createRange();
      r.selectNodeContents(firstCompany);
      capRight = Math.max(...Array.from(r.getClientRects()).map((x) => x.right));
    }
    document.querySelectorAll('[data-exp-row]').forEach((row) => {
      const cols = row.querySelectorAll(':scope > div:first-child > span');
      const title = cols[2];
      const desc = row.querySelector('[data-exp-desc] p');
      if (!title || !desc) return;
      let titleRight;
      if (title.firstChild && title.firstChild.nodeType === 3) {
        const r = document.createRange();
        r.selectNodeContents(title);
        titleRight = r.getBoundingClientRect().right;
      } else {
        titleRight = title.getBoundingClientRect().right;
      }
      const companyRect = cols[1].getBoundingClientRect();
      desc.style.width = Math.min(titleRight, capRight) - companyRect.left + 'px';
    });
  };
  sizeExpDescs();
  window.addEventListener('resize', sizeExpDescs);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeExpDescs);

  // ── scale "Let's talk" heading to span the full column width ──
  const sizeContact = () => {
    const heading = document.getElementById('talkHeading');
    if (!heading) return;
    const col = heading.parentElement;
    const row = document.getElementById('linksRow');
    const colW = col.getBoundingClientRect().width;
    const section = document.getElementById('contact');
    const secR = section.getBoundingClientRect();
    const colTop = col.getBoundingClientRect().top - secR.top;
    const footer = section.lastElementChild;
    const footH = footer ? footer.offsetHeight : 0;
    const secH = Math.min(secR.height, window.innerHeight);
    const availH = secH - colTop - footH - (row ? row.offsetHeight : 0) - 44;
    heading.style.fontSize = '100px';
    const w = heading.getBoundingClientRect().width;
    if (w > 0 && colW > 0) {
      let fs = 100 * colW / w;
      if (availH > 100) fs = Math.min(fs, availH / 1.85);
      heading.style.fontSize = fs + 'px';
    }
  };
  sizeContact();
  window.addEventListener('resize', sizeContact);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeContact);
  setTimeout(sizeContact, 300);
  setTimeout(sizeExpDescs, 300);
  setTimeout(sizeExpDescs, 1000);

  // ── signal-in-noise canvas ──
  (() => {
    const canvas = document.getElementById('signalCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const N = 460;
    const noise = new Float32Array(N);
    const target = new Float32Array(N);
    for (let i = 0; i < N; i++) { noise[i] = Math.random() * 2 - 1; target[i] = Math.random() * 2 - 1; }

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      if (!W || !H) return;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const render = (t, c) => {
      if (!W || !H) { resize(); if (!W || !H) return; }
      const mid = H * 0.5;
      const sigAmp = H * 0.15;
      const noiseAmp = H * 0.34 * (1 - c);
      const time = t * 0.001;
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const x = (i / (N - 1)) * W;
        const s = Math.sin(i / N * Math.PI * 6 + time * 0.8) * 0.72
                + Math.sin(i / N * Math.PI * 2.3 - time * 0.4) * 0.28;
        const y = mid - (s * sigAmp + noise[i] * noiseAmp);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.lineJoin = 'round';
      const glow = Math.pow(c, 3);
      // base stroke — always drawn, brightness scales smoothly with clarity
      ctx.strokeStyle = 'rgba(245, 240, 235, ' + (0.14 + c * 0.5) + ')';
      ctx.lineWidth = 1 + c * 1.7;
      ctx.stroke();
      // additive bloom on top, fades in/out continuously from zero
      if (glow > 0.001) {
        ctx.save();
        ctx.shadowColor = 'rgba(245, 240, 235, ' + (0.9 * glow) + ')';
        ctx.shadowBlur = 26 * glow;
        ctx.strokeStyle = 'rgba(245, 240, 235, ' + (0.45 * glow) + ')';
        ctx.lineWidth = 1 + c * 1.7 + glow * 1.4;
        ctx.stroke();
        ctx.restore();
      }
    };

    if (!motion) {
      render(0, 1);
      return;
    }

    const CYCLE = 11000;
    const start = performance.now();
    const draw = (t) => {
      const p = ((t - start) % CYCLE) / CYCLE;
      let clarity;
      if (p < 0.3) clarity = p / 0.3;                      // noise → signal
      else if (p < 0.5) clarity = 1;                       // hold: signal found
      else if (p < 0.85) clarity = 1 - (p - 0.5) / 0.35;   // signal → noise
      else clarity = 0;                                    // hold: pure noise
      const c = clarity * clarity * (3 - 2 * clarity);
      for (let i = 0; i < N; i++) {
        noise[i] += (target[i] - noise[i]) * 0.09;
        if (Math.abs(target[i] - noise[i]) < 0.04) target[i] = Math.random() * 2 - 1;
      }
      render(t, c);
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  })();

  // ── rAF loop: cursor lerp, skew-on-scroll, parallax ──
  let lastY = window.scrollY;
  let skew = 0;
  const loop = () => {
    // cursor
    pos.dx += (mouse.x - pos.dx) * 0.55;
    pos.dy += (mouse.y - pos.dy) * 0.55;
    pos.rx += (mouse.x - pos.rx) * 0.16;
    pos.ry += (mouse.y - pos.ry) * 0.16;
    dot.style.transform = 'translate(' + pos.dx + 'px,' + pos.dy + 'px)';
    ring.style.transform = 'translate(' + pos.rx + 'px,' + pos.ry + 'px)';
    // skew on scroll velocity
    if (motion) {
      const y = window.scrollY;
      const vel = y - lastY;
      lastY = y;
      const target = Math.max(-3.5, Math.min(3.5, vel * 0.09));
      skew += (target - skew) * 0.12;
      skewWrap.style.transform = 'skewY(' + skew.toFixed(3) + 'deg)';
      // hero parallax
      if (y < window.innerHeight * 1.4) {
        heroType.style.transform = 'translateY(' + (y * 0.14) + 'px)';
        sigStamp.style.transform = 'translateY(' + (y * -0.1) + 'px)';
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
