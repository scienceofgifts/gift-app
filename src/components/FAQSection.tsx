import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does the Science of Gifts Gift Finder work?",
    answer: "Unlike conventional ecommerce search bars that search only for literal keyword repeats, our concierge uses a multi-signal client-side interpreter. It extracts recipient relationships, niche passions (from WWII military history to optical filmmaking), budget parameters, and personality preferences (such as practical utility vs. artistic lore). It ranks items by authentic relevance so the top recommendations represent genuine curator picks."
  },
  {
    question: "How do I find a gift for someone who is notoriously difficult to shop for?",
    answer: "The best strategy is to describe their specific niche quirks or practical requirements rather than broad categories. For example, instead of searching 'gifts for men', try typing: 'A practical, non-decorative gift for a dad who loves aviation history and hates clutter'. The engine will prioritize durable, everyday functional objects (like tactical flasks or technical scale pens) over disposable novelty items."
  },
  {
    question: "Can I create and manage gift lists for different recipients?",
    answer: "Yes. Click the 'Saved' button in the navigation bar to access your personal Gift Lists. You can create lists for individual people (like Dad, Mom, or Sarah) or occasions (like Christmas 2026). When browsing, click 'Save to List' on any gift to organize your ideas. You can also configure recipient profile notes (like favorite hobbies, budget, and things to avoid) to improve future recommendations."
  },
  {
    question: "How does shopping for a specific recipient work?",
    answer: "When you select 'Find Gifts for Dad' inside your Dad gift list, the discovery engine automatically incorporates his saved interests, budget, and personality preferences into the recommendation algorithm while deprioritizing items you have already saved to his list so you can discover fresh ideas."
  },
  {
    question: "Can I find gifts within a specific budget constraint?",
    answer: "Yes. You can type phrases like 'under $40', 'less than $50', or 'between $25 and $75' directly into the natural-language search box. You can also open the Refine drawer to filter with precise price bracket toggles."
  },
  {
    question: "Does this require creating an account or logging in?",
    answer: "No login or account is required. All gift lists, recipient profiles, custom notes, and saved items persist directly in your browser using local storage, making the Gift Finder private, fast, and accessible anytime."
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-16 border-t border-[#E2E5E9] max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <span className="text-xs font-mono-accent font-semibold uppercase tracking-wider text-[#2A548E] block mb-1">
          Editorial Guidance
        </span>
        <h2 className="font-editorial text-3xl sm:text-4xl text-[#1E232B] font-bold mb-3">
          Frequently Asked Questions
        </h2>
        <p className="font-sans-clean text-sm text-[#5A6270] max-w-lg mx-auto">
          Insights on our curation philosophy, matching logic, and gift lists system.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="bg-white border border-[#DCE1E7] rounded-sm overflow-hidden transition-colors shadow-2xs"
            >
              <button
                onClick={() => toggleIndex(idx)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-editorial text-lg text-[#1E232B] font-bold hover:text-[#2A548E] transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#5A6270] shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm font-sans-clean text-[#5A6270] leading-relaxed border-t border-[#F0F2F5]">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
