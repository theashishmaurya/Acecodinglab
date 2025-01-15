'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Book,
  Building2,
  MessageCircle,
  ThumbsUp,
  Star,
  Share2,
  HelpCircle,
  Maximize2,
  ChevronLeft,
} from 'lucide-react';
import { QuestionData } from '@/app/lab/[slug]/page';
import MarkdownRenderer from '../markdownRenderer';

interface QuestionPanelProps {
  questionData?: QuestionData;
}

const QuestionPanel = (props: QuestionPanelProps) => {
  const { questionData } = props;
  if (!questionData) {
    return <>Question Data not Found</>;
  }
  const { meta, question } = questionData;
  return (
    <div className="h-[88vh] bg-background text-foreground overflow-auto">
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
              {/* <TabsTrigger
                value="solutions"
                className="flex gap-2 data-[state=active]:bg-transparent"
              >
                <BeakerIcon className="h-4 w-4" />
                Solutions
              </TabsTrigger> */}
              {/* <TabsTrigger
                value="submissions"
                className="flex gap-2 data-[state=active]:bg-transparent"
              >
                <BeakerIcon className="h-4 w-4" />
                Submissions
              </TabsTrigger> */}
            </TabsList>
          </Tabs>
          {/* <div className="flex gap-2">
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
          </div> */}
        </div>
      </Card>

      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">{meta?.name}</h1>
          {/* <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Solved
          </Badge> */}
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <Badge
            variant="secondary"
            className="bg-yellow-500/10 text-yellow-500"
          >
            {meta?.difficulty}
          </Badge>
          {Array.isArray(meta?.tags) &&
            meta?.tags?.map((tag, index) => (
              <Button
                key={index}
                variant="secondary"
                size="xs"
                className="flex gap-2"
              >
                <Book className="h-4 w-4" />
                {tag}
              </Button>
            ))}

          {Array.isArray(meta?.company) &&
            meta?.company?.map((company, index) => (
              <Button
                variant="secondary"
                size="xs"
                className="flex gap-2"
                key={index}
              >
                <Building2 className="h-4 w-4" />
                {company}
              </Button>
            ))}
        </div>

        <div className="space-y-6">
          <MarkdownRenderer content={question ?? ''} />
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
