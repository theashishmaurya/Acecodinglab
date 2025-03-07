'use client';

import React, { useState, useEffect } from 'react';
import {
  useQuestionTemplate,
  QuestionFiles,
} from './context/questionTemplate.context';
import { SandpackProvider } from '@codesandbox/sandpack-react';
import { CodeEditorMode } from '@/components/codeEditor/types';
import CodeEditor from '@/components/codeEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateSideNavProvider } from './context/templateEditor.sideNav';
import LabSideNavBar from '@/components/labSideNav';

export default function TemplateEditor() {
  const { selectedTemplate, templateFiles, updateTemplate } =
    useQuestionTemplate();
  const [files, setFiles] = useState<QuestionFiles | null>(templateFiles);
  const [activeFile, setActiveFile] = useState<string>('question.mdx');
  const [metadata, setMetadata] = useState(selectedTemplate);
  const [isEdited, setIsEdited] = useState(false);
  const [sandpackFiles, setSandpackFiles] = useState<
    Record<string, { code: string }>
  >({});

  // Update our state when templateFiles change
  useEffect(() => {
    if (templateFiles) {
      setFiles(templateFiles);

      // Convert files to Sandpack format
      const convertedFiles: Record<string, { code: string }> = {};
      Object.entries(templateFiles).forEach(([filename, content]) => {
        const path = filename === 'index.js' ? '/index.js' : `/${filename}`;
        convertedFiles[path] = { code: content || '' };
      });
      setSandpackFiles(convertedFiles);
    }
  }, [templateFiles]);

  // Handle file content change
  const handleFileChange = (fileName: string, content: string) => {
    if (!files) return;

    setFiles({
      ...files,
      [fileName]: content,
    });
    setIsEdited(true);
  };

  // Handle metadata change
  const handleMetadataChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === 'tags' || name === 'company') {
      setMetadata({
        ...metadata!,
        [name]: value.split(',').map(item => item.trim()),
      });
    } else {
      setMetadata({
        ...metadata!,
        [name]: value,
      });
    }
    setIsEdited(true);
  };

  // Handle saving changes
  const handleSave = async () => {
    if (!selectedTemplate || !files) return;

    await updateTemplate(metadata!, files);
    setIsEdited(false);
  };

  // Add a new file
  const handleAddFile = () => {
    const fileName = prompt('Enter file name (e.g., utils.js):');
    if (!fileName || !files) return;

    setFiles({
      ...files,
      [fileName]: '// New file',
    });
    setActiveFile(fileName);
    setIsEdited(true);
  };

  // Delete a file
  const handleDeleteFile = (fileName: string) => {
    if (
      !files ||
      !window.confirm(`Are you sure you want to delete ${fileName}?`)
    )
      return;

    const newFiles = { ...files };
    delete newFiles[fileName];

    setFiles(newFiles);
    setActiveFile(Object.keys(newFiles)[0] || '');
    setIsEdited(true);
  };

  if (!selectedTemplate || !files) {
    return <div>No template selected</div>;
  }

  // Create a dummy questionData object for the CodeEditor
  const questionData = {
    question: files['question.mdx'] || '',
    meta: {
      name: metadata?.name || '',
      difficulty: metadata?.difficulty || 'easy',
      author: metadata?.author || '',
      tags: metadata?.tags.join(', ') || '',
    },
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Metadata panel */}
      <div className="col-span-1 bg-white p-4 rounded-md shadow">
        <h2 className="text-lg font-bold mb-4">Template Metadata</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={metadata?.name || ''}
              onChange={handleMetadataChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key
            </label>
            <input
              type="text"
              name="key"
              value={metadata?.key || ''}
              onChange={handleMetadataChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={metadata?.tags.join(', ') || ''}
              onChange={handleMetadataChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={metadata?.difficulty || 'easy'}
              onChange={handleMetadataChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={metadata?.author || ''}
              onChange={handleMetadataChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Companies (comma separated)
            </label>
            <input
              type="text"
              name="company"
              value={metadata?.company.join(', ') || ''}
              onChange={handleMetadataChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={metadata?.status || 'draft'}
              onChange={handleMetadataChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="test">Test</option>
              <option value="live">Live</option>
            </select>
          </div>

          <button
            className={`w-full px-4 py-2 rounded-md mt-4 ${isEdited ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}
            onClick={handleSave}
            disabled={!isEdited}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Code editor panel */}
      <div className="col-span-2 bg-white rounded-md shadow">
        <div className="h-[800px]">
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
    </div>
  );
}
