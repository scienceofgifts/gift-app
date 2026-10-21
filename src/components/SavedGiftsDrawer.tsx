import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  ExternalLink,
  Bookmark,
  Copy,
  Check,
  StickyNote,
  Plus,
  Folder,
  User,
  Settings,
  Sparkles,
  ShoppingBag,
  ChevronRight,
  ArrowRight,
  CheckSquare,
  Square,
  Edit2
} from 'lucide-react';
import { useSavedGifts } from '../context/SavedGiftsContext';
import { Product, GiftList, RecipientProfile, isAmazonProduct } from '../types/gift';

interface SavedGiftsDrawerProps {
  onSelectProduct: (product: Product) => void;
  onShopForRecipient: (list: GiftList) => void;
}

export const SavedGiftsDrawer: React.FC<SavedGiftsDrawerProps> = ({
  onSelectProduct,
  onShopForRecipient
}) => {
  const {
    lists,
    savedItems,
    createList,
    updateList,
    deleteList,
    removeFromList,
    updateItemNote,
    togglePurchased,
    savedDrawerOpen,
    setSavedDrawerOpen,
    activeListId,
    setActiveListId,
    drawerCreateMode,
    setDrawerCreateMode
  } = useSavedGifts();

  const [selectedListId, setSelectedListId] = useState<string>(activeListId || lists[0]?.id || '');
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isProfileType, setIsProfileType] = useState(true);
  const [newListName, setNewListName] = useState('');
  const [newRelationship, setNewRelationship] = useState('');
  const [newInterests, setNewInterests] = useState('');
  const [newBudget, setNewBudget] = useState('$25–$75');
  const [newNotes, setNewNotes] = useState('');

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<RecipientProfile>({
    name: '',
    relationship: '',
    interests: [],
    budgetRange: '',
    occasions: [],
    personalityStyles: [],
    notes: ''
  });
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [copied, setCopied] = useState(false);

  // Sync selectedListId with activeListId or fallback to first list
  useEffect(() => {
    if (activeListId) {
      setSelectedListId(activeListId);
    } else if (!selectedListId && lists.length > 0) {
      setSelectedListId(lists[0].id);
    }
  }, [activeListId, lists]);

  // If opened via drawerCreateMode, auto-expand create profile form
  useEffect(() => {
    if (savedDrawerOpen && drawerCreateMode) {
      setIsCreatingList(true);
      setIsProfileType(true);
      setDrawerCreateMode(false);
    }
  }, [savedDrawerOpen, drawerCreateMode]);

  if (!savedDrawerOpen) return null;

  const currentList = lists.find(l => l.id === selectedListId) || lists[0];
  const listItems = currentList
    ? savedItems.filter(item => item.listIds.includes(currentList.id))
    : [];

  const totalValue = listItems.reduce((acc, item) => acc + item.product.priceNumber, 0);

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    let profile: RecipientProfile | undefined = undefined;
    if (isProfileType) {
      profile = {
        name: newListName.trim(),
        relationship: newRelationship.trim() || newListName.trim(),
        interests: newInterests
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        budgetRange: newBudget.trim() || '$25–$75',
        occasions: ['Birthday', 'Christmas & Holidays'],
        personalityStyles: ['Practical & Utilitarian'],
        notes: newNotes.trim()
      };
    }

    const newList = createList(newListName.trim(), profile);
    setSelectedListId(newList.id);
    setNewListName('');
    setNewRelationship('');
    setNewInterests('');
    setNewNotes('');
    setIsCreatingList(false);
  };

  const handleStartProfileEdit = () => {
    if (currentList) {
      setProfileForm(
        currentList.recipientProfile || {
          name: currentList.name,
          relationship: currentList.name,
          interests: [],
          budgetRange: '$25–$75',
          occasions: ['Birthday', 'Christmas & Holidays'],
          personalityStyles: ['Practical & Utilitarian'],
          notes: ''
        }
      );
      setEditingProfile(true);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentList) {
      updateList(currentList.id, profileForm.name.trim() || currentList.name, profileForm);
      setEditingProfile(false);
    }
  };

  const handleDeleteList = (id: string) => {
    deleteList(id);
    const remaining = lists.filter(l => l.id !== id);
    if (remaining.length > 0) {
      setSelectedListId(remaining[0].id);
    } else {
      setSelectedListId('');
    }
    setEditingProfile(false);
  };

  const handleCopySummary = () => {
    if (!currentList) return;
    const lines = [
      `🎁 Science of Gifts — List: ${currentList.name}`,
      ...(currentList.recipientProfile?.interests?.length
        ? [`Interests: ${currentList.recipientProfile.interests.join(' · ')}`]
        : []),
      ...(currentList.recipientProfile?.notes
        ? [`Notes: ${currentList.recipientProfile.notes}`]
        : []),
      '',
      ...listItems.map(
        (item, idx) =>
          `${idx + 1}. [${item.isPurchased ? 'Purchased' : 'Idea'}] ${item.product.title} (${item.product.price})${
            item.note ? ` — Note: ${item.note}` : ''
          }\n   ${item.product.productUrl}`
      ),
      `\nTotal Estimated: $${totalValue.toFixed(2)}`
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShopForThisRecipient = () => {
    if (currentList) {
      onShopForRecipient(currentList);
      setSavedDrawerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1E232B]/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setSavedDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
        <div className="w-screen max-w-2xl bg-[#FAF8F5] border-l border-[#DCE1E7] shadow-2xl flex flex-col">
          
          {/* Top Bar */}
          <div className="px-6 py-4.5 border-b border-[#E2E5E9] flex items-center justify-between bg-[#FAF8F5]">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#226E56] fill-[#C3F3DF]" />
              <h2 className="font-editorial text-2xl font-bold text-[#1E232B]">
                Your Gift Lists & Recipients
              </h2>
            </div>

            <button
              onClick={() => setSavedDrawerOpen(false)}
              className="p-1.5 text-[#5A6270] hover:text-[#1E232B] hover:bg-[#EAEFF5] rounded-xs transition-colors cursor-pointer"
              aria-label="Close gift lists drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Column: Lists Navigation (List Selector) */}
            <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-[#E2E5E9] bg-[#F5F2EC] flex flex-col shrink-0">
              
              <div className="p-3 border-b border-[#E2E5E9] flex items-center justify-between">
                <span className="font-mono-accent text-[11px] font-semibold uppercase tracking-wider text-[#5A6270]">
                  Lists & Recipients
                </span>
                <button
                  onClick={() => setIsCreatingList(true)}
                  className="text-xs text-[#2A548E] hover:text-[#1E232B] font-semibold flex items-center gap-1 cursor-pointer"
                  title="Create new gift list or recipient profile"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              </div>

              {/* Inline Create Form (Supports both Wishlist & Recipient Profile) */}
              {isCreatingList && (
                <form onSubmit={handleCreateList} className="p-3 border-b border-[#E2E5E9] bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#1E232B] uppercase font-mono-accent">
                      {isProfileType ? 'New Recipient' : 'New Wishlist'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsProfileType(!isProfileType)}
                      className="text-[10px] text-[#2A548E] hover:underline"
                    >
                      {isProfileType ? 'Switch to Wishlist' : 'Add Profile Details'}
                    </button>
                  </div>

                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder={isProfileType ? "Name (e.g. Sarah, Dad)..." : "List name (e.g. Birthday)..."}
                    className="w-full text-xs font-sans-clean px-2.5 py-1.5 border border-[#DCE1E7] rounded-xs focus:outline-none focus:border-[#2A548E]"
                    autoFocus
                  />

                  {isProfileType && (
                    <>
                      <input
                        type="text"
                        value={newInterests}
                        onChange={(e) => setNewInterests(e.target.value)}
                        placeholder="Interests (e.g. WWII, Coffee)..."
                        className="w-full text-xs font-sans-clean px-2.5 py-1 border border-[#DCE1E7] rounded-xs focus:outline-none focus:border-[#2A548E]"
                      />
                      <input
                        type="text"
                        value={newBudget}
                        onChange={(e) => setNewBudget(e.target.value)}
                        placeholder="Budget (e.g. $25–$75)..."
                        className="w-full text-xs font-sans-clean px-2.5 py-1 border border-[#DCE1E7] rounded-xs focus:outline-none focus:border-[#2A548E]"
                      />
                      <input
                        type="text"
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        placeholder="Quirks / Avoid (e.g. No mugs)..."
                        className="w-full text-xs font-sans-clean px-2.5 py-1 border border-[#DCE1E7] rounded-xs focus:outline-none focus:border-[#2A548E]"
                      />
                    </>
                  )}

                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingList(false);
                        setNewListName('');
                      }}
                      className="px-2 py-0.5 text-[11px] text-[#5A6270]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newListName.trim()}
                      className="px-2.5 py-0.5 text-[11px] bg-[#1E232B] hover:bg-[#2A548E] text-white rounded-xs font-semibold cursor-pointer"
                    >
                      Create
                    </button>
                  </div>
                </form>
              )}

              {/* List Tabs */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {lists.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#8D96A5]">
                    No lists created yet.
                  </div>
                ) : (
                  lists.map((list) => {
                    const count = savedItems.filter(i => i.listIds.includes(list.id)).length;
                    const isSelected = list.id === selectedListId;

                    return (
                      <button
                        key={list.id}
                        onClick={() => {
                          setSelectedListId(list.id);
                          setEditingProfile(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xs text-xs font-sans-clean transition-colors text-left cursor-pointer ${
                          isSelected
                            ? 'bg-[#1E232B] text-white font-semibold shadow-2xs'
                            : 'text-[#1E232B] hover:bg-[#EAEFF5]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {list.recipientProfile ? (
                            <User className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#C3F3DF]' : 'text-[#5A6270]'}`} />
                          ) : (
                            <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#C3F3DF]' : 'text-[#5A6270]'}`} />
                          )}
                          <span className="truncate">{list.name}</span>
                        </div>
                        <span
                          className={`font-mono-accent text-[11px] px-1.5 py-0.2 rounded-full shrink-0 ${
                            isSelected
                              ? 'bg-[#373D47] text-[#C3F3DF]'
                              : 'bg-[#E2E5E9] text-[#5A6270]'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

            </div>

            {/* Right Column: Active List Details & Saved Products */}
            <div className="flex-1 flex flex-col overflow-y-auto bg-[#FAF8F5]">
              
              {currentList ? (
                <>
                  {/* List Header & Recipient Info Card */}
                  <div className="p-5 border-b border-[#E2E5E9] bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-editorial text-2xl font-bold text-[#1E232B]">
                            {currentList.name}
                          </h3>
                          {currentList.recipientProfile && (
                            <span className="bg-[#C3F3DF] text-[#1E232B] text-[10px] font-mono-accent font-semibold px-2 py-0.5 rounded-xs">
                              Recipient Profile
                            </span>
                          )}
                        </div>
                        <p className="font-sans-clean text-xs text-[#5A6270] mt-0.5">
                          {listItems.length} {listItems.length === 1 ? 'gift saved' : 'gifts saved'} · Total value: ${totalValue.toFixed(2)}
                        </p>
                      </div>

                      {/* Recipient Action Buttons */}
                      <div className="flex items-center gap-2">
                        {currentList.recipientProfile && (
                          <button
                            onClick={handleShopForThisRecipient}
                            className="px-3 py-1.5 bg-[#2A548E] hover:bg-[#1B3C6B] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            title="Search specifically for this recipient"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#99BFF9]" />
                            <span>Find Gifts for {currentList.name}</span>
                          </button>
                        )}

                        <button
                          onClick={handleStartProfileEdit}
                          className="p-1.5 text-[#5A6270] hover:text-[#1E232B] border border-[#DCE1E7] rounded-xs hover:bg-[#F2F4F7] cursor-pointer"
                          title="Edit recipient profile preferences or rename list"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteList(currentList.id)}
                          className="p-1.5 text-[#5A6270] hover:text-red-600 border border-[#DCE1E7] rounded-xs hover:bg-red-50 cursor-pointer"
                          title="Delete this list"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Recipient Profile Summary Pillbox */}
                    {currentList.recipientProfile && !editingProfile && (
                      <div className="mt-3 p-3 bg-[#FAF8F5] border border-[#E2E5E9] rounded-xs text-xs font-sans-clean text-[#4A515E] space-y-1">
                        {currentList.recipientProfile.interests?.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#1E232B]">Interests:</span>
                            <span>{currentList.recipientProfile.interests.join(' · ')}</span>
                          </div>
                        )}
                        {currentList.recipientProfile.budgetRange && (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#1E232B]">Target Budget:</span>
                            <span className="font-mono-accent">{currentList.recipientProfile.budgetRange}</span>
                          </div>
                        )}
                        {currentList.recipientProfile.notes && (
                          <div className="flex items-start gap-2 pt-0.5">
                            <span className="font-semibold text-[#1E232B] shrink-0">Notes:</span>
                            <span className="italic text-[#5A6270]">&ldquo;{currentList.recipientProfile.notes}&rdquo;</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Recipient Profile Edit Form */}
                    {editingProfile && (
                      <form onSubmit={handleSaveProfile} className="mt-3 p-4 bg-[#F5F2EC] border border-[#DCE1E7] rounded-xs space-y-3 text-xs font-sans-clean">
                        <div className="font-semibold text-[#1E232B] border-b border-[#E2E5E9] pb-1 flex justify-between items-center">
                          <span>Edit Profile for {currentList.name}</span>
                          <button
                            type="button"
                            onClick={() => setEditingProfile(false)}
                            className="text-[#5A6270] hover:text-[#1E232B]"
                          >
                            Cancel
                          </button>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#5A6270] mb-1">
                            Recipient / List Name
                          </label>
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#DCE1E7] rounded-xs focus:outline-none focus:border-[#2A548E]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#5A6270] mb-1">
                            Interests & Passions (comma separated)
                          </label>
                          <input
                            type="text"
                            value={profileForm.interests?.join(', ')}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                interests: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                              })
                            }
                            placeholder="e.g. WWII, History, Whiskey, Astronomy"
                            className="w-full px-2.5 py-1.5 bg-white border border-[#DCE1E7] rounded-xs focus:outline-none focus:border-[#2A548E]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#5A6270] mb-1">
                              Budget Range
                            </label>
                            <input
                              type="text"
                              value={profileForm.budgetRange}
                              onChange={(e) => setProfileForm({ ...profileForm, budgetRange: e.target.value })}
                              placeholder="e.g. $25–$75"
                              className="w-full px-2.5 py-1.5 bg-white border border-[#DCE1E7] rounded-xs focus:outline-none focus:border-[#2A548E]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-[#5A6270] mb-1">
                              Relationship
                            </label>
                            <input
                              type="text"
                              value={profileForm.relationship}
                              onChange={(e) => setProfileForm({ ...profileForm, relationship: e.target.value })}
                              placeholder="e.g. Dad, Sister, Friend"
                              className="w-full px-2.5 py-1.5 bg-white border border-[#DCE1E7] rounded-xs focus:outline-none focus:border-[#2A548E]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#5A6270] mb-1">
                            Notes / Quirks / Things to Avoid
                          </label>
                          <input
                            type="text"
                            value={profileForm.notes}
                            onChange={(e) => setProfileForm({ ...profileForm, notes: e.target.value })}
                            placeholder="e.g. Already has too many mugs, likes practical everyday tools"
                            className="w-full px-2.5 py-1.5 bg-white border border-[#DCE1E7] rounded-xs focus:outline-none focus:border-[#2A548E]"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="submit"
                            className="px-3 py-1.5 bg-[#1E232B] text-white font-semibold rounded-xs hover:bg-[#2A548E]"
                          >
                            Save Preferences
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Saved Items List */}
                  <div className="flex-1 p-5 space-y-3 overflow-y-auto">
                    {listItems.length === 0 ? (
                      <div className="py-14 text-center text-[#5A6270]">
                        <ShoppingBag className="w-8 h-8 mx-auto text-[#BAC3D0] mb-2.5 stroke-[1.5]" />
                        <h4 className="font-editorial text-lg text-[#1E232B] font-semibold mb-1">
                          No gifts saved in this list yet
                        </h4>
                        <p className="font-sans-clean text-xs max-w-xs mx-auto leading-relaxed mb-4">
                          Browse recommendations and click &ldquo;Save to List&rdquo; to collect ideas for {currentList.name}.
                        </p>
                        {currentList.recipientProfile ? (
                          <button
                            onClick={handleShopForThisRecipient}
                            className="px-4 py-2 bg-[#1E232B] hover:bg-[#2A548E] text-white text-xs font-semibold rounded-xs transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#C3F3DF]" />
                            <span>Discover Gifts for {currentList.name}</span>
                          </button>
                        ) : null}
                      </div>
                    ) : (
                      listItems.map(({ product, note, isPurchased }) => (
                        <div
                          key={product.id}
                          className={`bg-white border rounded-xs p-3.5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                            isPurchased ? 'border-[#C3F3DF] bg-[#F7FCFA]' : 'border-[#DCE1E7] hover:border-[#BFC7D2]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* Purchased checkbox toggle */}
                            <button
                              type="button"
                              onClick={() => togglePurchased(product.id)}
                              className="text-[#5A6270] hover:text-[#226E56] p-0.5 cursor-pointer shrink-0"
                              title={isPurchased ? 'Mark as idea' : 'Mark as purchased'}
                            >
                              {isPurchased ? (
                                <CheckSquare className="w-4 h-4 text-[#226E56]" />
                              ) : (
                                <Square className="w-4 h-4 text-[#BAC3D0]" />
                              )}
                            </button>

                            {/* Thumbnail */}
                            <div
                              onClick={() => {
                                onSelectProduct(product);
                                setSavedDrawerOpen(false);
                              }}
                              className="w-13 h-13 bg-[#EAEFF5] rounded-xs overflow-hidden border border-[#DCE1E7] shrink-0 cursor-pointer"
                            >
                              <img
                                src={product.image}
                                alt={product.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 text-[11px] font-sans-clean text-[#5A6270]">
                                <span>{product.category}</span>
                                {isPurchased && (
                                   <span className="text-[#226E56] font-semibold bg-[#C3F3DF] px-1.5 py-0.2 rounded-xs text-[10px]">
                                    Purchased
                                  </span>
                                )}
                              </div>

                              <h5
                                onClick={() => {
                                  onSelectProduct(product);
                                  setSavedDrawerOpen(false);
                                }}
                                className={`font-editorial text-base font-semibold leading-tight truncate hover:text-[#2A548E] cursor-pointer ${
                                  isPurchased ? 'line-through text-[#7A8290]' : 'text-[#1E232B]'
                                }`}
                              >
                                {product.title}
                              </h5>

                              {/* Custom Item Note */}
                              {editingNoteId === product.id ? (
                                <div className="mt-1 flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Add recipient note..."
                                    className="text-xs px-2 py-0.5 border border-[#DCE1E7] rounded-xs w-48"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => {
                                      updateItemNote(product.id, noteText.trim());
                                      setEditingNoteId(null);
                                    }}
                                    className="text-[11px] px-2 py-0.5 bg-[#1E232B] text-white rounded-xs"
                                  >
                                    Save
                                  </button>
                                </div>
                              ) : (
                                <div className="mt-0.5 flex items-center gap-2">
                                  {note ? (
                                    <span
                                      onClick={() => {
                                        setEditingNoteId(product.id);
                                        setNoteText(note);
                                      }}
                                      className="text-[11px] text-[#2A548E] italic bg-[#EBF2FA] px-1.5 py-0.2 rounded-xs cursor-pointer truncate max-w-[200px]"
                                      title="Click to edit note"
                                    >
                                      &ldquo;{note}&rdquo;
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setEditingNoteId(product.id);
                                        setNoteText('');
                                      }}
                                      className="text-[10.5px] text-[#7A8290] hover:text-[#1E232B] inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <StickyNote className="w-2.5 h-2.5" />
                                      <span>Add note</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right side: Price & Links */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0F2F5]">
                            <div className="text-right">
                              <span className="font-mono-accent text-sm font-semibold text-[#1E232B] block">
                                {isAmazonProduct(product) ? (product.priceRange || product.price) : product.price}
                              </span>
                              {isAmazonProduct(product) && (
                                <span className="text-[10px] text-[#2A548E] font-medium block">
                                  Amazon Price Range
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <a
                                href={product.productUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-[#5A6270] hover:text-[#1E232B] border border-[#DCE1E7] rounded-xs hover:bg-[#F2F4F7]"
                                title={`View on ${product.vendor}`}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => removeFromList(product.id, currentList.id)}
                                className="p-1.5 text-[#5A6270] hover:text-red-600 border border-[#DCE1E7] rounded-xs hover:bg-red-50"
                                title="Remove from this list"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* List Footer Bar */}
                  {listItems.length > 0 && (
                    <div className="p-4 border-t border-[#E2E5E9] bg-white flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-mono-accent uppercase tracking-wider text-[#5A6270] block">
                          Estimated Subtotal
                        </span>
                        <span className="font-mono-accent text-lg font-bold text-[#1E232B] block">
                          ~${totalValue.toFixed(2)}
                        </span>
                        {listItems.some(i => isAmazonProduct(i.product)) && (
                          <span className="text-[10px] text-[#5A6270] italic block mt-0.5">
                            Includes estimated Amazon items (prices subject to change)
                          </span>
                        )}
                      </div>

                      <button
                        onClick={handleCopySummary}
                        className="px-4 py-2 bg-[#1E232B] hover:bg-[#2A548E] text-white text-xs font-semibold rounded-xs transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-[#C3F3DF]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'List Copied!' : 'Copy Gift List'}</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-12 text-center text-[#5A6270]">
                  <p className="font-sans-clean text-sm mb-4">No active list selected.</p>
                  <button
                    onClick={() => {
                      setIsCreatingList(true);
                      setIsProfileType(true);
                    }}
                    className="px-4 py-2 bg-[#1E232B] text-white text-xs font-semibold rounded-xs hover:bg-[#2A548E]"
                  >
                    Create a Recipient Profile
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
