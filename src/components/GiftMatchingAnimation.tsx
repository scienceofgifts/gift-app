import React, { useState, useEffect } from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { QueryInterpretation } from '../types/gift';

interface GiftMatchingAnimationProps {
  onComplete: () => void;
  interpretation?: QueryInterpretation | null;
  durationMs?: number;
}

const PHRASES = [
  "Reading the clues...",
  "Finding the right interests...",
  "Comparing gift ideas...",
  "Narrowing the possibilities...",
  "Finding the best match..."
];

export const GiftMatchingAnimation: React.FC<GiftMatchingAnimationProps> = ({
  onComplete,
  interpretation,
  durationMs = 2400
}) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = durationMs / PHRASES.length;
    
    // Interval for changing phrases
    const phraseInterval = setInterval(() => {
      setCurrentPhraseIndex((prev) => {
        if (prev < PHRASES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    // Smooth progress ticker
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);
      if (elapsed >= durationMs) {
        clearInterval(phraseInterval);
        clearInterval(progressInterval);
        onComplete();
      }
    }, 40);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(progressInterval);
    };
  }, [durationMs, onComplete]);

  return (
    <div className="py-20 px-4 sm:px-6 flex flex-col items-center justify-center text-center max-w-xl mx-auto animate-fade-in">
      
      {/* Editorial Astrolabe / Dial Animated Icon with Science of Gifts colors */}
      <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border border-[#2A548E]/25 rounded-full animate-spin-slow" />
        
        {/* Inner pulsing ring */}
        <div className="absolute inset-2 border border-dashed border-[#226E56]/40 rounded-full animate-subtle-pulse" />
        
        {/* Core Compass Emblem */}
        <div className="w-12 h-12 bg-[#1E232B] text-white rounded-full flex items-center justify-center shadow-md">
          <Compass className="w-6 h-6 text-[#C3F3DF] animate-pulse" />
        </div>
      </div>

      {/* Primary Status Phrase in Playfair Display */}
      <h2 className="font-editorial text-2xl sm:text-3xl text-[#1E232B] font-bold mb-3 transition-all duration-300">
        {PHRASES[currentPhraseIndex]}
      </h2>

      {/* Subtext with detected tags */}
      {interpretation && interpretation.detectedInterests.length > 0 ? (
        <p className="font-sans-clean text-xs sm:text-sm text-[#5A6270] mb-6">
          Calibrating matches for <span className="text-[#1E232B] font-semibold">{interpretation.detectedInterests.join(', ')}</span>
          {interpretation.detectedRecipients.length > 0 && (
            <> &middot; Recipient: <span className="text-[#1E232B] font-semibold">{interpretation.detectedRecipients.join(', ')}</span></>
          )}
        </p>
      ) : (
        <p className="font-sans-clean text-xs sm:text-sm text-[#5A6270] mb-6">
          Evaluating catalog against recipient personality, utility, and budget...
        </p>
      )}

      {/* Sleek Minimal Progress Line */}
      <div className="w-64 h-1.5 bg-[#E2E5E9] rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-[#2A548E] transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="font-mono-accent text-[11px] text-[#5A6270] tracking-widest uppercase">
        Match Confidence · {progress}%
      </div>

    </div>
  );
};
