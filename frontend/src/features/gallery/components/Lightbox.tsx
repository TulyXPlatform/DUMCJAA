import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, Calendar } from 'lucide-react';
import type { GalleryItem } from '../types';
import { isGradient } from '../data/gallery';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface LightboxProps {
  items: GalleryItem[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  items,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  const item = items[activeIndex];
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;

  useFocusTrap(true);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape': onClose(); break;
        case 'ArrowLeft': if (hasPrev) onPrev(); break;
        case 'ArrowRight': if (hasNext) onNext(); break;
      }
    },
    [onClose, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!item) return null;

  const isGrad = isGradient(item.imageUrl);

  return (
    // Backdrop — click outside the panel to close
    <div
      className="lightbox-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Image lightbox: ${item.title}`}
    >
      {/* Panel — stop click from propagating to backdrop */}
      <div className="lightbox-panel" onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button className="lightbox-btn lightbox-close" onClick={onClose} aria-label="Close lightbox">
          <X size={22} />
        </button>

        {/* Counter */}
        <span className="lightbox-counter" aria-live="polite">
          {activeIndex + 1} / {items.length}
        </span>

        {/* Media area */}
        <div className="lightbox-media-area">
          {/* Prev */}
          <button
            className={`lightbox-btn lightbox-nav lightbox-nav--prev ${!hasPrev ? 'lightbox-nav--hidden' : ''}`}
            onClick={onPrev}
            aria-label="Previous image"
            disabled={!hasPrev}
          >
            <ChevronLeft size={28} />
          </button>

          {/* Image or gradient */}
          <div className="lightbox-image-wrap">
            {isGrad ? (
              <div
                className="lightbox-gradient"
                style={{ background: item.imageUrl }}
                role="img"
                aria-label={item.title}
              />
            ) : (
              <img
                key={item.id}                  // Key forces re-mount on navigation → CSS fade-in
                className="lightbox-image"
                src={item.imageUrl}
                alt={item.title}
                loading="eager"                // Already in view; load immediately
              />
            )}
          </div>

          {/* Next */}
          <button
            className={`lightbox-btn lightbox-nav lightbox-nav--next ${!hasNext ? 'lightbox-nav--hidden' : ''}`}
            onClick={onNext}
            aria-label="Next image"
            disabled={!hasNext}
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Caption bar */}
        <div className="lightbox-caption">
          <div className="lightbox-caption-body">
            <h3 className="lightbox-title">{item.title}</h3>
            {item.caption && <p className="lightbox-desc">{item.caption}</p>}
            <div className="lightbox-meta">
              {item.photographerName && (
                <span><Camera size={13} /> {item.photographerName}</span>
              )}
              {item.takenAt && (
                <span>
                  <Calendar size={13} />
                  {new Date(item.takenAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
              <span className="lightbox-category-chip">{item.category}</span>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="lightbox-thumb-strip" aria-label="Image thumbnails">
            {items.map((t, idx) => (
              <button
                key={t.id}
                className={`lightbox-thumb ${idx === activeIndex ? 'lightbox-thumb--active' : ''}`}
                onClick={() => idx !== activeIndex && (idx < activeIndex ? onPrev() : onNext())}
                aria-label={`View: ${t.title}`}
                aria-current={idx === activeIndex}
                style={isGradient(t.imageUrl)
                  ? { background: t.imageUrl }
                  : { backgroundImage: `url(${t.thumbUrl ?? t.imageUrl})` }
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
