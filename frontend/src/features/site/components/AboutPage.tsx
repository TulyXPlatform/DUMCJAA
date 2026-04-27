import React from 'react';
import { StaticInfoPage } from './StaticInfoPage';

export const AboutPage: React.FC = () => {
  return (
    <StaticInfoPage
      eyebrow="About Us"
      title="DU Mass Communication & Journalism Alumni Association"
      description="We connect alumni, students, and faculty through mentorship, knowledge exchange, and community programs."
      sections={[
        {
          title: 'Our Mission',
          body: 'Build a meaningful alumni network that supports professional growth, lifelong learning, and collaborative impact across media and communication sectors.',
        },
        {
          title: 'What We Do',
          body: 'We organize reunions, talks, workshops, publications, and career-support initiatives that keep our alumni community active and future-focused.',
        },
        {
          title: 'Community Values',
          body: 'Integrity, service, and professional excellence guide our activities as we preserve institutional legacy while creating opportunities for the next generation.',
        },
      ]}
    />
  );
};
