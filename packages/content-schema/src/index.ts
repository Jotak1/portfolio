/** Shared content types for Expediente + Resonancia. */

export type SignalId =
  | 'identidad'
  | 'stack'
  | 'correos'
  | 'trayectoria'
  | 'contacto';

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  year: string;
  summary: string;
  stack: string[];
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  education: string;
  bio: string[];
  stack: {
    frontend: string[];
    backend: string[];
    tools: string[];
  };
  experience: Experience[];
}
