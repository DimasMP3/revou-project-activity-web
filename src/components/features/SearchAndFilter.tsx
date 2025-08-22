import React, { useState } from 'react';
import { animationClasses } from '../ui/animations';
import { Activity } from './ActivityCard';

interface SearchAndFilterProps {
  activities: Activity[];
  onFilteredActivities: (filtered: Activity[]) => void;
}

type SortOption = 'newest' | 'oldest' | 'duration' | 'alphabetical';
type FilterStatus = 'all' | 'active' | 'completed' | 'scheduled';

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  activities,
  onFilteredActivities
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Get unique categories
  const categories = Array.from(new Set(
    activities.map(a => a.category).filter(Boolean)
  )).sort();

  const applyFilters = React.useCallback(() => {
    let filtered = [...activities];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.category && activity.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(activity => activity.category === selectedCategory);
    }

    // Status filter
    if (filterStatus !== 'all') {
      const now = new Date();
      if (filterStatus === 'active') {
        filtered = filtered.filter(activity => {
          const startDate = new Date(activity.startTime);
          return !activity.endTime && startDate <= now;
        });
      } else if (filterStatus === 'completed') {
        filtered = filtered.filter(activity => {
          const endDate = activity.endTime ? new Date(activity.endTime) : null;
          return endDate && endDate < now;
        });
      } else if (filterStatus === 'scheduled') {
        filtered = filtered.filter(activity => {
          const startDate = new Date(activity.startTime);
          return startDate > now;
        });
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        case 'oldest':
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        case 'duration':
          const aDuration = a.endTime 
            ? new Date(a.endTime).getTime() - new Date(a.startTime).getTime()
            : new Date().getTime() - new Date(a.startTime).getTime();
          const bDuration = b.endTime 
            ? new Date(b.endTime).getTime() - new Date(b.startTime).getTime()
            : new Date().getTime() - new Date(b.startTime).getTime();
          return bDuration - aDuration;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    onFilteredActivities(filtered);
  }, [activities, searchTerm, selectedCategory, sortBy, filterStatus, onFilteredActivities]);

  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('newest');
    setFilterStatus('all');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || sortBy !== 'newest' || filterStatus !== 'all';

  return (
    <div className={`bg-gray-800 rounded-xl border border-gray-700 ${animationClasses.fadeIn}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-white">Search & Filter</h3>
            
            {hasActiveFilters && (
              <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                Filtered
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className={`
                  text-gray-400 hover:text-white text-sm
                  ${animationClasses.buttonHover}
                `}
              >
                Clear all
              </button>
            )}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`
                p-2 text-gray-400 hover:text-white rounded-lg
                ${animationClasses.buttonHover}
              `}
            >
              <svg 
                className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar - Always visible */}
      <div className="p-4">
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <input
            type="text"
            placeholder="Search activities by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition-colors
            "
          />
          
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Filter by Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All Activities' },
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'scheduled', label: 'Scheduled' }
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => setFilterStatus(status.value as FilterStatus)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${filterStatus === status.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }
                    ${animationClasses.buttonHover}
                  `}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter by Category */}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${selectedCategory === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }
                    ${animationClasses.buttonHover}
                  `}
                >
                  All Categories
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category || 'all')}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${selectedCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }
                      ${animationClasses.buttonHover}
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="
                w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                transition-colors
              "
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="duration">Longest Duration</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};