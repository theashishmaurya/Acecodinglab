'use client';
import React, { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CardFooter } from './card';
import { Separator } from './separator';

type StepContent = {
  title: string;
  content: ReactNode;
};

type StepperProps = {
  steps?: StepContent[];
  orientation?: 'vertical' | 'horizontal';
  onFinish?: () => void;
};

export default function Stepper({
  steps = [],
  orientation = 'horizontal',
  onFinish,
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      onFinish?.(); // Call onFinish if it's provided and we're on the last step
    } else {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  if (!steps || steps.length === 0) {
    return <div>No steps provided</div>;
  }

  return (
    <div
      className={cn(
        'w-full pl-10 pr-4 py-4',
        orientation === 'vertical'
          ? 'flex flex-col space-y-4 h-full'
          : 'flex flex-col',
      )}
    >
      <div className={cn('flex gap-10 items-start h-full')}>
        <div
          className={cn(
            'flex mb-8 flex-1',
            orientation === 'vertical'
              ? 'flex-col space-y-40 justify-center items-center'
              : 'flex-row space-x-4',
          )}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center',
                orientation === 'vertical'
                  ? 'flex-row space-x-4'
                  : 'flex-col space-y-2',
              )}
            >
              <div
                className={cn(
                  'w-14 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  index <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {index + 1}
              </div>
              {orientation === 'horizontal' && index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-muted" />
              )}
              <div className="text-sm font-medium w-full">{step.title}</div>
            </div>
          ))}
        </div>
        <div className="min-h-full">
          <Separator orientation="vertical" className="h-60 w-1" />
        </div>
        <div className="w-full">
          <div className="text-muted-foreground">
            {steps[currentStep]?.content}
          </div>
        </div>
      </div>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handlePrev}
          disabled={currentStep === 0}
          variant="outline"
        >
          Previous
        </Button>
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </CardFooter>
    </div>
  );
}
