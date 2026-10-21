import React, { useState, useEffect } from 'react';
import { Search, Sparkles, ArrowRight, User, X, Users, Compass } from 'lucide-react';
import { QueryInterpretation, GiftList } from '../types/gift';
import { useSavedGifts } from '../context/SavedGiftsContext';

interface HeroSearchProps {
  currentQuery: string;
  onSearch: (query: string) => void;
  interpretation: QueryInterpretation | null;
  isSearching: boolean;
  activeShoppingRecipient: GiftList | null;
  onClearActiveRecipient: () => void;
}

const EXAMPLE_PROMPTS = [
  "Gift for my dad who loves WWII history and doesn't like useless stuff",
  "Something thoughtful for a woman who loves Greek mythology, under $40",
  "My brother is obsessed with filmmaking. I want something unusual",
  "Christmas gift for a history professor who already owns everything",
  "A practical desk gift for an architect under $50",
  "Fascinating astronomy gift for a curious stargazing friend"
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  currentQuery,
  onSearch,
  interpretation,
  isSearching,
  activeShoppingRecipient,
  onClearActiveRecipient
}) => {
  const [inputValue, setInputValue] = useState(currentQuery);
  const { lists, setActiveShoppingRecipient } = useSavedGifts();

  useEffect(() => {
    setInputValue(currentQuery);
  }, [currentQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    onSearch(prompt);
  };

  const handleSelectRecipientList = (list: GiftList) => {
    setActiveShoppingRecipient(list);
    let promptQuery = `Gift for ${list.name}`;
    if (list.recipientProfile?.interests?.length) {
      promptQuery += ` who loves ${list.recipientProfile.interests.join(' and ')}`;
    }
    if (list.recipientProfile?.notes) {
      promptQuery += `. ${list.recipientProfile.notes}`;
    }
    setInputValue(promptQuery);
    onSearch(promptQuery);
  };

  const handleClearInput = () => {
    setInputValue('');
  };

  const recipientListsWithProfiles = lists.filter(l => l.recipientProfile);

  return (
    <section id="search-hero" className="relative pt-16 pb-16 sm:pt-20 sm:pb-20 border-b border-[#E2E5E9] bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5] to-[#F3EFE6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Active Recipient Shopping Banner or Category Pill */}
        <div className="flex justify-center mb-5">
          {activeShoppingRecipient ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C3F3DF] text-[#1E232B] text-xs font-sans-clean font-semibold border border-[#9ADBBC] shadow-2xs">
              <User className="w-3.5 h-3.5 text-[#226E56]" />
              <span>Shopping for {activeShoppingRecipient.name}</span>
              {activeShoppingRecipient.recipientProfile?.interests?.length ? (
                <span className="text-[#226E56] font-normal">
                  ({activeShoppingRecipient.recipientProfile.interests.join(' · ')})
                </span>
              ) : null}
              <button
                type="button"
                onClick={onClearActiveRecipient}
                className="p-1 hover:bg-black/10 rounded-full ml-1 cursor-pointer transition-colors"
                title="Clear recipient filter"
              >
                <X className="w-3 h-3 text-[#1E232B]" />
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAEFF5] text-[#2A548E] text-xs font-sans-clean font-medium tracking-wider uppercase">
              <Compass className="w-3.5 h-3.5 text-[#2A548E]" />
              <span>Intelligent Gift Discovery Engine</span>
            </div>
          )}
        </div>

        {/* Primary Editorial Headline in Playfair Display */}
        <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1E232B] font-bold tracking-tight leading-[1.18] mb-4 max-w-3xl mx-auto" style={{ textWrap: 'balance' }}>
          {activeShoppingRecipient
            ? `Find a gift worth giving to ${activeShoppingRecipient.name}.`
            : "Find a gift worth giving."}
        </h1>

        {/* Supporting description */}
        <p className="font-sans-clean text-[#5A6270] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
          Describe who you’re shopping for, what they’re into, and your budget in natural words. Our concierge interprets your clues to recommend thoughtful, curated gifts.
        </p>

        {/* Natural Language Search Input Container with Generous Spacing */}
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto text-left mb-8 sm:mb-10">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white border border-[#DCE1E7] hover:border-[#BFC7D2] focus-within:border-[#2A548E] focus-within:ring-2 focus-within:ring-[#2A548E]/15 rounded-xs shadow-sm transition-all p-2 sm:p-2.5 min-h-[64px] gap-2">
            
            <div className="flex items-center flex-1 min-w-0 px-3 py-2 sm:py-1">
              <Search className="w-5 h-5 text-[#5A6270] shrink-0 mr-3.5" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  activeShoppingRecipient
                    ? `What else is ${activeShoppingRecipient.name} into?`
                    : "Who are you shopping for, and what are they into?"
                }
                className="w-full bg-transparent text-[#1E232B] placeholder:text-[#8D96A5] font-sans-clean text-base sm:text-lg focus:outline-none pr-2"
                aria-label="Natural language gift search input"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={handleClearInput}
                  className="p-1.5 text-[#8D96A5] hover:text-[#1E232B] rounded-full hover:bg-[#F0F2F5] transition-colors ml-1 mr-1 shrink-0 cursor-pointer"
                  title="Clear search text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSearching || !inputValue.trim()}
              className="px-7 py-3.5 sm:py-3.5 bg-[#1E232B] hover:bg-[#2A548E] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans-clean text-sm font-semibold rounded-xs transition-all flex items-center justify-center gap-2.5 shrink-0 cursor-pointer shadow-xs min-h-[48px]"
            >
              <span>Find Gifts</span>
              <ArrowRight className="w-4 h-4 text-[#C3F3DF]" />
            </button>
          </div>
        </form>

        {/* Live Interpretation Signal Tagline */}
        {interpretation && interpretation.interpretedSummary !== 'Broad Discovery Search' && (
          <div className="mb-8 sm:mb-10 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs text-[#5A6270] font-sans-clean px-4 py-2.5 bg-white/80 rounded-xs border border-[#E2E5E9] max-w-2xl mx-auto shadow-2xs">
            <span className="font-semibold text-[#1E232B]">Interpreted Clues:</span>
            <span>{interpretation.interpretedSummary}</span>
          </div>
        )}

        {/* Section: "Try searching for" / Example Prompts */}
        <div className="text-left max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2A548E]" />
            <span className="font-mono-accent text-[11.5px] font-semibold uppercase tracking-wider text-[#5A6270]">
              Try searching for
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {EXAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptClick(prompt)}
                className="text-left px-4 py-2.5 bg-white hover:bg-[#F3F6FA] border border-[#DCE1E7] hover:border-[#2A548E]/40 rounded-xs text-xs sm:text-[13px] text-[#1E232B] font-sans-clean leading-relaxed transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>&ldquo;{prompt}&rdquo;</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section: Saved Recipient Profiles (Clear separation with generous spacing) */}
        {recipientListsWithProfiles.length > 0 && (
          <div className="text-left max-w-3xl mx-auto pt-8 sm:pt-10 border-t border-[#E2E5E9]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#226E56]" />
                <span className="font-mono-accent text-[11.5px] font-semibold uppercase tracking-wider text-[#5A6270]">
                  Saved Recipient Profiles
                </span>
              </div>
              <span className="text-[11px] font-sans-clean text-[#8D96A5]">
                Click a profile to tailor recommendations
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {recipientListsWithProfiles.map((list) => {
                const isActive = activeShoppingRecipient?.id === list.id;
                const profile = list.recipientProfile!;

                return (
                  <button
                    key={list.id}
                    type="button"
                    onClick={() => handleSelectRecipientList(list)}
                    className={`p-4 rounded-xs border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-[#C3F3DF]/40 border-[#226E56] ring-1 ring-[#226E56]'
                        : 'bg-white hover:bg-[#FAF8F5] border-[#DCE1E7] hover:border-[#2A548E]/40 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <User className={`w-3.5 h-3.5 ${isActive ? 'text-[#226E56]' : 'text-[#2A548E]'}`} />
                        <span className="font-editorial text-base font-bold text-[#1E232B]">
                          {list.name}
                        </span>
                      </div>
                      {profile.budgetRange && (
                        <span className="font-mono-accent text-[11px] text-[#5A6270] bg-[#EAEFF5] px-2 py-0.5 rounded-xs">
                          {profile.budgetRange}
                        </span>
                      )}
                    </div>

                    {profile.interests?.length > 0 && (
                      <p className="text-xs font-sans-clean text-[#5A6270] truncate mb-1">
                        {profile.interests.join(' · ')}
                      </p>
                    )}

                    {profile.notes && (
                      <p className="text-[11px] font-sans-clean italic text-[#8D96A5] truncate">
                        &ldquo;{profile.notes}&rdquo;
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
