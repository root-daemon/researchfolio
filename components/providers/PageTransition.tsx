"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type Navigate = (href: string) => void;
const TransitionContext = createContext<Navigate>(() => {});
export const useTransitionNavigate = () => useContext(TransitionContext);

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<((path: string) => void) | null>(null);
  const busy = useRef(false);

  // Resolve the in-flight transition once the new route has rendered.
  useEffect(() => {
    pending.current?.(pathname);
  }, [pathname]);

  const navigate = useCallback<Navigate>(
    (href) => {
      const [path, hash] = href.split("#");
      const target = path || pathname;
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number | string | HTMLElement, o?: object) => void } }).__lenis;
      if (target === pathname) {
        if (hash && lenis) lenis.scrollTo(`#${hash}`, { duration: 1.4 });
        else if (hash) document.getElementById(hash)?.scrollIntoView();
        return;
      }
      if (busy.current) return;
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }
      busy.current = true;
      const page = document.getElementById("page")!;
      const arrived = new Promise<void>((res) => {
        pending.current = (p) => { if (p === target) { pending.current = null; res(); } };
      });

      // Like an old TV changing channel: the picture collapses to a bright line, then a
      // dot, and the next page opens back out of it.
      gsap.timeline()
        .to(page, { scaleY: 0.006, transformOrigin: `50% ${window.scrollY + innerHeight / 2}px`, duration: 0.28, ease: "power3.in" })
        .to(page, { scaleX: 0, duration: 0.16, ease: "power2.in" })
        .add(() => {
          router.push(href, { scroll: false });
          arrived.then(() => {
            window.scrollTo(0, 0);
            ScrollTrigger.refresh();
            gsap.timeline({
              onComplete: () => {
                gsap.set(page, { clearProps: "all" });
                busy.current = false;
                window.dispatchEvent(new Event("page:enter"));
                if (hash) lenis?.scrollTo(`#${hash}`, { duration: 1.4 });
              },
            })
              .set(page, { transformOrigin: "50% 50vh" })
              .to(page, { scaleX: 1, duration: 0.16, ease: "power2.out", delay: 0.05 })
              .to(page, { scaleY: 1, duration: 0.35, ease: "power3.out" });
          });
        });
    },
    [pathname, router],
  );

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
    </TransitionContext.Provider>
  );
}
