import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, SavedGiftItem, GiftList, RecipientProfile } from '../types/gift';

interface SavedGiftsContextType {
  lists: GiftList[];
  savedItems: SavedGiftItem[];
  createList: (name: string, profile?: RecipientProfile) => GiftList;
  updateList: (id: string, name: string, profile?: RecipientProfile) => void;
  deleteList: (id: string) => void;
  isSaved: (productId: string, listId?: string) => boolean;
  getProductLists: (productId: string) => string[];
  saveToList: (product: Product, listId: string, note?: string) => void;
  removeFromList: (productId: string, listId: string) => void;
  toggleSaveToList: (product: Product, listId: string) => void;
  removeSavedCompletely: (productId: string) => void;
  updateItemNote: (productId: string, note: string) => void;
  togglePurchased: (productId: string) => void;
  clearAll: () => void;
  activeShoppingRecipient: GiftList | null;
  setActiveShoppingRecipient: (list: GiftList | null) => void;
  savedDrawerOpen: boolean;
  setSavedDrawerOpen: (open: boolean) => void;
  activeListId: string | null;
  setActiveListId: (id: string | null) => void;
  totalSavedCount: number;
}

const STORAGE_KEY_ITEMS = 'science_of_gifts_saved_items_v2';
const STORAGE_KEY_LISTS = 'science_of_gifts_lists_v2';

const DEFAULT_LISTS: GiftList[] = [
  {
    id: 'list-dad',
    name: 'Dad',
    isDefault: true,
    recipientProfile: {
      name: 'Dad',
      relationship: 'Dad',
      interests: ['WWII', 'Military History', 'Tactile Mechanics'],
      budgetRange: '$25–$75',
      maxBudget: 75,
      occasions: ['Father’s Day', 'Christmas & Holidays', 'Birthday'],
      personalityStyles: ['Practical & Utilitarian', 'Nostalgic & Historic'],
      notes: 'Already has too many mugs. Prefers durable, practical tools or historical items.'
    },
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2
  },
  {
    id: 'list-mom',
    name: 'Mom',
    isDefault: true,
    recipientProfile: {
      name: 'Mom',
      relationship: 'Mom',
      interests: ['Botany & Nature', 'Literature & Writing', 'Greek Mythology'],
      budgetRange: '$25–$50',
      maxBudget: 50,
      occasions: ['Mother’s Day', 'Birthday', 'Christmas & Holidays'],
      personalityStyles: ['Refined & Discerning', 'Creative & Artistic'],
      notes: 'Loves gardening, ancient stories, and cozy reading accessories.'
    },
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000
  },
  {
    id: 'list-general',
    name: 'General Wishlist',
    isDefault: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

const SavedGiftsContext = createContext<SavedGiftsContextType | undefined>(undefined);

export const SavedGiftsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<GiftList[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LISTS);
      return stored ? JSON.parse(stored) : DEFAULT_LISTS;
    } catch {
      return DEFAULT_LISTS;
    }
  });

  const [savedItems, setSavedItems] = useState<SavedGiftItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch {
      return [];
    }
  });

  const [activeShoppingRecipient, setActiveShoppingRecipient] = useState<GiftList | null>(null);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [activeListId, setActiveListId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LISTS, JSON.stringify(lists));
    } catch (e) {
      console.warn('Could not save lists to localStorage', e);
    }
  }, [lists]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(savedItems));
    } catch (e) {
      console.warn('Could not save items to localStorage', e);
    }
  }, [savedItems]);

  const createList = (name: string, profile?: RecipientProfile): GiftList => {
    const newList: GiftList = {
      id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim() || 'Untitled List',
      recipientProfile: profile,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setLists(prev => [...prev, newList]);
    return newList;
  };

  const updateList = (id: string, name: string, profile?: RecipientProfile) => {
    setLists(prev =>
      prev.map(l =>
        l.id === id
          ? {
              ...l,
              name: name.trim() || l.name,
              recipientProfile: profile !== undefined ? profile : l.recipientProfile,
              updatedAt: Date.now()
            }
          : l
      )
    );
  };

  const deleteList = (id: string) => {
    setLists(prev => prev.filter(l => l.id !== id));
    // Remove listId reference from items
    setSavedItems(prev =>
      prev
        .map(item => ({
          ...item,
          listIds: item.listIds.filter(lid => lid !== id)
        }))
        .filter(item => item.listIds.length > 0)
    );
    if (activeListId === id) {
      setActiveListId(null);
    }
    if (activeShoppingRecipient?.id === id) {
      setActiveShoppingRecipient(null);
    }
  };

  const isSaved = (productId: string, listId?: string): boolean => {
    const item = savedItems.find(i => i.product.id === productId);
    if (!item) return false;
    if (!listId) return item.listIds.length > 0;
    return item.listIds.includes(listId);
  };

  const getProductLists = (productId: string): string[] => {
    const item = savedItems.find(i => i.product.id === productId);
    return item ? item.listIds : [];
  };

  const saveToList = (product: Product, listId: string, note?: string) => {
    setSavedItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        const updatedLists = existing.listIds.includes(listId)
          ? existing.listIds
          : [...existing.listIds, listId];
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, listIds: updatedLists, note: note || i.note }
            : i
        );
      } else {
        return [
          {
            product,
            listIds: [listId],
            savedAt: Date.now(),
            note: note || ''
          },
          ...prev
        ];
      }
    });
  };

  const removeFromList = (productId: string, listId: string) => {
    setSavedItems(prev =>
      prev
        .map(i => {
          if (i.product.id === productId) {
            return {
              ...i,
              listIds: i.listIds.filter(id => id !== listId)
            };
          }
          return i;
        })
        .filter(i => i.listIds.length > 0)
    );
  };

  const toggleSaveToList = (product: Product, listId: string) => {
    if (isSaved(product.id, listId)) {
      removeFromList(product.id, listId);
    } else {
      saveToList(product, listId);
    }
  };

  const removeSavedCompletely = (productId: string) => {
    setSavedItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateItemNote = (productId: string, note: string) => {
    setSavedItems(prev =>
      prev.map(i => (i.product.id === productId ? { ...i, note } : i))
    );
  };

  const togglePurchased = (productId: string) => {
    setSavedItems(prev =>
      prev.map(i =>
        i.product.id === productId ? { ...i, isPurchased: !i.isPurchased } : i
      )
    );
  };

  const clearAll = () => {
    setSavedItems([]);
  };

  const totalSavedCount = savedItems.length;

  return (
    <SavedGiftsContext.Provider
      value={{
        lists,
        savedItems,
        createList,
        updateList,
        deleteList,
        isSaved,
        getProductLists,
        saveToList,
        removeFromList,
        toggleSaveToList,
        removeSavedCompletely,
        updateItemNote,
        togglePurchased,
        clearAll,
        activeShoppingRecipient,
        setActiveShoppingRecipient,
        savedDrawerOpen,
        setSavedDrawerOpen,
        activeListId,
        setActiveListId,
        totalSavedCount
      }}
    >
      {children}
    </SavedGiftsContext.Provider>
  );
};

export const useSavedGifts = () => {
  const context = useContext(SavedGiftsContext);
  if (!context) {
    throw new Error('useSavedGifts must be used within a SavedGiftsProvider');
  }
  return context;
};
