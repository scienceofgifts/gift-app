import React from 'react';
import { Compass, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1E232B] text-[#DCE1E7] border-t border-[#313742] pt-14 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#313742]">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <a
              href="https://scienceofgifts.com"
              className="flex items-center gap-2 text-white hover:text-[#C3F3DF] transition-colors"
            >
              <Compass className="w-5 h-5 text-[#C3F3DF]" />
              <span className="font-editorial text-2xl font-bold tracking-tight">
                SCIENCE OF GIFTS
              </span>
            </a>
            <p className="font-sans-clean text-xs text-[#8D96A5] leading-relaxed max-w-sm">
              An intelligent editorial gift concierge for those with curious minds and distinctive passions. Designed to turn genuine interests into unforgettable gifts.
            </p>
            <div className="font-mono-accent text-[11px] text-[#7A8290] tracking-wider uppercase pt-2 flex items-center gap-3">
              <a
                href="https://scienceofgifts.com"
                className="hover:text-white transition-colors underline-offset-2 hover:underline"
              >
                scienceofgifts.com
              </a>
              <span>·</span>
              <a
                href="https://shop.scienceofgifts.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C3F3DF] hover:text-white transition-colors inline-flex items-center gap-1"
              >
                <span>Official Shop</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Categories & Passions */}
          <div className="md:col-span-3 space-y-3 font-sans-clean text-xs">
            <span className="font-mono-accent text-[11px] font-bold uppercase tracking-wider text-white block">
              Curated Fields
            </span>
            <ul className="space-y-2 text-[#8D96A5]">
              <li>WWII & Military History</li>
              <li>Classical Greek Mythology</li>
              <li>Cinema & 35mm Filmmaking</li>
              <li>Astronomy & Deep Space</li>
              <li>Cartography & Topography</li>
              <li>Tactile Mechanics & Precision Brass</li>
            </ul>
          </div>

          {/* Curatorial Principles */}
          <div className="md:col-span-4 space-y-3 font-sans-clean text-xs">
            <span className="font-mono-accent text-[11px] font-bold uppercase tracking-wider text-white block">
              Our Gift Standard
            </span>
            <p className="text-[#8D96A5] leading-relaxed">
              Every item is vetted against three strict criteria: authentic subject provenance, tactile heirloom material quality, and real daily utility. We reject cheap plastic novelty filler.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans-clean text-xs text-[#7A8290]">
          <p>© {new Date().getFullYear()} Science of Gifts. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Client-Side Static Engine</span>
            <span>Zero Tracking Telemetry</span>
            <span>Local Storage Persistence</span>
          </div>
        </div>

        {/* Amazon Affiliate Legal Disclosure */}
        <div className="pt-6 mt-6 border-t border-[#313742] text-[11px] text-[#7A8290] font-sans-clean text-center sm:text-left leading-relaxed">
          <p>
            Science of Gifts is an independent editorial discovery platform. As an Amazon Associate and affiliate partner with archival cultural institutions, we may earn a small commission from qualifying purchases made through our curated links at zero additional cost to you. Product prices and availability are subject to change on merchant sites.
          </p>
        </div>

      </div>
    </footer>
  );
};
