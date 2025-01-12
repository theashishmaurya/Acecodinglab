'use client';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlayIcon, RotateCcwIcon } from 'lucide-react';
import {
  PracticeSession,
  practiceSessionsAPI,
} from '@/db/practiceSession/practiceSession.client';
import { readFromFolder } from '@/lib/readFromFolder';
import Spinner from '../ui/spinner';
import { useRouter } from 'next/navigation';

export interface IQuestions {
  name: string;
  key: string;
  tags: string[];
  difficulty: string;
  author: string;
  content: any;
}

export default function QuestionTable({
  questions,
  activeTab,
}: {
  questions: IQuestions[];
  activeTab: string;
}) {
  const router = useRouter();

  const [inProgressSessions, setInProgressSessions] = useState<
    PracticeSession[]
  >([]);
  const [inProgressSessionIndex, setInProgressSessionIndex] = useState<
    Record<string, string>
  >({});
  const [completedSessionIndex, setCompletedSessionIndex] = useState<
    Record<string, string>
  >({});
  const [filteredQuestions, setFilteredQuestions] =
    useState<IQuestions[]>(questions);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getInProgressSession = async () => {
    const data = await practiceSessionsAPI.getInProgressSessions();
    setInProgressSessions(data);
    const sessions: Record<string, string> = {};
    data.forEach(session => {
      sessions[session.question_id] = session.id;
    });
    setInProgressSessionIndex(sessions);
    updateFilteredQuestions(sessions, completedSessionIndex);
  };

  const getCompletedSession = async () => {
    const data = await practiceSessionsAPI.getCompletedSessions();
    const completedIndex: Record<string, string> = {};
    data.forEach(session => {
      completedIndex[session.question_id] = session.id;
    });
    setCompletedSessionIndex(completedIndex);
    updateFilteredQuestions(inProgressSessionIndex, completedIndex);
  };

  useEffect(() => {
    getInProgressSession();
    getCompletedSession();
  }, []);

  const handleCreateSession = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    question: IQuestions,
  ) => {
    e.preventDefault(); // Prevent default button behavior

    // Languages are hard coded for now
    const sessionId = await practiceSessionsAPI.startSession(
      question.key,
      'react',
      question.content,
    );
    //Navigate to data /dashboard/lab/id
    router.push(`/lab/${sessionId}`);
  };

  const updateFilteredQuestions = (
    inProgress: Record<string, string>,
    completed: Record<string, string>,
  ) => {
    const filtered = questions.filter(question => {
      if (activeTab === 'all') return true;
      if (activeTab === 'active') return question.key in inProgress;
      if (activeTab === 'completed') return question.key in completed;
      return false;
    });
    setFilteredQuestions(filtered);
    setIsLoading(false);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead> */}
          <TableHead>Name</TableHead>
          {/* <TableHead>Status</TableHead> */}
          <TableHead className="hidden md:table-cell">Difficulty</TableHead>
          <TableHead className="hidden md:table-cell">Tags</TableHead>
          <TableHead className="hidden md:table-cell">Author</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((question, index) => (
          <TableRow key={question.key}>
            {/* <TableCell className="hidden sm:table-cell">
              <Image
                alt="Product image"
                className="aspect-square rounded-md object-cover"
                height="64"
                src="/placeholder.svg"
                width="64"
              />
            </TableCell> */}
            <TableCell className="font-medium">{question.name}</TableCell>
            <TableCell>
              <DifficultyBadge difficulty={question.difficulty} />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <TagsCell tags={question.tags} />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {question.author}
            </TableCell>
            {/* <TableCell className="hidden md:table-cell">{product.createdAt}</TableCell> */}
            <TableCell className="w-8">
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild> */}
              {!isLoading ? (
                !inProgressSessionIndex[question.key] ? (
                  <Button
                    type="button"
                    variant={'default'}
                    size={'sm'}
                    className="w-full"
                    onClick={e => {
                      if (completedSessionIndex[question.key]) {
                        router.push(
                          `/lab/${completedSessionIndex[question.key]}`,
                        );
                      } else {
                        handleCreateSession(e, question);
                      }
                    }}
                  >
                    <PlayIcon className="mr-2 h-4 w-4" />
                    {!completedSessionIndex[question.key]
                      ? 'Start'
                      : 'Re-Attempt'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant={'default'}
                    size={'sm'}
                    className="w-full"
                    onClick={() => {
                      router.push(
                        `/lab/${inProgressSessionIndex[question.key]}`,
                      );
                    }}
                  >
                    <RotateCcwIcon className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                )
              ) : (
                <Spinner size="sm" />
              )}
              {/* </DropdownMenuTrigger> */}
              {/* <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent> */}
              {/* </DropdownMenu> */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface TagsCellProps {
  tags: string[];
}

const TagsCell: React.FC<TagsCellProps> = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="px-2 py-0.5 text-xs">
          {tag}
        </Badge>
      ))}
    </div>
  );
};

interface DifficultyBadgeProps {
  difficulty: string;
}

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const normalizedDifficulty = difficulty.toLowerCase().trim();

  let badgeColor = '';
  switch (normalizedDifficulty) {
    case 'easy':
      badgeColor = 'bg-green-100 text-green-800 border-green-200';
      break;
    case 'medium':
      badgeColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
      break;
    case 'advanced':
      badgeColor = 'bg-red-100 text-red-800 border-red-200';
      break;
    default:
      badgeColor = 'bg-gray-100 text-gray-800 border-gray-200';
  }

  return (
    <Badge variant="outline" className={`font-semibold ${badgeColor}`}>
      {difficulty.toUpperCase()}
    </Badge>
  );
};
