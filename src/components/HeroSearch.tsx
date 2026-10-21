import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  User,
  X,
  Users,
  Compass,
  Telescope,
  Coffee,
  BookOpen,
  Filter,
  Check,
  Ban,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { QueryInterpretation, GiftList } from '../types/gift';
import { useSavedGifts } from '../context/SavedGiftsContext';
import { AVOID_PRESETS } from '../data/catalog';
import { EDITORIAL_ARCHETYPES, EditorialArchetype } from '../data/archetypes';

interface HeroSearchProps {
  currentQuery: string;
  onSearch: (query: string) => void;
  interpretation: QueryInterpretation | null;
  isSearching: boolean;
  activeShoppingRecipient: GiftList | null;
  onClearActiveRecipient: () => void;
  avoidKeywords: string[];
  onToggleAvoidKeyword: (term: string) => void;
  onSelectArchetype: (archetype: EditorialArchetype) => void;
  onOpenQuiz: () => void;
}

const EXAMPLE_PROMPTS = [
  "Gift for my dad who loves WWII history and doesn't like useless stuff",
  "Something thoughtful for a woman who loves Greek mythology, under $40",
  "My brother is obsessed with filmmaking. I want something unusual",
  "Christmas gift for a history professor who already owns everything",
  "A practical desk gift for an architect under $50",
  "Fascinating astronomy gift for a curious stargazing friend"
];

const ARCHETYPE_ICONS = {
  Compass: Compass,
  Telescope: Telescope,
  Coffee: Coffee,
  BookOpen: BookOpen
};

export const HeroSearch: React.FC<HeroSearchProps> = ({
  currentQuery,
  onSearch,
  interpretation,
  isSearching,
  activeShoppingRecipient,
  onClearActiveRecipient,
  avoidKeywords,
  onToggleAvoidKeyword,
  onSelectArchetype,
  onOpenQuiz
}) => {
  const [inputValue, setInputValue] = useState(currentQuery);
  const [showAvoidFilters, setShowAvoidFilters] = useState(avoidKeywords.length > 0);
  const {
    lists,
    setActiveShoppingRecipient,
    deleteList,
    openDrawerToCreateProfile,
    openDrawerToEditProfile
  } = useSavedGifts();

  useEffect(() => {
    setInputValue(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    if (avoidKeywords.length > 0) {
      setShowAvoidFilters(true);
    }
  }, [avoidKeywords]);

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

  const recipientListsWithProfiles = lists.filter(l => Boolean(l.recipientProfile));

  return (
    <section id="search-hero" className="relative pt-16 pb-16 sm:pt-20 sm:pb-20 border-b border-[#E2E5E9] bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5] to-[#F3EFE6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Badges & Quick Quiz Trigger */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
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

          {/* Quick Concierge 3-Question Quiz Button */}
          <button
            type="button"
            onClick={onOpenQuiz}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F0F4FA] border border-[#2A548E]/30 text-[#2A548E] text-xs font-sans-clean font-semibold shadow-2xs transition-all cursor-pointer hover:border-[#2A548E]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2A548E]" />
            <span>Find My Match in 3 Questions</span>
          </button>
        </div>

        {/* Primary Editorial Headline in Playfair Display */}
        <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1E232B] font-bold tracking-tight leading-[1.18] mb-4 max-w-3xl mx-auto" style={{ textWrap: 'balance' }}>
          {activeShoppingRecipient
            ? `Find a gift worth giving to ${activeShoppingRecipient.name}.`
            : "Find a gift worth giving."}
        </h1>

        {/* Supporting description */}
        <p className="font-sans-clean text-[#5A6270] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
          Describe who you're shopping for, what they're into, and your budget in natural words. Our concierge interprets your clues to recommend thoughtful, curated gifts.
        </p>

        {/* Natural Language Search Input Container with Generous Spacing */}
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto text-left mb-6">
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

        {/* Feature 1: "Anti-Gift / What to Avoid" Quick Filters */}
        <div className="max-w-3xl mx-auto mb-8 sm:mb-10 text-left">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setShowAvoidFilters(!showAvoidFilters)}
              className="inline-flex items-center gap-1.5 text-xs font-sans-clean font-semibold text-[#5A6270] hover:text-[#1E232B] transition-colors cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5 text-[#8D96A5]" />
              <span>Filter out clichés & unwanted items</span>
              {avoidKeywords.length > 0 && (
                <span className="font-mono-accent text-[10px] bg-[#1E232B] text-white px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                  {avoidKeywords.length} active
                </span>
              )}
              {showAvoidFilters ? (
                <ChevronUp className="w-3 h-3 text-[#8D96A5]" />
              ) : (
                <ChevronDown className="w-3 h-3 text-[#8D96A5]" />
              )}
            </button>

            {avoidKeywords.length > 0 && (
              <button
                type="button"
                onClick={() => avoidKeywords.forEach(k => onToggleAvoidKeyword(k))}
                className="text-[11px] font-sans-clean text-[#8D96A5] hover:text-[#1E232B] transition-colors cursor-pointer"
              >
                Clear avoid filters
              </button>
            )}
          </div>

          {showAvoidFilters && (
            <div className="p-3 bg-[#FAF8F5] border border-[#E2E5E9] rounded-xs animate-in fade-in duration-200">
              <div className="flex flex-wrap gap-2">
                {AVOID_PRESETS.map((preset) => {
                  const isAvoided = avoidKeywords.includes(preset.term);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onToggleAvoidKeyword(preset.term)}
                      className={`px-3 py-1.5 rounded-xs text-xs font-sans-clean transition-all flex items-center gap-1.5 cursor-pointer ${
                        isAvoided
                          ? 'bg-[#1E232B] text-white font-semibold shadow-2xs'
                          : 'bg-white hover:bg-[#F3F6FA] text-[#5A6270] hover:text-[#1E232B] border border-[#DCE1E7]'
                      }`}
                    >
                      <span className={isAvoided ? 'text-[#C3F3DF]' : 'text-[#8D96A5]'}>
                        {isAvoided ? '✕' : '–'}
                      </span>
                      <span>{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Live Interpretation Signal Tagline */}
        {interpretation && interpretation.interpretedSummary !== 'Broad Discovery Search' && (
          <div className="mb-8 sm:mb-10 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs text-[#5A6270] font-sans-clean px-4 py-2.5 bg-white/80 rounded-xs border border-[#E2E5E9] max-w-2xl mx-auto shadow-2xs">
            <span className="font-semibold text-[#1E232B]">Interpreted Clues:</span>
            <span>{interpretation.interpretedSummary}</span>
          </div>
        )}

        {/* Section: "Try searching for" / Example Prompts */}
        <div className="text-left max-w-3xl mx-auto mb-10">
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

        {/* Feature 3: Editorial Archetypes Quick Selector */}
        <div className="text-left max-w-3xl mx-auto mb-10 pt-8 border-t border-[#E2E5E9]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#2A548E]" />
              <span className="font-mono-accent text-[11.5px] font-semibold uppercase tracking-wider text-[#5A6270]">
                Start from an Editorial Archetype
              </span>
            </div>
            <span className="text-[11px] font-sans-clean text-[#8D96A5]">
              Pre-calibrated enthusiast profiles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {EDITORIAL_ARCHETYPES.map((arch) => {
              const Icon = ARCHETYPE_ICONS[arch.iconName] || Compass;
              return (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => onSelectArchetype(arch)}
                  className="p-4 rounded-xs border border-[#DCE1E7] bg-white hover:bg-[#FAF8F5] hover:border-[#2A548E]/50 text-left transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xs bg-[#EAEFF5] text-[#2A548E] flex items-center justify-center group-hover:bg-[#2A548E] group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-editorial text-base font-bold text-[#1E232B]">
                          {arch.title}
                        </span>
                      </div>
                      <span className="font-mono-accent text-[10px] text-[#226E56] bg-[#C3F3DF] px-2 py-0.5 rounded-xs font-semibold">
                        {arch.badge}
                      </span>
                    </div>

                    <p className="font-sans-clean text-xs text-[#5A6270] leading-relaxed mb-3">
                      {arch.tagline}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-sans-clean font-semibold text-[#2A548E] group-hover:text-[#1E232B] transition-colors pt-1">
                    <span>Explore Curated Picks</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Saved Recipient Profiles */}
        <div className="text-left max-w-3xl mx-auto pt-8 border-t border-[#E2E5E9]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#226E56]" />
              <span className="font-mono-accent text-[11.5px] font-semibold uppercase tracking-wider text-[#5A6270]">
                Saved Recipient Profiles
              </span>
            </div>

            {recipientListsWithProfiles.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-sans-clean text-[#8D96A5] hidden sm:inline">
                  Click a profile to tailor recommendations
                </span>
                <button
                  type="button"
                  onClick={openDrawerToCreateProfile}
                  className="inline-flex items-center gap-1 text-xs font-sans-clean font-semibold text-[#2A548E] hover:text-[#1E232B] transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Profile</span>
                </button>
              </div>
            )}
          </div>

          {recipientListsWithProfiles.length === 0 ? (
            /* Editorial "Add Recipient Profile" Prompt Card */
            <button
              type="button"
              onClick={openDrawerToCreateProfile}
              className="w-full border-2 border-dashed border-[#DCE1E7] hover:border-[#2A548E] bg-white/70 hover:bg-white p-5 sm:p-6 rounded-xs text-left transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer shadow-2xs"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#EAEFF5] text-[#2A548E] flex items-center justify-center group-hover:bg-[#2A548E] group-hover:text-white transition-colors shrink-0">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#1E232B] group-hover:text-[#2A548E] transition-colors">
                    Add a Recipient Profile
                  </h3>
                  <p className="font-sans-clean text-xs sm:text-sm text-[#5A6270] mt-0.5 leading-relaxed">
                    Save someone's specific interests, budget, and dislikes for tailored one-click recommendations.
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#FAF8F5] group-hover:bg-[#EAEFF5] border border-[#DCE1E7] text-xs font-sans-clean font-semibold text-[#2A548E] transition-colors shrink-0">
                <span>Create Profile</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {recipientListsWithProfiles.map((list) => {
                const isActive = activeShoppingRecipient?.id === list.id;
                const profile = list.recipientProfile!;

                return (
                  <div
                    key={list.id}
                    onClick={() => handleSelectRecipientList(list)}
                    className={`p-4 rounded-xs border text-left transition-all cursor-pointer flex flex-col justify-between group relative ${
                      isActive
                        ? 'bg-[#C3F3DF]/40 border-[#226E56] ring-1 ring-[#226E56]'
                        : 'bg-white hover:bg-[#FAF8F5] border-[#DCE1E7] hover:border-[#2A548E]/40 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 min-w-0 pr-2">
                          <User className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#226E56]' : 'text-[#2A548E]'}`} />
                          <span className="font-editorial text-base font-bold text-[#1E232B] truncate">
                            {list.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {profile.budgetRange && (
                            <span className="font-mono-accent text-[11px] text-[#5A6270] bg-[#EAEFF5] px-2 py-0.5 rounded-xs mr-1">
                              {profile.budgetRange}
                            </span>
                          )}

                          {/* Quick Edit */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDrawerToEditProfile(list.id);
                            }}
                            className="p-1 text-[#8D96A5] hover:text-[#1E232B] hover:bg-[#EAEFF5] rounded-xs transition-colors cursor-pointer"
                            title="Edit profile"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>

                          {/* Quick Delete */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteList(list.id);
                            }}
                            className="p-1 text-[#8D96A5] hover:text-red-600 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                            title="Delete profile"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
