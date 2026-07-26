import type { Profile } from '@portfolio/content-schema';

/** Single source of truth for Inicio, Expediente, Resonancia, SEO. */
export const profile: Profile = {
  name: 'Juan Pablo Ausensi',
  shortName: 'Juan Pablo',
  role: 'Desarrollador Full-Stack',
  roleSignal: 'Full-Stack · IA aplicada',
  location: 'Chile',
  email: 'jp.ausensi@gmail.com',
  phone: '+56 9 2736 6163',
  phoneHref: 'tel:+56927366163',
  seoDescription:
    'Juan Pablo Ausensi — desarrollador full-stack en Chile. Sistemas en producción; integración de modelos de IA cuando el producto lo pide.',
  links: {
    linkedin: 'https://www.linkedin.com/in/jpas/',
    github: 'https://github.com/Jotak1',
    portfolio: 'https://jotak1.github.io/portfolio/',
  },
  education: 'Ingeniería Electrónica · INACAP 2019',
  educationShort: 'INACAP 2019',
  home: {
    eyebrow: 'Portafolio · Full-Stack + IA',
    titleLine1: 'Léeme.',
    titleLine2: 'O sintoniza.',
    lead: 'Expediente para leer en dos minutos. Resonancia si prefieres jugar con la señal. Full-stack e IA aplicada, Chile.',
    roleMeta: 'Full-Stack · IA · Chile',
    expedienteCard: 'CV claro: trayectoria, stack, contacto y dónde aplico IA.',
    resonanciaCard: 'Sintoniza frecuencia y amplitud. Captura señales de mi historia.',
  },
  hero: {
    eyebrow: 'Expediente · lectura',
    titleLine1: 'Juan Pablo.',
    titleLine2: 'Desarrollador full-stack.',
    lead: 'Construyo el sistema completo: front, APIs, datos y operación. IA como herramienta para desarrollar y para entregar.',
    signalLabel: 'Señal activa',
    signalRole: 'Full-Stack · IA aplicada',
    signalJob: 'Correos Chile · ene 2025 – actualidad',
  },
  bioHeadline: 'Electrónica de base. Software en producción. IA para construir y para entregar.',
  bio: [
    'Ingeniero en Electrónica (INACAP, 2019). Full-stack en equipos reales: interfaces, APIs, datos y software en producción. Uso IA para construir más rápido y la integro cuando el producto lo pide.',
    'Padre de familia. Me gustan los autos y resolver cosas en casa.',
  ],
  ai: {
    eyebrow: 'IA aplicada',
    headline: 'Sistemas alrededor del modelo.',
    intro:
      'Integro modelos de IA y armo el pipeline de producto — APIs, datos, UX y operación.',
    systems: [
      {
        id: 'facial',
        title: 'Reconocimiento facial',
        summary:
          'Matching 1:1 y búsqueda 1:N con embeddings/vectores sobre modelos de IA.',
      },
      {
        id: 'stt',
        title: 'Transcripción de audio',
        summary: 'Pipelines speech-to-text: audio a texto usable en el producto.',
      },
      {
        id: 'voice',
        title: 'Clonación de voz',
        summary: 'Integración de síntesis / clonación de voz en flujos de audio reales.',
      },
    ],
  },
  stack: {
    headline: 'Con qué construyo hoy.',
    frontend: ['React', 'Vite', 'Astro', 'Tailwind', 'React Native', 'TypeScript'],
    backend: ['Bun', 'Elysia', 'Node.js', 'NestJS'],
    dataOps: ['PostgreSQL', 'MongoDB', 'Oracle', 'Docker', 'Git'],
    ai: [
      'embeddings / vectores',
      'speech-to-text',
      'voice clone',
      'inferencia con modelos de IA',
    ],
  },
  contact: {
    headline: 'Hablemos',
    pitch:
      'Desarrollador full-stack. Sistemas en producción. Abierto a oportunidades.',
  },
  experience: [
    {
      id: 'correos',
      company: 'Correos Chile',
      role: 'Desarrollador Full-Stack',
      roleLine: '2025 – hoy · Full-Stack',
      period: 'ene 2025 – actualidad',
      year: '2025',
      summary:
        'Modernización de sistemas internos de punta a punta (NestJS, Node.js, React, Vue). Optimización de SQL en PostgreSQL y Oracle para mantener la operación fluida.',
      badge: 'Rol actual',
      stack: ['NestJS', 'React', 'Vue', 'PostgreSQL', 'Oracle'],
    },
    {
      id: 'amicar',
      company: 'Amicar S.A.',
      role: 'Desarrollador Full-Stack',
      roleLine: '2023 – 2025 · Full-Stack',
      period: '2023 – 2025',
      year: '2023',
      summary:
        'Producto full-stack en fintech/crédito (React, Node.js, MongoDB, PostgreSQL). Soporte e incidencias en producción.',
      badge: 'Producción · fintech / crédito',
      stack: ['React', 'Node.js', 'MongoDB', 'PostgreSQL'],
    },
    {
      id: 'natural',
      company: 'Natural Phone S.A.',
      role: 'Desarrollador Front-End',
      roleLine: '2022 – 2023 · Front-End',
      period: '2022 – 2023',
      year: '2022',
      summary: 'Apps móviles con React Native y sitios web con Vue.js.',
      badge: 'Mobile + web',
      stack: ['React Native', 'Vue'],
    },
    {
      id: 'haibu',
      company: 'Haibu Solutions',
      role: 'Desarrollador Full-Stack',
      roleLine: '2021 – 2022 · Full-Stack',
      period: '2021 – 2022',
      year: '2021',
      summary:
        'Apps móviles para células de técnicos, ventas y clientes VTR (Ionic, Angular, Node.js, Scrum).',
      badge: 'Telecom · campo',
      stack: ['Ionic', 'Angular', 'Node.js'],
    },
    {
      id: 'mecanica',
      company: 'Soc. Mecánica e Ingeniería',
      role: 'Ingeniería + desarrollo',
      roleLine: '2019 – 2021 · Ingeniería + desarrollo',
      period: '2019 – 2021',
      year: '2019',
      summary:
        'Ingeniería eléctrica/electrónica + sistemas internos (Angular, Node.js, Express, MongoDB). Origen del puente hardware a software.',
      badge: 'Origen · electrónica + software',
      stack: ['Angular', 'Node.js', 'Express', 'MongoDB'],
    },
  ],
};
