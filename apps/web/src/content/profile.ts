import type { Profile } from '@portfolio/content-schema';

/** Contenteditable source of truth — mirror of CV / OD prototype. */
export const profile: Profile = {
  name: 'Juan Pablo Ausensi',
  role: 'Desarrollador Full-Stack',
  location: 'Chile',
  email: 'jp.ausensi@gmail.com',
  phone: '+56 9 2736 6163',
  links: {
    linkedin: 'https://www.linkedin.com/in/juan-pablo-ausensi/',
    github: 'https://github.com/jotak1',
    portfolio: 'https://jotak1.github.io/portfolio/',
  },
  education: 'Ingeniería Electrónica, INACAP 2019',
  bio: [
    'Ingeniero en Electrónica (INACAP, 2019). Me gusta el desarrollo web: problemas nuevos, aprendizaje continuo y equipos reales.',
    'Me adapto rápido y trabajo bien en equipo. Chile, ajedrez, familia y outdoor — la misma curiosidad que aplico al código.',
  ],
  stack: {
    frontend: ['React', 'Vue', 'Angular', 'React Native', 'Ionic'],
    backend: ['NestJS', 'Node.js', 'Bun', 'PostgreSQL', 'Oracle'],
    tools: ['Docker', 'Git', 'TypeScript', 'GSAP'],
  },
  experience: [
    {
      id: 'correos',
      company: 'Correos Chile',
      role: 'Desarrollador Full-Stack',
      period: 'ene 2025 – actualidad',
      year: '2025',
      summary: 'Plataformas internas con NestJS, React, Vue, PostgreSQL y Oracle.',
      stack: ['NestJS', 'React', 'Vue', 'PostgreSQL', 'Oracle'],
    },
    {
      id: 'amicar',
      company: 'Amicar S.A.',
      role: 'Desarrollador',
      period: '2023 – 2025',
      year: '2023',
      summary: 'Productos en producción con React y Node.',
      stack: ['React', 'Node.js'],
    },
    {
      id: 'natural',
      company: 'Natural Phone',
      role: 'Desarrollador',
      period: '2022 – 2023',
      year: '2022',
      summary: 'App móvil con React Native.',
      stack: ['React Native'],
    },
    {
      id: 'haibu',
      company: 'Haibu · VTR',
      role: 'Desarrollador',
      period: '2021 – 2022',
      year: '2021',
      summary: 'Apps Ionic/Angular para VTR.',
      stack: ['Ionic', 'Angular'],
    },
  ],
};
