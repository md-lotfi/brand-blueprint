import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/** Progressive motion: content remains visible without JavaScript or animation support. */
export function ShowcaseMotion() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const animations = new Set<Animation>();
    const stop = () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    const start = () => {
      stop();
      if (preference.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer?.unobserve(entry.target);
          const element = entry.target;
          if (!(element instanceof HTMLElement)) return;
          const siblings = Array.from(element.parentElement?.children ?? []);
          const delay = Math.min(Math.max(siblings.indexOf(element), 0) * 70, 210);
          const animation = element.animate(
            [{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 750, delay, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      }, { threshold: 0.08 });
      document.querySelectorAll("#main section h1, #main section h2, #main section article, #main section li, #main section form, #main section > img, #main section > div > p").forEach((element) => observer?.observe(element));
    };
    start();
    preference.addEventListener("change", start);
    return () => {
      stop();
      preference.removeEventListener("change", start);
    };
  }, [pathname]);

  return null;
}