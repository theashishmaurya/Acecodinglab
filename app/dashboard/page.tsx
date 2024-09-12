import React from 'react';
import { YourProgress } from '@/components/yourProgress';
import { InterviewPreparation } from '@/components/interviewPreparation';
import { InterviewSchedule } from '@/components/interviewSchedule';
import { RecommendedJobs } from '@/components/recommendJobs';
import { Leaderboard } from '@/components/leaderboard';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const Overlay = () => (
  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
    <div className="text-white text-3xl font-bold mb-6">Dashboard coming soon...</div>
    <Link href="/dashboard/practice">
    <Button variant="default" >
      Practice Problems Here
    </Button>
    </Link>
  </div>
);

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4 relative">
      <Overlay />
      <div className="grid grid-cols-3 gap-4 filter blur-sm">
        <div className="col-span-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <YourProgress />
              <InterviewPreparation />
            </div>
            <InterviewSchedule />
          </div>
        </div>
        <div className="space-y-4">
          <RecommendedJobs />
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}