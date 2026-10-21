export type PriceRange = '$0–$25' | '$25–$50' | '$50–$75' | '$75+';

export interface Product {
  id: string;
  title: string;
  image: string;
  price: string;
  priceNumber: number;
  priceRange: PriceRange;
  vendor: string;
  category: string;
  productType: string;
  badgeLabel: string;
  recipients: string[];
  interests: string[];
  occasions: string[];
  ageRanges: string[];
  personalityStyles: string[];
  tags: string[];
  editorialReview: string;
  whyItMakesAGreatGift: string;
  idealFor: string;
  whatMakesItStandOut: string;
  thingsToConsider: string;
  productUrl: string;
  inStock: boolean;
  rating: number;
  reviewCount?: number;
  presentationTip?: string;
  relatedProductIds?: string[];
  isAmazonItem?: boolean;
}

export function isAmazonProduct(product: Product): boolean {
  if (product.isAmazonItem) return true;
  const vendorLower = product.vendor ? product.vendor.toLowerCase() : '';
  const urlLower = product.productUrl ? product.productUrl.toLowerCase() : '';
  return vendorLower.includes('amazon') || urlLower.includes('amazon.com') || urlLower.includes('amzn.to');
}

export interface RecipientProfile {
  name: string;
  relationship: string;
  interests: string[];
  budgetRange: string;
  maxBudget?: number;
  occasions: string[];
  personalityStyles: string[];
  notes: string;
}

export interface GiftList {
  id: string;
  name: string;
  isDefault?: boolean;
  recipientProfile?: RecipientProfile;
  createdAt: number;
  updatedAt: number;
}

export interface SavedGiftItem {
  product: Product;
  listIds: string[];
  savedAt: number;
  note?: string;
  isPurchased?: boolean;
}

export interface QueryInterpretation {
  rawQuery: string;
  detectedRecipients: string[];
  detectedInterests: string[];
  detectedMaxPrice: number | null;
  detectedMinPrice: number | null;
  detectedOccasions: string[];
  detectedProductTypes: string[];
  detectedPersonalities: string[];
  negativePreferences: string[];
  sentimentTraits: string[];
  interpretedSummary: string;
}

export interface ScoredProduct {
  product: Product;
  score: number;
  matchBreakdown: {
    recipientScore: number;
    interestScore: number;
    budgetScore: number;
    personalityScore: number;
    categoryScore: number;
    editorialScore: number;
    negativePenalty: number;
    alreadySavedDeprioritization?: number;
  };
  matchingReasons: string[];
  tailoredWhyThisGift: string;
}

export interface FilterState {
  recipients: string[];
  interests: string[];
  priceRange: 'all' | 'under25' | '25to50' | '50to75' | '75plus';
  maxPrice: number | null;
  productTypes: string[];
  occasions: string[];
  personalityStyles: string[];
  avoidKeywords: string[];
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'rating';
}
