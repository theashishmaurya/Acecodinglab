import CodeEditor from '@/components/codeEditor';
import { CodeEditorMode } from '@/components/codeEditor/types';

const Page = () => {
  return (
    <CodeEditor files={{}} mode={CodeEditorMode.INTERVIEW} isSample={false} />
  );
};

export default Page;
