
/* ============================
   SECTION 04: 3대통합기능 로테이션
   ============================ */
(function() {
  var slides  = document.querySelectorAll('.feat04-slide');
  var imgs    = document.querySelectorAll('.feat04-img');
  var counter = document.getElementById('feat04Counter');
  var btn     = document.getElementById('feat04PlayPause');
  if (!slides.length) return;

  var idx     = 0;
  var paused  = false;
  var timer   = null;
  var total   = slides.length;

  function goTo(next) {
    slides[idx].classList.remove('active');
    if (imgs[idx]) imgs[idx].classList.remove('active');
    idx = next % total;
    slides[idx].classList.add('active');
    if (imgs[idx]) imgs[idx].classList.add('active');
    if (counter) counter.innerHTML = '<strong>' + (idx + 1) + '</strong> / ' + total;
  }

  function start() {
    timer = setInterval(function() { goTo(idx + 1); }, 5000);
  }

  var btnPrev = document.getElementById('feat04Prev');
  var btnNext = document.getElementById('feat04Next');

  if (btn) {
    btn.addEventListener('click', function() {
      paused = !paused;
      var iconPause = btn.querySelector('.icon-pause');
      var iconPlay  = btn.querySelector('.icon-play');
      if (paused) {
        clearInterval(timer);
        if (iconPause) iconPause.style.display = 'none';
        if (iconPlay)  iconPlay.style.display  = '';
      } else {
        start();
        if (iconPause) iconPause.style.display = '';
        if (iconPlay)  iconPlay.style.display  = 'none';
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', function() {
      clearInterval(timer);
      goTo((idx - 1 + total) % total);
      if (!paused) start();
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', function() {
      clearInterval(timer);
      goTo(idx + 1);
      if (!paused) start();
    });
  }

  start();
})();

/* 초기 로드 플래시 방지 — 첫 프레임 후 preload 제거 */
requestAnimationFrame(function() {
  requestAnimationFrame(function() {
    document.body.classList.remove('preload');
  });
});

/* ============================
   BENTO TYPEWRITER
   ============================ */
(function() {
  var elKr = document.querySelector('.bento-tw-kr');
  var elEn = document.querySelector('.bento-tw-en');
  var cursor = document.querySelector('.bento-tw-cursor');
  if (!elKr || !elEn || !cursor) return;

  var krTexts = [
    '문서를 자동으로 등록하는 ',
    '법규를 자동으로 매핑하는 ',
    '위험을 자동으로 분석하는 ',
    '보고서를 자동 생성하는 ',
  ];
  var enText = 'DUEGO SAFER AI';
  var idx = 0;
  var frameInterval = 70;
  var resolvePerFrame = 1;
  var scrambleOnly = 4;
  var blinkDuration = 4000;

  function rnd(p) { return p[Math.floor(Math.random() * p.length)]; }

  function scrambleIn(targetEl, text, onDone) {
    var pool = text.replace(/\s/g, '') || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var resolvedCount = 0;
    var frame = 0;

    function render() {
      frame++;
      if (frame > scrambleOnly) {
        resolvedCount = Math.min(resolvedCount + resolvePerFrame, text.length);
      }
      var out = '';
      for (var i = 0; i < text.length; i++) {
        if (/\s/.test(text[i])) { out += text[i]; }
        else if (i < resolvedCount) { out += text[i]; }
        else { out += Math.random() < 0.5 ? rnd(pool) : text[i]; }
      }
      targetEl.textContent = out;
      if (resolvedCount >= text.length) {
        targetEl.textContent = text;
        if (onDone) onDone();
      } else {
        setTimeout(render, frameInterval);
      }
    }
    render();
  }

  function next() {
    cursor.classList.remove('blink');
    cursor.style.opacity = '0';
    elEn.textContent = '';
    scrambleIn(elKr, krTexts[idx], function() {
      elEn.textContent = enText;
      cursor.style.opacity = '1';
      cursor.classList.add('blink');
      setTimeout(function() {
        idx = (idx + 1) % krTexts.length;
        next();
      }, blinkDuration);
    });
  }

  next();
})();

/* ============================
   HERO CANVAS ANIMATION
   ============================ */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const DOT_SPACING = 52;
  const DOT_RADIUS = 2.2;
  const INFLUENCE_RADIUS = 270;
  const MAX_DISPLACEMENT = 80;

  // 수평 orb: 고정 Y 레인 / 수직 orb: 고정 X 레인
  const orbs = [
    { x: 300,  y: 75,  vx:  2.5, vy: 0,   r: 7, color: '#e03131', rgb: [224, 49,  49]  },
    { x: 1100, y: 420, vx: -2.3, vy: 0,   r: 7, color: '#2f9e44', rgb: [47,  158, 68]  },
    { x: 200,  y: 300, vx: 0,   vy:  2.2, r: 7, color: '#f08c00', rgb: [240, 140, 0]   },
    { x: 1200, y: 100, vx: 0,   vy:  2.0, r: 7, color: '#e03131', rgb: [224, 49,  49]  },
  ];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function update() {
    const maxY = canvas.height;
    orbs.forEach(o => {
      o.x += o.vx;
      o.y += o.vy;
      if (o.x < -40)              o.x = canvas.width + 40;
      if (o.x > canvas.width + 40) o.x = -40;
      if (o.y < -40)              o.y = maxY + 40;
      if (o.y > maxY + 40)        o.y = -40;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cols = Math.ceil(canvas.width  / DOT_SPACING) + 2;
    const rows = Math.ceil(canvas.height / DOT_SPACING) + 2;
    const t = Date.now() / 1000;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const bx = c * DOT_SPACING;
        const by = r * DOT_SPACING;

        const wave = Math.sin(t * 0.5 + bx * 0.007 + by * 0.005);

        let dx = 0, dy = 0, bestFactor = 0, bestRgb = null;

        orbs.forEach(o => {
          const ex = bx - o.x;
          const ey = by - o.y;
          const dist = Math.sqrt(ex * ex + ey * ey);
          if (dist < INFLUENCE_RADIUS && dist > 0) {
            const linear = 1 - dist / INFLUENCE_RADIUS;
            const factor = linear * linear;
            if (factor > bestFactor) {
              bestFactor = factor;
              bestRgb = o.rgb;
              dx = (ex / dist) * factor * MAX_DISPLACEMENT;
              dy = (ey / dist) * factor * MAX_DISPLACEMENT;
            }
          }
        });

        let cr, cg, cb, alpha;
        if (bestFactor > 0) {
          cr = Math.round(bestRgb[0] * bestFactor + 140 * (1 - bestFactor));
          cg = Math.round(bestRgb[1] * bestFactor + 140 * (1 - bestFactor));
          cb = Math.round(bestRgb[2] * bestFactor + 140 * (1 - bestFactor));
          alpha = 0.45 + bestFactor * 0.5;
        } else {
          cr = 140; cg = 140; cb = 140;
          alpha = 0.5 + wave * 0.25;
        }

        const dotSize = DOT_RADIUS + bestFactor * 0.9;
        ctx.beginPath();
        ctx.arc(bx + dx, by + dy, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.fill();
      }
    }

    orbs.forEach(o => {
      const glow = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * 2);
      glow.addColorStop(0,   o.color + '40');
      glow.addColorStop(1,   o.color + '00');
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r * 2, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = o.color;
      ctx.fill();
    });
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  loop();
})();

/* ============================
   SCROLL: STICKY HEADER
   ============================ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

/* ============================
   SCROLL: FADE-IN ANIMATIONS
   ============================ */
const fadeTargets = document.querySelectorAll('.fade-in, .fade-in-up');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

fadeTargets.forEach(el => revealObserver.observe(el));

/* ============================
   BENTO GRID: 스태거드 등장
   ============================ */
(function() {
  const bentoCards = document.querySelectorAll('.bento-grid .bento-card');
  if (!bentoCards.length) return;
  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('bento-in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  bentoCards.forEach(function(card, i) {
    var cardDelay = i * 0.12;
    card.style.transitionDelay = cardDelay + 's';
    card.querySelectorAll('img').forEach(function(img) {
      img.style.transitionDelay = (cardDelay + 0.5) + 's';
    });
    obs.observe(card);
  });
})();

function initOrbitRing(ringId, visualSelector, initialLabels) {
  var ring = document.getElementById(ringId);
  if (!ring) return;
  var ringDots = ring.querySelectorAll('.ring-dot03');
  var labelPs  = document.querySelectorAll(visualSelector + ' .orbit-label03 p');
  var labels = initialLabels.slice();
  var focusSeq = [0, 3, 2, 1];
  var step = 0;
  var ringAngle = 0;

  function applyFocus(idx) {
    ringDots.forEach(function(d, i) { d.classList.toggle('focus', i === idx); });
  }
  applyFocus(0);

  setInterval(function() {
    ringAngle += 90;
    ring.style.transform = 'rotate(' + ringAngle + 'deg)';
    step = (step + 1) % 4;
    applyFocus(focusSeq[step]);
    labels.unshift(labels.pop());
    labelPs.forEach(function(p) { p.style.opacity = '0'; });
    setTimeout(function() {
      labelPs.forEach(function(p, i) { p.innerHTML = labels[i]; p.style.opacity = '1'; });
    }, 280);
  }, 2500);
}

initOrbitRing('orbitRing03', '.feature03-visual', [
  '고도화된<br>인프라',
  '세계적인 위협<br>분석 역량',
  '실시간 위험<br>감지 시스템',
  '전체 비즈니스<br>보호'
]);

function initOrbitRing3(ringId, visualSelector, initialLabels, initialVideos, textContainerId) {
  var ring = document.getElementById(ringId);
  if (!ring) return;
  var ringDots = ring.querySelectorAll('.ring-dot03');
  var labelPs  = document.querySelectorAll(visualSelector + ' .orbit-label03 p');
  var videoEl  = document.querySelector(visualSelector + ' video');
  var slides   = textContainerId ? document.querySelectorAll('#' + textContainerId + ' .feat03b-slide') : null;
  var labels = initialLabels.slice();
  var videos = initialVideos ? initialVideos.slice() : null;
  var slideIndices = [0, 1, 2];
  var focusSeq = [0, 2, 1];
  var step = 0;
  var ringAngle = 0;

  function applyFocus(idx) {
    ringDots.forEach(function(d, i) { d.classList.toggle('focus', i === idx); });
  }
  applyFocus(0);

  setInterval(function() {
    ringAngle += 120;
    ring.style.transform = 'rotate(' + ringAngle + 'deg)';
    step = (step + 1) % 3;
    applyFocus(focusSeq[step]);
    labels.unshift(labels.pop());
    if (videos) videos.unshift(videos.pop());
    slideIndices.unshift(slideIndices.pop());
    labelPs.forEach(function(p) { p.style.opacity = '0'; });
    setTimeout(function() {
      labelPs.forEach(function(p, i) { p.innerHTML = labels[i]; p.style.opacity = '1'; });
      if (videos && videoEl) {
        videoEl.src = videos[0];
        videoEl.load();
        videoEl.play();
      }
      if (slides) {
        slides.forEach(function(s, i) {
          s.classList.toggle('active', i === slideIndices[0]);
        });
      }
    }, 280);
  }, 4000);
}

initOrbitRing3('orbitRing03b', '.feature03b-visual',
  [
    '안전보건 데이터<br>국가공인 보안',
    '대한민국<br>안전보건관리 No.1',
    '안전전문 경력 18년<br>되고시스템'
  ],
  [
    'video/001.mp4',
    'video/002.mp4',
    'video/003.mp4'
  ],
  'featureText03b'
);

/* ============================
   USE CASES TABS
   ============================ */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const panel = document.getElementById('tab-' + target);
    if (panel) panel.classList.add('active');
  });
});

/* ============================
   TESTIMONIALS CAROUSEL
   ============================ */
(function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  const visibleCount = getVisibleCount();
  let current = 0;
  let autoplayTimer = null;

  function getVisibleCount() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 900) return 2;
    return 3;
  }

  const totalSlides = Math.ceil(cards.length / getVisibleCount());

  // Build dots
  function buildDots() {
    dotsContainer.innerHTML = '';
    const count = Math.ceil(cards.length / getVisibleCount());
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === current ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    const count = Math.ceil(cards.length / getVisibleCount());
    current = (index + count) % count;

    const cardWidth = cards[0].offsetWidth + 24; // 24 = gap
    const offset = current * getVisibleCount() * cardWidth;
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });

  function startAutoplay() {
    autoplayTimer = setInterval(next, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  track.addEventListener('mouseleave', startAutoplay);

  // Touch swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      resetAutoplay();
    }
  });

  // Reflow on resize
  window.addEventListener('resize', () => {
    buildDots();
    goTo(0);
  });

  buildDots();
  startAutoplay();
})();

/* ============================
   EMAIL FORM: HERO
   ============================ */
const emailForm = document.querySelector('.hero-email-form');
if (emailForm) {
  const submitBtn = emailForm.querySelector('.email-submit');
  const input = emailForm.querySelector('.email-input');

  submitBtn.addEventListener('click', () => {
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
      input.focus();
      input.style.outline = '2px solid #ff4444';
      setTimeout(() => { input.style.outline = ''; }, 1200);
      return;
    }
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Qualifying...';
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      input.value = '';
    }, 2500);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitBtn.click();
  });
}

/* ============================
   ANIMATED DASHBOARD
   ============================ */
(function initAnimDashboard() {
  const el = document.getElementById('animDB');
  if (!el) return;

  function animateCount(node, target, opts) {
    opts = opts || {};
    var duration = opts.duration || 1000;
    var decimals = opts.decimals || 0;
    var suffix = opts.suffix || '';
    var delay = opts.delay || 0;
    setTimeout(function() {
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        node.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else node.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(step);
    }, delay);
  }

  var obs = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      el.classList.add('is-visible');
      obs.disconnect();

      // 캐릭터 이미지: 대시보드 헤더 등장 직후 슬라이드업
      var character = document.querySelector('.hero-character');
      if (character) {
        setTimeout(function() {
          character.classList.add('is-visible');
        }, 600);
      }

      // 도넛 중앙 숫자 카운트업
      var donutNum = el.querySelector('.db2-donut-center b');
      if (donutNum) animateCount(donutNum, 72, { duration: 1100, delay: 900 });

      // 통계 카드 퍼센트 카운트업
      el.querySelectorAll('.db2-stat-value').forEach(function(node, i) {
        var target = parseFloat(node.textContent);
        if (isNaN(target)) return;
        animateCount(node, target, { duration: 1000, decimals: 1, suffix: '%', delay: 1350 + i * 90 });
      });
    }
  }, { threshold: 0.15 });
  obs.observe(el);
})();

/* ============================
   SOLUTION GRID ANIMATION
   ============================ */
(function initSolGrid() {
  const visual = document.querySelector('.pcard-visual--solution');
  if (!visual) return;
  let t1 = null, t2 = null;
  const obs = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      t1 = setTimeout(function() { visual.classList.add('sol-active'); }, 1000);
      t2 = setTimeout(function() { visual.classList.add('sol-idle'); }, 3500);
    } else {
      clearTimeout(t1); clearTimeout(t2);
      visual.classList.remove('sol-active', 'sol-idle');
    }
  }, { threshold: 0.2 });
  obs.observe(visual);
})();

/* ============================
   BADGE POUR ANIMATION
   ============================ */
(function initBadgePour() {
  const visual = document.querySelector('.problem-card--dark .pcard-visual');
  if (!visual) return;
  let t = null;
  const obs = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      visual.classList.add('badges-active');
      t = setTimeout(function() { visual.classList.add('badges-idle'); }, 3000);
    } else {
      clearTimeout(t);
      visual.classList.remove('badges-active', 'badges-idle');
    }
  }, { threshold: 0.25 });
  obs.observe(visual);
})();

/* ============================
   MOBILE HAMBURGER
   ============================ */
const hamburger = document.getElementById('navHamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });
}
