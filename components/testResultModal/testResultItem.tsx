import React from 'react';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface TestResultItemProps {
  result: {
    status: 'pass' | 'fail';
    name: string;
    path: string[];
    errors?: Array<{ message: string }>;
  };
}

export function TestResultItem({ result }: TestResultItemProps) {
  const { status, name, path, errors } = result;

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center w-full text-left">
        <ChevronRight className="mr-2 h-4 w-4" />
        {status === 'pass' ? (
          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="mr-2 h-5 w-5 text-red-500" />
        )}
        <span className="font-medium">{path.join(' > ')}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-8 mt-2">
        <p className="text-sm">{name}</p>
        {errors && errors.length > 0 && (
          <div className="mt-2 text-sm text-red-600">
            {errors.map((error, index) => (
              <p key={index}>{error.message}</p>
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
