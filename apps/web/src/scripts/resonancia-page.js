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
  
      // Unlock audio on first gesture (browser autoplay policy)
      const unlockAudio = () => {
        Motion.Audio.ensure();
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
  
      const SIGNALS = [
        {
          id: 'identidad',
          title: 'Señal 01 · Identidad',
          short: 'Identidad',
          freq: 0.58,
          amp: 0.40,
          body: `
            <h3>Quién soy</h3>
            <p>Ingeniero en Electrónica (INACAP, 2019). Me gusta el desarrollo web: problemas nuevos, aprendizaje continuo y equipos reales.</p>
            <p>Me adapto rápido y trabajo bien en equipo. Padre de familia. Me gusta el deporte, estar al aire libre y el ajedrez.</p>
            <div class="chips"><span class="chip">Chile</span><span class="chip">Full-Stack</span><span class="chip">INACAP 2019</span></div>
          `
        },
        {
          id: 'stack',
          title: 'Señal 02 · Stack',
          short: 'Stack',
          freq: 0.28,
          amp: 0.72,
          body: `
            <h3>Herramientas</h3>
            <p>Construyo de punta a punta: front, APIs y datos en producción.</p>
            <ul>
              <li>React · Vue · Angular · React Native · Ionic</li>
              <li>Node.js · NestJS · Express · Bun</li>
              <li>PostgreSQL · MongoDB · Oracle · Docker · Git</li>
            </ul>
          `
        },
        {
          id: 'correos',
          title: 'Señal 03 · Correos Chile',
          short: 'Correos',
          freq: 0.74,
          amp: 0.55,
          body: `
            <h3>Rol actual</h3>
            <p><strong>Correos Chile</strong> · Desarrollador Full-Stack (ene 2025 – actualidad)</p>
            <p>Modernización de sistemas internos con NestJS, Node.js, React y Vue. Optimización de queries SQL en PostgreSQL y Oracle.</p>
            <div class="chips"><span class="chip">NestJS</span><span class="chip">React</span><span class="chip">Vue</span><span class="chip">PostgreSQL</span></div>
          `
        },
        {
          id: 'trayectoria',
          title: 'Señal 04 · Trayectoria',
          short: 'Trayectoria',
          freq: 0.45,
          amp: 0.22,
          body: `
            <h3>Experiencia previa</h3>
            <p><strong>Amicar S.A.</strong> (2023–2025) — React, Node.js, MongoDB, PostgreSQL · soporte en producción.</p>
            <p><strong>Natural Phone</strong> (2022–2023) — React Native y Vue.</p>
            <p><strong>Haibu / VTR</strong> (2021–2022) — Ionic, Angular, Node.js.</p>
            <p><strong>Soc. Mecánica</strong> (2019–2021) — ingeniería eléctrica + Angular / Node.</p>
          `
        },
        {
          id: 'contacto',
          title: 'Señal 05 · Contacto',
          short: 'Contacto',
          freq: 0.82,
          amp: 0.68,
          body: `
            <h3>Contacto</h3>
            <p>¿Hablamos? Abierto a proyectos full-stack, modernizar sistemas y equipos que necesiten front y back.</p>
            <a class="cta" href="mailto:jp.ausensi@gmail.com">jp.ausensi@gmail.com</a>
            <p style="margin-top:14px;font-family:var(--font-mono);font-size:13px">+56 9 2736 6163</p>
            <div class="chips" style="margin-top:14px">
              <a class="chip" href="https://www.linkedin.com/in/jpas/" target="_blank" rel="noopener">LinkedIn</a>
              <a class="chip" href="https://github.com/Jotak1" target="_blank" rel="noopener">GitHub</a>
              <a class="chip" href="${(window.__BASE__ || '/')}expediente/" data-transition-label="Expediente">Ver expediente</a>
            </div>
          `
        }
      ];
  
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
        tx: document.getElementById('tx-panel'),
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
        els.tx.classList.add('visible');
        els.tx.innerHTML = s.body;
        els.status.textContent = `Transmisión capturada · ${s.short}`;
        Motion.bindInternalLinks(els.tx);
  
        els.banner.textContent = s.short;
        Motion.Audio.capture(locked.size - 1);
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => {
            capturing = false;
            gsap.delayedCall(0.55, nextPending);
          }
        });
  
        tl
          .fromTo(els.flash, { opacity: 0.7 }, { opacity: 0, duration: 0.7 }, 0)
          .fromTo(els.banner, { opacity: 0, scale: 0.85, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.45 }, 0)
          .to(els.banner, { opacity: 0, y: -20, duration: 0.4 }, 0.7)
          .fromTo(els.ringOuter, { attr: { r: 54 } }, { attr: { r: 92 }, duration: 0.35, yoyo: true, repeat: 1 }, 0)
          .fromTo(els.ringInner, { attr: { r: 28 } }, { attr: { r: 48 }, duration: 0.35, yoyo: true, repeat: 1 }, 0.05)
          .fromTo(els.core, { attr: { r: 6 } }, { attr: { r: 18 }, duration: 0.25, yoyo: true, repeat: 1 }, 0)
          .fromTo(els.tx, { opacity: 0, y: 28, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.65 }, 0.15)
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
  
      function pulseCore() {
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
  
      // Intro
      gsap.from('#wave-wrap', { opacity: 0, scale: 0.9, duration: 1.1, ease: 'power3.out' });
      gsap.from(['.topbar', '.panel', '.bottom', '.center-hint'], {
        opacity: 0, y: 20, duration: 0.75, stagger: 0.08, ease: 'power3.out', delay: 0.12
      });
      gsap.from(particleEls.map((p) => p.el), {
        opacity: 0, duration: 0.8, stagger: 0.03, delay: 0.4
      });
  
      gsap.to(els.ringOuter, {
        attr: { r: 62 }, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut'
      });
      gsap.to(els.ringInner, {
        attr: { r: 32 }, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.2
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
  
      setCurrent(0);
      requestAnimationFrame(tick);
    })();
}
