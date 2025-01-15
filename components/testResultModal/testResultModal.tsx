import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { flattenTestResults } from '@/lib/flattenTestResults';
import { TestResultItem } from './testResultItem';

interface TestResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  testResults: any;
}

export function TestResultsModal({
  isOpen,
  onClose,
  onSubmit,
  testResults,
}: TestResultsModalProps) {
  const [flattenedResults, setFlattenedResults] = useState<
    ReturnType<typeof flattenTestResults>
  >([]);

  useEffect(() => {
    console.log(testResults, isOpen, 'TestResults');
    if (testResults) {
      setFlattenedResults(flattenTestResults(testResults));
      console.log(flattenTestResults(testResults), 'Data from the test');
    }
  }, [testResults]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Test Results</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {flattenedResults.map((result, index) => (
            <TestResultItem key={index} result={result} />
          ))}
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
