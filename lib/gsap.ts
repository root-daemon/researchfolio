import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  // One house ease for almost everything: fast start, long soft landing.
  CustomEase.create("house", "0.65, 0.05, 0, 1");
}

export { gsap, ScrollTrigger, SplitText };

// Draggable + Inertia are only used by the marquee, so they load on demand.
export async function loadDraggable() {
  const [{ Draggable }, { InertiaPlugin }] = await Promise.all([import("gsap/Draggable"), import("gsap/InertiaPlugin")]);
  gsap.registerPlugin(Draggable, InertiaPlugin);
  return Draggable;
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
