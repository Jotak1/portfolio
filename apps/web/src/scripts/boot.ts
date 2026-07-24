import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createOdMotion } from './motion.js';

declare global {
  interface Window {
    gsap: typeof gsap;
    ScrollTrigger: typeof ScrollTrigger;
    // Shared motion helpers (curtain, VT, audio, split…)
    Motion: any;
    __BASE__?: string;
  }
}

export type BootOptions = {
  scrollTrigger?: boolean;
};

/** Attach GSAP (+ optional ScrollTrigger) and Motion helpers to window. */
export async function bootMotion(opts: BootOptions = {}): Promise<void> {
  window.gsap = gsap;

  if (opts.scrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    window.ScrollTrigger = ScrollTrigger;
  }

  createOdMotion(window);
}
