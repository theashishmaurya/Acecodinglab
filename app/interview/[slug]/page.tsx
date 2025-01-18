'use client';
import CodeEditor from '@/components/codeEditor';
import { useCodeEditor } from '@/components/codeEditor/codeEditor.context';
import { CodeEditorMode } from '@/components/codeEditor/types';
import { SandpackProvider } from '@codesandbox/sandpack-react';
import { useEffect, useState } from 'react';

const Page = () => {
  const [files, setFiles] = useState({});
  const { currentTask } = useCodeEditor();

  useEffect(() => {
    handleFiles();
  }, [currentTask]);

  const handleFiles = () => {
    if (currentTask) {
      try {
        const file = JSON.parse(currentTask.code_snapshot);
        setFiles(file);
      } catch (err) {
        console.error(err, 'Error happened while parsing');
      }
    }
  };

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
      <CodeEditor mode={CodeEditorMode.INTERVIEW} isSample={false} />
    </SandpackProvider>
  );
};

export default Page;
