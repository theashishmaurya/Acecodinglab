'use client';

import React from 'react';
import { QuestionTemplateProvider } from '@/components/questionTemplate/context/questionTemplate.context';
import QuestionTemplateManager from '@/components/questionTemplate/QuestionTemplateManager';

export default function TemplatePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Question Template Manager</h1>
      <QuestionTemplateProvider>
        <QuestionTemplateManager />
      </QuestionTemplateProvider>
    </div>
  );
}
