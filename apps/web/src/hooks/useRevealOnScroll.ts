"use client";

import { useEffect } from "react";

export function useRevealOnScroll() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      const revealItems = document.querySelectorAll<HTMLElement>(".reveal");
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target as HTMLElement;
          // Wait one paint so initial `.reveal` styles are committed,
          // then apply visibility class for reliable stagger transitions.
          requestAnimationFrame(() => {
            target.style.transitionDelay = `${target.dataset.delay || 0}ms`;
            target.classList.add("is-visible");
            revealObserver.unobserve(target);
          });
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" },
    );
    const observed = new WeakSet<HTMLElement>();

    const observeRevealEl = (el: HTMLElement) => {
      if (!el.classList.contains("reveal")) return;
      if (el.classList.contains("is-visible")) return;
      if (observed.has(el)) return;
      observed.add(el);
      revealObserver.observe(el);
    };

    const observeRevealTree = (root: ParentNode) => {
      const nodes = root.querySelectorAll<HTMLElement>(".reveal");
      nodes.forEach((node) => observeRevealEl(node));
    };

    observeRevealTree(document);

    const mutationObserver = new MutationObserver((mutations) => {
      if (!mutations.length) return;
      // React can commit nested nodes in multiple micro-batches.
      // Rescanning ensures every new `.reveal` gets observed.
      observeRevealTree(document);
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      revealObserver.disconnect();
    };
  }, []);
}
