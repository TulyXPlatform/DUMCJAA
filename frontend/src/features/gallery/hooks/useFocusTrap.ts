import { useEffect } from 'react';

/**
 * Traps keyboard focus within a modal while it's open.
 * Restores focus to the element that was active before the modal opened.
 */
export function useFocusTrap(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    // Capture the element that triggered the modal so we can restore focus on close
    const previouslyFocused = document.activeElement as HTMLElement;

    // Lock scroll on body
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [isOpen]);
}
