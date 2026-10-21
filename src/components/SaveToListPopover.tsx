import React, { useState, useRef, useEffect } from 'react';
import { Bookmark, Check, Plus, X, FolderPlus } from 'lucide-react';
import { Product } from '../types/gift';
import { useSavedGifts } from '../context/SavedGiftsContext';

interface SaveToListPopoverProps {
  product: Product;
  triggerButton?: React.ReactNode;
  variant?: 'icon' | 'button' | 'pill';
  className?: string;
}

export const SaveToListPopover: React.FC<SaveToListPopoverProps> = ({
  product,
  variant = 'icon',
  className = ''
}) => {
  const { lists, isSaved, getProductLists, toggleSaveToList, createList } = useSavedGifts();
  const [isOpen, setIsOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const productListIds = getProductLists(product.id);
  const isProductSaved = productListIds.length > 0;

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
        setNewListName('');
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      const newList = createList(newListName.trim());
      toggleSaveToList(product, newList.id);
      setNewListName('');
      setIsCreating(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      {/* Trigger Button Variants */}
      {variant === 'icon' && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`p-2 rounded-xs border transition-all cursor-pointer ${
            isProductSaved
              ? 'bg-[#C3F3DF] text-[#1E232B] border-[#9ADBBC] font-medium shadow-xs'
              : 'bg-white/90 text-[#5A6270] border-[#DCE1E7] hover:bg-white hover:text-[#1E232B]'
          }`}
          aria-label={isProductSaved ? 'Saved to list' : 'Save gift to list'}
          title={isProductSaved ? 'Saved to list' : 'Save to list'}
        >
          <Bookmark className={`w-4 h-4 ${isProductSaved ? 'fill-current text-[#1E232B]' : ''}`} />
        </button>
      )}

      {variant === 'button' && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`px-4 py-2.5 rounded-xs border font-sans-clean text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-2 ${
            isProductSaved
              ? 'bg-[#C3F3DF] text-[#1E232B] border-[#9ADBBC]'
              : 'bg-white hover:bg-[#F2F4F7] text-[#1E232B] border-[#DCE1E7]'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isProductSaved ? 'fill-current' : ''}`} />
          <span>{isProductSaved ? `Saved (${productListIds.length})` : 'Save to List'}</span>
        </button>
      )}

      {variant === 'pill' && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`p-1.5 rounded-xs border transition-all cursor-pointer ${
            isProductSaved
              ? 'bg-[#C3F3DF] text-[#1E232B] border-[#9ADBBC]'
              : 'bg-white/80 text-[#5A6270] border-[#DCE1E7] hover:bg-white hover:text-[#1E232B]'
          }`}
          aria-label={isProductSaved ? 'Saved' : 'Save to list'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isProductSaved ? 'fill-current' : ''}`} />
        </button>
      )}

      {/* Popover Menu */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mt-2 mb-2 w-64 bg-[#FAF8F5] border border-[#DCE1E7] rounded-sm shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E5E9]">
            <span className="font-mono-accent text-[11px] font-semibold tracking-wider uppercase text-[#5A6270]">
              Save Gift To:
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#5A6270] hover:text-[#1E232B] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* List Options */}
          <div className="space-y-1 max-h-48 overflow-y-auto mb-2 pr-0.5">
            {lists.map((list) => {
              const inList = productListIds.includes(list.id);
              return (
                <button
                  key={list.id}
                  type="button"
                  onClick={() => toggleSaveToList(product, list.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xs text-xs font-sans-clean transition-colors text-left cursor-pointer ${
                    inList
                      ? 'bg-[#C3F3DF]/60 text-[#1E232B] font-semibold border border-[#A6DFC8]'
                      : 'hover:bg-[#EAEFF5] text-[#1E232B]'
                  }`}
                >
                  <span className="truncate pr-2">{list.name}</span>
                  {inList ? (
                    <Check className="w-3.5 h-3.5 text-[#226E56] shrink-0" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-[#8D96A5] shrink-0 opacity-0 group-hover:opacity-100" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Create New List Inline */}
          {isCreating ? (
            <form onSubmit={handleCreateAndAdd} className="pt-2 border-t border-[#E2E5E9]">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name (e.g. Sarah)..."
                className="w-full text-xs font-sans-clean px-2.5 py-1.5 bg-white border border-[#DCE1E7] rounded-xs focus:outline-none focus:border-[#2A548E] mb-2"
                autoFocus
              />
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewListName('');
                  }}
                  className="px-2 py-1 text-[11px] text-[#5A6270] hover:text-[#1E232B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newListName.trim()}
                  className="px-2.5 py-1 text-[11px] bg-[#1E232B] text-white rounded-xs font-semibold disabled:opacity-40"
                >
                  Save to List
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="w-full pt-2 border-t border-[#E2E5E9] flex items-center gap-1.5 text-xs text-[#2A548E] hover:text-[#1B3C6B] font-medium transition-colors cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>+ Create New List</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
