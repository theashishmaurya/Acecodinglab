'use client';

import React, { useState } from 'react';
import { useQuestionTemplate } from './context/questionTemplate.context';
import { SandpackProvider } from '@codesandbox/sandpack-react';
import { CodeEditorMode } from '@/components/codeEditor/types';
import CodeEditor from '@/components/codeEditor';
import { TemplateSideNavProvider } from './context/templateEditor.sideNav';
import LabSideNavBar from '@/components/labSideNav';

export default function TemplatePreview() {
  const { selectedTemplate, templateFiles } = useQuestionTemplate();
  const [testResult, setTestResult] = useState<{
    passed: boolean;
    message: string;
  } | null>(null);

  if (!selectedTemplate || !templateFiles) {
    return <div>No template selected</div>;
  }

  const runTests = () => {
    // Mock test functionality
    // In a real app, this would run actual tests against the template
    const passing = Math.random() > 0.5;

    setTestResult({
      passed: passing,
      message: passing
        ? 'All tests passed successfully!'
        : 'Some tests failed. Please check your implementation.',
    });
  };

  // Convert template files to Sandpack format
  const sandpackFiles: Record<string, { code: string }> = {};
  Object.entries(templateFiles).forEach(([filename, content]) => {
    if (filename !== 'question.mdx') {
      const path = filename === 'index.js' ? '/index.js' : `/${filename}`;
      sandpackFiles[path] = { code: content || '' };
    }
  });

  // Create questionData object for the CodeEditor
  const questionData = {
    question: templateFiles['question.mdx'] || '',
    meta: {
      name: selectedTemplate.name,
      difficulty: selectedTemplate.difficulty,
      author: selectedTemplate.author,
      tags: selectedTemplate.tags.join(', '),
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-md shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold">{selectedTemplate.name}</h2>
            <p className="text-gray-500">
              Status:{' '}
              <span className="font-medium">{selectedTemplate.status}</span>
            </p>
          </div>

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={runTests}
          >
            Run Tests
          </button>
        </div>

        {testResult && (
          <div
            className={`p-4 mb-4 rounded-md ${testResult.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {testResult.message}
          </div>
        )}
      </div>

      <div className="bg-white rounded-md shadow h-[800px]">
        <SandpackProvider
          template="react"
          theme="dark"
          files={sandpackFiles}
          options={{
            autorun: true,
          }}
          customSetup={{
            dependencies: {
              '@testing-library/jest-dom': '5.11.4',
              '@testing-library/react': '11.2.7',
              '@testing-library/user-event': '14.6.1',
            },
          }}
        >
          <TemplateSideNavProvider>
            <LabSideNavBar />
            <CodeEditor
              mode={CodeEditorMode.PRACTICE}
              isSample={false}
              questionData={questionData}
            />
          </TemplateSideNavProvider>
        </SandpackProvider>
      </div>
    </div>
  );
}
