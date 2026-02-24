'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Users, MoreVertical, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Interview {
  id: string;
  title: string;
  type: 'live' | 'ai_conducted' | 'take_home';
  status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_at: string | null;
  duration_minutes: number;
  created_at: string;
  participants: { count: number }[];
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  in_progress: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const typeLabels = {
  live: 'Live',
  ai_conducted: 'AI',
  take_home: 'Take-Home',
};

export function InterviewListClient() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchInterviews();
  }, [statusFilter, typeFilter]);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const response = await fetch(`/api/interviews?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setInterviews(data.interviews || []);
      }
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interview?')) return;

    try {
      const response = await fetch(`/api/interviews/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setInterviews(interviews.filter((i) => i.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete interview:', error);
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground mt-1">
            Manage your coding interview sessions
          </p>
        </div>
        <Link href="/dashboard/interviews/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Interview
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="ai_conducted">AI-Conducted</SelectItem>
            <SelectItem value="take_home">Take-Home</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Interview List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : interviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No interviews yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first interview to get started
            </p>
            <Link href="/dashboard/interviews/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Interview
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {interviews.map((interview) => (
            <Card key={interview.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/interviews/${interview.id}`}
                        className="text-lg font-semibold hover:underline"
                      >
                        {interview.title}
                      </Link>
                      <Badge className={statusColors[interview.status]}>
                        {interview.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {typeLabels[interview.type]}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {interview.scheduled_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(interview.scheduled_at), 'MMM d, yyyy h:mm a')}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {interview.duration_minutes} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {interview.participants?.[0]?.count || 0} participants
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/interviews/${interview.id}`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      {interview.status === 'draft' && (
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/interviews/${interview.id}/edit`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {interview.status === 'scheduled' && (
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/interviews/${interview.id}/invite`}>
                            Manage Invites
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {interview.status === 'draft' && (
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(interview.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}