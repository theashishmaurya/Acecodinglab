'use client';

import React, { useState } from 'react';
import { useQuestionTemplate } from './context/questionTemplate.context';
import TemplateList from './TemplateList';
import TemplateEditor from './TemplateEditor';
import TemplatePreview from './TemplatePreview';

export default function QuestionTemplateManager() {
  const { selectedTemplate, isLoading, error } = useQuestionTemplate();
  const [activeView, setActiveView] = useState<'list' | 'edit' | 'preview'>(
    'list',
  );

  // Handle view switching based on template selection or user action
  React.useEffect(() => {
    if (selectedTemplate && activeView === 'list') {
      setActiveView('edit');
    }
  }, [selectedTemplate, activeView]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded-md mb-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      {/* Navigation tabs */}
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 ${activeView === 'list' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveView('list')}
        >
          Templates
        </button>
        {selectedTemplate && (
          <>
            <button
              className={`px-4 py-2 ${activeView === 'edit' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveView('edit')}
            >
              Editor
            </button>
            <button
              className={`px-4 py-2 ${activeView === 'preview' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveView('preview')}
            >
              Preview
            </button>
          </>
        )}
      </div>

      {/* Content area */}
      <div>
        {activeView === 'list' && <TemplateList />}
        {activeView === 'edit' && selectedTemplate && <TemplateEditor />}
        {activeView === 'preview' && selectedTemplate && <TemplatePreview />}
      </div>
    </div>
  );
}
