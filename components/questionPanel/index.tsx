'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Book,
  BeakerIcon,
  Building2,
  MessageCircle,
  ThumbsUp,
  Star,
  Share2,
  HelpCircle,
  Maximize2,
  ChevronLeft,
} from 'lucide-react';
import { useCodeEditor } from '../codeEditor/codeEditor.context';

interface QuestionPanelProps {}

const QuestionPanel = () => {
  return (
    <div className="h-full bg-background text-foreground overflow-auto">
      <Card className="rounded-none border-0 border-b">
        <div className="p-2 flex items-center justify-between">
          <Tabs defaultValue="description" className="flex-1">
            <TabsList className="bg-transparent border-none gap-4">
              <TabsTrigger
                value="description"
                className="flex gap-2 data-[state=active]:bg-transparent"
              >
                <Book className="h-4 w-4" />
                Description
              </TabsTrigger>
              <TabsTrigger
                value="editorial"
                className="flex gap-2 data-[state=active]:bg-transparent"
              >
                <BeakerIcon className="h-4 w-4" />
                Editorial
              </TabsTrigger>
              <TabsTrigger
                value="solutions"
                className="flex gap-2 data-[state=active]:bg-transparent"
              >
                <BeakerIcon className="h-4 w-4" />
                Solutions
              </TabsTrigger>
              <TabsTrigger
                value="submissions"
                className="flex gap-2 data-[state=active]:bg-transparent"
              >
                <BeakerIcon className="h-4 w-4" />
                Submissions
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              // onClick={() => setShowFileExplorer(true)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">
            122. Best Time to Buy and Sell Stock II
          </h1>
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Solved
          </Badge>
        </div>

        <div className="flex gap-4 mb-8">
          <Badge
            variant="secondary"
            className="bg-yellow-500/10 text-yellow-500"
          >
            Medium
          </Badge>
          <Button variant="secondary" size="sm" className="flex gap-2">
            <Book className="h-4 w-4" />
            Topics
          </Button>
          <Button variant="secondary" size="sm" className="flex gap-2">
            <Building2 className="h-4 w-4" />
            Companies
          </Button>
        </div>

        <div className="space-y-6 text-lg">
          <p>
            You are given an integer array{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded-md">prices</code>{' '}
            where{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded-md">prices[i]</code>{' '}
            is the price of a given stock on the{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded-md">
              i<sup>th</sup>
            </code>{' '}
            day.
          </p>

          <p>
            On each day, you may decide to buy and/or sell the stock. You can
            only hold <strong>at most one share</strong> of the stock at any
            time. However, you can buy it then immediately sell it on the{' '}
            <strong>same day</strong>.
          </p>

          <p>
            Find and return <em>the maximum profit you can achieve</em>.
          </p>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Example 1:</h2>
            <div className="bg-muted p-4 rounded-lg font-mono">
              <p>Input: prices = [7,1,5,3,6,4]</p>
              <p>Output: 7</p>
              <p className="text-muted-foreground">
                Explanation: Buy on day 2 (price = 1) and sell on day 3 (price =
                5), profit = 5-1 = 4.
                <br />
                Then buy on day 4 (price = 3) and sell on day 5 (price = 6),
                profit = 6-3 = 3.
                <br />
                Total profit is 4 + 3 = 7.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8 pt-4 border-t">
          <Button variant="ghost" size="sm" className="flex gap-2">
            <ThumbsUp className="h-4 w-4" />
            14.1K
          </Button>
          <Button variant="ghost" size="sm" className="flex gap-2">
            <MessageCircle className="h-4 w-4" />
            282
          </Button>
          <Button variant="ghost" size="sm" className="flex gap-2">
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="flex gap-2">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="flex gap-2">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-right text-sm text-muted-foreground">
            176 Online
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPanel;
