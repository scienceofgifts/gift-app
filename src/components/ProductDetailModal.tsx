import React, { useEffect } from 'react';
import { X, Award, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Product } from '../types/gift';
import { SaveToListPopover } from './SaveToListPopover';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (product) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 md:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop overlay (subtle, allows background page to remain visible) */}
      <div
        className="fixed inset-0 bg-[#1E232B]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Centered Modal Window with Constrained Width & Height */}
      <div className="relative w-full max-w-4xl max-h-[88vh] my-auto flex flex-col bg-white border border-[#DCE1E7] rounded-xs shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Bar with Close Button */}
        <div className="px-6 py-4 border-b border-[#E2E5E9] flex items-center justify-between bg-[#FAF8F5] shrink-0">
          <div className="flex items-center gap-2 text-xs font-sans-clean text-[#5A6270]">
            <span className="font-semibold text-[#1E232B]">{product.vendor}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
            {product.badgeLabel && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#226E56] font-mono-accent font-semibold">{product.badgeLabel}</span>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#5A6270] hover:text-[#1E232B] hover:bg-[#EAEFF5] rounded-xs transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Product Imagery */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative aspect-square bg-[#F7F5F0] rounded-xs overflow-hidden border border-[#DCE1E7]">
                <img
                  src={product.image}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {product.badgeLabel && (
                  <div className="absolute top-3 left-3 bg-[#1E232B]/90 text-white text-[10px] font-mono-accent font-medium px-2.5 py-1 rounded-xs">
                    {product.badgeLabel}
                  </div>
                )}
              </div>

              {/* Match Signals & Tags */}
              <div className="p-4 bg-[#FAF8F5] rounded-xs border border-[#E2E5E9]">
                <h4 className="text-[11px] font-mono-accent font-semibold uppercase tracking-wider text-[#5A6270] mb-2">
                  Curated Metadata Signals
                </h4>
                <div className="flex flex-wrap gap-1.5 text-xs text-[#1E232B]">
                  {product.interests.map(i => (
                    <span key={i} className="bg-white border border-[#DCE1E7] px-2 py-0.5 rounded-xs text-[11px] font-medium">
                      {i}
                    </span>
                  ))}
                  {product.recipients.slice(0, 3).map(r => (
                    <span key={r} className="bg-white border border-[#DCE1E7] px-2 py-0.5 rounded-xs text-[11px]">
                      For: {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Narrative & Editorial Fields */}
            <div className="md:col-span-7 space-y-6">
              
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl text-[#1E232B] font-bold leading-tight mb-2">
                  {product.title}
                </h2>
                
                <div className="flex items-center gap-4">
                  <span className="font-mono-accent text-2xl font-bold text-[#1E232B]">
                    {product.price}
                  </span>
                  <span className="text-xs text-[#5A6270] font-sans-clean">
                    Curated Selection · In Stock
                  </span>
                </div>
              </div>

              {/* Editorial Review */}
              <div>
                <h3 className="text-xs font-mono-accent font-semibold uppercase tracking-wider text-[#5A6270] mb-1.5">
                  Curator’s Editorial Review
                </h3>
                <p className="font-sans-clean text-sm text-[#1E232B] leading-relaxed">
                  {product.editorialReview}
                </p>
              </div>

              {/* Why It Makes a Great Gift */}
              <div className="p-3.5 bg-[#F2FCF7] border-l-3 border-[#226E56] rounded-xs">
                <div className="flex items-center gap-1.5 text-xs font-mono-accent font-semibold uppercase tracking-wider text-[#226E56] mb-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Why It Makes a Great Gift</span>
                </div>
                <p className="font-sans-clean text-sm text-[#1E232B] leading-relaxed">
                  {product.whyItMakesAGreatGift}
                </p>
              </div>

              {/* Ideal For & What Makes It Stand Out */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <h4 className="text-xs font-mono-accent font-semibold uppercase tracking-wider text-[#5A6270] mb-1">
                    Ideal For
                  </h4>
                  <p className="font-sans-clean text-xs text-[#1E232B] leading-relaxed">
                    {product.idealFor}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-mono-accent font-semibold uppercase tracking-wider text-[#5A6270] mb-1">
                    What Makes It Stand Out
                  </h4>
                  <p className="font-sans-clean text-xs text-[#1E232B] leading-relaxed">
                    {product.whatMakesItStandOut}
                  </p>
                </div>
              </div>

              {/* Things to Consider */}
              {product.thingsToConsider && (
                <div className="pt-1">
                  <h4 className="text-xs font-mono-accent font-semibold uppercase tracking-wider text-[#5A6270] mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-[#2A548E]" />
                    <span>Things to Consider</span>
                  </h4>
                  <p className="font-sans-clean text-xs text-[#5A6270] leading-relaxed">
                    {product.thingsToConsider}
                  </p>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-t border-[#E2E5E9] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <SaveToListPopover product={product} variant="button" />

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-sans-clean font-medium text-[#5A6270] hover:text-[#1E232B] transition-colors cursor-pointer"
            >
              Back to Search
            </button>

            <a
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#1E232B] hover:bg-[#2A548E] text-white font-sans-clean text-xs font-semibold rounded-xs transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>View on {product.vendor}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C3F3DF]" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
