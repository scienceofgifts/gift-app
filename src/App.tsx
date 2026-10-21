/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CATALOG } from './data/catalog';
import { FilterState, Product, QueryInterpretation, GiftList } from './types/gift';
import { interpretQuery, rankCatalog } from './utils/searchEngine';
import { SavedGiftsProvider, useSavedGifts } from './context/SavedGiftsContext';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { GiftMatchingAnimation } from './components/GiftMatchingAnimation';
import { PrimaryRecommendationCarousel } from './components/PrimaryRecommendationCarousel';
import { SecondaryPicksGrid } from './components/SecondaryPicksGrid';
import { DiscoveryShelf } from './components/DiscoveryShelf';
import { RefineDrawer } from './components/RefineDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SavedGiftsDrawer } from './components/SavedGiftsDrawer';
import { CuratedCollections } from './components/CuratedCollections';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { SlidersHorizontal, RotateCcw, User, X } from 'lucide-react';

const INITIAL_QUERY = "Gift for my dad who loves WWII history and doesn't like useless stuff";

function GiftFinderMain() {
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [isMatchingAnimation, setIsMatchingAnimation] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refineDrawerOpen, setRefineDrawerOpen] = useState(false);

  const {
    activeShoppingRecipient,
    setActiveShoppingRecipient,
    savedItems
  } = useSavedGifts();

  const [filters, setFilters] = useState<FilterState>({
    recipients: [],
    interests: [],
    priceRange: 'all',
    maxPrice: null,
    productTypes: [],
    occasions: [],
    personalityStyles: [],
    sortBy: 'relevance'
  });

  // Query Interpretation
  const interpretation: QueryInterpretation = useMemo(() => {
    return interpretQuery(query);
  }, [query]);

  // Already saved product IDs for the active recipient (to deprioritize duplicates)
  const savedProductIdsForRecipient = useMemo(() => {
    if (!activeShoppingRecipient) return [];
    return savedItems
      .filter(item => item.listIds.includes(activeShoppingRecipient.id))
      .map(item => item.product.id);
  }, [activeShoppingRecipient, savedItems]);

  // Scored and Ranked Results
  const scoredProducts = useMemo(() => {
    return rankCatalog(
      CATALOG,
      query,
      filters,
      interpretation,
      activeShoppingRecipient?.recipientProfile,
      savedProductIdsForRecipient
    );
  }, [query, filters, interpretation, activeShoppingRecipient, savedProductIdsForRecipient]);

  // Handle Search Submission
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setIsMatchingAnimation(true);
    setTimeout(() => {
      const el = document.getElementById('results-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleResetSearch = () => {
    setQuery('');
    setActiveShoppingRecipient(null);
    setFilters({
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

  const handleShopForRecipient = (list: GiftList) => {
    setActiveShoppingRecipient(list);
    let promptQuery = `Gift for ${list.name}`;
    if (list.recipientProfile?.interests?.length) {
      promptQuery += ` who loves ${list.recipientProfile.interests.join(' and ')}`;
    }
    if (list.recipientProfile?.notes) {
      promptQuery += `. ${list.recipientProfile.notes}`;
    }
    handleSearch(promptQuery);
  };

  const handleFilterForAudience = (audience: 'men' | 'women' | 'guides') => {
    if (audience === 'men') {
      handleSearch('Thoughtful distinctive gifts for men and fathers');
    } else if (audience === 'women') {
      handleSearch('Thoughtful distinctive gifts for women and mothers');
    } else {
      const el = document.getElementById('curated-collections-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToSearch = () => {
    const el = document.getElementById('search-hero');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const input = el.querySelector('input');
      if (input) input.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E232B]">
      
      {/* Science of Gifts Navigation Bar */}
      <Header
        onSearchClick={scrollToSearch}
        onFilterForAudience={handleFilterForAudience}
        onResetSearch={handleResetSearch}
        hasActiveSearch={Boolean(query.trim())}
      />

      {/* Hero & Natural-Language Search */}
      <HeroSearch
        currentQuery={query}
        onSearch={handleSearch}
        interpretation={interpretation}
        isSearching={isMatchingAnimation}
        activeShoppingRecipient={activeShoppingRecipient}
        onClearActiveRecipient={() => setActiveShoppingRecipient(null)}
      />

      {/* Main Content Area */}
      <main id="results-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Animated 2–3s Thinking/Matching Concierge Animation */}
        {isMatchingAnimation ? (
          <GiftMatchingAnimation
            durationMs={2400}
            interpretation={interpretation}
            onComplete={() => setIsMatchingAnimation(false)}
          />
        ) : (
          <>
            {/* Active Search & Filter Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E2E5E9]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono-accent text-[11px] font-semibold uppercase tracking-wider text-[#5A6270]">
                  Results for:
                </span>
                <span className="font-editorial text-xl text-[#1E232B] font-bold">
                  {query ? `“${query}”` : 'All Curated Gifts'}
                </span>
                <span className="font-mono-accent text-xs text-[#5A6270] bg-[#EAEFF5] px-2.5 py-0.5 rounded-xs font-semibold">
                  {scoredProducts.length} Recommendations Found
                </span>

                {activeShoppingRecipient && (
                  <span className="inline-flex items-center gap-1.5 bg-[#C3F3DF] text-[#1E232B] text-xs font-sans-clean font-semibold px-2.5 py-0.5 rounded-xs border border-[#9ADBBC]">
                    <User className="w-3 h-3 text-[#226E56]" />
                    <span>Shopping for {activeShoppingRecipient.name} (Deprioritizing saved)</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRefineDrawerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#EAEFF5] border border-[#DCE1E7] text-xs font-sans-clean font-semibold text-[#1E232B] rounded-xs transition-colors cursor-pointer shadow-2xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#2A548E]" />
                  <span>Filter & Refine</span>
                </button>

                {query && (
                  <button
                    onClick={handleResetSearch}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-sans-clean text-[#5A6270] hover:text-[#1E232B] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* LEVEL 1: Primary Recommendation Carousel */}
            <PrimaryRecommendationCarousel
              scoredProducts={scoredProducts}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />

            {/* LEVEL 2: Secondary Picks Grid */}
            <SecondaryPicksGrid
              scoredProducts={scoredProducts}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />

            {/* LEVEL 3: Compact Discovery Shelf */}
            <DiscoveryShelf
              scoredProducts={scoredProducts}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />

            {/* Themed Curated Collections */}
            <div id="curated-collections-section">
              <CuratedCollections onSelectCollection={handleSearch} />
            </div>

            {/* Editorial FAQ Section */}
            <FAQSection />
          </>
        )}

      </main>

      {/* Modals and Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <RefineDrawer
        isOpen={refineDrawerOpen}
        onClose={() => setRefineDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        totalMatchedCount={scoredProducts.length}
      />

      <SavedGiftsDrawer
        onSelectProduct={(p) => setSelectedProduct(p)}
        onShopForRecipient={handleShopForRecipient}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <SavedGiftsProvider>
      <GiftFinderMain />
    </SavedGiftsProvider>
  );
}
