import React from 'react';
import { X, RotateCcw, SlidersHorizontal, Ban } from 'lucide-react';
import { FilterState } from '../types/gift';
import {
  RECIPIENTS,
  INTERESTS,
  OCCASIONS,
  PRODUCT_TYPES,
  PERSONALITY_STYLES,
  AVOID_PRESETS
} from '../data/catalog';

interface RefineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalMatchedCount: number;
}

export const RefineDrawer: React.FC<RefineDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  totalMatchedCount,
}) => {
  if (!isOpen) return null;

  const toggleArrayFilter = (
    key: 'recipients' | 'interests' | 'occasions' | 'productTypes' | 'personalityStyles',
    value: string
  ) => {
    const current = filters[key];
    const exists = current.includes(value);
    const updated = exists ? current.filter(item => item !== value) : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  const toggleAvoidFilter = (term: string) => {
    const current = filters.avoidKeywords || [];
    const exists = current.includes(term);
    const updated = exists ? current.filter(item => item !== term) : [...current, term];
    onFilterChange({ ...filters, avoidKeywords: updated });
  };

  const handlePriceRange = (range: FilterState['priceRange']) => {
    onFilterChange({ ...filters, priceRange: range });
  };

  const handleReset = () => {
    onFilterChange({
      recipients: [],
      interests: [],
      priceRange: 'all',
      maxPrice: null,
      productTypes: [],
      occasions: [],
      personalityStyles: [],
      avoidKeywords: [],
      sortBy: 'relevance'
    });
  };

  const activeCount =
    filters.recipients.length +
    filters.interests.length +
    (filters.priceRange !== 'all' ? 1 : 0) +
    filters.productTypes.length +
    filters.occasions.length +
    filters.personalityStyles.length +
    (filters.avoidKeywords?.length || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1E232B]/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#DCE1E7] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E2E5E9] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#2A548E]" />
              <h2 className="font-editorial text-xl font-bold text-[#1E232B]">
                Refine Recommendations
              </h2>
              {activeCount > 0 && (
                <span className="font-mono-accent text-xs bg-[#C3F3DF] text-[#1E232B] px-2 py-0.5 rounded-full font-bold">
                  {activeCount}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#5A6270] hover:text-[#1E232B] hover:bg-[#EAEFF5] rounded-xs transition-colors cursor-pointer"
              aria-label="Close refine drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-7">
            
            {/* Sort Order */}
            <div>
              <label className="font-mono-accent text-[11px] font-bold uppercase tracking-wider text-[#5A6270] block mb-2.5">
                Sort By
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'relevance', label: 'Smart Relevance' },
                  { id: 'price-asc', label: 'Price: Low to High' },
                  { id: 'price-desc', label: 'Price: High to Low' },
                  { id: 'rating', label: 'Highest Rated' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onFilterChange({ ...filters, sortBy: s.id as any })}
                    className={`px-3 py-2 text-xs font-sans-clean rounded-xs border transition-colors text-left cursor-pointer ${
                      filters.sortBy === s.id
                        ? 'bg-[#1E232B] text-white border-[#1E232B] font-semibold'
                        : 'bg-white text-[#1E232B] border-[#DCE1E7] hover:bg-[#EAEFF5]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Anti-Gift / Avoid Clichés & Items */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Ban className="w-3.5 h-3.5 text-[#8D96A5]" />
                <label className="font-mono-accent text-[11px] font-bold uppercase tracking-wider text-[#5A6270]">
                  Filter Out Clichés (What to Avoid)
                </label>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {AVOID_PRESETS.map((preset) => {
                  const active = (filters.avoidKeywords || []).includes(preset.term);
                  return (
                    <button
                      key={preset.id}
                      onClick={() => toggleAvoidFilter(preset.term)}
                      className={`px-2.5 py-1 text-xs font-sans-clean rounded-xs border transition-colors cursor-pointer flex items-center gap-1 ${
                        active
                          ? 'bg-[#1E232B] text-white border-[#1E232B] font-semibold shadow-2xs'
                          : 'bg-white text-[#5A6270] hover:text-[#1E232B] border-[#DCE1E7] hover:bg-[#EAEFF5]'
                      }`}
                    >
                      <span className={active ? 'text-[#C3F3DF]' : 'text-[#8D96A5]'}>
                        {active ? '✕' : '–'}
                      </span>
                      <span>{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget Presets */}
            <div>
              <label className="font-mono-accent text-[11px] font-bold uppercase tracking-wider text-[#5A6270] block mb-2.5">
                Target Budget
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'All Budgets' },
                  { id: 'under25', label: 'Under $25' },
                  { id: '25to50', label: '$25 – $50' },
                  { id: '50to75', label: '$50 – $75' },
                  { id: '75plus', label: '$75 & Above' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handlePriceRange(b.id as any)}
                    className={`px-3 py-2 text-xs font-sans-clean rounded-xs border transition-colors text-left cursor-pointer ${
                      filters.priceRange === b.id
                        ? 'bg-[#1E232B] text-white border-[#1E232B] font-semibold'
                        : 'bg-white text-[#1E232B] border-[#DCE1E7] hover:bg-[#EAEFF5]'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient */}
            <div>
              <label className="font-mono-accent text-[11px] font-bold uppercase tracking-wider text-[#5A6270] block mb-2.5">
                Recipient
              </label>
              <div className="flex flex-wrap gap-1.5">
                {RECIPIENTS.map((rec) => {
                  const active = filters.recipients.includes(rec);
                  return (
                    <button
                      key={rec}
                      onClick={() => toggleArrayFilter('recipients', rec)}
                      className={`px-2.5 py-1 text-xs font-sans-clean rounded-xs border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#1E232B] text-white border-[#1E232B] font-semibold'
                          : 'bg-white text-[#1E232B] border-[#DCE1E7] hover:bg-[#EAEFF5]'
                      }`}
                    >
                      {rec}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interests & Passions */}
            <div>
              <label className="font-mono-accent text-[11px] font-bold uppercase tracking-wider text-[#5A6270] block mb-2.5">
                Interests & Passions
              </label>
              <div className="flex flex-wrap gap-1.5">
                {INTERESTS.map((interest) => {
                  const active = filters.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleArrayFilter('interests', interest)}
                      className={`px-2.5 py-1 text-xs font-sans-clean rounded-xs border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#2A548E] text-white border-[#2A548E] font-semibold'
                          : 'bg-white text-[#1E232B] border-[#DCE1E7] hover:bg-[#EAEFF5]'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personality & Gifting Style */}
            <div>
              <label className="font-mono-accent text-[11px] font-bold uppercase tracking-wider text-[#5A6270] block mb-2.5">
                Personality & Gifting Style
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PERSONALITY_STYLES.map((style) => {
                  const active = filters.personalityStyles.includes(style);
                  return (
                    <button
                      key={style}
                      onClick={() => toggleArrayFilter('personalityStyles', style)}
                      className={`px-2.5 py-1 text-xs font-sans-clean rounded-xs border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#226E56] text-white border-[#226E56] font-semibold'
                          : 'bg-white text-[#1E232B] border-[#DCE1E7] hover:bg-[#EAEFF5]'
                      }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Type */}
            <div>
              <label className="font-mono-accent text-[11px] font-bold uppercase tracking-wider text-[#5A6270] block mb-2.5">
                Product Format / Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRODUCT_TYPES.map((pt) => {
                  const active = filters.productTypes.includes(pt);
                  return (
                    <button
                      key={pt}
                      onClick={() => toggleArrayFilter('productTypes', pt)}
                      className={`px-2.5 py-1 text-xs font-sans-clean rounded-xs border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#1E232B] text-white border-[#1E232B] font-semibold'
                          : 'bg-white text-[#1E232B] border-[#DCE1E7] hover:bg-[#EAEFF5]'
                      }`}
                    >
                      {pt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <label className="font-mono-accent text-[11px] font-bold uppercase tracking-wider text-[#5A6270] block mb-2.5">
                Occasion
              </label>
              <div className="flex flex-wrap gap-1.5">
                {OCCASIONS.map((occ) => {
                  const active = filters.occasions.includes(occ);
                  return (
                    <button
                      key={occ}
                      onClick={() => toggleArrayFilter('occasions', occ)}
                      className={`px-2.5 py-1 text-xs font-sans-clean rounded-xs border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#1E232B] text-white border-[#1E232B] font-semibold'
                          : 'bg-white text-[#1E232B] border-[#DCE1E7] hover:bg-[#EAEFF5]'
                      }`}
                    >
                      {occ}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-5 bg-white border-t border-[#E2E5E9] flex items-center justify-between gap-3">
            <button
              onClick={handleReset}
              disabled={activeCount === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans-clean font-medium text-[#5A6270] hover:text-[#1E232B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#1E232B] hover:bg-[#2A548E] text-white font-sans-clean text-xs font-semibold rounded-xs transition-colors cursor-pointer shadow-xs"
            >
              Show {totalMatchedCount} Results
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
