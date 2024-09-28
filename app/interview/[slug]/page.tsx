'use client';
import CodeEditor from '@/components/codeEditor';
import { useCodeEditor } from '@/components/codeEditor/codeEditor.context';
import { CodeEditorMode } from '@/components/codeEditor/types';
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
    <CodeEditor
      files={files}
      mode={CodeEditorMode.INTERVIEW}
      isSample={false}
    />
  );
};

export default Page;
