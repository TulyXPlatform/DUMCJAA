import { useRef, useEffect, useState } from 'react';

/**
 * True lazy loading via IntersectionObserver.
 * Returns a ref to attach to the element and a boolean `isVisible`.
 * Once the element enters the viewport it stays visible (no "unload on scroll out").
 */
export function useLazyLoad(rootMargin = '200px') {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip if the API isn't available (SSR / old browsers)
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el); // Fire once, then stop observing
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [rootMargin]);

  return { ref, isVisible };
}
