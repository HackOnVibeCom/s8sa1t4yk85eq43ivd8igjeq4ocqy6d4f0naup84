import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { VenueCard } from '../components/venue/VenueCard';
import { 
  Bookmark, 
  Plus, 
  Search, 
  ChevronRight, 
  Star, 
  Briefcase, 
  MapPin, 
  Eye, 
  ListOrdered,
  FolderPlus
} from 'lucide-react';

export const SavedPlacesPage: React.FC = () => {
  const { venues, savedLists, createSavedList, navigateTo } = useApp();

  const [activeTab, setActiveTab] = useState<'All Saved' | 'My Lists' | 'Recently Viewed'>('All Saved');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isNewListOpen, setIsNewListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');

  // Venues that are saved
  const savedVenues = venues.filter(v => v.saved);

  // If a specific list is selected from the sidebar
  const displayVenues = selectedListId 
    ? venues.filter(v => {
        const targetList = savedLists.find(l => l.id === selectedListId);
        return targetList?.venueIds.includes(v.id);
      })
    : savedVenues;

  const filteredVenues = displayVenues.filter(v => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q) || v.address.toLowerCase().includes(q);
  });

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    createSavedList(newListName.trim(), 'pin');
    setNewListName('');
    setIsNewListOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#DDEBE1] text-forest flex items-center justify-center flex-shrink-0">
            <Bookmark className="w-5 h-5 text-forest" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263C3A] tracking-tight">
              Saved Places
            </h1>
            <p className="text-xs sm:text-sm text-[#74817B]">
              Your collection of accessible places for quick access anytime.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewListOpen(true)}
          className="px-4 py-2 bg-white hover:bg-[#F7F6F0] border border-[#E5E5DC] text-[#263C3A] text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-colors self-start sm:self-auto shadow-2xs"
        >
          <Plus className="w-4 h-4 text-forest" />
          New List
        </button>
      </div>

      {/* Horizontal Tabs (PDF Page 9) */}
      <div className="flex items-center gap-3 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          onClick={() => {
            setActiveTab('All Saved');
            setSelectedListId(null);
          }}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'All Saved' && !selectedListId
              ? 'bg-[#DDEBE1] text-[#155E4B] font-bold'
              : 'text-[#74817B] hover:text-[#263C3A]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          All Saved ({savedVenues.length})
        </button>

        <button
          onClick={() => setActiveTab('My Lists')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'My Lists'
              ? 'bg-[#DDEBE1] text-[#155E4B] font-bold'
              : 'text-[#74817B] hover:text-[#263C3A]'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          My Lists
        </button>

        <button
          onClick={() => setActiveTab('Recently Viewed')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'Recently Viewed'
              ? 'bg-[#DDEBE1] text-[#155E4B] font-bold'
              : 'text-[#74817B] hover:text-[#263C3A]'
          }`}
        >
          <Eye className="w-4 h-4" />
          Recently Viewed
        </button>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-[#E5E5DC] rounded-xl px-3.5 py-2 w-full shadow-2xs">
          <Search className="w-4 h-4 text-[#74817B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in saved places..."
            className="w-full bg-transparent text-xs sm:text-sm text-[#263C3A] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select className="bg-white border border-[#E5E5DC] rounded-xl px-3 py-2 text-xs font-semibold text-[#263C3A] focus:outline-none shadow-2xs cursor-pointer flex-1 sm:flex-none">
            <option>All Categories</option>
            <option>Restaurants</option>
            <option>Shopping Malls</option>
          </select>

          <select className="bg-white border border-[#E5E5DC] rounded-xl px-3 py-2 text-xs font-semibold text-[#263C3A] focus:outline-none shadow-2xs cursor-pointer flex-1 sm:flex-none">
            <option>Sort: Recently Saved</option>
            <option>Sort: Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Saved Places List + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Saved Venue Cards */}
        <div className="lg:col-span-8 space-y-4">
          {selectedListId && (
            <div className="flex items-center justify-between p-3 bg-[#EDF4EA] rounded-xl border border-[#C3D8CE] text-xs">
              <span className="font-bold text-forest">
                Filtering by list: {savedLists.find(l => l.id === selectedListId)?.name}
              </span>
              <button
                onClick={() => setSelectedListId(null)}
                className="text-forest font-bold hover:underline"
              >
                Clear list filter
              </button>
            </div>
          )}

          {filteredVenues.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E5E5DC] p-8 text-center text-[#74817B] space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-gray-300" />
              <p className="font-semibold text-sm">No saved places found</p>
              <p className="text-xs">Explore places in Chennai and click the bookmark icon to save them here.</p>
            </div>
          ) : (
            filteredVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))
          )}
        </div>

        {/* Right Sidebar: My Lists & Quick Stats (PDF Page 9) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* My Lists Card */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3.5">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#263C3A]">
                My Lists
              </h3>
              <p className="text-xs text-[#74817B]">
                Create and organize saved places for different needs.
              </p>
            </div>

            <div className="space-y-2 pt-1 divide-y divide-gray-100">
              {savedLists.map((list) => {
                const isSelected = selectedListId === list.id;
                return (
                  <div
                    key={list.id}
                    onClick={() => setSelectedListId(isSelected ? null : list.id)}
                    className={`pt-2 flex items-center justify-between cursor-pointer p-2 rounded-xl transition-colors ${
                      isSelected ? 'bg-[#EDF4EA] text-forest' : 'hover:bg-[#F7F6F0]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {list.icon === 'star' && <Star className="w-4 h-4 text-[#D6A34B] fill-[#D6A34B]" />}
                      {list.icon === 'briefcase' && <Briefcase className="w-4 h-4 text-forest" />}
                      {list.icon === 'pin' && <MapPin className="w-4 h-4 text-forest" />}
                      <div>
                        <p className="font-bold text-xs text-[#263C3A]">{list.name}</p>
                        <p className="text-[10px] text-[#74817B]">{list.venueIds.length} places</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsNewListOpen(true)}
              className="w-full py-2 bg-[#F7F6F0] hover:bg-[#EDF4EA] text-forest text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-[#E5E5DC]"
            >
              <Plus className="w-3.5 h-3.5" />
              Create New List
            </button>
          </div>

          {/* Quick Stats Card (PDF Page 9) */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-[#263C3A]">
              Quick Stats
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-3 bg-[#F7F6F0] rounded-2xl border border-[#E5E5DC]">
                <Bookmark className="w-4 h-4 text-forest mx-auto mb-1 fill-forest" />
                <p className="font-extrabold text-base text-[#263C3A]">{savedVenues.length}</p>
                <p className="text-[10px] text-[#74817B]">Saved Places</p>
              </div>

              <div className="p-3 bg-[#F7F6F0] rounded-2xl border border-[#E5E5DC]">
                <ListOrdered className="w-4 h-4 text-forest mx-auto mb-1" />
                <p className="font-extrabold text-base text-[#263C3A]">{savedLists.length}</p>
                <p className="text-[10px] text-[#74817B]">Lists</p>
              </div>

              <div className="p-3 bg-[#F7F6F0] rounded-2xl border border-[#E5E5DC]">
                <Eye className="w-4 h-4 text-forest mx-auto mb-1" />
                <p className="font-extrabold text-base text-[#263C3A]">12</p>
                <p className="text-[10px] text-[#74817B]">Recently Viewed</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Create List Modal */}
      {isNewListOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E5E5DC] max-w-sm w-full p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-[#263C3A]">Create a New List</h3>
            <form onSubmit={handleCreateList} className="space-y-3">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="e.g. Weekend Cafes, College Route..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#F7F6F0] border border-[#E5E5DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-forest text-[#263C3A]"
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewListOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#74817B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-forest text-white text-xs font-bold rounded-xl hover:bg-forest-hover"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
