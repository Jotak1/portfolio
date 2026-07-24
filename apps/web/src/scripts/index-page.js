/** Auto-ported page script for index */
export function initIndexPage() {
  const gsap = window.gsap;
  const Motion = window.Motion;
  if (!gsap || !Motion) {
    console.warn('[index] gsap/Motion missing');
    return;
  }
  (function () {
      Motion.injectCurtainStyles();
      Motion.playEnter();
      Motion.bindInternalLinks();
      Motion.ensureMuteButton(document.querySelector('.topnav'));
  
      const reduced = Motion.prefersReduced();
      const cards = gsap.utils.toArray('.view-card');
      const lines = gsap.utils.toArray('.doc-line');
      const wave = document.getElementById('preview-wave');
      const waveHarm = document.getElementById('preview-wave-harm');
      const waveGhost = document.getElementById('preview-wave-ghost');
      const waveFill = document.getElementById('preview-wave-fill');
      const glow = document.getElementById('cursor-glow');
      const stage = document.getElementById('wave-stage');

      // Soft preview drone when hovering Resonancia card
      const resoCard = document.querySelector('[data-od-id="card-resonancia"]');
      if (resoCard) {
        resoCard.addEventListener('pointerenter', () => {
          Motion.Audio.ensure().then((ok) => {
            if (ok) Motion.Audio.setProximity(0.45, 0.5, 0.4, false);
          });
        });
        resoCard.addEventListener('pointerleave', () => {
          Motion.Audio.setProximity(0, 0.5, 0.4, false);
        });
      }

      // Preview wave: multi-period sine + harmonic (reads as signal, not a soft bump)
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
        gsap.set('.reveal, .split-char', { clearProps: 'all', opacity: 1, y: 0 });
        return;
      }
  
      const chars1 = Motion.splitChars(document.getElementById('title-l1'));
      const chars2 = Motion.splitChars(document.getElementById('title-l2'));
      const allChars = chars1.concat(chars2);
  
      gsap.set(allChars, { yPercent: 120, opacity: 0 });
      gsap.set('.reveal', { opacity: 0, y: 28 });
  
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .to('.topnav', { opacity: 1, y: 0, duration: 0.7 }, 0.05)
        .to('.eyebrow', { opacity: 1, y: 0, duration: 0.55 }, 0.12)
        .to(allChars, {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.018,
          ease: 'power4.out'
        }, 0.2)
        .to('.lead', { opacity: 1, y: 0, duration: 0.7 }, 0.55)
        .to(cards, { opacity: 1, y: 0, duration: 0.85, stagger: 0.12 }, 0.65)
        .to('.foot', { opacity: 1, y: 0, duration: 0.6 }, 0.95);
  
      gsap.fromTo(lines, {
        scaleX: 0.2,
        opacity: 0.3
      }, {
        scaleX: 1,
        opacity: 1,
        duration: 0.55,
        stagger: 0.06,
        delay: 1.05,
        ease: 'power2.out'
      });

      function spawnSpark() {
        const spark = document.createElement('span');
        spark.className = 'spark';
        stage.appendChild(spark);
        const x = 20 + Math.random() * 240;
        const y = 40 + Math.random() * 40;
        gsap.set(spark, { left: x, top: y, opacity: 0.9, scale: 0.4 });
        gsap.to(spark, {
          y: -30 - Math.random() * 40,
          opacity: 0,
          scale: 1.2,
          duration: 0.9 + Math.random() * 0.5,
          ease: 'power2.out',
          onComplete: () => spark.remove()
        });
      }
      gsap.delayedCall(1.2, function loop() {
        spawnSpark();
        gsap.delayedCall(0.45 + Math.random() * 0.6, loop);
      });
  
      // Cursor glow
      const glowPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      window.addEventListener('pointermove', (e) => {
        gsap.to(glowPos, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.55,
          ease: 'power3.out',
          onUpdate: () => {
            glow.style.left = glowPos.x + 'px';
            glow.style.top = glowPos.y + 'px';
          }
        });
        gsap.to(glow, { opacity: 0.7, duration: 0.35 });
      });
      window.addEventListener('pointerleave', () => {
        gsap.to(glow, { opacity: 0, duration: 0.5 });
      });
  
      // Magnetic tilt
      cards.forEach((card) => {
        const rot = { x: 0, y: 0 };
        card.addEventListener('pointermove', (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(rot, {
            x: py * -8,
            y: px * 10,
            duration: 0.45,
            ease: 'power2.out',
            onUpdate: () => {
              card.style.transform = `rotateX(${rot.x}deg) rotateY(${rot.y}deg) translateY(-4px)`;
            }
          });
        });
        card.addEventListener('pointerleave', () => {
          gsap.to(rot, {
            x: 0, y: 0, duration: 0.55, ease: 'power3.out',
            onUpdate: () => {
              card.style.transform = `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`;
            }
          });
        });
      });
    })();
}
