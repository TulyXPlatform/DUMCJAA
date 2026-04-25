// Static blog posts — in production these would come from a CMS API (/api/posts).
// Using static data here makes the blog resilient to backend downtime and
// allows content editors to write posts without a deploy cycle.
import { PostSummary, Post } from '../types';

export const STATIC_POSTS: PostSummary[] = [
  {
    id: '1',
    title: 'DUMCJAA Member Wins National Press Award for Investigative Reporting',
    slug: 'national-press-award-2026',
    excerpt: 'Senior alumnus Karim Uddin was recognized at the 2026 National Press Club ceremony for his six-month investigation into economic reform irregularities — a story that changed national policy.',
    category: 'Achievement',
    tags: ['Press Award', 'Journalism', 'Achievement'],
    author: { name: 'Editorial Team', avatarUrl: undefined },
    publishedAt: '2026-04-20T08:00:00Z',
    coverImageUrl: undefined,
    readTimeMinutes: 5,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Annual Scholarship Fund Now Open — Apply Before June 1st',
    slug: 'scholarship-2026-open',
    excerpt: 'The DUMCJAA Scholarship Committee is accepting applications for the 2026 merit-based scholarship worth BDT 50,000. Final-year undergraduate students are encouraged to apply.',
    category: 'Scholarship',
    tags: ['Scholarship', 'Students', 'Application'],
    author: { name: 'Admin Office', avatarUrl: undefined },
    publishedAt: '2026-04-15T09:30:00Z',
    coverImageUrl: undefined,
    readTimeMinutes: 3,
    isFeatured: false,
  },
  {
    id: '3',
    title: 'Alumni Mentorship Program Launches Its Largest Cohort Yet — 120 Mentors',
    slug: 'mentorship-2026-cohort',
    excerpt: 'This year\'s cohort sees 120 senior alumni commit to guiding final-year students across media, broadcast journalism, digital communications, and PR.',
    category: 'Community',
    tags: ['Mentorship', 'Community', 'Students'],
    author: { name: 'Program Director', avatarUrl: undefined },
    publishedAt: '2026-04-10T10:00:00Z',
    coverImageUrl: undefined,
    readTimeMinutes: 4,
    isFeatured: false,
  },
  {
    id: '4',
    title: 'New Research Paper: How Digital Journalism Changed Political Coverage in Bangladesh',
    slug: 'digital-journalism-research-2026',
    excerpt: 'A peer-reviewed paper by three DUMCJAA alumni documents how mobile-first media shifted the political reporting landscape between 2018–2024.',
    category: 'Research',
    tags: ['Research', 'Digital Media', 'Bangladesh'],
    author: { name: 'Dr. Farhana Islam', avatarUrl: undefined },
    publishedAt: '2026-04-05T08:00:00Z',
    coverImageUrl: undefined,
    readTimeMinutes: 8,
    isFeatured: true,
  },
  {
    id: '5',
    title: 'Annual General Meeting 2026 — Results and Resolutions',
    slug: 'agm-2026-results',
    excerpt: 'The 2026 AGM saw record attendance with 340 registered members. Key resolutions passed include a new digital archive fund and revised membership fee structure.',
    category: 'Announcement',
    tags: ['AGM', 'Governance', 'Membership'],
    author: { name: 'Secretary General', avatarUrl: undefined },
    publishedAt: '2026-03-28T14:00:00Z',
    coverImageUrl: undefined,
    readTimeMinutes: 6,
    isFeatured: false,
  },
  {
    id: '6',
    title: '"Journalism Must Serve Truth, Not Power" — An Interview with Rafiqul Hasan',
    slug: 'interview-rafiqul-hasan',
    excerpt: 'Sitting down with one of Bangladesh\'s most decorated journalists, we discuss the evolution of press freedom, the responsibility of alumni networks, and advice for the next generation.',
    category: 'Interview',
    tags: ['Interview', 'Press Freedom', 'Alumni'],
    author: { name: 'Editorial Team', avatarUrl: undefined },
    publishedAt: '2026-03-20T09:00:00Z',
    coverImageUrl: undefined,
    readTimeMinutes: 10,
    isFeatured: false,
  },
];

export const STATIC_POST_BODIES: Record<string, string> = {
  'national-press-award-2026': `
    <p>In a ceremony held at the National Press Club auditorium in Dhaka, Karim Uddin — a 2010 graduate of the Department of Mass Communication and Journalism, Dhaka University — was presented with the <strong>Gold Award for Investigative Journalism</strong>.</p>
    <p>His six-month investigation, titled <em>"Silent Transfers: How Public Funds Disappeared in Broad Daylight"</em>, exposed a sophisticated system of financial misdirection within a government procurement body. The report, originally published in the Daily Star, triggered a parliamentary inquiry committee and ultimately led to policy reform.</p>
    <h2>The Investigation</h2>
    <p>Karim and his team spent 183 days cross-referencing government tender documents, company registration records, and bank audit reports obtained through Freedom of Information requests. The investigation required building a custom data-matching tool to detect anomalies across 12,000 records.</p>
    <blockquote><p>"We didn't have a story for the first four months. We had a hunch and an obligation. That's what journalism is."<br/><cite>— Karim Uddin</cite></p></blockquote>
    <h2>DUMCJAA's Response</h2>
    <p>The DUMCJAA Executive Committee congratulated Karim and expressed pride in his work representing the values instilled by the department.</p>
    <p>This award marks the third consecutive year a DUMCJAA alumnus has won a top national press accolade, reinforcing the department's reputation as Bangladesh's foremost journalism institution.</p>
  `,
  'digital-journalism-research-2026': `
    <p>A new peer-reviewed paper published in the <em>Asian Journal of Media Studies</em> documents how the proliferation of mobile internet in Bangladesh fundamentally altered the relationship between political journalism and its audiences.</p>
    <h2>Key Findings</h2>
    <p>The research, spanning six years of content analysis from 2018 to 2024, found that:</p>
    <ul>
      <li>Mobile-first news platforms attracted 3.2× more engagement on political content than legacy print brands' digital editions</li>
      <li>Short-form video journalism grew from 4% to 38% of total political media consumption</li>
      <li>Reader trust in established brands dropped 18 points while hyperlocal outlets gained 22 points</li>
    </ul>
    <h2>Implications for Journalism Education</h2>
    <p>The authors recommend that journalism curricula urgently integrate data journalism, video production, and algorithmic literacy into core modules — a shift already underway at DU's MCJ department.</p>
    <blockquote><p>"The platform is now the editor. Journalists who don't understand distribution are writing for no one."<br/><cite>— Dr. Farhana Islam</cite></p></blockquote>
  `,
};

// Simulate fetching a single post by slug
export function getPostBySlug(slug: string): Post | undefined {
  const summary = STATIC_POSTS.find(p => p.slug === slug);
  if (!summary) return undefined;
  return {
    ...summary,
    content: STATIC_POST_BODIES[slug] ?? `<p>${summary.excerpt}</p><p>Full article coming soon.</p>`,
    updatedAt: summary.publishedAt,
  };
}
