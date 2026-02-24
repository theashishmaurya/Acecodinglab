'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

import { Stepper, Step } from './stepper';
import { ChallengeSelector } from './challenge-selector';
import { SettingsPanel } from './settings-panel';
import { PreviewStep } from './preview-step';
import { createInterviewSchema, CreateInterviewInput, ChallengeSummary, InterviewSettings } from '@/lib/interview';

const steps: Step[] = [
  { id: 1, title: 'Details', description: 'Basic info' },
  { id: 2, title: 'Challenges', description: 'Select challenges' },
  { id: 3, title: 'Settings', description: 'Configure' },
  { id: 4, title: 'Preview', description: 'Review & create' },
];

// Mock challenges - in production, these would come from the API
const mockChallenges: ChallengeSummary[] = [
  { key: 'modal', name: 'Modal Component', difficulty: 'easy', estimated_time: 15, tags: ['React', 'Accessibility'], category: 'UI Components' },
  { key: 'tabs', name: 'Tab Navigation', difficulty: 'easy', estimated_time: 20, tags: ['React', 'State'], category: 'UI Components' },
  { key: 'autocomplete', name: 'Autocomplete Input', difficulty: 'medium', estimated_time: 30, tags: ['React', 'API', 'Debounce'], category: 'Forms' },
  { key: 'toast', name: 'Toast Notification System', difficulty: 'medium', estimated_time: 25, tags: ['React', 'Animation'], category: 'UI Components' },
  { key: 'drag-drop-list', name: 'Drag and Drop List', difficulty: 'medium', estimated_time: 35, tags: ['React', 'DnD', 'State'], category: 'UI Components' },
  { key: 'virtual-list', name: 'Virtual List', difficulty: 'hard', estimated_time: 45, tags: ['React', 'Performance'], category: 'Advanced' },
  { key: 'debounce', name: 'Debounce Function', difficulty: 'easy', estimated_time: 10, tags: ['JavaScript', 'Utility'], category: 'Utilities' },
  { key: 'deep-clone', name: 'Deep Clone Object', difficulty: 'medium', estimated_time: 20, tags: ['JavaScript', 'Recursion'], category: 'Utilities' },
];

const timezones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Australia/Sydney',
];

export function CreateInterviewForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'live' | 'ai_conducted' | 'take_home'>('live');
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [timezone, setTimezone] = useState('UTC');
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [settings, setSettings] = useState<Partial<InterviewSettings>>({
    allow_hints: true,
    max_hints_per_challenge: 3,
    show_timer: true,
    allow_code_explanation: true,
    require_fullscreen: true,
    block_copy_paste: true,
    enable_breaks: false,
    max_breaks: 1,
  });
  const [autoRecord, setAutoRecord] = useState(true);
  const [antiCheatEnabled, setAntiCheatEnabled] = useState(true);
  const [aiProctoringEnabled, setAiProctoringEnabled] = useState(false);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return title.length >= 3;
      case 2:
        return selectedChallenges.length > 0;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    setIsSubmitting(true);

    try {
      // Combine date and time if scheduled
      let scheduledDateTime: string | undefined;
      if (scheduledAt && scheduledTime) {
        const [hours, minutes] = scheduledTime.split(':').map(Number);
        const date = new Date(scheduledAt);
        date.setHours(hours, minutes, 0, 0);
        scheduledDateTime = date.toISOString();
      }

      const data: CreateInterviewInput = {
        title,
        description: description || undefined,
        type,
        scheduled_at: scheduledDateTime,
        duration_minutes: durationMinutes,
        timezone,
        auto_record: autoRecord,
        anti_cheat_enabled: antiCheatEnabled,
        ai_proctoring_enabled: aiProctoringEnabled,
        selected_challenges: selectedChallenges,
        settings,
      };

      const response = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create interview');
      }

      const { interview } = await response.json();

      toast({
        title: 'Interview created!',
        description: 'You can now invite participants.',
      });

      // Navigate to invite page or interview details
      router.push(`/dashboard/interviews/${interview.id}/invite`);
    } catch (error) {
      console.error('Failed to create interview:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create interview',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stepper */}
      <Stepper steps={steps} currentStep={currentStep} />

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Step 1: Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Interview Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Frontend Developer Interview"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Interview Type</Label>
                    <Select value={type} onValueChange={(v: any) => setType(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="live">Live Interview</SelectItem>
                        <SelectItem value="ai_conducted">AI-Conducted</SelectItem>
                        <SelectItem value="take_home">Take-Home Challenge</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select value={durationMinutes.toString()} onValueChange={(v) => setDurationMinutes(Number(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Add notes or instructions for candidates..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Schedule (Optional)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={scheduledAt?.toISOString().split('T')[0] || ''}
                        onChange={(e) => setScheduledAt(e.target.value ? new Date(e.target.value) : null)}
                      />
                      <Input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Challenges */}
          {currentStep === 2 && (
            <ChallengeSelector
              challenges={mockChallenges}
              selected={selectedChallenges}
              onChange={setSelectedChallenges}
              maxChallenges={10}
            />
          )}

          {/* Step 3: Settings */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <SettingsPanel
                settings={settings}
                onChange={setSettings}
                interviewType={type}
              />

              {/* Additional settings */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Recording & Proctoring</CardTitle>
                  <CardDescription>
                    Configure recording and AI proctoring options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-record Session</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically record the interview session
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoRecord}
                      onChange={(e) => setAutoRecord(e.target.checked)}
                      className="toggle"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Anti-Cheat</Label>
                      <p className="text-xs text-muted-foreground">
                        Monitor for tab switches, copy/paste, etc.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={antiCheatEnabled}
                      onChange={(e) => setAntiCheatEnabled(e.target.checked)}
                      className="toggle"
                    />
                  </div>

                  {type === 'live' && (
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>AI Proctoring</Label>
                        <p className="text-xs text-muted-foreground">
                          Use AI to detect suspicious behavior
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={aiProctoringEnabled}
                        onChange={(e) => setAiProctoringEnabled(e.target.checked)}
                        className="toggle"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Preview */}
          {currentStep === 4 && (
            <PreviewStep
              title={title}
              description={description}
              type={type}
              scheduledAt={scheduledAt || undefined}
              durationMinutes={durationMinutes}
              timezone={timezone}
              selectedChallenges={selectedChallenges}
              challenges={mockChallenges}
              settings={settings}
              autoRecord={autoRecord}
              antiCheatEnabled={antiCheatEnabled}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {currentStep < 4 ? (
          <Button onClick={handleNext} disabled={!canProceed()}>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting || !canProceed()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Interview'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}