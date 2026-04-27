import React from 'react';
import { StaticInfoPage } from './StaticInfoPage';

export const ContactPage: React.FC = () => {
  return (
    <StaticInfoPage
      eyebrow="Contact"
      title="Get in Touch with DUMCJAA"
      description="For events, membership support, publication submissions, or partnership inquiries, our team is ready to help."
      sections={[
        {
          title: 'General Inquiries',
          body: 'Email: support@dumcjaa.com. Please include your full name, batch, and your request details for a faster response.',
        },
        {
          title: 'Events & Collaborations',
          body: 'For event partnerships, sponsorships, or speaker invitations, include your organization profile and proposed collaboration scope.',
        },
        {
          title: 'Membership & Account Help',
          body: 'If you face verification/login issues, contact support with your registered email address and we will assist with account recovery.',
        },
      ]}
    />
  );
};
