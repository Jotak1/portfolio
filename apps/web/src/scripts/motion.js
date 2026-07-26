/**
 * Shared GSAP motion helpers — portfolio prototype.
 * Free GSAP only + Web Audio + View Transitions API (MPA).
 */
export function createOdMotion(global = window) {
  const KEY = 'od-gsap-enter';
  const AUDIO_KEY = 'od-audio-enabled';

  function prefersReduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function hasViewTransition() {
    return typeof document.startViewTransition === 'function';
  }

  /** Cross-document MPA transitions (Chrome 126+). */
  function hasCrossDocVT() {
    if (!hasViewTransition()) return false;
    try {
      return CSS.supports('view-transition-name', 'none');
    } catch (_) {
      return true;
    }
  }

  /* ───────── View Transitions + curtain styles ───────── */

  function injectCurtainStyles() {
    if (document.getElementById('od-curtain-css')) return;
    const style = document.createElement('style');
    style.id = 'od-curtain-css';
    style.textContent = `
      @view-transition { navigation: auto; }

      ::view-transition-old(root) {
        animation: 420ms cubic-bezier(0.23, 1, 0.32, 1) both od-vt-out;
      }
      ::view-transition-new(root) {
        animation: 520ms cubic-bezier(0.23, 1, 0.32, 1) both od-vt-in;
      }
      @keyframes od-vt-out {
        to {
          opacity: 0;
          filter: blur(10px);
          transform: scale(1.03) translateY(-1.5%);
        }
      }
      @keyframes od-vt-in {
        from {
          opacity: 0;
          filter: blur(10px);
          transform: scale(0.97) translateY(2%);
        }
      }

      ::view-transition-group(brand) {
        animation-duration: 480ms;
        animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
      }
      ::view-transition-old(brand),
      ::view-transition-new(brand) {
        height: 100%;
        object-fit: none;
        overflow: visible;
      }

      .logo, .brand {
        view-transition-name: brand;
      }
      .view-card[data-od-id="card-expediente"] {
        view-transition-name: card-expediente;
      }
      .view-card[data-od-id="card-resonancia"] {
        view-transition-name: card-resonancia;
      }

      #od-curtain {
        position: fixed; inset: 0; z-index: 9999;
        pointer-events: none; display: grid; place-items: center;
        opacity: 0;
      }
      #od-curtain.is-active { pointer-events: auto; }
      #od-curtain .od-curtain-panel {
        position: absolute; inset: 0;
        background: var(--bg);
        transform: translateY(101%);
      }
      #od-curtain .od-curtain-label {
        position: relative; z-index: 1;
        margin: 0;
        font-family: var(--font-mono);
        font-size: 12px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--accent);
        opacity: 0;
      }
      .split-line { display: block; overflow: hidden; }
      .split-word, .split-char {
        display: inline-block;
        will-change: transform, opacity;
      }
      .split-char { white-space: pre; }

      .od-mute {
        font-family: var(--font-mono);
        font-size: 11px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        min-height: 44px;
        padding: 6px 12px;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: transparent;
        color: var(--muted);
        cursor: pointer;
        line-height: 1;
        transition: color 0.15s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.15s cubic-bezier(0.23, 1, 0.32, 1);
      }
      .od-mute:hover { color: var(--fg); border-color: var(--fg); }
      .od-mute:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 3px;
      }
      .od-mute.is-off { color: var(--muted); opacity: 0.7; }
      .od-mute.is-on { color: var(--accent); border-color: color-mix(in oklch, var(--accent) 45%, var(--border)); }
    `;
    document.head.appendChild(style);
  }

  function ensureCurtain() {
    let el = document.getElementById('od-curtain');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'od-curtain';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="od-curtain-panel"></div><p class="od-curtain-label"></p>';
    document.body.appendChild(el);
    return el;
  }

  /* ───────── DIY SplitText ───────── */

  function split(el, mode) {
    if (!el || el.dataset.split === '1') return [];
    const text = el.textContent;
    el.textContent = '';
    el.dataset.split = '1';
    const parts = [];

    if (mode === 'chars') {
      const line = document.createElement('span');
      line.className = 'split-line';
      [...text].forEach((ch) => {
        const span = document.createElement('span');
        span.className = 'split-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        line.appendChild(span);
        parts.push(span);
      });
      el.appendChild(line);
      return parts;
    }

    const words = text.trim().split(/\s+/);
    words.forEach((word, i) => {
      const line = document.createElement('span');
      line.className = 'split-line';
      const span = document.createElement('span');
      span.className = 'split-word';
      span.textContent = word;
      line.appendChild(span);
      el.appendChild(line);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      parts.push(span);
    });
    return parts;
  }

  function splitChars(el) {
    return split(el, 'chars');
  }

  function splitWords(el) {
    return split(el, 'words');
  }

  /* ───────── Web Audio bus (sound-reactive) ───────── */

  const AudioBus = {
    ctx: null,
    master: null,
    droneOsc: null,
    droneOsc2: null,
    droneGain: null,
    droneFilter: null,
    lfo: null,
    lfoGain: null,
    analyser: null,
    data: null,
    started: false,
    enabled: localStorage.getItem(AUDIO_KEY) !== '0',
    _lastBand: false,

    isEnabled() {
      return this.enabled && !prefersReduced();
    },

    async ensure() {
      if (!this.isEnabled()) return false;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;

      if (!this.ctx) {
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.28;
        this.master.connect(this.ctx.destination);

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.data = new Uint8Array(this.analyser.frequencyBinCount);
        this.master.connect(this.analyser);

        this.droneFilter = this.ctx.createBiquadFilter();
        this.droneFilter.type = 'lowpass';
        this.droneFilter.frequency.value = 420;
        this.droneFilter.Q.value = 0.7;
        this.droneFilter.connect(this.master);

        this.droneGain = this.ctx.createGain();
        this.droneGain.gain.value = 0;
        this.droneGain.connect(this.droneFilter);

        this.droneOsc = this.ctx.createOscillator();
        this.droneOsc.type = 'sine';
        this.droneOsc.frequency.value = 110;
        this.droneOsc.connect(this.droneGain);

        this.droneOsc2 = this.ctx.createOscillator();
        this.droneOsc2.type = 'triangle';
        this.droneOsc2.frequency.value = 165;
        const g2 = this.ctx.createGain();
        g2.gain.value = 0.35;
        this.droneOsc2.connect(g2);
        g2.connect(this.droneGain);

        this.lfo = this.ctx.createOscillator();
        this.lfo.type = 'sine';
        this.lfo.frequency.value = 0.35;
        this.lfoGain = this.ctx.createGain();
        this.lfoGain.gain.value = 18;
        this.lfo.connect(this.lfoGain);
        this.lfoGain.connect(this.droneOsc.frequency);

        this.droneOsc.start();
        this.droneOsc2.start();
        this.lfo.start();
      }

      if (this.ctx.state === 'suspended') {
        try { await this.ctx.resume(); } catch (_) { return false; }
      }
      this.started = true;
      return true;
    },

    /** Drive drone from tuner proximity (0–1) + dial positions. */
    setProximity(closeness, freq, amp, inBand) {
      if (!this.started || !this.isEnabled()) return;
      const t = this.ctx.currentTime;
      const base = 90 + freq * 160;
      this.droneOsc.frequency.setTargetAtTime(base, t, 0.08);
      this.droneOsc2.frequency.setTargetAtTime(base * (1.5 + amp * 0.2), t, 0.08);
      this.droneFilter.frequency.setTargetAtTime(280 + closeness * 2400 + amp * 400, t, 0.1);
      const vol = closeness * 0.22 * (inBand ? 1.35 : 1);
      this.droneGain.gain.setTargetAtTime(vol, t, 0.12);
      this.lfo.frequency.setTargetAtTime(0.2 + closeness * 2.5, t, 0.15);

      if (inBand && !this._lastBand) this.bandEnter();
      this._lastBand = !!inBand;
    },

    bandEnter() {
      this._blip(660, 0.05, 0.09);
    },

    pulse() {
      this._blip(220, 0.08, 0.12);
      this._blip(440, 0.04, 0.08, 0.04);
    },

    capture(index) {
      if (!this.started || !this.isEnabled()) return;
      const base = 330 + (index % 5) * 55;
      [0, 0.08, 0.16].forEach((delay, i) => {
        this._blip(base * (1 + i * 0.33), 0.12, 0.18, delay);
      });
      // soft noise burst
      this._noise(0.12, 0.05);
    },

    level() {
      if (!this.analyser || !this.data) return 0;
      this.analyser.getByteFrequencyData(this.data);
      let sum = 0;
      for (let i = 0; i < this.data.length; i++) sum += this.data[i];
      return sum / (this.data.length * 255);
    },

    _blip(freq, attack, dur, delay) {
      if (!this.ctx || !this.isEnabled()) return;
      const t0 = this.ctx.currentTime + (delay || 0);
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.22, t0 + attack);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      osc.connect(g);
      g.connect(this.master);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    },

    _noise(dur, gain) {
      if (!this.ctx || !this.isEnabled()) return;
      const len = Math.floor(this.ctx.sampleRate * dur);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const g = this.ctx.createGain();
      const f = this.ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 1800;
      g.gain.value = gain || 0.06;
      src.connect(f);
      f.connect(g);
      g.connect(this.master);
      src.start();
    },

    async setEnabled(on) {
      this.enabled = !!on;
      localStorage.setItem(AUDIO_KEY, on ? '1' : '0');
      if (!on) {
        if (this.droneGain && this.ctx) {
          this.droneGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
        }
        return;
      }
      await this.ensure();
    },

    toggle() {
      return this.setEnabled(!this.enabled).then(() => this.enabled);
    }
  };

  function ensureMuteButton(mount) {
    injectCurtainStyles();
    const host = mount || document.querySelector('.links') || document.querySelector('.topnav') || document.body;
    let btn = document.getElementById('od-mute');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'od-mute';
      btn.className = 'od-mute';
      btn.setAttribute('data-od-id', 'mute-btn');
      host.appendChild(btn);
    }
    const sync = () => {
      const on = AudioBus.isEnabled();
      btn.textContent = on ? 'Sonido' : 'Silenciado';
      btn.classList.toggle('is-on', on);
      btn.classList.toggle('is-off', !on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.title = on ? 'Silenciar audio reactivo' : 'Activar audio reactivo';
    };
    sync();
    btn.onclick = async () => {
      await AudioBus.toggle();
      if (AudioBus.isEnabled()) await AudioBus.ensure();
      sync();
    };
    return btn;
  }

  /* ───────── Page enter / navigate ───────── */

  function playEnter() {
    if (prefersReduced() || typeof gsap === 'undefined') return;
    if (sessionStorage.getItem(KEY) !== '1') return;
    sessionStorage.removeItem(KEY);

    // With cross-doc VT the browser already animated; skip curtain reveal.
    if (hasCrossDocVT()) return;

    injectCurtainStyles();
    const curtain = ensureCurtain();
    const panel = curtain.querySelector('.od-curtain-panel');
    const label = curtain.querySelector('.od-curtain-label');
    curtain.classList.add('is-active');
    gsap.set(curtain, { opacity: 1 });
    gsap.set(panel, { yPercent: 0 });
    gsap.set(label, { opacity: 0 });
    gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        curtain.classList.remove('is-active');
        gsap.set(curtain, { opacity: 0 });
      }
    })
      .to(panel, { yPercent: -101, duration: 0.75 }, 0.05)
      .to(label, { opacity: 0, duration: 0.2 }, 0);
  }

  function navigate(href, label) {
    if (prefersReduced()) {
      window.location.href = href;
      return;
    }

    sessionStorage.setItem(KEY, '1');

    // Prefer native cross-document View Transitions
    if (hasCrossDocVT()) {
      window.location.href = href;
      return;
    }

    // Same-document VT (if somehow SPA) or GSAP curtain fallback
    if (hasViewTransition() && typeof gsap !== 'undefined') {
      injectCurtainStyles();
      const curtain = ensureCurtain();
      const panel = curtain.querySelector('.od-curtain-panel');
      const labelEl = curtain.querySelector('.od-curtain-label');
      labelEl.textContent = label || 'Cargando';
      curtain.classList.add('is-active');
      gsap.set(curtain, { opacity: 1 });
      gsap.set(panel, { yPercent: 101 });
      gsap.set(labelEl, { opacity: 0, y: 8 });
      document.startViewTransition(() => {
        gsap.set(panel, { yPercent: 0 });
        gsap.set(labelEl, { opacity: 1, y: 0 });
      }).finished.finally(() => {
        window.location.href = href;
      });
      return;
    }

    if (typeof gsap === 'undefined') {
      window.location.href = href;
      return;
    }

    injectCurtainStyles();
    const curtain = ensureCurtain();
    const panel = curtain.querySelector('.od-curtain-panel');
    const labelEl = curtain.querySelector('.od-curtain-label');
    labelEl.textContent = label || 'Cargando';
    curtain.classList.add('is-active');

    gsap.set(curtain, { opacity: 1 });
    gsap.set(panel, { yPercent: 101 });
    gsap.set(labelEl, { opacity: 0, y: 8 });

    gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => { window.location.href = href; }
    })
      .to(panel, { yPercent: 0, duration: 0.7 }, 0)
      .to(labelEl, { opacity: 1, y: 0, duration: 0.35 }, 0.25);
  }

  function bindInternalLinks(root) {
    const scope = root || document;
    scope.querySelectorAll('a[href]').forEach((a) => {
      if (a.dataset.odBound === '1') return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
      // Internal app routes (Astro) or legacy .html prototypes
      const isInternal =
        href === '/' ||
        href === 'index.html' ||
        /\.html($|\?)/.test(href) ||
        /^\/(expediente|resonancia)(\/|$|\?)/.test(href);
      if (!isInternal) return;
      if (a.dataset.noTransition === '1') return;
      a.dataset.odBound = '1';
      a.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;

        // Cross-doc VT: let the browser navigate so @view-transition runs.
        if (hasCrossDocVT() && !prefersReduced()) {
          sessionStorage.setItem(KEY, '1');
          return;
        }

        e.preventDefault();
        const label = a.dataset.transitionLabel || a.textContent.trim().slice(0, 40) || 'Siguiente';
        navigate(href, label);
      });
    });
  }

  function bindTopnavScroll(topnav, { threshold = 12, media = '(max-width: 720px)' } = {}) {
    if (!topnav) return;
    const mq = window.matchMedia(media);
    let ticking = false;

    function update() {
      ticking = false;
      if (!mq.matches) {
        topnav.classList.remove('is-scrolled');
        return;
      }
      topnav.classList.toggle('is-scrolled', window.scrollY > threshold);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    mq.addEventListener('change', update);
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  global.Motion = {
    prefersReduced,
    hasViewTransition,
    hasCrossDocVT,
    splitChars,
    splitWords,
    playEnter,
    navigate,
    bindInternalLinks,
    ensureCurtain,
    injectCurtainStyles,
    Audio: AudioBus,
    ensureMuteButton,
    bindTopnavScroll
  };
}
