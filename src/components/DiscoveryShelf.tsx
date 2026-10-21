import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ScoredProduct, Product } from '../types/gift';
import { SaveToListPopover } from './SaveToListPopover';

interface DiscoveryShelfProps {
  scoredProducts: ScoredProduct[];
  onSelectProduct: (product: Product) => void;
}

export const DiscoveryShelf: React.FC<DiscoveryShelfProps> = ({
  scoredProducts,
  onSelectProduct,
}) => {
  // Level 3 products: remaining catalog items
  const shelfProducts = scoredProducts.slice(9);

  if (shelfProducts.length === 0) return null;

  return (
    <section className="mb-16">
      
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-[#E2E5E9] mb-6">
        <div>
          <span className="text-xs font-mono-accent font-semibold uppercase tracking-wider text-[#2A548E] block mb-1">
            Level 3 · Rapid Scan
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#1E232B] font-bold">
            More Ideas From Our Catalog
          </h2>
        </div>
        <p className="font-sans-clean text-xs sm:text-sm text-[#5A6270]">
          Compact discovery shelf of additional curiosities, books, barware, and tools
        </p>
      </div>

      {/* Discovery Shelf Rows */}
      <div className="bg-white border border-[#DCE1E7] rounded-sm divide-y divide-[#EAEFF5] overflow-hidden shadow-2xs">
        {shelfProducts.map(({ product }) => {
          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group flex items-center justify-between gap-4 p-3 sm:p-4 hover:bg-[#F7F9FC] transition-colors cursor-pointer"
            >
              {/* Left Zone: Small Thumbnail & Title */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-[#F7F5F0] rounded-xs overflow-hidden border border-[#DCE1E7] shrink-0">
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

                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-sans-clean text-[#5A6270]">
                    <span className="font-semibold text-[#1E232B]">{product.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="hidden xs:inline truncate">{product.interests[0]}</span>
                    {product.badgeLabel && (
                      <>
                        <span aria-hidden="true" className="hidden sm:inline">·</span>
                        <span className="hidden sm:inline text-[#226E56] font-medium">{product.badgeLabel}</span>
                      </>
                    )}
                  </div>

                  <h4 className="font-editorial text-base sm:text-lg text-[#1E232B] font-bold truncate group-hover:text-[#2A548E] transition-colors">
                    {product.title}
                  </h4>
                </div>
              </div>

              {/* Right Zone: Price, Save Popover, and Arrow */}
              <div className="flex items-center gap-3 sm:gap-5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <span className="font-mono-accent text-sm sm:text-base font-bold text-[#1E232B] tracking-tight">
                  {product.price}
                </span>

                <SaveToListPopover product={product} variant="pill" />

                <div
                  onClick={() => onSelectProduct(product)}
                  className="p-1 text-[#5A6270] group-hover:text-[#1E232B] group-hover:translate-x-0.5 transition-all hidden xs:block cursor-pointer"
                  title="Expand product details"
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
