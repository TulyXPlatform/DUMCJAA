import React from 'react';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { FeaturedAlumniSection } from './FeaturedAlumniSection';
import { UpcomingEventsSection } from './UpcomingEventsSection';
import { LatestNewsSection } from './LatestNewsSection';
import { GallerySection } from './GallerySection';
import { CtaSection } from './CtaSection';
import './HomePage.css';

export const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedAlumniSection />
      <UpcomingEventsSection />
      <LatestNewsSection />
      <GallerySection />
      <CtaSection />
    </>
  );
};
