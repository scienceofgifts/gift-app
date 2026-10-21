import React from 'react';
import { X, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { FilterState } from '../types/gift';
import {
  RECIPIENTS,
  INTERESTS,
  OCCASIONS,
  PRODUCT_TYPES,
  PERSONALITY_STYLES
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
      sortBy: 'relevance'
    });
  };

  const activeCount =
    filters.recipients.length +
    filters.interests.length +
    (filters.priceRange !== 'all' ? 1 : 0) +
    filters.productTypes.length +
    filters.occasions.length +
    filters.personalityStyles.length;

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
                Sort Results By
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Concierge Relevance', value: 'relevance' },
                  { label: 'Price: Low to High', value: 'price-asc' },
                  { label: 'Price: High to Low', value: 'price-desc' },
                  { label: 'Highest Rated', value: 'rating' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onFilterChange({ ...filters, sortBy: opt.value as any })}
                    className={`px-3 py-2 text-xs font-sans-clean rounded-xs border text-left transition-colors cursor-pointer ${
                      filters.sortBy === opt.value
                        ? 'bg-[#1E232B] text-white border-[#1E232B] font-semibold'
                        : 'bg-white text-[#1E232B] border-[#DCE1E7] hover:bg-[#EAEFF5]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget / Price Range */}
            <div>
              <label className="font-mono-accent text-[11px] font-bold uppercase tracking-wider text-[#5A6270] block mb-2.5">
                Budget / Price Bracket
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Any Price', val: 'all' },
                  { label: 'Under $25', val: 'under25' },
                  { label: '$25–$50', val: '25to50' },
                  { label: '$50–$75', val: '50to75' },
                  { label: '$75+', val: '75plus' }
                ].map((tier) => (
                  <button
                    key={tier.val}
                    onClick={() => handlePriceRange(tier.val as any)}
                    className={`px-2.5 py-1.5 text-xs font-sans-clean rounded-xs border text-center transition-colors cursor-pointer ${
                      filters.priceRange === tier.val
                        ? 'bg-[#1E232B] text-white border-[#1E232B] font-semibold'
                        : 'bg-white text-[#1E232B] border-[#DCE1E7] hover:bg-[#EAEFF5]'
                    }`}
                  >
                    {tier.label}
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

            {/* Specific Interests & Passions */}
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
                          ? 'bg-[#1E232B] text-white border-[#1E232B] font-semibold'
                          : 'bg-white text-[#1E232B] border-[#DCE1E7] hover:bg-[#EAEFF5]'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personality & Style */}
            <div>
              <label className="font-mono-accent text-[11px] font-bold uppercase tracking-wider text-[#5A6270] block mb-2.5">
                Personality & Style
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
                          ? 'bg-[#1E232B] text-white border-[#1E232B] font-semibold'
                          : 'bg-white text-[#1E232B] border-[#DCE1E7] hover:bg-[#EAEFF5]'
                      }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Type / Format */}
            <div>
              <label className="font-mono-accent text-[11px] font-bold uppercase tracking-wider text-[#5A6270] block mb-2.5">
                Product Format
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRODUCT_TYPES.map((type) => {
                  const active = filters.productTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => toggleArrayFilter('productTypes', type)}
                      className={`px-2.5 py-1 text-xs font-sans-clean rounded-xs border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#1E232B] text-white border-[#1E232B] font-semibold'
                          : 'bg-white text-[#1E232B] border-[#DCE1E7] hover:bg-[#EAEFF5]'
                      }`}
                    >
                      {type}
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
