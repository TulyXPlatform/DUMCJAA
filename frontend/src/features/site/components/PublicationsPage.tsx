import React from 'react';
import { StaticInfoPage } from './StaticInfoPage';

export const PublicationsPage: React.FC = () => {
  return (
    <StaticInfoPage
      eyebrow="Publications"
      title="Research, Alumni Stories & Department Insights"
      description="A curated archive of alumni publications, feature stories, and department contributions."
      sections={[
        {
          title: 'Featured Stories',
          body: 'Highlights from alumni working in journalism, communication strategy, broadcasting, documentary, digital media, and academia.',
        },
        {
          title: 'Academic Publications',
          body: 'Selected papers, reports, and media research outputs contributed by faculty, researchers, and alumni collaborators.',
        },
        {
          title: 'Submission & Editorial',
          body: 'To submit a publication for review, contact the editorial team through the contact page with publication details and reference links.',
        },
      ]}
    />
  );
};
