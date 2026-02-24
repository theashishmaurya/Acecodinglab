'use client';

import React from 'react';
import { Calendar, Clock, Users, Video, Shield, HelpCircle, Coffee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { InterviewSettings, ChallengeSummary } from '@/lib/interview/types';

interface PreviewStepProps {
  // Basic info
  title: string;
  description?: string;
  type: 'live' | 'ai_conducted' | 'take_home';
  
  // Scheduling
  scheduledAt?: Date;
  durationMinutes: number;
  timezone: string;
  
  // Challenges
  selectedChallenges: string[];
  challenges: ChallengeSummary[];
  
  // Settings
  settings: Partial<InterviewSettings>;
  autoRecord: boolean;
  antiCheatEnabled: boolean;
  
  // Participants
  participants?: { email: string; name?: string; role: string }[];
}

const typeLabels = {
  live: 'Live Interview',
  ai_conducted: 'AI-Conducted Interview',
  take_home: 'Take-Home Challenge',
};

const typeColors = {
  live: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  ai_conducted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  take_home: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export function PreviewStep({
  title,
  description,
  type,
  scheduledAt,
  durationMinutes,
  timezone,
  selectedChallenges,
  challenges,
  settings,
  autoRecord,
  antiCheatEnabled,
  participants,
}: PreviewStepProps) {
  const selectedChallengeDetails = challenges.filter(c => 
    selectedChallenges.includes(c.key)
  );
  
  const totalTime = selectedChallengeDetails.reduce((sum, c) => sum + c.estimated_time, 0);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{title || 'Untitled Interview'}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
        <Badge className={typeColors[type]}>
          {typeLabels[type]}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Schedule */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scheduledAt ? (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{formatDate(scheduledAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{formatTime(scheduledAt)}</span>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">Not scheduled (draft)</p>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">{durationMinutes} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timezone</span>
              <span className="font-medium">{timezone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Challenges */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Video className="h-4 w-4" />
              Challenges ({selectedChallenges.length})
            </CardTitle>
            <CardDescription>
              Estimated total time: {totalTime} minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedChallengeDetails.length > 0 ? (
              <ul className="space-y-2">
                {selectedChallengeDetails.map((challenge, index) => (
                  <li key={challenge.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">{index + 1}.</span>
                      <span className="font-medium">{challenge.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={difficultyColors[challenge.difficulty]}
                      >
                        {challenge.difficulty}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {challenge.estimated_time}m
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No challenges selected</p>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${autoRecord ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm">Auto-record</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${antiCheatEnabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm">Anti-cheat</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">
                  {settings.allow_hints ? `${settings.max_hints_per_challenge || 3} hints/challenge` : 'No hints'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">
                  {settings.enable_breaks ? `${settings.max_breaks || 1} breaks allowed` : 'No breaks'}
                </span>
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${settings.show_timer ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Show timer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${settings.allow_code_explanation ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Code explanations</span>
              </div>
              {type === 'live' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${settings.require_fullscreen ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>Fullscreen required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${settings.block_copy_paste ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>Block copy/paste</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Participants */}
        {participants && participants.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participants ({participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {participants.map((participant, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        {participant.name || participant.email}
                      </span>
                      {participant.name && (
                        <span className="text-sm text-muted-foreground ml-2">
                          {participant.email}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {participant.role}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Time Warning */}
      {totalTime > durationMinutes && (
        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-4 rounded-lg">
          <strong>⚠️ Warning:</strong> The selected challenges require approximately{' '}
          <strong>{totalTime} minutes</strong>, which exceeds your interview duration of{' '}
          <strong>{durationMinutes} minutes</strong>.
        </div>
      )}
    </div>
  );
}