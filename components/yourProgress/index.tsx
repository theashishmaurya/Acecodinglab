import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function YourProgress() {
  // Mock data
  const progress = {
    percentage: 75,
    solved: 150,
    attempted: 200,
    accuracy: 75
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-lg font-medium">YOUR PROGRESS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#e5e7eb" 
                strokeWidth="10"
                className="dark:stroke-gray-700"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="10"
                strokeDasharray={`${progress.percentage * 2.83} 283`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="dark:stroke-blue-500"
              />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <span className="text-2xl font-bold">{progress.percentage}%</span>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              Solved: <span className="text-gray-900 dark:text-gray-200">{progress.solved}</span>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Attempted: <span className="text-gray-900 dark:text-gray-200">{progress.attempted}</span>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Accuracy: <span className="text-gray-900 dark:text-gray-200">{progress.accuracy}%</span>
            </div>
          </div>
        </div>
        <Button variant="link" className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-0">
          View Progress
        </Button>
      </CardContent>
    </Card>
  );
}