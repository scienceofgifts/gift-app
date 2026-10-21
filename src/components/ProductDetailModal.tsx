import React, { useEffect, useState } from 'react';
import {
  X,
  Award,
  AlertCircle,
  ArrowUpRight,
  Gift,
  Plus,
  Check,
  Bookmark,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Product, isAmazonProduct } from '../types/gift';
import { SaveToListPopover } from './SaveToListPopover';
import { CATALOG } from '../data/catalog';
import { useSavedGifts } from '../context/SavedGiftsContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

// Helper to deduplicate recipient synonyms (e.g. Dad and Father)
function getDeduplicatedRecipients(recipients: string[]): string[] {
  const synonymMap: Record<string, string> = {
    father: 'dad',
    dad: 'dad',
    mother: 'mom',
    mom: 'mom',
    grandfather: 'grandpa',
    grandpa: 'grandpa',
    grandmother: 'grandma',
    grandma: 'grandma',
  };

  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of recipients) {
    const key = raw.toLowerCase().trim();
    const canonical = synonymMap[key] || key;
    if (!seen.has(canonical)) {
      seen.add(canonical);
      result.push(raw);
    }
  }

  return result;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectProduct
}) => {
  const { saveToList, activeShoppingRecipient, lists } = useSavedGifts();
  const [savedPairMap, setSavedPairMap] = useState<{ [pairedId: string]: boolean }>({});

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

  const isAmazon = isAmazonProduct(product);

  // Resolve paired products
  const pairedProducts: Product[] = (product.relatedProductIds || [])
    .map(id => CATALOG.find(p => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const targetList = activeShoppingRecipient || lists[0];

  const handleSaveBoth = (pairedProduct: Product) => {
    if (!targetList) return;
    saveToList(product, targetList.id);
    saveToList(pairedProduct, targetList.id);
    setSavedPairMap(prev => ({ ...prev, [pairedProduct.id]: true }));
    setTimeout(() => {
      setSavedPairMap(prev => ({ ...prev, [pairedProduct.id]: false }));
    }, 3000);
  };

  const deduplicatedRecipients = getDeduplicatedRecipients(product.recipients);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 md:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop overlay */}
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
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8">
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
                  Curator’s Index
                </h4>
                <div className="flex flex-wrap gap-1.5 text-xs text-[#1E232B]">
                  {product.interests.map(i => (
                    <span key={i} className="bg-white border border-[#DCE1E7] px-2 py-0.5 rounded-xs text-[11px] font-medium">
                      {i}
                    </span>
                  ))}
                  {deduplicatedRecipients.slice(0, 3).map(r => (
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
                
                {isAmazon ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono-accent text-2xl font-bold text-[#1E232B]">
                        {product.priceRange}
                      </span>
                      <span className="text-xs text-[#2A548E] font-sans-clean font-semibold bg-[#EAEFF5] px-2.5 py-0.5 rounded-xs">
                        Live Price on Amazon
                      </span>
                    </div>
                    <span className="text-xs text-[#7A8290] font-sans-clean">
                      Exact price, discounts, and stock vary on Amazon
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="font-mono-accent text-2xl font-bold text-[#1E232B]">
                      {product.price}
                    </span>
                    <span className="text-xs text-[#5A6270] font-sans-clean">
                      Curated Selection · In Stock
                    </span>
                  </div>
                )}
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

              {/* Feature 2: Curator's Presentation & Gifting Note */}
              {product.presentationTip && (
                <div className="p-3.5 bg-[#FAF8F5] border-l-3 border-[#1E232B] border-y border-r border-[#E2E5E9] rounded-xs">
                  <div className="flex items-center gap-1.5 text-xs font-mono-accent font-semibold uppercase tracking-wider text-[#1E232B] mb-1">
                    <Gift className="w-3.5 h-3.5 text-[#2A548E]" />
                    <span>Curator’s Presentation & Gifting Note</span>
                  </div>
                  <p className="font-sans-clean text-xs sm:text-sm text-[#373D47] leading-relaxed italic">
                    {product.presentationTip}
                  </p>
                </div>
              )}

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

          {/* Feature 4: "Complete the Gift Set" Complementary Product Pairings */}
          {pairedProducts.length > 0 && (
            <div className="pt-6 border-t border-[#E2E5E9]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#2A548E]" />
                  <h3 className="font-editorial text-lg font-bold text-[#1E232B]">
                    Frequently Paired Together · Complete the Set
                  </h3>
                </div>
                <span className="text-xs font-sans-clean text-[#5A6270]">
                  Harmonious pairings for a coordinated gift
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pairedProducts.map((paired) => {
                  const isBothSaved = Boolean(savedPairMap[paired.id]);
                  return (
                    <div
                      key={paired.id}
                      className="p-3.5 bg-[#FAF8F5] border border-[#DCE1E7] hover:border-[#BFC7D2] rounded-xs flex items-center justify-between gap-3.5 transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          onClick={() => onSelectProduct && onSelectProduct(paired)}
                          className="w-14 h-14 bg-white rounded-xs overflow-hidden border border-[#DCE1E7] shrink-0 cursor-pointer"
                        >
                          <img
                            src={paired.image}
                            alt={paired.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-mono-accent text-[#5A6270] uppercase tracking-wider block">
                            {paired.category}
                          </span>
                          <h4
                            onClick={() => onSelectProduct && onSelectProduct(paired)}
                            className="font-editorial text-sm font-semibold text-[#1E232B] truncate hover:text-[#2A548E] cursor-pointer"
                            title={paired.title}
                          >
                            {paired.title}
                          </h4>
                          <span className="font-mono-accent text-xs font-bold text-[#1E232B]">
                            {isAmazonProduct(paired) ? paired.priceRange : paired.price}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 shrink-0">
                        {onSelectProduct && (
                          <button
                            type="button"
                            onClick={() => onSelectProduct(paired)}
                            className="px-2.5 py-1 text-[11px] font-sans-clean font-semibold text-[#2A548E] hover:text-[#1E232B] hover:bg-white rounded-xs border border-[#DCE1E7] transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleSaveBoth(paired)}
                          className={`px-2.5 py-1 text-[11px] font-sans-clean font-semibold rounded-xs transition-colors flex items-center gap-1 cursor-pointer ${
                            isBothSaved
                              ? 'bg-[#226E56] text-white'
                              : 'bg-[#1E232B] hover:bg-[#2A548E] text-white'
                          }`}
                          title={`Save ${product.title} and ${paired.title} to your active list`}
                        >
                          {isBothSaved ? (
                            <>
                              <Check className="w-3 h-3 text-[#C3F3DF]" />
                              <span>Set Saved!</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 text-[#C3F3DF]" />
                              <span>Save Both</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions & Amazon Disclaimer */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-t border-[#E2E5E9] flex flex-col gap-2 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
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
                <span>{isAmazon ? 'Check Live Price on Amazon' : `View on ${product.vendor}`}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C3F3DF]" />
              </a>
            </div>
          </div>

          {isAmazon && (
            <p className="text-[11px] text-[#7A8290] font-sans-clean text-right">
              Amazon prices fluctuate regularly. Click through to view real-time pricing, stock, and Prime shipping options.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
