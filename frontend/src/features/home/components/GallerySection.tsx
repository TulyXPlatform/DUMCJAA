import React from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

// Gallery tiles — each represents a photo from a past event.
// In production these would come from the File Upload API.
const GALLERY_TILES = [
  { id: 1, label: 'Annual Reunion 2025', span: 'tile-large' },
  { id: 2, label: 'Award Night', span: '' },
  { id: 3, label: 'Scholarship Gala', span: '' },
  { id: 4, label: 'Sports Day', span: '' },
  { id: 5, label: 'Cultural Fest', span: 'tile-wide' },
];

// Gradient palette for each tile (simulates real images)
const TILE_COLORS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];

export const GallerySection: React.FC = () => (
  <section className="home-section bg-main">
    <div className="container">
      <div className="section-header-row">
        <div>
          <span className="section-eyebrow">Memories</span>
          <h2 className="section-title">Photo Gallery</h2>
        </div>
        <Link to="/gallery" className="view-all-link">View Full Gallery →</Link>
      </div>

      <div className="gallery-grid">
        {GALLERY_TILES.map((tile, idx) => (
          <div
            key={tile.id}
            className={`gallery-tile ${tile.span}`}
            style={{ background: TILE_COLORS[idx % TILE_COLORS.length] }}
            role="img"
            aria-label={tile.label}
          >
            <div className="gallery-tile-overlay">
              <Camera size={20} />
              <span>{tile.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
