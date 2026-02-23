'use client';

import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';

export interface Challenge {
  name: string;
  key: string;
  tags: string[];
  difficulty: string;
  author: string;
  company?: string[];
}

interface ChallengeSearchProps {
  challenges: Challenge[];
  onFilteredChallenges: (challenges: Challenge[]) => void;
}

export function ChallengeSearch({ challenges, onFilteredChallenges }: ChallengeSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    challenges.forEach(c => c.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [challenges]);

  // Filter challenges
  const filteredChallenges = useMemo(() => {
    return challenges.filter(challenge => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = challenge.name.toLowerCase().includes(query);
        const matchesTags = challenge.tags?.some(t => t.toLowerCase().includes(query));
        const matchesCompany = challenge.company?.some(c => c.toLowerCase().includes(query));
        if (!matchesName && !matchesTags && !matchesCompany) {
          return false;
        }
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all' && challenge.difficulty !== selectedDifficulty) {
        return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every(tag => 
          challenge.tags?.includes(tag)
        );
        if (!hasAllTags) {
          return false;
        }
      }

      return true;
    });
  }, [challenges, searchQuery, selectedDifficulty, selectedTags]);

  // Notify parent of filtered results
  React.useEffect(() => {
    onFilteredChallenges(filteredChallenges);
  }, [filteredChallenges, onFilteredChallenges]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('all');
    setSelectedTags([]);
  };

  const hasActiveFilters = searchQuery || selectedDifficulty !== 'all' || selectedTags.length > 0;

  return (
    <div className="challenge-search">
      {/* Search Input */}
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search challenges by name, tag, or company..."
          className="search-input"
          aria-label="Search challenges"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="clear-search"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="filters-row">
        {/* Difficulty Filter */}
        <div className="filter-group">
          <label className="filter-label">Difficulty:</label>
          <div className="filter-buttons">
            {['all', 'easy', 'medium', 'advanced'].map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`filter-btn ${selectedDifficulty === diff ? 'active' : ''} ${
                  diff === 'easy' ? 'difficulty-easy' : 
                  diff === 'medium' ? 'difficulty-medium' : 
                  diff === 'advanced' ? 'difficulty-hard' : ''
                }`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        )}
      </div>

      {/* Tags Filter */}
      <div className="tags-filter">
        <label className="filter-label">Tags:</label>
        <div className="tags-list">
          {allTags.slice(0, 10).map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`tag-btn ${selectedTags.includes(tag) ? 'selected' : ''}`}
            >
              {tag}
            </button>
          ))}
          {allTags.length > 10 && (
            <span className="more-tags">+{allTags.length - 10} more</span>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        Showing {filteredChallenges.length} of {challenges.length} challenges
      </div>

      <style jsx>{`
        .challenge-search {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          background: var(--bg-secondary, #f9fafb);
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }
        
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted, #9ca3af);
        }
        
        .search-input {
          width: 100%;
          padding: 0.75rem 2.5rem 0.75rem 2.5rem;
          border: 1px solid var(--border, #e5e7eb);
          border-radius: 8px;
          font-size: 0.875rem;
          background: white;
          transition: all 0.2s;
        }
        
        .search-input:focus {
          outline: none;
          border-color: var(--primary, #3b82f6);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .clear-search {
          position: absolute;
          right: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          color: var(--text-muted, #9ca3af);
        }
        
        .clear-search:hover {
          background: var(--bg-tertiary, #f3f4f6);
          color: var(--text, #111827);
        }
        
        .filters-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .filter-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted, #6b7280);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .filter-buttons {
          display: flex;
          gap: 0.25rem;
        }
        
        .filter-btn {
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid var(--border, #e5e7eb);
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text, #374151);
        }
        
        .filter-btn:hover {
          background: var(--bg-tertiary, #f3f4f6);
        }
        
        .filter-btn.active {
          background: var(--primary, #3b82f6);
          border-color: var(--primary, #3b82f6);
          color: white;
        }
        
        .filter-btn.difficulty-easy.active {
          background: #10b981;
          border-color: #10b981;
        }
        
        .filter-btn.difficulty-medium.active {
          background: #f59e0b;
          border-color: #f59e0b;
        }
        
        .filter-btn.difficulty-hard.active {
          background: #ef4444;
          border-color: #ef4444;
        }
        
        .clear-filters-btn {
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--primary, #3b82f6);
          background: transparent;
          border: 1px solid var(--primary, #3b82f6);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .clear-filters-btn:hover {
          background: var(--primary, #3b82f6);
          color: white;
        }
        
        .tags-filter {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        
        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
          flex: 1;
        }
        
        .tag-btn {
          padding: 0.25rem 0.5rem;
          font-size: 0.6875rem;
          font-weight: 500;
          background: white;
          border: 1px solid var(--border, #e5e7eb);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-muted, #6b7280);
        }
        
        .tag-btn:hover {
          border-color: var(--primary, #3b82f6);
          color: var(--primary, #3b82f6);
        }
        
        .tag-btn.selected {
          background: var(--primary, #3b82f6);
          border-color: var(--primary, #3b82f6);
          color: white;
        }
        
        .more-tags {
          font-size: 0.6875rem;
          color: var(--text-muted, #9ca3af);
          padding: 0.25rem 0.5rem;
        }
        
        .results-count {
          font-size: 0.75rem;
          color: var(--text-muted, #6b7280);
        }
        
        :global(.dark) .challenge-search {
          --bg-secondary: #1f2937;
          --border: #374151;
          --text: #f9fafb;
          --text-muted: #9ca3af;
          --bg-tertiary: #374151;
        }
        
        :global(.dark) .search-input,
        :global(.dark) .filter-btn,
        :global(.dark) .tag-btn {
          background: #374151;
          border-color: #4b5563;
          color: #f9fafb;
        }
      `}</style>
    </div>
  );
}