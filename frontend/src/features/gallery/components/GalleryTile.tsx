import React, { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { GalleryItem } from '../types';
import { isGradient } from '../data/gallery';
import { useLazyLoad } from '../hooks/useLazyLoad';

interface GalleryTileProps {
  item: GalleryItem;
  index: number;
  onOpen: (index: number) => void;
}

export const GalleryTile: React.FC<GalleryTileProps> = ({ item, index, onOpen }) => {
  const { ref, isVisible } = useLazyLoad('300px');
  const [imgLoaded, setImgLoaded] = useState(false);
  const isGrad = isGradient(item.imageUrl);

  // Compute aspect-ratio padding from real dimensions (prevents CLS)
  const paddingBottom = `${(item.height / item.width) * 100}%`;

  return (
    <div
      ref={ref}
      className="gallery-tile"
      onClick={() => onOpen(index)}
      role="button"
      tabIndex={0}
      aria-label={`Open photo: ${item.title}`}
      onKeyDown={e => e.key === 'Enter' && onOpen(index)}
    >
      {/* Aspect-ratio box prevents layout shift before image loads */}
      <div className="gallery-tile-inner" style={{ paddingBottom }}>
        {/* Placeholder shown while lazy loading hasn't triggered or image is loading */}
        <div
          className={`gallery-tile-placeholder ${imgLoaded || isGrad ? 'gallery-tile-placeholder--hidden' : ''}`}
        />

        {/* Only render once visible in viewport */}
        {isVisible && (
          isGrad ? (
            <div
              className="gallery-tile-media"
              style={{ background: item.imageUrl }}
              aria-hidden="true"
            />
          ) : (
            <img
              src={item.imageUrl}
              alt={item.title}
              className={`gallery-tile-media gallery-tile-img ${imgLoaded ? 'gallery-tile-img--loaded' : ''}`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
            />
          )
        )}

        {/* Hover overlay */}
        <div className="gallery-tile-overlay" aria-hidden="true">
          <div className="gallery-tile-overlay-inner">
            <ZoomIn size={24} className="gallery-tile-zoom-icon" />
            <p className="gallery-tile-overlay-title">{item.title}</p>
            <span className="gallery-tile-overlay-cat">{item.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
