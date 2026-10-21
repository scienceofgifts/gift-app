import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { ScoredProduct, Product, isAmazonProduct } from '../types/gift';
import { SaveToListPopover } from './SaveToListPopover';

interface DiscoveryShelfProps {
  scoredProducts: ScoredProduct[];
  onSelectProduct: (product: Product) => void;
}

export const DiscoveryShelf: React.FC<DiscoveryShelfProps> = ({
  scoredProducts,
  onSelectProduct,
}) => {
  // Take remaining items (index 9 onwards) for Level 3 Discovery Shelf
  const shelfItems = scoredProducts.slice(9, 20);

  if (shelfItems.length === 0) return null;

  return (
    <section className="mb-14">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E5E9]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#5A6270]" />
          <h3 className="font-editorial text-xl sm:text-2xl text-[#1E232B] font-bold tracking-tight">
            Curator’s Extended Discovery Shelf
          </h3>
        </div>
        <span className="font-mono-accent text-xs text-[#5A6270]">
          Rapid scan view
        </span>
      </div>

      {/* Dense Row List */}
      <div className="bg-white border border-[#DCE1E7] rounded-xs divide-y divide-[#E2E5E9] shadow-2xs">
        {shelfItems.map(({ product }) => {
          const isAmazon = isAmazonProduct(product);

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="p-3.5 sm:p-4 hover:bg-[#FAF8F5] transition-colors flex flex-row items-start sm:items-center gap-3.5 sm:gap-4 cursor-pointer group"
            >
              
              {/* Thumbnail Image */}
              <div className="w-16 h-16 sm:w-14 sm:h-14 bg-[#F7F5F0] rounded-xs overflow-hidden border border-[#DCE1E7] shrink-0">
                <img
                  src={product.image}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Flexible Main Content Container */}
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
                
                {/* Title & Metadata Stack */}
                <div className="min-w-0 flex-1 space-y-1 sm:space-y-0.5">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] font-sans-clean text-[#5A6270] truncate">
                    <span className="font-medium text-[#1E232B] truncate">{product.vendor}</span>
                    <span aria-hidden="true" className="shrink-0">·</span>
                    <span className="truncate">{product.category}</span>
                    {product.badgeLabel && (
                      <>
                        <span aria-hidden="true" className="hidden sm:inline shrink-0">·</span>
                        <span className="text-[#226E56] font-mono-accent font-semibold hidden sm:inline shrink-0">{product.badgeLabel}</span>
                      </>
                    )}
                  </div>

                  <h4 className="font-editorial font-bold text-[#1E232B] line-clamp-2 sm:line-clamp-1 text-sm sm:text-base leading-snug group-hover:text-[#2A548E] transition-colors">
                    {product.title}
                  </h4>
                </div>

                {/* Footer Strip on Mobile / Right Price & Action Bar on Desktop */}
                <div
                  className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-4 shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-[#F0F2F5]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Price / Amazon Pill */}
                  <div className="min-w-0">
                    {isAmazon ? (
                      <span className="text-[11px] font-mono-accent text-[#2A548E] bg-[#EAEFF5] px-2 py-0.5 rounded-xs inline-block truncate max-w-[190px] sm:max-w-none font-bold">
                        Check Amazon ({product.priceRange})
                      </span>
                    ) : (
                      <span className="font-mono-accent text-xs sm:text-base font-bold text-[#1E232B] tracking-tight">
                        {product.price}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                    <SaveToListPopover product={product} variant="pill" />

                    <div
                      onClick={() => onSelectProduct(product)}
                      className="p-1 text-[#5A6270] group-hover:text-[#1E232B] group-hover:translate-x-0.5 transition-all cursor-pointer"
                      title="Explore the Gift"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </div>
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
