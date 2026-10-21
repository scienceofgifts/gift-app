import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles, Eye } from 'lucide-react';
import { ScoredProduct, Product } from '../types/gift';
import { SaveToListPopover } from './SaveToListPopover';

interface PrimaryRecommendationCarouselProps {
  scoredProducts: ScoredProduct[];
  onSelectProduct: (product: Product) => void;
}

export const PrimaryRecommendationCarousel: React.FC<PrimaryRecommendationCarouselProps> = ({
  scoredProducts,
  onSelectProduct,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const topPicks = scoredProducts.slice(0, 5);
  const currentPick = topPicks[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
  }, [scoredProducts]);

  if (!currentPick) return null;

  const { product, tailoredWhyThisGift, matchingReasons } = currentPick;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? topPicks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === topPicks.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="mb-14">
      
      {/* Section Header with Carousel Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E2E5E9] mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-accent font-semibold uppercase tracking-wider text-[#2A548E] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#2A548E]" />
            <span>Level 1 · Best Match</span>
            {currentIndex === 0 && (
              <span className="text-[#226E56] font-bold bg-[#C3F3DF] px-2 py-0.5 rounded-xs text-[10px]">
                Strongest Match
              </span>
            )}
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#1E232B] font-bold">
            The Curated Primary Selection
          </h2>
        </div>

        {/* Carousel Pagination & Arrows */}
        {topPicks.length > 1 && (
          <div className="flex items-center gap-3">
            <span className="font-mono-accent text-xs text-[#5A6270] font-medium tracking-wider">
              {currentIndex + 1} / {topPicks.length} Strongest Picks
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-xs border border-[#DCE1E7] bg-white hover:bg-[#EAEFF5] text-[#1E232B] transition-colors cursor-pointer"
                aria-label="Previous recommendation"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-xs border border-[#DCE1E7] bg-white hover:bg-[#EAEFF5] text-[#1E232B] transition-colors cursor-pointer"
                aria-label="Next recommendation"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Spotlight Editorial Card */}
      <div className="bg-white border border-[#DCE1E7] rounded-sm p-6 sm:p-8 md:p-10 transition-all duration-300 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Product Photography Container */}
          <div className="lg:col-span-5 relative group">
            <div className="relative aspect-[4/3] sm:aspect-square bg-[#F7F5F0] rounded-xs overflow-hidden border border-[#DCE1E7]">
              <img
                src={product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />

              {/* Badge Label */}
              {product.badgeLabel && (
                <div className="absolute top-3 left-3 bg-[#1E232B]/90 backdrop-blur-xs text-white text-[11px] font-mono-accent font-medium px-2.5 py-1 rounded-xs tracking-wide">
                  {product.badgeLabel}
                </div>
              )}

              {/* Save Quick Action Popover */}
              <div className="absolute top-3 right-3">
                <SaveToListPopover product={product} variant="icon" />
              </div>

              {/* View Quick Inspector */}
              <button
                onClick={() => onSelectProduct(product)}
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white border border-[#DCE1E7] text-xs font-sans-clean font-medium text-[#1E232B] rounded-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
              >
                <Eye className="w-3.5 h-3.5 text-[#5A6270]" />
                <span>Quick View</span>
              </button>
            </div>

            {/* Carousel Selector Thumbnails */}
            {topPicks.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {topPicks.map((pick, idx) => (
                  <button
                    key={pick.product.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-14 h-14 rounded-xs overflow-hidden border shrink-0 transition-all cursor-pointer ${
                      idx === currentIndex
                        ? 'border-[#2A548E] ring-2 ring-[#2A548E]/30 opacity-100'
                        : 'border-[#DCE1E7] opacity-60 hover:opacity-90'
                    }`}
                  >
                    <img
                      src={pick.product.image}
                      alt={pick.product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Editorial Details & Match Rationale */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Unboxed Clean Metadata */}
            <div className="flex items-center gap-2 text-xs font-sans-clean text-[#5A6270] mb-2">
              <span className="font-semibold text-[#1E232B]">{product.vendor}</span>
              <span aria-hidden="true">·</span>
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.productType}</span>
            </div>

            {/* Product Title in Playfair Display */}
            <h3
              onClick={() => onSelectProduct(product)}
              className="font-editorial text-2xl sm:text-3xl text-[#1E232B] font-bold tracking-tight leading-snug mb-3 hover:text-[#2A548E] transition-colors cursor-pointer"
            >
              {product.title}
            </h3>

            {/* Price & Rating */}
            <div className="flex items-center gap-4 mb-5">
              <span className="font-mono-accent text-2xl text-[#1E232B] font-bold">
                {product.price}
              </span>
              <span className="text-xs text-[#5A6270] font-sans-clean">
                Science of Gifts Curated · In Stock
              </span>
            </div>

            {/* Concierge Match Rationale */}
            <div className="p-4 bg-[#F2F6FB] border-l-3 border-[#2A548E] rounded-xs mb-5">
              <span className="text-xs font-mono-accent font-bold uppercase tracking-wider text-[#2A548E] block mb-1">
                Concierge Match Interpretation
              </span>
              <p className="font-sans-clean text-sm text-[#1E232B] leading-relaxed italic">
                &ldquo;{tailoredWhyThisGift}&rdquo;
              </p>
            </div>

            {/* Why This Matches (Concise 2-4 points) */}
            <div className="mb-6">
              <h4 className="font-mono-accent text-[11px] font-bold uppercase tracking-wider text-[#5A6270] mb-2.5">
                Why This Matches:
              </h4>
              <ul className="space-y-1.5">
                {matchingReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#1E232B] font-sans-clean">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#226E56] mt-2 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Editorial Review Excerpt */}
            <p className="font-sans-clean text-sm text-[#5A6270] leading-relaxed mb-8 line-clamp-3">
              {product.editorialReview}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#E2E5E9] mt-auto">
              <a
                href={product.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#1E232B] hover:bg-[#2A548E] text-white font-sans-clean text-sm font-semibold rounded-xs transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>View on {product.vendor}</span>
                <ArrowUpRight className="w-4 h-4 text-[#C3F3DF]" />
              </a>

              <button
                onClick={() => onSelectProduct(product)}
                className="px-4 py-2.5 bg-white hover:bg-[#EAEFF5] border border-[#DCE1E7] text-[#1E232B] font-sans-clean text-sm font-medium rounded-xs transition-colors cursor-pointer"
              >
                Inspect All Details
              </button>

              <SaveToListPopover product={product} variant="button" />
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
