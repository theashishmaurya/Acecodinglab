'use client';
import { SandpackFiles, SandpackProvider } from '@codesandbox/sandpack-react';
import React from 'react';

import 'highlight.js/styles/github-dark.css';

import { CodeEditorMode } from './types';
import QuestionPanel from '../questionPanel';
import CodeEditorNavbar from './codeEditorNavbar';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import Editor from './editor';
import { SandpackFileExplorer } from 'sandpack-file-explorer';
import { QuestionData } from '@/app/lab/[slug]/page';
import { useSideNav } from '@/app/lab/sideNav.provider';
import { TestResultsModal } from '../testResultModal/testResultModal';

interface CodeEditorProps {
  mode: CodeEditorMode;
  isSample: boolean;
  questionData?: QuestionData;
}

export default function CodeEditor({
  isSample,
  questionData,
  mode = CodeEditorMode.PRACTICE,
}: CodeEditorProps) {
  const {
    isFileExplorerOpen,
    isQuestionPanelOpen,
    showTestResultModal,
    testResult,
    handleCloseModal,
    handleSubmit,
  } = useSideNav();

  return (
    <>
      <div className="flex justify-center h-[9vh] w-full">
        <CodeEditorNavbar />
        <TestResultsModal
          isOpen={showTestResultModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          testResults={testResult}
        />
      </div>
      <div className="flex h-full w-full">
        {isFileExplorerOpen && (
          <div className="w-[250px] h-full">
            <SandpackFileExplorer />
          </div>
        )}
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            style={{
              flexGrow: isQuestionPanelOpen ? 0 : 33,
            }}
          >
            <QuestionPanel questionData={questionData} />
          </ResizablePanel>
          <ResizableHandle />

          <ResizablePanel>
            <Editor isSample={isSample} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
