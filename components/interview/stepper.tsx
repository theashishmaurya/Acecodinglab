'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Step {
  id: number;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  allowNavigation?: boolean;
}

export function Stepper({ steps, currentStep, onStepClick, allowNavigation = false }: StepperProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = allowNavigation && (isCompleted || step.id === 1);

          return (
            <li key={step.id} className="relative flex-1">
              {/* Connector line */}
              {index > 0 && (
                <div
                  className={cn(
                    'absolute left-0 right-1/2 top-4 h-0.5 -translate-y-1/2',
                    isCompleted || currentStep > steps[index - 1].id
                      ? 'bg-primary'
                      : 'bg-muted'
                  )}
                />
              )}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute left-1/2 right-0 top-4 h-0.5 -translate-y-1/2',
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}

              {/* Step circle and label */}
              <div
                className={cn(
                  'relative flex flex-col items-center',
                  isClickable && 'cursor-pointer'
                )}
                onClick={() => isClickable && onStepClick?.(step.id)}
              >
                <div
                  className={cn(
                    'relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                    isCompleted && 'bg-primary text-primary-foreground',
                    isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                    !isCompleted && !isCurrent && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isCurrent ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}