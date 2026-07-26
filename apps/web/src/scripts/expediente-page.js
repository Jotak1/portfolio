/** Expediente page — GSAP scrub + multi-period signal wave (synced from OD polish). */
export function initExpedientePage() {
  const gsap = window.gsap;
  const Motion = window.Motion;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !Motion) {
    console.warn('[expediente] gsap/Motion missing');
    return;
  }

  document.documentElement.classList.add('js-ready');

  Motion.injectCurtainStyles();
  Motion.playEnter();
  Motion.bindInternalLinks();
  Motion.ensureMuteButton(
    document.querySelector('.topnav-actions') || document.querySelector('.topnav-inner')
  );
  Motion.bindTopnavScroll(document.querySelector('.topnav'));

  const reduced = Motion.prefersReduced();
  const wave = document.getElementById('hero-wave');
  const waveHarm = document.getElementById('hero-wave-harm');
  const waveGhost = document.getElementById('hero-wave-ghost');
  const waveFill = document.getElementById('hero-wave-fill');
  const progress = document.getElementById('scroll-progress');
  const track = document.getElementById('timeline-track');
  const pin = document.getElementById('timeline-pin');
  const yearEl = document.getElementById('timeline-year');
  const labelEl = document.getElementById('timeline-label');
  const idxEl = document.getElementById('timeline-idx');
  const fill = document.getElementById('timeline-fill');
  const cards = gsap.utils.toArray('.timeline-card');
  const sectionIds = ['trayectoria', 'stack', 'contacto'];

  gsap.registerPlugin(ScrollTrigger);

  function bindAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
        if (typeof target.focus === 'function') {
          try {
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
          } catch (_) {}
        }
      });
    });
  }

  function syncNavCurrent() {
    const mid = window.scrollY + window.innerHeight * 0.28;
    let current = '';
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.offsetTop <= mid) current = id;
    });
    document.querySelectorAll('.topnav nav a[href^="#"]').forEach((a) => {
      const id = a.getAttribute('href').slice(1);
      if (id && id === current) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  // Same multi-period signal as index Resonancia preview
  const waveState = { amp: 26, phase: 0, breath: 0 };
  const WAVE_W = 280;
  const WAVE_MID = 60;
  const WAVE_STEPS = 56;

  function sampleWave(x, phase, amp, freq, harm = 0) {
    const t = (x / WAVE_W) * Math.PI * 2 * freq + phase;
    const fundamental = Math.sin(t) * amp;
    const overtone = Math.sin(t * 2.15 + 0.4) * amp * harm;
    const ripple = Math.sin(t * 5.2 - phase * 0.6) * amp * 0.12;
    return WAVE_MID + fundamental + overtone + ripple;
  }

  function buildWavePath(phase, amp, freq, harm, closeFill) {
    let d = '';
    for (let i = 0; i <= WAVE_STEPS; i++) {
      const x = (i / WAVE_STEPS) * WAVE_W;
      const y = sampleWave(x, phase, amp, freq, harm);
      d += i === 0 ? `M${x.toFixed(1)} ${y.toFixed(2)}` : ` L${x.toFixed(1)} ${y.toFixed(2)}`;
    }
    if (closeFill) {
      d += ` L${WAVE_W} 120 L0 120 Z`;
    }
    return d;
  }

  function drawWave() {
    const breath = 1 + Math.sin(waveState.breath) * 0.18;
    const amp = waveState.amp * breath;
    const p = waveState.phase;
    if (wave) wave.setAttribute('d', buildWavePath(p, amp, 2.75, 0.28, false));
    if (waveHarm) waveHarm.setAttribute('d', buildWavePath(p * 1.15 + 0.9, amp * 0.55, 3.6, 0.2, false));
    if (waveGhost) waveGhost.setAttribute('d', buildWavePath(p * 0.7 - 0.5, amp * 0.35, 1.6, 0, false));
    if (waveFill) waveFill.setAttribute('d', buildWavePath(p, amp, 2.75, 0.28, true));
  }

  drawWave();
  bindAnchors();
  syncNavCurrent();
  window.addEventListener('scroll', syncNavCurrent, { passive: true });

  if (!reduced) {
    gsap.to(waveState, {
      phase: Math.PI * 6,
      duration: 4.5,
      repeat: -1,
      ease: 'none',
      onUpdate: drawWave
    });
    gsap.to(waveState, {
      amp: 34,
      breath: Math.PI * 2,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      onUpdate: drawWave
    });
  }

  if (reduced) {
    gsap.set('.reveal, .split-char, .split-word', { clearProps: 'all', opacity: 1, y: 0 });
    return;
  }

  // Char split hero — scoped selectors so bio/contacto leads stay visible
  const chars1 = Motion.splitChars(document.getElementById('title-l1'));
  const words2 = Motion.splitWords(document.getElementById('title-l2'));
  const allChars = chars1.concat(words2);
  gsap.set(allChars, { yPercent: 120, opacity: 0 });
  gsap.set('.reveal', { opacity: 0, y: 36 });
  gsap.set('.hero .eyebrow', { opacity: 0, y: 12 });
  gsap.set('.hero .lead', { opacity: 0, y: 16 });
  gsap.set('.hero .hero-cta', { opacity: 0, y: 16 });
  gsap.set('.signal-card', { opacity: 0, y: 40, scale: 0.96 });

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .to('.hero .eyebrow', { opacity: 1, y: 0, duration: 0.55 }, 0.1)
    .to(allChars, {
      yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.016, ease: 'power4.out'
    }, 0.18)
    .to('.hero .lead', { opacity: 1, y: 0, duration: 0.7 }, 0.5)
    .to('.hero .hero-cta', { opacity: 1, y: 0, duration: 0.6 }, 0.65)
    .to('.signal-card', { opacity: 1, y: 0, scale: 1, duration: 0.9 }, 0.35);

  gsap.to('.signal-card', {
    y: -48, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // Horizontal scrub timeline (desktop+); stacked list on narrow viewports
  const mm = gsap.matchMedia();
  mm.add('(min-width: 721px)', () => {
    const getScroll = () => Math.max(0, track.scrollWidth - pin.clientWidth + 80);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => '+=' + getScroll(),
        pin: true,
        scrub: 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)));
          const card = cards[i];
          yearEl.textContent = card.dataset.year;
          labelEl.textContent = card.dataset.label;
          idxEl.textContent = String(i + 1).padStart(2, '0');
          gsap.set(fill, { width: (self.progress * 100) + '%' });
        }
      }
    });

    tl.to(track, { x: () => -getScroll(), ease: 'none' });

    cards.forEach((card, i) => {
      ScrollTrigger.create({
        trigger: pin,
        start: 'top top',
        end: () => '+=' + getScroll(),
        scrub: true,
        onUpdate: (self) => {
          const center = i / (cards.length - 1);
          const dist = Math.abs(self.progress - center);
          const t = Math.max(0, 1 - dist * 2.2);
          gsap.set(card, {
            opacity: 0.4 + t * 0.6,
            scale: 0.94 + t * 0.06
          });
        }
      });
    });

    let lastIdx = 0;
    ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: () => '+=' + getScroll(),
      onUpdate: (self) => {
        const i = Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)));
        if (i !== lastIdx) {
          lastIdx = i;
          gsap.fromTo(yearEl, { y: 24, opacity: 0.35 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
        }
      }
    });
  });

  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  gsap.utils.toArray('[data-od-id^="stack-"] .tag').forEach((tag) => {
    gsap.from(tag, {
      opacity: 0, y: 10, duration: 0.4, ease: 'power2.out',
      scrollTrigger: { trigger: tag.closest('.card'), start: 'top 80%' },
      stagger: 0.04
    });
  });

  gsap.to(progress, {
    width: '100%', ease: 'none',
    scrollTrigger: {
      trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3
    }
  });
}
