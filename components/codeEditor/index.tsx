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

interface CodeEditorProps {
  files: SandpackFiles;
  mode: CodeEditorMode;
  isSample: boolean;
}

export default function CodeEditor({
  files,
  isSample,
  mode = CodeEditorMode.PRACTICE,
}: CodeEditorProps) {
  return (
    <SandpackProvider
      template="react"
      theme="dark"
      files={files}
      options={{
        autorun: true,
      }}
      customSetup={{
        //Jest and react-testing-library
        dependencies: {
          '@testing-library/jest-dom': '5.11.4',
          '@testing-library/react': '11.2.7',
        },
      }}
    >
      <div className="flex justify-center  h-full w-full">
        <CodeEditorNavbar />
      </div>
      <div className="flex h-full w-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            className="w-[300px] flex-grow-0"
            style={{ maxWidth: '300px', flexBasis: '300px' }}
          >
            <SandpackFileExplorer />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <QuestionPanel />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <Editor isSample={isSample} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SandpackProvider>
  );
}
