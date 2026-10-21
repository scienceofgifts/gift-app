import React from 'react';
import { ArrowRight, Shield, Film, BookOpen, Atom } from 'lucide-react';

interface CuratedCollectionsProps {
  onSelectCollection: (query: string) => void;
}

const COLLECTIONS = [
  {
    id: 'ww2-archive',
    title: 'The WWII & Aviation Archive',
    tagline: 'Technical blueprints, tactical instruments, and declassified military history',
    query: 'WWII military history and tactical aviation',
    icon: Shield,
    badge: 'Archival Focus'
  },
  {
    id: 'mythology-pantheon',
    title: 'Mythology & Ancient Lore',
    tagline: 'Classical Greek gods, epic poetry, and ancient Athenian artifacts',
    query: 'Greek mythology ancient gods and epic literature',
    icon: BookOpen,
    badge: 'Classical Lore'
  },
  {
    id: 'cinema-directors',
    title: 'The Indie Filmmaker’s Toolkit',
    tagline: 'Optical viewfinders, 35mm celluloid barware, and production grids',
    query: 'Filmmaking cinema and director tools',
    icon: Film,
    badge: 'Cinematic'
  },
  {
    id: 'cosmos-astrophysics',
    title: 'Cosmos & Astrological Curiosities',
    tagline: 'Deep space infrared, Renaissance armillary spheres, and celestial cartography',
    query: 'Astronomy space and astrophysics',
    icon: Atom,
    badge: 'Scientific'
  }
];

export const CuratedCollections: React.FC<CuratedCollectionsProps> = ({ onSelectCollection }) => {
  return (
    <section className="py-14 border-t border-[#E2E5E9]">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-[#E2E5E9] mb-8">
        <div>
          <span className="text-xs font-mono-accent font-semibold uppercase tracking-wider text-[#2A548E] block mb-1">
            Editorial Collections
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#1E232B] font-bold">
            Explore Curated Passions
          </h2>
        </div>
        <p className="font-sans-clean text-xs sm:text-sm text-[#5A6270]">
          Deep dives into specific intellectual fascinations and historical themes
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {COLLECTIONS.map((col) => {
          const Icon = col.icon;
          return (
            <div
              key={col.id}
              onClick={() => onSelectCollection(col.query)}
              className="group p-5 bg-white hover:bg-[#F2F6FB] border border-[#DCE1E7] hover:border-[#2A548E]/50 rounded-sm transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xs bg-[#EAEFF5] flex items-center justify-center text-[#2A548E] group-hover:bg-[#2A548E] group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono-accent font-semibold uppercase tracking-wider text-[#226E56] bg-[#C3F3DF] px-2 py-0.5 rounded-xs">
                    {col.badge}
                  </span>
                </div>

                <h3 className="font-editorial text-xl text-[#1E232B] font-bold mb-2 group-hover:text-[#2A548E] transition-colors leading-snug">
                  {col.title}
                </h3>

                <p className="font-sans-clean text-xs text-[#5A6270] leading-relaxed mb-6">
                  {col.tagline}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-sans-clean font-semibold text-[#2A548E] group-hover:text-[#1B3C6B] pt-3 border-t border-[#F0F2F5]">
                <span>Discover Archive</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
