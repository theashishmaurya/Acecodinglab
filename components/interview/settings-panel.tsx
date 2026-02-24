'use client';

import React from 'react';
import { HelpCircle, Clock, Eye, Shield, Ban, Coffee } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InterviewSettings } from '@/lib/interview/types';

interface SettingsPanelProps {
  settings: Partial<InterviewSettings>;
  onChange: (settings: Partial<InterviewSettings>) => void;
  interviewType: 'live' | 'ai_conducted' | 'take_home';
}

export function SettingsPanel({ settings, onChange, interviewType }: SettingsPanelProps) {
  const updateSetting = <K extends keyof InterviewSettings>(key: K, value: InterviewSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const isLiveInterview = interviewType === 'live';

  return (
    <div className="space-y-6">
      {/* Hints Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Hints
          </CardTitle>
          <CardDescription>
            Configure how candidates can request hints during challenges
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allow-hints">Allow Hints</Label>
              <p className="text-xs text-muted-foreground">
                Let candidates request progressive hints
              </p>
            </div>
            <Switch
              id="allow-hints"
              checked={settings.allow_hints ?? true}
              onCheckedChange={(checked) => updateSetting('allow_hints', checked)}
            />
          </div>

          {settings.allow_hints && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Max Hints per Challenge</Label>
                <span className="text-sm font-medium">{settings.max_hints_per_challenge ?? 3}</span>
              </div>
              <Slider
                value={[settings.max_hints_per_challenge ?? 3]}
                onValueChange={([value]) => updateSetting('max_hints_per_challenge', value)}
                min={1}
                max={5}
                step={1}
                disabled={!settings.allow_hints}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timer Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timer & Display
          </CardTitle>
          <CardDescription>
            Control what candidates see during the interview
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-timer">Show Timer</Label>
              <p className="text-xs text-muted-foreground">
                Display countdown timer to candidate
              </p>
            </div>
            <Switch
              id="show-timer"
              checked={settings.show_timer ?? true}
              onCheckedChange={(checked) => updateSetting('show_timer', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allow-explanation">Allow Code Explanation</Label>
              <p className="text-xs text-muted-foreground">
                AI-powered code explanation feature
              </p>
            </div>
            <Switch
              id="allow-explanation"
              checked={settings.allow_code_explanation ?? true}
              onCheckedChange={(checked) => updateSetting('allow_code_explanation', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Anti-Cheat Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Anti-Cheat (Live Interviews)
          </CardTitle>
          <CardDescription>
            Security measures to ensure interview integrity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="require-fullscreen">Require Fullscreen</Label>
              <p className="text-xs text-muted-foreground">
                Force fullscreen mode during interview
              </p>
            </div>
            <Switch
              id="require-fullscreen"
              checked={settings.require_fullscreen ?? true}
              onCheckedChange={(checked) => updateSetting('require_fullscreen', checked)}
              disabled={!isLiveInterview}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="block-copy-paste">Block Copy/Paste</Label>
              <p className="text-xs text-muted-foreground">
                Prevent clipboard operations in editor
              </p>
            </div>
            <Switch
              id="block-copy-paste"
              checked={settings.block_copy_paste ?? true}
              onCheckedChange={(checked) => updateSetting('block_copy_paste', checked)}
              disabled={!isLiveInterview}
            />
          </div>

          {!isLiveInterview && (
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
              <Ban className="h-3 w-3" />
              Anti-cheat settings only apply to live interviews
            </div>
          )}
        </CardContent>
      </Card>

      {/* Break Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Coffee className="h-4 w-4" />
            Breaks
          </CardTitle>
          <CardDescription>
            Allow scheduled breaks during long interviews
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enable-breaks">Enable Breaks</Label>
              <p className="text-xs text-muted-foreground">
                Allow candidate to take short breaks
              </p>
            </div>
            <Switch
              id="enable-breaks"
              checked={settings.enable_breaks ?? false}
              onCheckedChange={(checked) => updateSetting('enable_breaks', checked)}
            />
          </div>

          {settings.enable_breaks && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Max Breaks</Label>
                <span className="text-sm font-medium">{settings.max_breaks ?? 1}</span>
              </div>
              <Slider
                value={[settings.max_breaks ?? 1]}
                onValueChange={([value]) => updateSetting('max_breaks', value)}
                min={1}
                max={3}
                step={1}
                disabled={!settings.enable_breaks}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}