import React from 'react';
import { StaticInfoPage } from './StaticInfoPage';

export const CareerPage: React.FC = () => {
  return (
    <StaticInfoPage
      eyebrow="Career Board"
      title="Opportunities for Excellence"
      description="Connect with alumni for job openings, mentorship, and professional growth."
      sections={[
        {
          title: 'Job Postings',
          body: 'Discover exclusive job opportunities shared by our alumni network across various sectors including media, communication, and corporate roles.',
        },
        {
          title: 'Mentorship',
          body: 'Connect with senior alumni for career guidance, portfolio reviews, and industry insights.',
        },
        {
          title: 'Talent Showcase',
          body: 'Highlight your skills and professional achievements to attract potential collaborators and employers within the DUMCJ community.',
        },
      ]}
    />
  );
};
