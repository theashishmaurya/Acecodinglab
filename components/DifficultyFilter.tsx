'use client';

import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DifficultyFilterProps {
  activeTab: string;
  difficulty: string;
}

export function DifficultyFilter({
  activeTab,
  difficulty,
}: DifficultyFilterProps) {
  // Helper function to create URL with current parameters
  const getFilterUrl = (
    tab: string = activeTab,
    newDifficulty: string = difficulty,
  ) => {
    return `?tab=${tab}${newDifficulty !== 'all' ? `&difficulty=${newDifficulty}` : ''}`;
  };

  return (
    <div className="ml-auto flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <ListFilter className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Filter
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter by Difficulty</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={getFilterUrl(activeTab, 'all')} className="w-full">
            <DropdownMenuCheckboxItem
              checked={difficulty === 'all' || !difficulty}
              onSelect={e => e.preventDefault()}
              className="cursor-pointer"
            >
              All Difficulties
            </DropdownMenuCheckboxItem>
          </Link>
          <Link href={getFilterUrl(activeTab, 'easy')} className="w-full">
            <DropdownMenuCheckboxItem
              checked={difficulty === 'easy'}
              onSelect={e => e.preventDefault()}
              className="cursor-pointer"
            >
              Difficulty: Easy
            </DropdownMenuCheckboxItem>
          </Link>
          <Link href={getFilterUrl(activeTab, 'medium')} className="w-full">
            <DropdownMenuCheckboxItem
              checked={difficulty === 'medium'}
              onSelect={e => e.preventDefault()}
              className="cursor-pointer"
            >
              Difficulty: Medium
            </DropdownMenuCheckboxItem>
          </Link>
          <Link href={getFilterUrl(activeTab, 'advanced')} className="w-full">
            <DropdownMenuCheckboxItem
              checked={difficulty === 'advanced'}
              onSelect={e => e.preventDefault()}
              className="cursor-pointer"
            >
              Difficulty: Advanced
            </DropdownMenuCheckboxItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
