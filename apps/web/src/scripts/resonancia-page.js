/** Auto-ported page script for resonancia */
export function initResonanciaPage() {
  const gsap = window.gsap;
  const Motion = window.Motion;
  if (!gsap || !Motion) {
    console.warn('[resonancia] gsap/Motion missing');
    return;
  }
  (function () {
      Motion.injectCurtainStyles();
      Motion.playEnter();
      Motion.bindInternalLinks();
      Motion.ensureMuteButton(document.querySelector('.links'));
      Motion.bindTopnavScroll(document.querySelector('.topbar'));
  
      const mobileMq = window.matchMedia('(max-width: 1000px)');
      const isMobile = () => mobileMq.matches;
      // Unlock audio on first gesture (browser autoplay policy)
      const unlockAudio = () => {
        Motion.Audio.ensure();
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
  
      const SIGNALS = window.__SIGNALS__;
      if (!SIGNALS?.length) {
        console.warn('[resonancia] window.__SIGNALS__ missing');
        return;
      }
  
      const TOL = 0.055;
      const LOCK_MS = 1400;
      const PARTICLE_COUNT = 18;
      const reducedMotion = Motion.prefersReduced();
      const locked = new Set();
      let current = 0;
      let freq = 0.42;
      let amp = 0.35;
      let lockProgress = 0;
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      let phase = 0;
      let capturing = false;
      let coreVisible = false;
      let ringBreathTween = null;
      let innerBreathTween = null;
      let coreTween = null;
      let pendingAfterTx = false;
      const keys = Object.create(null);
  
      const els = {
        progress: document.getElementById('progress-num'),
        title: document.getElementById('target-title'),
        hint: document.getElementById('target-hint'),
        freqVal: document.getElementById('freq-val'),
        ampVal: document.getElementById('amp-val'),
        freqFill: document.getElementById('freq-fill'),
        ampFill: document.getElementById('amp-fill'),
        freqMeter: document.getElementById('freq-meter'),
        ampMeter: document.getElementById('amp-meter'),
        lockFill: document.getElementById('lock-fill'),
        lockLabel: document.getElementById('lock-label'),
        list: document.getElementById('signal-list'),
        chips: document.getElementById('signal-chips'),
        tx: document.getElementById('tx-panel'),
        txBody: document.getElementById('tx-body'),
        txBackdrop: document.getElementById('tx-backdrop'),
        txClose: document.getElementById('tx-close'),
        status: document.getElementById('status-line'),
        hintCenter: document.getElementById('center-hint'),
        flash: document.getElementById('flash'),
        banner: document.getElementById('capture-banner'),
        fallback: document.getElementById('fallback'),
        live: document.getElementById('wave-live'),
        fill: document.getElementById('wave-fill'),
        target: document.getElementById('wave-target'),
        ringOuter: document.getElementById('ring-outer'),
        ringInner: document.getElementById('ring-inner'),
        core: document.getElementById('core-dot'),
        particles: document.getElementById('particles'),
        ambient: document.getElementById('ambient')
      };

      const CORE = { outer: 54, inner: 28, dot: 6, outerBreath: 62, innerBreath: 32 };
      const defaultCenterHint = els.hintCenter.innerHTML;
      const matchCenterHint = '<strong>En banda</strong> · mantén la posición para capturar';
  
      function showFallback() {
        els.fallback.classList.add('visible');
        els.fallback.innerHTML = `
          <h1>Resonancia</h1>
          <p class="lead">Versión sin animación. Las mismas cinco señales.</p>
          ${SIGNALS.map((s, i) => `<article class="fb-card" data-od-id="fb-${s.id}"><p class="eyebrow" style="color:var(--accent);font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 8px">Señal 0${i + 1}</p>${s.body}</article>`).join('')}
          <p style="margin-top:24px"><a href="${(window.__BASE__ || '/')}expediente/" style="color:var(--accent)">← Volver al expediente</a></p>
        `;
        document.getElementById('ui').style.display = 'none';
        document.getElementById('stage').style.display = 'none';
        Motion.bindInternalLinks(els.fallback);
      }
  
      if (reducedMotion) {
        showFallback();
        return;
      }
  
      // Wave particles
      const particleEls = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('r', String(1.5 + (i % 3) * 0.6));
        c.setAttribute('class', 'particle');
        c.setAttribute('cx', '0');
        c.setAttribute('cy', '0');
        els.particles.appendChild(c);
        particleEls.push({ el: c, t: i / PARTICLE_COUNT, speed: 0.002 + (i % 5) * 0.0004 });
      }
  
      // Ambient motes
      for (let i = 0; i < 14; i++) {
        const m = document.createElement('span');
        m.className = 'mote';
        els.ambient.appendChild(m);
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        gsap.set(m, { left: x + '%', top: y + '%', opacity: 0 });
        gsap.to(m, {
          opacity: 0.15 + Math.random() * 0.25,
          y: -40 - Math.random() * 80,
          duration: 4 + Math.random() * 5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 3
        });
      }
  
      function wavePoint(f, a, ph, t) {
        const w = 900;
        const mid = 170;
        const ampPx = 18 + a * 110;
        const cycles = 1.2 + f * 4.5;
        const x = t * w;
        const y = mid + Math.sin(t * Math.PI * 2 * cycles + ph) * ampPx * Math.sin(Math.PI * t);
        return { x, y };
      }
  
      function wavePath(f, a, ph, closed) {
        const steps = 48;
        let d = '';
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const p = wavePoint(f, a, ph, t);
          d += (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ' ';
        }
        if (closed) d += 'L 900 340 L 0 340 Z';
        return d;
      }
  
      function drawWaves() {
        const s = SIGNALS[current];
        els.live.setAttribute('d', wavePath(freq, amp, phase, false));
        els.fill.setAttribute('d', wavePath(freq, amp, phase, true));
        els.target.setAttribute('d', wavePath(s.freq, s.amp, 0, false));
  
        particleEls.forEach((p) => {
          p.t = (p.t + p.speed) % 1;
          const pt = wavePoint(freq, amp, phase, p.t);
          p.el.setAttribute('cx', pt.x.toFixed(1));
          p.el.setAttribute('cy', pt.y.toFixed(1));
        });
      }
  
      function renderList() {
        els.list.innerHTML = SIGNALS.map((s, i) => {
          const isLocked = locked.has(s.id);
          const isActive = i === current && !isLocked;
          return `<div class="sig ${isLocked ? 'locked' : ''}" data-od-id="sig-${s.id}">
            <span class="idx">0${i + 1}</span>
            <span class="name">${s.short}</span>
            <span class="state">${isLocked ? 'capturada' : isActive ? 'activa' : 'en espera'}</span>
          </div>`;
        }).join('');
        renderChips();
      }

      function renderChips() {
        if (!els.chips) return;
        els.chips.innerHTML = SIGNALS.map((s, i) => {
          const isLocked = locked.has(s.id);
          const isActive = i === current;
          return `<button type="button" class="sig-chip ${isLocked ? 'locked' : ''} ${isActive ? 'active' : ''}" data-idx="${i}" aria-pressed="${isActive}" aria-label="Señal 0${i + 1}: ${s.short}">
            <span class="chip-idx">0${i + 1}</span>
            <span class="chip-name">${s.short}</span>
          </button>`;
        }).join('');
        els.chips.querySelectorAll('.sig-chip').forEach((btn) => {
          btn.addEventListener('click', () => {
            const idx = Number(btn.dataset.idx);
            if (locked.has(SIGNALS[idx].id)) return;
            setCurrent(idx);
          });
        });
      }

      function openTxSheet() {
        els.tx.removeAttribute('hidden');
        els.tx.classList.add('visible');
        if (isMobile()) {
          els.tx.classList.add('is-open');
          els.txBackdrop?.removeAttribute('hidden');
          els.txBackdrop?.classList.add('is-open');
          gsap.fromTo(els.tx, { y: '105%' }, { y: '0%', duration: 0.55, ease: 'power3.out' });
          gsap.fromTo(els.txBackdrop, { opacity: 0 }, { opacity: 1, duration: 0.28 });
        } else {
          gsap.fromTo(els.tx, { opacity: 0, y: 28, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out' });
        }
      }

      function closeTxSheet() {
        return new Promise((resolve) => {
          if (!els.tx.classList.contains('visible')) {
            resolve();
            return;
          }
          if (isMobile()) {
            gsap.to(els.tx, {
              y: '105%',
              duration: 0.35,
              ease: 'power2.in',
              onComplete: () => {
                els.tx.classList.remove('visible', 'is-open');
                els.tx.setAttribute('hidden', '');
                els.txBackdrop?.classList.remove('is-open');
                els.txBackdrop?.setAttribute('hidden', '');
                gsap.set(els.tx, { clearProps: 'y' });
                resolve();
              }
            });
            gsap.to(els.txBackdrop, { opacity: 0, duration: 0.25 });
          } else {
            gsap.to(els.tx, {
              opacity: 0,
              y: 12,
              scale: 0.98,
              duration: 0.3,
              ease: 'power2.in',
              onComplete: () => {
                els.tx.classList.remove('visible');
                els.tx.setAttribute('hidden', '');
                resolve();
              }
            });
          }
        });
      }

      function finishTxReading() {
        if (!pendingAfterTx) return;
        pendingAfterTx = false;
        gsap.delayedCall(0.15, nextPending);
      }
  
      function setCurrent(i) {
        current = i;
        const s = SIGNALS[current];
        els.title.textContent = s.title;
        els.freqMeter.style.setProperty('--target', (s.freq * 100) + '%');
        els.ampMeter.style.setProperty('--target', (s.amp * 100) + '%');
        lockProgress = 0;
        if (locked.size === SIGNALS.length) {
          els.hint.textContent = 'Todas las señales capturadas. Puedes volver a pulsar o abrir el expediente.';
          els.hintCenter.innerHTML = '<strong>Listo</strong> · las 5 señales están abiertas';
        } else if (locked.has(s.id)) {
          els.hint.textContent = 'Esta señal ya está capturada. Pulsa N para saltar a la siguiente pendiente.';
        } else {
          els.hint.textContent = 'Alinea frecuencia y amplitud con las marcas. Mantén el bloqueo para capturar.';
        }
        renderList();
        gsap.fromTo(els.title, { opacity: 0.4, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
      }
  
      function nextPending() {
        for (let i = 0; i < SIGNALS.length; i++) {
          const idx = (current + 1 + i) % SIGNALS.length;
          if (!locked.has(SIGNALS[idx].id)) {
            setCurrent(idx);
            return;
          }
        }
        setCurrent(0);
      }
  
      function capture() {
        const s = SIGNALS[current];
        if (locked.has(s.id) || capturing) return;
        capturing = true;
        locked.add(s.id);
        els.progress.textContent = String(locked.size);
        els.txBody.innerHTML = s.body;
        els.status.textContent = `Transmisión capturada · ${s.short}`;
        Motion.bindInternalLinks(els.txBody);
  
        killCoreTween();
        ringBreathTween?.pause();
        innerBreathTween?.pause();
        coreVisible = true;

        els.banner.textContent = s.short;
        gsap.set(els.hintCenter, { opacity: 1, y: 0 });
        els.hintCenter.innerHTML = defaultCenterHint;
        gsap.set(els.ringOuter, { attr: { r: 12 }, opacity: 0 });
        gsap.set(els.ringInner, { attr: { r: 6 }, opacity: 0 });
        gsap.set(els.core, { attr: { r: 0 }, opacity: 0 });

        Motion.Audio.capture(locked.size - 1);
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => {
            capturing = false;
            coreVisible = false;
            resetCoreHidden();
            if (isMobile()) {
              pendingAfterTx = true;
            } else {
              gsap.delayedCall(0.55, nextPending);
            }
          }
        });

        tl
          .fromTo(els.flash, { opacity: 0.7 }, { opacity: 0, duration: 0.7 }, 0)
          .fromTo(els.banner, { opacity: 0, scale: 0.82, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.58, ease: 'back.out(1.5)' }, 0)
          .fromTo(els.ringOuter, { attr: { r: 12 }, opacity: 0 }, { attr: { r: 88 }, opacity: 1, duration: 0.58, ease: 'back.out(1.6)' }, 0)
          .fromTo(els.ringInner, { attr: { r: 6 }, opacity: 0 }, { attr: { r: 44 }, opacity: 1, duration: 0.52, ease: 'back.out(1.6)' }, 0.06)
          .fromTo(els.core, { attr: { r: 0 }, opacity: 0 }, { attr: { r: 10 }, opacity: 1, duration: 0.46, ease: 'back.out(2)' }, 0.1)
          .to(els.banner, { opacity: 0, scale: 0.9, y: -28, duration: 0.48, ease: 'power2.in' }, 0.82)
          .to(els.ringOuter, { attr: { r: 14 }, opacity: 0, duration: 0.48, ease: 'power2.in' }, 0.82)
          .to(els.ringInner, { attr: { r: 7 }, opacity: 0, duration: 0.44, ease: 'power2.in' }, 0.86)
          .to(els.core, { attr: { r: 0 }, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0.9)
          .add(() => openTxSheet(), 0.15)
          .fromTo(particleEls.map((p) => p.el), { opacity: 0.2 }, {
            opacity: 1, duration: 0.2, stagger: 0.02, yoyo: true, repeat: 1
          }, 0);
  
        // Burst motes from center
        for (let i = 0; i < 10; i++) {
          const m = document.createElement('span');
          m.className = 'mote';
          els.ambient.appendChild(m);
          gsap.set(m, {
            left: '50%', top: '45%', opacity: 0.9, scale: 1
          });
          gsap.to(m, {
            x: (Math.random() - 0.5) * 260,
            y: (Math.random() - 0.5) * 180,
            opacity: 0,
            scale: 0.2,
            duration: 0.85,
            ease: 'power2.out',
            onComplete: () => m.remove()
          });
        }
  
        renderList();
      }
  
      function killCoreTween() {
        coreTween?.kill();
        coreTween = null;
      }

      function resetCoreHidden() {
        gsap.set(els.ringOuter, { attr: { r: 10 }, opacity: 0 });
        gsap.set(els.ringInner, { attr: { r: 5 }, opacity: 0 });
        gsap.set(els.core, { attr: { r: 0 }, opacity: 0 });
      }

      function startCoreBreath() {
        if (ringBreathTween) {
          ringBreathTween.play();
          innerBreathTween.play();
          return;
        }
        ringBreathTween = gsap.to(els.ringOuter, {
          attr: { r: CORE.outerBreath }, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut'
        });
        innerBreathTween = gsap.to(els.ringInner, {
          attr: { r: CORE.innerBreath }, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.2
        });
      }

      function showCoreMatch() {
        if (coreVisible || capturing) return;
        coreVisible = true;
        killCoreTween();
        ringBreathTween?.pause();
        innerBreathTween?.pause();

        coreTween = gsap.timeline({
          onComplete: () => {
            coreTween = null;
            startCoreBreath();
          }
        });

        coreTween
          .to(els.hintCenter, {
            opacity: 0, y: 10, duration: 0.22, ease: 'power2.in',
            onComplete: () => { els.hintCenter.innerHTML = matchCenterHint; }
          }, 0)
          .to(els.hintCenter, { opacity: 1, y: 0, duration: 0.48, ease: 'back.out(1.4)' }, 0.18)
          .fromTo(els.ringOuter, { attr: { r: 10 }, opacity: 0 }, { attr: { r: CORE.outer }, opacity: 1, duration: 0.68, ease: 'back.out(1.7)' }, 0.12)
          .fromTo(els.ringInner, { attr: { r: 5 }, opacity: 0 }, { attr: { r: CORE.inner }, opacity: 1, duration: 0.62, ease: 'back.out(1.7)' }, 0.2)
          .fromTo(els.core, { attr: { r: 0 }, opacity: 0 }, { attr: { r: CORE.dot }, opacity: 1, duration: 0.52, ease: 'back.out(2)' }, 0.26);
      }

      function hideCoreMatch() {
        if (!coreVisible || capturing) return;
        coreVisible = false;
        killCoreTween();
        ringBreathTween?.pause();
        innerBreathTween?.pause();

        coreTween = gsap.timeline({
          onComplete: () => {
            coreTween = null;
            resetCoreHidden();
          }
        });

        coreTween
          .to(els.hintCenter, {
            opacity: 0, y: -8, duration: 0.24, ease: 'power2.in',
            onComplete: () => { els.hintCenter.innerHTML = defaultCenterHint; }
          }, 0)
          .to(els.hintCenter, { opacity: 1, y: 0, duration: 0.42, ease: 'power3.out' }, 0.2)
          .to(els.ringOuter, { attr: { r: 10 }, opacity: 0, duration: 0.42, ease: 'power2.in' }, 0)
          .to(els.ringInner, { attr: { r: 5 }, opacity: 0, duration: 0.38, ease: 'power2.in' }, 0.05)
          .to(els.core, { attr: { r: 0 }, opacity: 0, duration: 0.34, ease: 'power2.in' }, 0.1);
      }

      function pulseCore() {
        if (!coreVisible) return;
        gsap.fromTo([els.ringOuter, els.ringInner, els.core], {
          opacity: 0.4
        }, {
          opacity: 1, duration: 0.35, stagger: 0.05, yoyo: true, repeat: 1, ease: 'power2.inOut'
        });
        phase += 1.2;
        Motion.Audio.pulse();
      }
  
      function updateMeters(dt) {
        const s = SIGNALS[current];
        els.freqVal.textContent = freq.toFixed(2);
        els.ampVal.textContent = amp.toFixed(2);
        gsap.set(els.freqFill, { width: (freq * 100) + '%' });
        gsap.set(els.ampFill, { width: (amp * 100) + '%' });
  
        const inBand = Math.abs(freq - s.freq) < TOL && Math.abs(amp - s.amp) < TOL && !locked.has(s.id) && !capturing;
        if (!capturing) {
          if (inBand) showCoreMatch();
          else hideCoreMatch();
        }
        els.freqMeter.classList.toggle('in-band', inBand);
        els.ampMeter.classList.toggle('in-band', inBand);
  
        if (inBand) {
          lockProgress = Math.min(1, lockProgress + dt / LOCK_MS);
          els.lockLabel.textContent = lockProgress >= 1 ? 'capturando…' : 'en banda';
          els.lockLabel.style.color = 'var(--ok)';
          els.status.textContent = 'Bloqueo estable — mantén la posición';
        } else {
          lockProgress = Math.max(0, lockProgress - dt / 500);
          els.lockLabel.textContent = 'fuera de banda';
          els.lockLabel.style.color = '';
          if (!locked.has(s.id)) els.status.textContent = 'Onda en espera…';
        }
        gsap.set(els.lockFill, { width: (lockProgress * 100) + '%' });
        if (lockProgress >= 1) {
          lockProgress = 0;
          capture();
        }
  
        const dist = Math.abs(freq - s.freq) + Math.abs(amp - s.amp);
        const closeness = Math.max(0, 1 - dist / 0.4);
        const audioLevel = Motion.Audio.level();
        const react = Math.min(1, closeness * 0.75 + audioLevel * 1.4);
  
        els.live.style.stroke = closeness > 0.7 ? 'var(--ok)' : 'var(--accent)';
        els.live.style.strokeWidth = String(3 + react * 2.5);
        els.particles.style.opacity = String(0.35 + react * 0.65);
        els.core.style.filter = react > 0.15
          ? `drop-shadow(0 0 ${6 + react * 18}px var(--accent))`
          : 'none';
  
        Motion.Audio.setProximity(closeness, freq, amp, inBand);
      }
  
      resetCoreHidden();

      // Intro
      gsap.from('#wave-wrap', { opacity: 0, scale: 0.9, duration: 1.1, ease: 'power3.out' });
      gsap.from(['.topbar', '.panel', '.bottom', '.center-hint'], {
        opacity: 0, y: 20, duration: 0.75, stagger: 0.08, ease: 'power3.out', delay: 0.12
      });
      gsap.from(particleEls.map((p) => p.el), {
        opacity: 0, duration: 0.8, stagger: 0.03, delay: 0.4
      });
  
      let last = performance.now();
      function tick(now) {
        const dt = now - last;
        last = now;
        phase += 0.025 + freq * 0.04;
  
        const speed = 0.00055 * dt;
        if (keys.a || keys.ArrowLeft) freq = Math.max(0, freq - speed);
        if (keys.d || keys.ArrowRight) freq = Math.min(1, freq + speed);
        if (keys.w || keys.ArrowUp) amp = Math.min(1, amp + speed);
        if (keys.s || keys.ArrowDown) amp = Math.max(0, amp - speed);
  
        drawWaves();
        updateMeters(dt);
        requestAnimationFrame(tick);
      }
  
      const stage = document.getElementById('stage');
      stage.addEventListener('pointerdown', (e) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        stage.setPointerCapture(e.pointerId);
      });
      stage.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        freq = Math.min(1, Math.max(0, freq + dx * 0.0018));
        amp = Math.min(1, Math.max(0, amp - dy * 0.0018));
      });
      stage.addEventListener('pointerup', () => { dragging = false; });
      stage.addEventListener('pointercancel', () => { dragging = false; });
  
      window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        keys[e.key.toLowerCase()] = true;
        if (e.code === 'Space') { e.preventDefault(); pulseCore(); }
        if (e.key === 'n' || e.key === 'N') nextPending();
      });
      window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
        keys[e.key.toLowerCase()] = false;
      });

      els.txClose?.addEventListener('click', () => {
        closeTxSheet().then(finishTxReading);
      });
      els.txBackdrop?.addEventListener('click', () => {
        closeTxSheet().then(finishTxReading);
      });
  
      setCurrent(0);
      requestAnimationFrame(tick);
    })();
}
