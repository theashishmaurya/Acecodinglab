'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CreateInterviewForm } from '@/components/interview';

export function CreateInterviewClient() {
  return (
    <div className="container max-w-4xl py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/interviews">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Interviews
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create Interview</h1>
        <p className="text-muted-foreground mt-1">
          Set up a new coding interview session
        </p>
      </div>

      {/* Form */}
      <CreateInterviewForm />
    </div>
  );
}