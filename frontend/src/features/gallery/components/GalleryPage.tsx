import React, { useState, useMemo, useCallback } from 'react';
import { Image } from 'lucide-react';
import { GALLERY_CATEGORIES, type GalleryCategory } from '../types';
import { GALLERY_ITEMS } from '../data/gallery';
import { GalleryTile } from './GalleryTile';
import { Lightbox } from './Lightbox';
import './Gallery.css';

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter items — memoised so changing category doesn't re-render the whole grid unnecessarily
  const filteredItems = useMemo(
    () =>
      activeCategory === 'All'
        ? GALLERY_ITEMS
        : GALLERY_ITEMS.filter(item => item.category === activeCategory),
    [activeCategory]
  );

  const handleOpenLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const handleClose = useCallback(() => setLightboxIndex(null), []);
  const handlePrev = useCallback(
    () => setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i)),
    []
  );
  const handleNext = useCallback(
    () => setLightboxIndex(i => (i !== null && i < filteredItems.length - 1 ? i + 1 : i)),
    [filteredItems.length]
  );

  return (
    <div className="gallery-page">
      {/* Header */}
      <header className="gallery-header">
        <div>
          <h1 className="gallery-title">Photo Gallery</h1>
          <p className="gallery-subtitle">
            Moments from reunions, convocations, cultural events, and campus life.
          </p>
        </div>
        <span className="gallery-count" aria-live="polite">
          {filteredItems.length} photo{filteredItems.length !== 1 ? 's' : ''}
        </span>
      </header>

      {/* Category Filter */}
      <nav className="gallery-filter" role="navigation" aria-label="Filter photos by category">
        <div className="gallery-filter-scroll">
          {GALLERY_CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`gallery-filter-btn ${activeCategory === cat ? 'gallery-filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
            >
              {cat}
              {cat !== 'All' && (
                <span className="gallery-filter-count">
                  {GALLERY_ITEMS.filter(i => i.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Empty state */}
      {filteredItems.length === 0 && (
        <div className="gallery-empty" role="status">
          <Image size={40} strokeWidth={1.5} aria-hidden="true" />
          <h3>No photos in this category yet</h3>
          <p>Check back after the next event!</p>
        </div>
      )}

      {/* Grid */}
      {filteredItems.length > 0 && (
        <main className="gallery-grid" aria-label="Photo grid">
          {filteredItems.map((item, index) => (
            <GalleryTile
              key={item.id}
              item={item}
              index={index}
              onOpen={handleOpenLightbox}
            />
          ))}
        </main>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filteredItems}
          activeIndex={lightboxIndex}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
};
