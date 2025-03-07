'use client';

import Link from 'next/link';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabsNavigationProps {
  activeTab: string;
  difficulty: string;
}

export function TabsNavigation({ activeTab, difficulty }: TabsNavigationProps) {
  // Helper function to create URL with current parameters
  const getFilterUrl = (
    tab: string = activeTab,
    newDifficulty: string = difficulty,
  ) => {
    return `?tab=${tab}${newDifficulty !== 'all' ? `&difficulty=${newDifficulty}` : ''}`;
  };

  return (
    <TabsList>
      <TabsTrigger value="all">
        <Link
          href={getFilterUrl('all')}
          className="w-full h-full inline-flex items-center justify-center"
        >
          All
        </Link>
      </TabsTrigger>
      <TabsTrigger value="active">
        <Link
          href={getFilterUrl('active')}
          className="w-full h-full inline-flex items-center justify-center"
        >
          In Progress
        </Link>
      </TabsTrigger>
      <TabsTrigger value="completed">
        <Link
          href={getFilterUrl('completed')}
          className="w-full h-full inline-flex items-center justify-center"
        >
          Completed
        </Link>
      </TabsTrigger>
    </TabsList>
  );
}
