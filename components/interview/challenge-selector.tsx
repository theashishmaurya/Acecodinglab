'use client';

import React, { useState, useMemo } from 'react';
import { Search, Check, Clock, Tag, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChallengeSummary } from '@/lib/interview/types';

interface ChallengeSelectorProps {
  challenges: ChallengeSummary[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxChallenges?: number;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export function ChallengeSelector({
  challenges,
  selected,
  onChange,
  maxChallenges = 10,
}: ChallengeSelectorProps) {
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(challenges.map(c => c.category));
    return Array.from(cats).sort();
  }, [challenges]);

  // Filter challenges
  const filteredChallenges = useMemo(() => {
    return challenges.filter(challenge => {
      // Search filter
      const searchLower = search.toLowerCase();
      const matchesSearch = !search || 
        challenge.name.toLowerCase().includes(searchLower) ||
        challenge.tags.some(tag => tag.toLowerCase().includes(searchLower));

      // Difficulty filter
      const matchesDifficulty = difficultyFilter.length === 0 || 
        difficultyFilter.includes(challenge.difficulty);

      // Category filter
      const matchesCategory = categoryFilter.length === 0 ||
        categoryFilter.includes(challenge.category);

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [challenges, search, difficultyFilter, categoryFilter]);

  // Calculate total time
  const totalTime = useMemo(() => {
    return challenges
      .filter(c => selected.includes(c.key))
      .reduce((sum, c) => sum + c.estimated_time, 0);
  }, [challenges, selected]);

  const toggleChallenge = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter(k => k !== key));
    } else if (selected.length < maxChallenges) {
      onChange([...selected, key]);
    }
  };

  const toggleDifficulty = (difficulty: string) => {
    if (difficultyFilter.includes(difficulty)) {
      setDifficultyFilter(difficultyFilter.filter(d => d !== difficulty));
    } else {
      setDifficultyFilter([...difficultyFilter, difficulty]);
    }
  };

  const toggleCategory = (category: string) => {
    if (categoryFilter.includes(category)) {
      setCategoryFilter(categoryFilter.filter(c => c !== category));
    } else {
      setCategoryFilter([...categoryFilter, category]);
    }
  };

  const selectAll = () => {
    const allKeys = filteredChallenges.slice(0, maxChallenges).map(c => c.key);
    onChange(allKeys);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className={cn(
            'font-medium',
            selected.length >= maxChallenges && 'text-amber-600'
          )}>
            {selected.length}/{maxChallenges} selected
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {totalTime} min total
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground mr-2">Difficulty:</span>
        {['easy', 'medium', 'hard'].map(difficulty => (
          <Button
            key={difficulty}
            variant={difficultyFilter.includes(difficulty) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleDifficulty(difficulty)}
            className="capitalize"
          >
            {difficulty}
          </Button>
        ))}
        
        {categories.length > 1 && (
          <>
            <span className="text-sm text-muted-foreground mr-2 ml-4">Category:</span>
            {categories.slice(0, 5).map(category => (
              <Button
                key={category}
                variant={categoryFilter.includes(category) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Button>
            ))}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={selectAll}>
          Select All
        </Button>
        <Button variant="outline" size="sm" onClick={clearAll}>
          Clear Selection
        </Button>
      </div>

      {/* Challenge List */}
      <ScrollArea className="h-[400px] pr-4">
        <div className="grid gap-2">
          {filteredChallenges.map(challenge => {
            const isSelected = selected.includes(challenge.key);
            const isDisabled = !isSelected && selected.length >= maxChallenges;

            return (
              <Card
                key={challenge.key}
                className={cn(
                  'cursor-pointer transition-all',
                  isSelected && 'ring-2 ring-primary bg-primary/5',
                  isDisabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => !isDisabled && toggleChallenge(challenge.key)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      disabled={isDisabled}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">{challenge.name}</h4>
                        <Badge
                          variant="secondary"
                          className={cn('capitalize', difficultyColors[challenge.difficulty])}
                        >
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {challenge.estimated_time} min
                        </span>
                        <span>{challenge.category}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {challenge.tags.slice(0, 4).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {challenge.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{challenge.tags.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredChallenges.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No challenges found matching your filters
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Selected Challenges Summary */}
      {selected.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Selected Challenges</h4>
            <div className="flex flex-wrap gap-2">
              {selected.map(key => {
                const challenge = challenges.find(c => c.key === key);
                return challenge ? (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {challenge.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(selected.filter(k => k !== key));
                      }}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}