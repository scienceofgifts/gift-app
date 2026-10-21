import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Compass,
  Telescope,
  Coffee,
  BookOpen,
  Wrench,
  DollarSign
} from 'lucide-react';

export interface QuizResults {
  recipient: string;
  interest: string;
  priceBracket: 'under30' | '30to60' | 'all';
}

interface QuickConciergeQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (results: QuizResults) => void;
}

const RECIPIENT_OPTIONS = [
  { id: 'Dad', label: 'Dad / Father', sub: 'Practical heirlooms & history' },
  { id: 'Mom', label: 'Mom / Mother', sub: 'Refined botanicals & literature' },
  { id: 'Partner', label: 'Partner / Spouse', sub: 'Intimate, thoughtful curiosities' },
  { id: 'Friend', label: 'Close Friend', sub: 'Conversation starters & passions' },
  { id: 'Coworker', label: 'Coworker / Mentor', sub: 'Desk objects & refined utility' }
];

const RABBIT_HOLE_OPTIONS = [
  { id: 'History', label: 'WWII & Cartography', icon: Compass, sub: 'Archival maps, blueprints, military history' },
  { id: 'Astronomy', label: 'Deep Space & Physics', icon: Telescope, sub: 'Cosmology, optics, quantum curiosities' },
  { id: 'Coffee', label: 'Specialty Coffee & Brewing', icon: Coffee, sub: 'Extraction science & tactile rituals' },
  { id: 'Literature', label: 'Mythology & Literature', icon: BookOpen, sub: 'Antiquity, rare manuscripts, poetry' },
  { id: 'Mechanics', label: 'Tactile Mechanics & EDC', icon: Wrench, sub: 'Precision machined instruments & gears' }
];

const BUDGET_OPTIONS = [
  { id: 'under30', label: 'Under $30', sub: 'Thoughtful curated gems on a budget' },
  { id: '30to60', label: '$30 – $60', sub: 'Our sweet spot for durable, high-craft items' },
  { id: 'all', label: 'No Limit / Quality First', sub: 'Exceptional heirloom and statement pieces' }
];

export const QuickConciergeQuizModal: React.FC<QuickConciergeQuizModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRecipient, setSelectedRecipient] = useState<string>('Dad');
  const [selectedInterest, setSelectedInterest] = useState<string>('History');
  const [selectedBudget, setSelectedBudget] = useState<'under30' | '30to60' | 'all'>('30to60');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else {
      onComplete({
        recipient: selectedRecipient,
        interest: selectedInterest,
        priceBracket: selectedBudget
      });
      onClose();
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const resetAndClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1E232B]/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={resetAndClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl my-auto bg-white border border-[#DCE1E7] rounded-xs shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[#E2E5E9] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#C3F3DF] flex items-center justify-center text-[#226E56]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-editorial text-lg font-bold text-[#1E232B] leading-none">
                Gift Concierge Quiz
              </h3>
              <span className="font-mono-accent text-[11px] text-[#5A6270]">
                Step {step} of 3
              </span>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="p-1.5 text-[#5A6270] hover:text-[#1E232B] hover:bg-[#EAEFF5] rounded-xs transition-colors cursor-pointer"
            aria-label="Close quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#EAEFF5] h-1">
          <div
            className="bg-[#2A548E] h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8">
          
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <span className="font-mono-accent text-[11px] font-semibold uppercase tracking-wider text-[#2A548E] block mb-1">
                  Question 1
                </span>
                <h4 className="font-editorial text-2xl font-bold text-[#1E232B]">
                  Who are you shopping for?
                </h4>
                <p className="font-sans-clean text-xs text-[#5A6270] mt-1">
                  We'll tune tone, utility, and aesthetic to their personality.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {RECIPIENT_OPTIONS.map((item) => {
                  const isSelected = selectedRecipient === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedRecipient(item.id)}
                      className={`w-full p-3.5 rounded-xs border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#F2FCF7] border-[#226E56] ring-1 ring-[#226E56]'
                          : 'bg-white hover:bg-[#FAF8F5] border-[#DCE1E7]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <User className={`w-4 h-4 ${isSelected ? 'text-[#226E56]' : 'text-[#5A6270]'}`} />
                        <div>
                          <span className="font-sans-clean text-sm font-semibold text-[#1E232B] block">
                            {item.label}
                          </span>
                          <span className="text-xs text-[#7A8290] font-sans-clean">
                            {item.sub}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#226E56]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <span className="font-mono-accent text-[11px] font-semibold uppercase tracking-wider text-[#2A548E] block mb-1">
                  Question 2
                </span>
                <h4 className="font-editorial text-2xl font-bold text-[#1E232B]">
                  What is their core rabbit hole?
                </h4>
                <p className="font-sans-clean text-xs text-[#5A6270] mt-1">
                  Pick the obsession they can talk about for hours without stopping.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {RABBIT_HOLE_OPTIONS.map((item) => {
                  const isSelected = selectedInterest === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedInterest(item.id)}
                      className={`w-full p-3.5 rounded-xs border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#F2FCF7] border-[#226E56] ring-1 ring-[#226E56]'
                          : 'bg-white hover:bg-[#FAF8F5] border-[#DCE1E7]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#226E56]' : 'text-[#2A548E]'}`} />
                        <div>
                          <span className="font-sans-clean text-sm font-semibold text-[#1E232B] block">
                            {item.label}
                          </span>
                          <span className="text-xs text-[#7A8290] font-sans-clean">
                            {item.sub}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#226E56]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <span className="font-mono-accent text-[11px] font-semibold uppercase tracking-wider text-[#2A548E] block mb-1">
                  Question 3
                </span>
                <h4 className="font-editorial text-2xl font-bold text-[#1E232B]">
                  What is your target budget?
                </h4>
                <p className="font-sans-clean text-xs text-[#5A6270] mt-1">
                  We'll filter to items that respect your spending target.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {BUDGET_OPTIONS.map((item) => {
                  const isSelected = selectedBudget === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedBudget(item.id as 'under30' | '30to60' | 'all')}
                      className={`w-full p-3.5 rounded-xs border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#F2FCF7] border-[#226E56] ring-1 ring-[#226E56]'
                          : 'bg-white hover:bg-[#FAF8F5] border-[#DCE1E7]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <DollarSign className={`w-4 h-4 ${isSelected ? 'text-[#226E56]' : 'text-[#5A6270]'}`} />
                        <div>
                          <span className="font-sans-clean text-sm font-semibold text-[#1E232B] block">
                            {item.label}
                          </span>
                          <span className="text-xs text-[#7A8290] font-sans-clean">
                            {item.sub}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#226E56]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-t border-[#E2E5E9] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans-clean font-semibold text-[#5A6270] hover:text-[#1E232B] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 bg-[#1E232B] hover:bg-[#2A548E] text-white font-sans-clean text-xs font-semibold rounded-xs transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>{step === 3 ? 'Show Matching Gifts' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C3F3DF]" />
          </button>
        </div>

      </div>
    </div>
  );
};
