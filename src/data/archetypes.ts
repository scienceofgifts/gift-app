import { FilterState } from '../types/gift';

export interface EditorialArchetype {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  iconName: 'Compass' | 'Telescope' | 'Coffee' | 'BookOpen';
  query: string;
  interests: string[];
  personalityStyles: string[];
  defaultFilters: Partial<FilterState>;
}

export const EDITORIAL_ARCHETYPES: EditorialArchetype[] = [
  {
    id: 'archival-historian',
    title: 'The Archival Historian',
    tagline: 'Passionate about WWII schematics, antique cartography, and timeless horology.',
    badge: 'Archival & Heirlooms',
    iconName: 'Compass',
    query: 'Archival WWII history, vintage maps, and durable mechanical heirlooms',
    interests: ['WWII', 'Cartography & Maps', 'Vintage Horology', 'Military History'],
    personalityStyles: ['Nostalgic & Historic', 'Practical & Utilitarian', 'Refined & Discerning'],
    defaultFilters: {
      interests: ['WWII', 'Cartography & Maps', 'Vintage Horology'],
      personalityStyles: ['Nostalgic & Historic', 'Practical & Utilitarian'],
      avoidKeywords: ['decorative']
    }
  },
  {
    id: 'deep-thinker-astronomer',
    title: 'The Deep Thinker & Astronomer',
    tagline: 'Fascinated by deep-space cosmology, quantum physics, and tactile desk curiosities.',
    badge: 'Cosmic & Curiosity',
    iconName: 'Telescope',
    query: 'Deep space astronomy, physics, mathematics, and intellectual desk curiosities',
    interests: ['Astronomy & Space', 'Physics & Math', 'Literature & Writing'],
    personalityStyles: ['Intellectual & Curious', 'Refined & Discerning'],
    defaultFilters: {
      interests: ['Astronomy & Space', 'Physics & Math'],
      personalityStyles: ['Intellectual & Curious'],
      avoidKeywords: []
    }
  },
  {
    id: 'espresso-chemist',
    title: 'The Third-Wave Espresso Chemist',
    tagline: 'Dedicated to precision extraction ratios, laboratory glass, and tactile mechanics.',
    badge: 'Precision Extraction',
    iconName: 'Coffee',
    query: 'Third-wave specialty coffee extraction, laboratory drippers, and tactile mechanics',
    interests: ['Coffee & Brewing', 'Tactile Mechanics'],
    personalityStyles: ['Practical & Utilitarian', 'Intellectual & Curious'],
    defaultFilters: {
      interests: ['Coffee & Brewing', 'Tactile Mechanics'],
      personalityStyles: ['Practical & Utilitarian'],
      avoidKeywords: ['candle']
    }
  },
  {
    id: 'dark-academia-bibliophile',
    title: 'The Ancient Lore & Dark Academia Bibliophile',
    tagline: 'Immersed in classical Greek antiquity, antiquarian literature, and botanical aesthetics.',
    badge: 'Antiquity & Lore',
    iconName: 'BookOpen',
    query: 'Greek mythology, antiquarian literature, and botanical atmospheric curiosities',
    interests: ['Greek Mythology', 'Literature & Writing', 'Botany & Nature'],
    personalityStyles: ['Intellectual & Curious', 'Creative & Artistic', 'Refined & Discerning'],
    defaultFilters: {
      interests: ['Greek Mythology', 'Literature & Writing', 'Botany & Nature'],
      personalityStyles: ['Refined & Discerning', 'Creative & Artistic'],
      avoidKeywords: []
    }
  }
];
