import { Product, QueryInterpretation, ScoredProduct, FilterState, GiftList } from '../types/gift';
import {
  RECIPIENT_SYNONYMS,
  INTEREST_SYNONYMS,
  PERSONALITY_SYNONYMS,
  OCCASION_SYNONYMS,
  PRODUCT_TYPE_SYNONYMS,
  NEGATIVE_PATTERNS
} from '../data/synonyms';

/**
 * Client-side Natural Language Query Interpreter
 */
export function interpretQuery(rawQuery: string): QueryInterpretation {
  const query = rawQuery.trim();
  const lower = query.toLowerCase();

  const detectedRecipients: string[] = [];
  const detectedInterests: string[] = [];
  const detectedOccasions: string[] = [];
  const detectedProductTypes: string[] = [];
  const detectedPersonalities: string[] = [];
  const negativePreferences: string[] = [];
  const sentimentTraits: string[] = [];

  // 1. Detect Negatives first (e.g. "doesn't like decorative", "no t-shirts", "not useless")
  for (const pattern of NEGATIVE_PATTERNS) {
    const match = lower.match(pattern);
    if (match && match[1]) {
      const phrase = match[1].trim();
      negativePreferences.push(phrase);
    }
  }

  // 2. Extract Budget / Price constraints
  let detectedMaxPrice: number | null = null;
  let detectedMinPrice: number | null = null;

  // "under $50", "under 40", "below $60", "less than 50", "<$50", "max $75"
  const underMatch = lower.match(/(?:under|below|less than|max|up to|<)\s*\$?(\d+)/i);
  if (underMatch) {
    detectedMaxPrice = parseInt(underMatch[1], 10);
  }

  // "over $50", "above $30", ">$40", "at least $30"
  const overMatch = lower.match(/(?:over|above|more than|at least|>)\s*\$?(\d+)/i);
  if (overMatch) {
    detectedMinPrice = parseInt(overMatch[1], 10);
  }

  // "between $25 and $75", "$25-$50", "$30 to $60"
  const rangeMatch = lower.match(/\$?(\d+)\s*(?:-|to|and)\s*\$?(\d+)/i);
  if (rangeMatch && !underMatch && !overMatch) {
    const p1 = parseInt(rangeMatch[1], 10);
    const p2 = parseInt(rangeMatch[2], 10);
    detectedMinPrice = Math.min(p1, p2);
    detectedMaxPrice = Math.max(p1, p2);
  }

  if (lower.includes('cheap') || lower.includes('budget') || lower.includes('affordable')) {
    if (detectedMaxPrice === null) detectedMaxPrice = 30;
  }

  // 3. Match Recipients
  for (const group of RECIPIENT_SYNONYMS) {
    for (const alias of group.aliases) {
      const regex = new RegExp(`\\b${alias}\\b`, 'i');
      if (regex.test(lower)) {
        if (!detectedRecipients.includes(group.canonical)) {
          detectedRecipients.push(group.canonical);
        }
        break;
      }
    }
  }

  // 4. Match Interests
  for (const group of INTEREST_SYNONYMS) {
    for (const alias of group.aliases) {
      const regex = new RegExp(`\\b${alias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lower)) {
        if (!detectedInterests.includes(group.canonical)) {
          detectedInterests.push(group.canonical);
        }
        break;
      }
    }
  }

  // 5. Match Occasions
  for (const group of OCCASION_SYNONYMS) {
    for (const alias of group.aliases) {
      const regex = new RegExp(`\\b${alias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lower)) {
        if (!detectedOccasions.includes(group.canonical)) {
          detectedOccasions.push(group.canonical);
        }
        break;
      }
    }
  }

  // 6. Match Product Types
  for (const group of PRODUCT_TYPE_SYNONYMS) {
    for (const alias of group.aliases) {
      const regex = new RegExp(`\\b${alias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lower)) {
        // Ensure this product type wasn't negated
        const isNegated = negativePreferences.some(neg => neg.includes(alias));
        if (!isNegated && !detectedProductTypes.includes(group.canonical)) {
          detectedProductTypes.push(group.canonical);
        }
        break;
      }
    }
  }

  // 7. Match Personality Styles & Traits
  for (const group of PERSONALITY_SYNONYMS) {
    for (const alias of group.aliases) {
      if (lower.includes(alias)) {
        if (!detectedPersonalities.includes(group.canonical)) {
          detectedPersonalities.push(group.canonical);
        }
        break;
      }
    }
  }

  // If query mentions "practical", "useful", "not useless", "doesn't like junk", ensure Practical personality is registered
  if (
    lower.includes("not useless") ||
    lower.includes("no junk") ||
    lower.includes("useful") ||
    lower.includes("practical") ||
    lower.includes("doesn't like useless")
  ) {
    if (!detectedPersonalities.includes("Practical & Utilitarian")) {
      detectedPersonalities.push("Practical & Utilitarian");
    }
  }

  if (
    lower.includes("unusual") ||
    lower.includes("unique") ||
    lower.includes("eccentric") ||
    lower.includes("rare")
  ) {
    if (!detectedPersonalities.includes("Eccentric & Playful")) {
      detectedPersonalities.push("Eccentric & Playful");
    }
  }

  // Build summary
  const summaryParts: string[] = [];
  if (detectedRecipients.length > 0) summaryParts.push(`Recipient: ${detectedRecipients.join(', ')}`);
  if (detectedInterests.length > 0) summaryParts.push(`Interests: ${detectedInterests.join(', ')}`);
  if (detectedPersonalities.length > 0) summaryParts.push(`Style: ${detectedPersonalities.join(', ')}`);
  if (detectedMaxPrice !== null) summaryParts.push(`Budget: ≤ $${detectedMaxPrice}`);
  if (detectedOccasions.length > 0) summaryParts.push(`Occasion: ${detectedOccasions.join(', ')}`);
  if (negativePreferences.length > 0) summaryParts.push(`Avoiding: ${negativePreferences.join(', ')}`);

  const interpretedSummary = summaryParts.length > 0 ? summaryParts.join(' · ') : 'Broad Discovery Search';

  return {
    rawQuery: query,
    detectedRecipients,
    detectedInterests,
    detectedMaxPrice,
    detectedMinPrice,
    detectedOccasions,
    detectedProductTypes,
    detectedPersonalities,
    negativePreferences,
    sentimentTraits,
    interpretedSummary
  };
}

/**
 * Multi-Signal Ranking Algorithm
 */
export function rankCatalog(
  products: Product[],
  query: string,
  filters: FilterState,
  interpretation?: QueryInterpretation,
  recipientProfile?: GiftList['recipientProfile'],
  savedProductIdsForRecipient: string[] = []
): ScoredProduct[] {
  const interp = interpretation || interpretQuery(query);
  const lowerQuery = query.toLowerCase().trim();
  const queryTerms = lowerQuery.split(/\s+/).filter(t => t.length > 2);

  const scored: ScoredProduct[] = [];

  for (const product of products) {
    let recipientScore = 0;
    let interestScore = 0;
    let budgetScore = 0;
    let personalityScore = 0;
    let categoryScore = 0;
    let editorialScore = 0;
    let negativePenalty = 0;
    let alreadySavedDeprioritization = 0;
    const matchingReasons: string[] = [];

    // --- Recipient Profile Influence (if active recipient shopping) ---
    if (recipientProfile) {
      if (recipientProfile.relationship && product.recipients.some(r => r.toLowerCase() === recipientProfile.relationship.toLowerCase())) {
        recipientScore += 30;
      }
      if (recipientProfile.interests && recipientProfile.interests.length > 0) {
        for (const interest of recipientProfile.interests) {
          if (product.interests.some(pi => pi.toLowerCase() === interest.toLowerCase())) {
            interestScore += 25;
            matchingReasons.push(`Matches ${recipientProfile.name}’s interest in ${interest}`);
          }
        }
      }
      if (recipientProfile.maxBudget && product.priceNumber <= recipientProfile.maxBudget) {
        budgetScore += 15;
      }
      if (recipientProfile.personalityStyles && recipientProfile.personalityStyles.length > 0) {
        for (const style of recipientProfile.personalityStyles) {
          if (product.personalityStyles.includes(style)) {
            personalityScore += 15;
          }
        }
      }
    }

    // --- 1. Recipient Matching (High Weight) ---
    if (interp.detectedRecipients.length > 0) {
      const match = interp.detectedRecipients.find(r => 
        product.recipients.some(pr => pr.toLowerCase() === r.toLowerCase())
      );
      if (match) {
        recipientScore += 35;
        matchingReasons.push(`Curated specifically for ${match}`);
      }
    }
    // From Explicit Filters
    if (filters.recipients.length > 0) {
      const filterMatch = filters.recipients.some(r => product.recipients.includes(r));
      if (filterMatch) {
        recipientScore += 25;
      } else {
        recipientScore -= 15;
      }
    }

    // --- 2. Interest Matching (High Weight) ---
    if (interp.detectedInterests.length > 0) {
      let matchedCount = 0;
      for (const interest of interp.detectedInterests) {
        if (product.interests.some(pi => pi.toLowerCase() === interest.toLowerCase())) {
          matchedCount++;
          interestScore += 45;
          matchingReasons.push(`Strong thematic match for ${interest}`);
        }
      }
      if (matchedCount > 1) {
        interestScore += 15;
      }
    }
    // From Explicit Filters
    if (filters.interests.length > 0) {
      const filterInterestMatch = filters.interests.some(i => product.interests.includes(i));
      if (filterInterestMatch) {
        interestScore += 30;
      } else if (interp.detectedInterests.length === 0) {
        interestScore -= 20;
      }
    }

    // --- 3. Budget / Price Matching (High Weight) ---
    if (interp.detectedMaxPrice !== null) {
      if (product.priceNumber <= interp.detectedMaxPrice) {
        budgetScore += 25;
        matchingReasons.push(`Within your $${interp.detectedMaxPrice} budget (${product.price})`);
      } else {
        const overage = product.priceNumber - interp.detectedMaxPrice;
        if (overage <= 5) {
          budgetScore -= 10;
        } else {
          budgetScore -= 35;
        }
      }
    }

    if (interp.detectedMinPrice !== null) {
      if (product.priceNumber >= interp.detectedMinPrice) {
        budgetScore += 10;
      } else {
        budgetScore -= 15;
      }
    }

    // Explicit Filter Price Range
    if (filters.priceRange !== 'all') {
      if (
        (filters.priceRange === 'under25' && product.priceNumber <= 25) ||
        (filters.priceRange === '25to50' && product.priceNumber >= 25 && product.priceNumber <= 50) ||
        (filters.priceRange === '50to75' && product.priceNumber >= 50 && product.priceNumber <= 75) ||
        (filters.priceRange === '75plus' && product.priceNumber >= 75)
      ) {
        budgetScore += 20;
      } else {
        budgetScore -= 25;
      }
    }

    // --- 4. Personality & Style Matching ---
    if (interp.detectedPersonalities.length > 0) {
      for (const pers of interp.detectedPersonalities) {
        if (product.personalityStyles.includes(pers)) {
          personalityScore += 20;
          if (pers === 'Practical & Utilitarian') {
            matchingReasons.push(`Practical, high-utility item (avoids clutter)`);
          } else if (pers === 'Eccentric & Playful') {
            matchingReasons.push(`Distinctive & conversation-starting design`);
          } else {
            matchingReasons.push(`Aligned with ${pers.toLowerCase()} taste`);
          }
        }
      }
    }
    if (filters.personalityStyles.length > 0) {
      const matchPers = filters.personalityStyles.some(p => product.personalityStyles.includes(p));
      if (matchPers) personalityScore += 15;
    }

    // --- 5. Occasion Matching ---
    if (interp.detectedOccasions.length > 0) {
      for (const occ of interp.detectedOccasions) {
        if (product.occasions.includes(occ)) {
          personalityScore += 15;
          matchingReasons.push(`Ideal for ${occ}`);
        }
      }
    }
    if (filters.occasions.length > 0) {
      if (filters.occasions.some(o => product.occasions.includes(o))) {
        personalityScore += 15;
      }
    }

    // --- 6. Product Type Matching ---
    if (interp.detectedProductTypes.length > 0) {
      if (interp.detectedProductTypes.includes(product.productType)) {
        categoryScore += 25;
        matchingReasons.push(`Matches requested format: ${product.productType}`);
      }
    }
    if (filters.productTypes.length > 0) {
      if (filters.productTypes.includes(product.productType)) {
        categoryScore += 20;
      } else {
        categoryScore -= 15;
      }
    }

    // --- 7. Negation Penalty ---
    if (interp.negativePreferences.length > 0) {
      for (const neg of interp.negativePreferences) {
        const negLower = neg.toLowerCase();
        if (
          (negLower.includes('decorative') && product.category === 'Posters & Art Prints') ||
          (negLower.includes('clothing') || negLower.includes('shirt') && product.category === 'Apparel') ||
          (negLower.includes('mug') && product.productType === 'Mug') ||
          (negLower.includes('junk') && product.priceNumber < 20)
        ) {
          negativePenalty += 40;
        }
      }
    }

    // --- 8. Avoid Duplicate Recommendations (Deprioritize already-saved items for this recipient) ---
    if (savedProductIdsForRecipient.includes(product.id)) {
      alreadySavedDeprioritization = 50; // Push already saved items down so user discovers fresh ideas
    }

    // --- 9. Editorial & Full-Text Relevance ---
    const textCorpus = `${product.title} ${product.editorialReview} ${product.whyItMakesAGreatGift} ${product.idealFor} ${product.whatMakesItStandOut} ${product.tags.join(' ')}`.toLowerCase();

    for (const term of queryTerms) {
      if (product.title.toLowerCase().includes(term)) {
        editorialScore += 10;
      } else if (product.tags.some(t => t.toLowerCase().includes(term))) {
        editorialScore += 8;
      } else if (textCorpus.includes(term)) {
        editorialScore += 4;
      }
    }

    // Base quality & rating baseline
    const qualityScore = Math.round((product.rating || 4.8) * 4);

    // Total Score Calculation
    const totalScore = Math.max(
      0,
      recipientScore +
      interestScore +
      budgetScore +
      personalityScore +
      categoryScore +
      editorialScore +
      qualityScore -
      negativePenalty -
      alreadySavedDeprioritization
    );

    // Fallback reasons if needed
    if (matchingReasons.length === 0) {
      matchingReasons.push(`Curated for ${product.interests[0] || 'Curious Minds'}`);
      matchingReasons.push(`${product.badgeLabel || 'Archival'} craftsmanship`);
      if (product.personalityStyles[0]) {
        matchingReasons.push(`Best suited for ${product.personalityStyles[0]}`);
      }
    }

    // Tailored "Why This Gift" Synthesis
    const tailoredWhyThisGift = generateTailoredWhyThisGift(product, interp, matchingReasons, recipientProfile);

    scored.push({
      product,
      score: totalScore,
      matchBreakdown: {
        recipientScore,
        interestScore,
        budgetScore,
        personalityScore,
        categoryScore,
        editorialScore,
        negativePenalty,
        alreadySavedDeprioritization
      },
      matchingReasons: matchingReasons.slice(0, 4),
      tailoredWhyThisGift
    });
  }

  // Sort according to preference
  if (filters.sortBy === 'price-asc') {
    return scored.sort((a, b) => a.product.priceNumber - b.product.priceNumber);
  } else if (filters.sortBy === 'price-desc') {
    return scored.sort((a, b) => b.product.priceNumber - a.product.priceNumber);
  } else if (filters.sortBy === 'rating') {
    return scored.sort((a, b) => b.product.rating - a.product.rating);
  }

  // Default: Smart Relevance Ranking
  return scored.sort((a, b) => b.score - a.score);
}

/**
 * Natural language reasoning synthesis for the primary recommendation
 */
function generateTailoredWhyThisGift(
  product: Product,
  interp: QueryInterpretation,
  reasons: string[],
  recipientProfile?: GiftList['recipientProfile']
): string {
  const parts: string[] = [];

  const recipient = recipientProfile?.name || interp.detectedRecipients[0];
  const interest = interp.detectedInterests[0] || recipientProfile?.interests[0] || product.interests[0];
  const budget = interp.detectedMaxPrice || recipientProfile?.maxBudget;
  const isPractical = interp.detectedPersonalities.includes("Practical & Utilitarian") || recipientProfile?.personalityStyles?.includes("Practical & Utilitarian");

  if (recipient && interest) {
    parts.push(`This is an exceptional match for ${recipient} who is passionate about ${interest.toLowerCase()}`);
  } else if (recipient) {
    parts.push(`This is a particularly thoughtful pick for ${recipient}`);
  } else if (interest) {
    parts.push(`This is a standout choice for anyone fascinated by ${interest.toLowerCase()}`);
  } else {
    parts.push(`This is an editorial standout in ${product.category}`);
  }

  if (isPractical) {
    parts.push(`offers genuine everyday utility rather than decorative clutter`);
  } else if (product.badgeLabel) {
    parts.push(`features verified archival-quality craftsmanship`);
  }

  if (budget) {
    parts.push(`stays comfortably within budget at ${product.price}`);
  } else {
    parts.push(`offers exceptional heirloom value at ${product.price}`);
  }

  return parts.join(', ') + '.';
}
