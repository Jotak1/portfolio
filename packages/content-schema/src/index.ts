/** Shared content types for Expediente + Resonancia. */

export type SignalId =
  | 'identidad'
  | 'ia'
  | 'correos'
  | 'trayectoria'
  | 'contacto';

export interface Experience {
  id: string;
  company: string;
  role: string;
  /** Short role line for timeline, e.g. "2025 – hoy · Full-Stack" */
  roleLine: string;
  period: string;
  year: string;
  summary: string;
  badge: string;
  stack: string[];
}

export interface AiSystem {
  id: string;
  title: string;
  summary: string;
}

export interface HomeCopy {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  lead: string;
  roleMeta: string;
  expedienteCard: string;
  resonanciaCard: string;
}

export interface HeroCopy {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  lead: string;
  signalLabel: string;
  signalRole: string;
  signalJob: string;
}

export interface Profile {
  name: string;
  shortName: string;
  role: string;
  roleSignal: string;
  location: string;
  email: string;
  seoDescription: string;
  links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  education: string;
  educationShort: string;
  home: HomeCopy;
  hero: HeroCopy;
  bioHeadline: string;
  bio: string[];
  ai: {
    eyebrow: string;
    headline: string;
    intro: string;
    systems: AiSystem[];
  };
  stack: {
    headline: string;
    frontend: string[];
    backend: string[];
    dataOps: string[];
    ai: string[];
  };
  contact: {
    headline: string;
    pitch: string;
  };
  experience: Experience[];
}
