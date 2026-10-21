import React, { useState } from 'react';
import { Bookmark, Search, ArrowUpRight, Menu, X, RotateCcw } from 'lucide-react';
import { useSavedGifts } from '../context/SavedGiftsContext';

interface HeaderProps {
  onSearchClick: () => void;
  onFilterForAudience: (audience: 'men' | 'women' | 'guides') => void;
  onResetSearch: () => void;
  hasActiveSearch: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  onFilterForAudience,
  onResetSearch,
  hasActiveSearch,
}) => {
  const { totalSavedCount, setSavedDrawerOpen } = useSavedGifts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E2E5E9] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Primary Brand (links to main Science of Gifts site) */}
        <div className="flex items-center gap-6">
          <a
            href="https://scienceofgifts.com"
            className="group flex flex-col items-start text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A548E]"
          >
            <span className="font-editorial text-2xl sm:text-2xl font-bold tracking-tight text-[#1E232B] group-hover:text-[#2A548E] transition-colors">
              SCIENCE OF GIFTS
            </span>
            <span className="font-mono-accent text-[9.5px] tracking-[0.2em] uppercase text-[#5A6270] -mt-1 font-medium">
              Gift Discovery Engine
            </span>
          </a>
        </div>

        {/* Zone 2: Editorial Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 font-sans-clean text-sm font-medium text-[#5A6270]">
          {/* Active section: Gift Finder */}
          <button
            onClick={onSearchClick}
            className="text-[#1E232B] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer relative py-1"
          >
            <span>Gift Finder</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#226E56]" />
          </button>

          <button
            onClick={() => onFilterForAudience('guides')}
            className="hover:text-[#1E232B] transition-colors cursor-pointer"
          >
            Gift Guides
          </button>

          <a
            href="https://scienceofgifts.com/articles"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1E232B] transition-colors cursor-pointer"
          >
            Articles
          </a>

          <button
            onClick={() => onFilterForAudience('men')}
            className="hover:text-[#1E232B] transition-colors cursor-pointer"
          >
            For Men
          </button>

          <button
            onClick={() => onFilterForAudience('women')}
            className="hover:text-[#1E232B] transition-colors cursor-pointer"
          >
            For Women
          </button>

          {/* Visually distinct Shop button in Science of Gifts soft mint #C3F3DF */}
          <a
            href="https://shop.scienceofgifts.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[#C3F3DF] hover:bg-[#B0EBCF] text-[#1E232B] border border-[#A6DFC8] text-xs font-semibold rounded-xs transition-colors shadow-2xs"
          >
            <span>Shop</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#1E232B]" />
          </a>
        </nav>

        {/* Zone 3: Actions (Search, Saved, Mobile Hamburger) */}
        <div className="flex items-center gap-3">
          {hasActiveSearch && (
            <button
              onClick={onResetSearch}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5A6270] hover:text-[#1E232B] border border-[#DCE1E7] hover:border-[#BFC7D2] rounded-xs bg-white/60 transition-all cursor-pointer"
              title="Reset to New Search"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={onSearchClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5A6270] hover:text-[#1E232B] border border-[#DCE1E7] hover:border-[#BFC7D2] rounded-xs bg-white transition-all cursor-pointer"
            aria-label="Jump to search"
          >
            <Search className="w-3.5 h-3.5 text-[#2A548E]" />
            <span className="hidden sm:inline">Search</span>
          </button>

          {/* Saved Gifts & Lists Trigger */}
          <button
            onClick={() => setSavedDrawerOpen(true)}
            className="relative inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#1E232B] bg-white hover:bg-[#F2F4F7] border border-[#DCE1E7] rounded-xs transition-all cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-[#2A548E]"
            aria-label={`Saved Gift Lists (${totalSavedCount})`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${totalSavedCount > 0 ? 'text-[#226E56] fill-[#C3F3DF]' : 'text-[#5A6270]'}`} />
            <span>Saved</span>
            <span className="font-mono-accent bg-[#EAEFF5] text-[#1E232B] text-[11px] px-1.5 py-0.2 rounded-full font-semibold">
              {totalSavedCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#5A6270] hover:text-[#1E232B] border border-[#DCE1E7] rounded-xs bg-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E5E9] bg-[#FAF8F5] px-4 py-4 space-y-3 font-sans-clean text-sm">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                onSearchClick();
                setMobileMenuOpen(false);
              }}
              className="text-left font-semibold text-[#1E232B] py-1.5 flex items-center justify-between"
            >
              <span>Gift Finder</span>
              <span className="w-2 h-2 rounded-full bg-[#226E56]" />
            </button>
            <button
              onClick={() => {
                onFilterForAudience('guides');
                setMobileMenuOpen(false);
              }}
              className="text-left text-[#5A6270] hover:text-[#1E232B] py-1.5"
            >
              Gift Guides
            </button>
            <a
              href="https://scienceofgifts.com/articles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5A6270] hover:text-[#1E232B] py-1.5"
            >
              Articles
            </a>
            <button
              onClick={() => {
                onFilterForAudience('men');
                setMobileMenuOpen(false);
              }}
              className="text-left text-[#5A6270] hover:text-[#1E232B] py-1.5"
            >
              For Men
            </button>
            <button
              onClick={() => {
                onFilterForAudience('women');
                setMobileMenuOpen(false);
              }}
              className="text-left text-[#5A6270] hover:text-[#1E232B] py-1.5"
            >
              For Women
            </button>
          </div>

          <div className="pt-3 border-t border-[#E2E5E9] flex items-center justify-between">
            <a
              href="https://shop.scienceofgifts.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C3F3DF] text-[#1E232B] border border-[#A6DFC8] text-xs font-semibold rounded-xs"
            >
              <span>Shop Official Store</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://scienceofgifts.com"
              className="text-xs text-[#2A548E] font-medium"
            >
              scienceofgifts.com &rarr;
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
