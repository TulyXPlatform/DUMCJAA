import React from 'react';
import { Newspaper, Clock } from 'lucide-react';

// News items are typically CMS-driven. These would be fetched from the Settings/CMS module.
// For now, using static data to demonstrate the layout.
const NEWS_ITEMS = [
  {
    id: 1,
    category: 'Achievement',
    date: 'April 20, 2026',
    title: 'DUMCJAA Member Wins National Press Award',
    excerpt: 'Senior alumnus Karim Uddin has been recognized at the National Press Club for outstanding investigative journalism covering the recent economic reforms.',
    readTime: '3 min read',
  },
  {
    id: 2,
    category: 'Announcement',
    date: 'April 15, 2026',
    title: 'Scholarship Fund Opens for Class of 2026 Students',
    excerpt: 'The DUMCJAA Scholarship Committee is now accepting applications for the annual merit-based scholarship worth BDT 50,000 each.',
    readTime: '2 min read',
  },
  {
    id: 3,
    category: 'Community',
    date: 'April 10, 2026',
    title: 'Alumni Mentorship Program Launches New Cohort',
    excerpt: 'Over 120 senior alumni have signed up to mentor final-year students in media, broadcast journalism, and digital communications.',
    readTime: '4 min read',
  },
];

const NewsCard: React.FC<{ item: typeof NEWS_ITEMS[0] }> = ({ item }) => (
  <article className="news-card card">
    <div className="news-card-meta">
      <span className="news-category">{item.category}</span>
      <span className="news-date"><Clock size={12} /> {item.readTime}</span>
    </div>
    <h3 className="news-title">{item.title}</h3>
    <p className="news-excerpt">{item.excerpt}</p>
    <div className="news-footer">
      <span className="news-date-text"><Newspaper size={13} /> {item.date}</span>
      <a href="#" className="news-read-more">Read more →</a>
    </div>
  </article>
);

export const LatestNewsSection: React.FC = () => (
  <section className="home-section bg-surface">
    <div className="container">
      <div className="section-header-row">
        <div>
          <span className="section-eyebrow">Stay Informed</span>
          <h2 className="section-title">Latest News</h2>
        </div>
        <a href="#" className="view-all-link">View All News →</a>
      </div>
      <div className="three-col-grid">
        {NEWS_ITEMS.map(item => <NewsCard key={item.id} item={item} />)}
      </div>
    </div>
  </section>
);
