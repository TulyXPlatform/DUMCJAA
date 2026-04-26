import type { GalleryItem } from '../types';

// Gradients simulating real album photos until a backend file API is connected.
// Colors are deterministic per item so refreshes don't scramble the grid.
const GRADIENTS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  'linear-gradient(135deg,#fccb90,#d57eeb)',
  'linear-gradient(135deg,#e0c3fc,#8ec5fc)',
  'linear-gradient(135deg,#f6d365,#fda085)',
  'linear-gradient(135deg,#89f7fe,#66a6ff)',
  'linear-gradient(135deg,#fddb92,#d1fdff)',
  'linear-gradient(135deg,#a1c4fd,#c2e9fb)',
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id:'g1',  title:'Grand Alumni Reunion 2025',  caption:'Over 600 alumni gathered in TSC Auditorium for the Annual Grand Reunion.', category:'Reunions',    imageUrl:'', width:1600, height:1067, photographerName:'Rahim Studio', takenAt:'2025-12-15' },
  { id:'g2',  title:'Batch 2015 Reunion Dinner',  caption:'Batch 2015 celebrated 10 years since graduation.', category:'Reunions',    imageUrl:'', width:1600, height:1200, photographerName:'Rahim Studio', takenAt:'2025-11-20' },
  { id:'g3',  title:'Convocation Ceremony 2025',  caption:'More than 400 graduates received their degrees in a grand ceremony.', category:'Convocation', imageUrl:'', width:1600, height:1067, photographerName:'DU Photography', takenAt:'2025-10-05' },
  { id:'g4',  title:'Vice Chancellor\'s Address',  caption:'VC Prof. Dr. A.S.M. Maksud Kamal addressed the graduating class.', category:'Convocation', imageUrl:'', width:1600, height:1200, photographerName:'DU Photography', takenAt:'2025-10-05' },
  { id:'g5',  title:'Annual Football Tournament', caption:'Alumni football final match at Central Sports Ground.', category:'Sports',     imageUrl:'', width:1600, height:1067, photographerName:'Sports Desk', takenAt:'2025-09-10' },
  { id:'g6',  title:'Cricket League Winners',     caption:'Congratulations to Batch 2010 team for winning the alumni cricket league.', category:'Sports',     imageUrl:'', width:1600, height:1200, photographerName:'Sports Desk', takenAt:'2025-08-22' },
  { id:'g7',  title:'Basanta Utsab 2025',         caption:'The annual spring festival celebrated with color and music.', category:'Cultural',   imageUrl:'', width:1600, height:1067, photographerName:'Cultural Wing', takenAt:'2025-03-20' },
  { id:'g8',  title:'Cultural Evening Performance',caption:'Alumni showcased traditional music and dance.', category:'Cultural',   imageUrl:'', width:1600, height:1200, photographerName:'Cultural Wing', takenAt:'2025-02-14' },
  { id:'g9',  title:'Media Futures Seminar',      caption:'Panel discussion on the future of digital journalism in Bangladesh.', category:'Seminars',   imageUrl:'', width:1600, height:1067, photographerName:'Event Desk', takenAt:'2025-07-18' },
  { id:'g10', title:'AI in Journalism Workshop',  caption:'Hands-on training on AI-assisted investigative reporting.', category:'Seminars',   imageUrl:'', width:1600, height:1200, photographerName:'Event Desk', takenAt:'2025-06-05' },
  { id:'g11', title:'Campus Walk — Monsoon',      caption:'Capturing the beauty of Dhaka University during the monsoon.', category:'Campus Life', imageUrl:'', width:1600, height:1067, photographerName:'Campus Photo Club', takenAt:'2025-07-01' },
  { id:'g12', title:'Curzon Hall at Dawn',        caption:'The iconic Curzon Hall photographed at first light.', category:'Campus Life', imageUrl:'', width:1600, height:1200, photographerName:'Campus Photo Club', takenAt:'2025-05-10' },
];

// Inject gradient as the imageUrl so the component has something to render
GALLERY_ITEMS.forEach((item, idx) => {
  if (!item.imageUrl) {
    item.imageUrl = GRADIENTS[idx % GRADIENTS.length];
  }
});

export function isGradient(url: string): boolean {
  return url.startsWith('linear-gradient') || url.startsWith('radial-gradient');
}
