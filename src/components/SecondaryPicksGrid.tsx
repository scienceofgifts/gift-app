import React from 'react';
import { Bookmark, Eye, ArrowUpRight, Sparkles } from 'lucide-react';
import { ScoredProduct, Product, isAmazonProduct } from '../types/gift';
import { useSavedGifts } from '../context/SavedGiftsContext';
import { SaveToListPopover } from './SaveToListPopover';

interface SecondaryPicksGridProps {
  scoredProducts: ScoredProduct[];
  onSelectProduct: (product: Product) => void;
}

export const SecondaryPicksGrid: React.FC<SecondaryPicksGridProps> = ({
  scoredProducts,
  onSelectProduct,
}) => {
  // Take items index 1 to 7 for Level 2 Secondary Grid
  const secondaryPicks = scoredProducts.slice(1, 9);

  if (secondaryPicks.length === 0) return null;

  return (
    <section className="mb-14">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2A548E]" />
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#1E232B] font-bold tracking-tight">
            Strong Companion Matches
          </h2>
        </div>
        <span className="font-mono-accent text-xs text-[#5A6270]">
          Showing {secondaryPicks.length} curated picks
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {secondaryPicks.map(({ product, matchingReasons }) => {
          const isAmazon = isAmazonProduct(product);

          return (
            <div
              key={product.id}
              className="bg-white border border-[#DCE1E7] rounded-xs overflow-hidden flex flex-col hover:border-[#2A548E]/40 transition-all duration-200 shadow-2xs group"
            >
              
              {/* Product Image Area */}
              <div className="relative aspect-[4/3] bg-[#F7F5F0] overflow-hidden border-b border-[#E2E5E9]">
                <img
                  src={product.image}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />

                {/* Badge Label */}
                {product.badgeLabel && (
                  <div className="absolute top-2.5 left-2.5 bg-[#1E232B]/90 text-white text-[10px] font-mono-accent font-medium px-2 py-0.5 rounded-xs">
                    {product.badgeLabel}
                  </div>
                )}

                {/* Save Popover Button */}
                <div className="absolute top-2.5 right-2.5">
                  <SaveToListPopover product={product} variant="icon" />
                </div>

                {/* Quick View Button */}
                <button
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className="absolute inset-x-3 bottom-3 py-1.5 bg-white/95 hover:bg-white border border-[#DCE1E7] text-xs font-sans-clean font-medium text-[#1E232B] rounded-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs text-center flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-[#5A6270]" />
                  <span>Explore the Gift</span>
                </button>
              </div>

              {/* Card Body & Strict Action Hierarchy */}
              <div className="p-4 flex flex-col flex-1">
                
                {/* 1. Product Information */}
                <div className="flex items-center gap-1.5 text-[11px] font-sans-clean text-[#5A6270] mb-1.5">
                  <span className="truncate max-w-[120px] font-medium text-[#1E232B]">{product.vendor}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{product.category}</span>
                </div>

                {/* Title */}
                <h3
                  onClick={() => onSelectProduct(product)}
                  className="font-editorial text-lg text-[#1E232B] font-bold leading-snug mb-2 group-hover:text-[#2A548E] transition-colors line-clamp-2 cursor-pointer"
                >
                  {product.title}
                </h3>

                {/* Primary Match Highlight Point */}
                {matchingReasons[0] && (
                  <p className="text-[12px] font-sans-clean text-[#5A6270] mb-3 line-clamp-1 italic">
                    &bull; {matchingReasons[0]}
                  </p>
                )}

                {/* Price Display (Amazon Compliant) */}
                <div className="mb-4">
                  {isAmazon ? (
                    <div className="flex items-center justify-between">
                      <span className="font-mono-accent text-base font-bold text-[#1E232B]">
                        {product.priceRange}
                      </span>
                      <span className="text-[10px] font-mono-accent font-semibold text-[#2A548E] bg-[#EAEFF5] px-1.5 py-0.2 rounded-xs">
                        Amazon Price
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono-accent text-base font-bold text-[#1E232B]">
                      {product.price}
                    </span>
                  )}
                </div>

                {/* Card Action Hierarchy in Footer */}
                <div className="mt-auto pt-3 border-t border-[#F0F2F5] space-y-1.5">
                  {/* 2. Quiet Merchant Action */}
                  <div>
                    <a
                      href={product.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link text-xs font-semibold text-[#2A548E] hover:text-[#1B3C6B] inline-flex items-center gap-1 transition-colors py-0.5"
                    >
                      <span className="tracking-wide">
                        {isAmazon ? 'CHECK PRICE ON AMAZON ↗' : `VIEW ON ${product.vendor.toUpperCase()}`}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#2A548E] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>

                  {/* 3. Secondary Editorial Link: Explore the Gift */}
                  <div>
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="text-[11.5px] font-sans-clean text-[#5A6270] hover:text-[#1E232B] hover:underline underline-offset-2 transition-colors cursor-pointer block text-left"
                    >
                      Explore the Gift
                    </button>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
