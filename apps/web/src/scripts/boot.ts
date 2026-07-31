import gsap from 'gsap';
import { createOdMotion } from './motion.js';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

declare global {
  interface Window {
    gsap: typeof gsap;
    ScrollTrigger?: typeof ScrollTriggerType;
    // Shared motion helpers (curtain, VT, audio, split…)
    Motion: any;
    __BASE__?: string;
    __SIGNALS__?: Array<{
      id: string;
      title: string;
      short: string;
      freq: number;
      amp: number;
      body: string;
    }>;
  }
}

export type BootOptions = {
  scrollTrigger?: boolean;
};

/** Attach GSAP (+ optional ScrollTrigger) and Motion helpers to window. */
export async function bootMotion(opts: BootOptions = {}): Promise<void> {
  window.gsap = gsap;

  if (opts.scrollTrigger) {
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    window.ScrollTrigger = ScrollTrigger;
  }

  createOdMotion(window);
}
