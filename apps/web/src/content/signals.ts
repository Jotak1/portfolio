import type { Profile, SignalId } from '@portfolio/content-schema';

export interface ResonanciaSignal {
  id: SignalId;
  title: string;
  short: string;
  freq: number;
  amp: number;
  body: string;
}

function chips(items: string[]) {
  return `<div class="chips">${items.map((t) => `<span class="chip">${t}</span>`).join('')}</div>`;
}

/** Build Resonancia SIGNALS from profile — single narrative with Expediente. */
export function buildSignals(p: Profile, base: string): ResonanciaSignal[] {
  const prior = p.experience.filter((e) => e.id !== 'correos');
  const current = p.experience.find((e) => e.id === 'correos')!;
  const stackChips = [
    ...p.stack.frontend.slice(0, 4),
    ...p.stack.backend.slice(0, 3),
  ];

  return [
    {
      id: 'identidad',
      title: 'Señal 01 · Identidad',
      short: 'Identidad',
      freq: 0.58,
      amp: 0.4,
      body: `
            <h3>Quién soy</h3>
            <p>${p.bio[0]}</p>
            <p>${p.bio[1]}</p>
            ${chips([p.location, 'Full-Stack', 'IA aplicada', p.educationShort])}
          `,
    },
    {
      id: 'ia',
      title: 'Señal 02 · IA aplicada',
      short: 'IA aplicada',
      freq: 0.28,
      amp: 0.72,
      body: `
            <h3>${p.ai.headline.replace(/\.$/, '')}</h3>
            <p>${p.ai.intro}</p>
            <ul>
              ${p.ai.systems.map((s) => `<li><strong>${s.title}</strong> — ${s.summary}</li>`).join('')}
            </ul>
            ${chips(stackChips)}
          `,
    },
    {
      id: 'correos',
      title: 'Señal 03 · Correos Chile',
      short: 'Correos',
      freq: 0.74,
      amp: 0.55,
      body: `
            <h3>Rol actual</h3>
            <p><strong>${current.company}</strong> · ${current.role} (${current.period})</p>
            <p>${current.summary}</p>
            ${chips(current.stack)}
          `,
    },
    {
      id: 'trayectoria',
      title: 'Señal 04 · Trayectoria',
      short: 'Trayectoria',
      freq: 0.45,
      amp: 0.22,
      body: `
            <h3>Experiencia previa</h3>
            ${prior
              .map((e) => `<p><strong>${e.company}</strong> (${e.period}) — ${e.summary}</p>`)
              .join('')}
          `,
    },
    {
      id: 'contacto',
      title: 'Señal 05 · Contacto',
      short: 'Contacto',
      freq: 0.82,
      amp: 0.68,
      body: `
            <h3>Contacto</h3>
            <p>${p.contact.headline} ${p.contact.pitch}</p>
            <a class="cta" href="mailto:${p.email}">${p.email}</a>
            <p style="margin-top:14px;font-family:var(--font-mono);font-size:13px">${p.phone}</p>
            <div class="chips" style="margin-top:14px">
              <a class="chip" href="${p.links.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
              <a class="chip" href="${p.links.github}" target="_blank" rel="noopener">GitHub</a>
              <a class="chip" href="${base}expediente/" data-transition-label="Expediente">Ver expediente</a>
            </div>
          `,
    },
  ];
}
