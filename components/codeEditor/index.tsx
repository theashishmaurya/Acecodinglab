'use client';
import {
  ConsoleIcon,
  RoundedButton,
  Sandpack,
  SandpackCodeEditor,
  SandpackConsole,
  SandpackFileExplorer,
  SandpackFiles,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackStack,
  SandpackTests,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { isMDFile } from '@/lib/isMDFile';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

import { MDXComponents } from 'mdx/types';
import { Button } from '../ui/button';
import CountDown from '../ui/countdown';
import { practiceSessionsAPI } from '@/db/practiceSession/practiceSession.client';
import { useParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Spec } from '@codesandbox/sandpack-react/components/Tests/Specs';
import { CodeEditorMode } from './types';
import { useCodeEditor } from './codeEditor.context';

type HeadingProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;
type ParagraphProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;
type ListProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>;
type ListItemProps = React.DetailedHTMLProps<
  React.LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
>;
type AnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;
type BlockquoteProps = React.DetailedHTMLProps<
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
  HTMLQuoteElement
>;
type CodeProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & { className?: string };
type PreProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>;

// Custom components for MDX
const components: MDXComponents = {
  h1: (props: HeadingProps) => (
    <h1 className="text-3xl font-bold my-4" {...props} />
  ),
  h2: (props: HeadingProps) => (
    <h2 className="text-2xl font-bold my-3" {...props} />
  ),
  h3: (props: HeadingProps) => (
    <h3 className="text-xl font-bold my-2" {...props} />
  ),
  h4: (props: HeadingProps) => (
    <h4 className="text-lg font-bold my-2" {...props} />
  ),
  p: (props: ParagraphProps) => <p className="my-2" {...props} />,
  ul: (props: ListProps) => (
    <ul className="list-disc list-inside my-2" {...props} />
  ),
  ol: (
    props: React.DetailedHTMLProps<
      React.OlHTMLAttributes<HTMLOListElement>,
      HTMLOListElement
    >,
  ) => <ol className="list-decimal pl-4 my-2" {...props} />,
  li: (props: ListItemProps) => <li className="my-1" {...props} />,
  a: (props: AnchorProps) => (
    <a className="text-blue-500 hover:underline" {...props} />
  ),
  blockquote: (props: BlockquoteProps) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic my-2"
      {...props}
    />
  ),
  code: ({ className, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
      <code className={`${className} block p-2 rounded`} {...props} />
    ) : (
      <code className="bg-gray-700 rounded px-1" {...props} />
    );
  },
  pre: (props: PreProps) => (
    <pre
      className="bg-gray-800 text-white p-4 rounded my-4 overflow-x-auto"
      {...props}
    />
  ),
};

interface CustomBottomPanel {
  consoleVisibility: boolean;
  verticalSize: number;
  testVisibility: boolean;
  onTestComplete: (specs: Record<string, Spec>) => void;
}

const CustomBottomPanel = (props: CustomBottomPanel) => {
  const { consoleVisibility, verticalSize, testVisibility, onTestComplete } =
    props;
  const { sandpack } = useSandpack();
  const { activeFile } = sandpack;
  const [isBottomPanelVisible, setIsBottomPanelVisible] =
    useState<boolean>(true);

  useEffect(() => {
    if (isMDFile(activeFile)) {
      setIsBottomPanelVisible(false);
    } else {
      setIsBottomPanelVisible(true);
    }
  }, [activeFile]);
  return (
    <>
      {isBottomPanelVisible && (
        <div
          className="console-wrapper w-full overflow-hidden"
          style={{
            flexGrow: consoleVisibility ? 100 - verticalSize : 0,
            flexShrink: consoleVisibility ? 100 - verticalSize : 0,
            flexBasis: 0,
            width: '100%',
            maxHeight: consoleVisibility
              ? `calc(${100 - verticalSize}% - 1px)`
              : 0,
          }}
        >
          {!testVisibility && (
            <SandpackConsole
              className={classNames('overflow-y', [
                // Displaty the console when the consoleVisibility is true
                consoleVisibility ? 'block' : 'hidden',
              ])}
              // onLogsChange={(logs) => { // causing rerender
              //   setCouter(logs.length);
              // }}
              showHeader={false}
            />
          )}
          {testVisibility ? (
            <SandpackTests
              className="h-full min-h-full block"
              onComplete={onTestComplete}
            />
          ) : null}
        </div>
      )}
    </>
  );
};

interface ICustomPreview {
  style?: React.CSSProperties;
}

interface MDFileState {
  isMdFile: boolean;
  content: string;
  mdxSource: MDXRemoteSerializeResult | null;
}

const CustomEditor = (props: ICustomPreview) => {
  const { style } = props;

  const { sandpack } = useSandpack();
  const { files, activeFile, runSandpack } = sandpack;
  const [mdFile, setMdFile] = useState<MDFileState>({
    isMdFile: false,
    content: '',
    mdxSource: null,
  });
  const prevIsMdFile = useRef<boolean>(false);

  useEffect(() => {
    const updateMdFile = async () => {
      if (isMDFile(activeFile)) {
        const mdFileContent = files[activeFile].code;
        const mdxSource = await serialize(mdFileContent, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeHighlight],
          },
        });
        setMdFile({
          isMdFile: true,
          content: mdFileContent,
          mdxSource,
        });
        prevIsMdFile.current = true;
      } else {
        setMdFile({
          isMdFile: false,
          content: '',
          mdxSource: null,
        });
        if (prevIsMdFile.current) {
          runSandpack();
        }

        prevIsMdFile.current = false;
      }
    };

    updateMdFile();
  }, [activeFile, files, runSandpack]);

  return (
    <>
      {mdFile.isMdFile ? (
        <div className="markdown-preview p-4 overflow-auto" style={style}>
          {mdFile.content && (
            <MDXRemote
              compiledSource={mdFile.mdxSource?.compiledSource || ''}
              scope={undefined}
              frontmatter={undefined}
              components={components}
            />
          )}
        </div>
      ) : (
        <SandpackCodeEditor style={{ ...style, overflow: 'hidden' }} />
      )}
    </>
  );
};

function Editor({ isSample }: { isSample: boolean }) {
  const [consoleVisibility, setConsoleVisibility] = React.useState(true);
  const [counter, setCouter] = useState(0);
  const dragEventTargetRef = React.useRef<any>(null);
  const [horizontalSize, setHorizontalSize] = React.useState(50); // 50% of the screen
  const [verticalSize, setVerticalSize] = React.useState(70);
  const [showFile, setShowFile] = React.useState(true);
  const [testVisibility, setTestVisibility] = React.useState(false);
  const [bottomPanelVisible, setBottomPanelVisible] = useState(true);
  const [testResults, setTestResults] = useState<Record<string, Spec>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sandpack } = useSandpack();

  const { handleOnCodeChange } = useCodeEditor();

  useEffect(() => {
    if (!sandpack.files) return;

    if (!isSample) {
      handleOnCodeChange()(JSON.stringify(sandpack.files));
    }
  }, [sandpack.files, isSample, handleOnCodeChange]);

  const RightColumn = SandpackStack;

  const MenuColumn = SandpackStack;

  const rightColumnStyle = {
    flexGrow: 100 - horizontalSize,
    flexShrink: 100 - horizontalSize,
    flexBasis: 0,
    width: 100 + '%',
    display: 'flex',
    gap: consoleVisibility ? 1 : 0,
    height: '100%',
  };

  const topRowStyle = {
    flexGrow: verticalSize,
    flexShrink: verticalSize,
    flexBasis: 0,
    overflow: 'hidden',
    height: '100%',
  };

  const rightColumnProps = {
    className: '.sp' + '-preset-column',
    style: rightColumnStyle,
  };

  const actionsChildren = (
    <ConsoleCounterButton
      counter={counter}
      onClick={(): void => {
        testVisibility
          ? setTestVisibility(false)
          : setConsoleVisibility(prev => !prev);
      }}
    />
  );
  const onDragMove = (event: MouseEvent): void => {
    if (!dragEventTargetRef.current) return;

    const container = dragEventTargetRef.current.parentElement as
      | HTMLDivElement
      | undefined;

    if (!container) return;

    const direction = dragEventTargetRef.current.dataset.direction as
      | 'horizontal'
      | 'vertical';
    const isHorizontal = direction === 'horizontal';

    const { left, top, height, width } = container.getBoundingClientRect();
    const offset = isHorizontal
      ? ((event.clientX - left) / width) * 100
      : ((event.clientY - top) / height) * 100;
    const boundaries = Math.min(Math.max(offset, 25), 75);

    if (isHorizontal) {
      setHorizontalSize(boundaries);
    } else {
      setVerticalSize(boundaries);
    }

    container.querySelectorAll(`.sp-stack`).forEach(item => {
      (item as HTMLDivElement).style.pointerEvents = 'none';
    });
  };

  const stopDragging = (): void => {
    const container = dragEventTargetRef.current?.parentElement as
      | HTMLDivElement
      | undefined;

    if (!container) return;

    container.querySelectorAll(`.sp-stack`).forEach(item => {
      (item as HTMLDivElement).style.pointerEvents = '';
    });

    dragEventTargetRef.current = null;
  };

  React.useEffect(() => {
    document.body.addEventListener('mousemove', onDragMove);
    document.body.addEventListener('mouseup', stopDragging);

    return (): void => {
      document.body.removeEventListener('mousemove', onDragMove);
      document.body.removeEventListener('mouseup', stopDragging);
    };
  }, []);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTestVisibility(true);
    // The actual submission will be triggered after tests complete in handleTestComplete
  };

  const handleTestComplete = (specs: Record<string, Spec>) => {
    setTestResults(specs);
    console.log(specs, 'Specs');

    if (isSubmitting) {
      const allTestsPassed = Object.values(specs).every(file =>
        Object.values(file.tests).every(test => test.status === 'pass'),
      );

      if (allTestsPassed) {
        // submitToBackend();
        console.log(specs, 'Submitted to backend');
      } else {
        setIsSubmitting(false);
        // Optionally, show a message that not all tests passed
      }
    }
  };

  // const submitToBackend = () => {
  //   // Actual submission logic here
  //   practiceSessionsAPI
  //     .completeSession(slug)
  //     .then(() => {
  //       console.log('Submission successful');
  //       // Handle successful submission (e.g., show a success message)
  //     })
  //     .catch(error => {
  //       console.error('Failed to submit session:', error);
  //       // Handle submission error (e.g., show an error message)
  //     })
  //     .finally(() => {
  //       setIsSubmitting(false);
  //     });
  // };

  const EditorStyle = {
    height: '100%', // use the original editor height
    flexGrow: horizontalSize,
    flexShrink: horizontalSize,
    flexBasis: 0,
  };

  return (
    <>
      <SandpackLayout
        style={{
          height: '86vh',
        }}
      >
        {showFile ? <SandpackFileExplorer style={{ height: '100%' }} /> : null}

        <CustomEditor style={EditorStyle} />

        <div
          className={classNames('resize-handler', [])}
          style={{
            left: `calc(${horizontalSize}% - 5px)`,
            width: 10,
            cursor: 'ew-resize',
          }}
          data-direction="horizontal"
          onMouseDown={(event): void => {
            dragEventTargetRef.current = event.target;
          }}
        />
        <RightColumn {...rightColumnProps}>
          <SandpackPreview
            actionsChildren={actionsChildren}
            style={topRowStyle}
            showNavigator={true}
            showOpenInCodeSandbox={true}
            showRefreshButton={true}
            showSandpackErrorOverlay={true}
          />
          {/* <CustomPreview
            style={topRowStyle}
            actionsChildren={actionsChildren}
          /> */}
          <div
            className={classNames('resize-handler', [
              // dragHandler({ direction: "vertical" }),
            ])}
            data-direction="vertical"
            onMouseDown={(event): void => {
              dragEventTargetRef.current = event.target;
            }}
            style={{
              top: `calc(${verticalSize}% - 5px)`,
              cursor: 'ns-resize',
              width: 100 + '%',
              height: 10,
            }}
          />

          <CustomBottomPanel
            consoleVisibility={consoleVisibility}
            verticalSize={verticalSize}
            testVisibility={testVisibility}
            onTestComplete={handleTestComplete}
          />
        </RightColumn>
      </SandpackLayout>
      <div className="flex justify-between items-end w-full my-4">
        <div className="mx-2">
          {/* <CountDown
          hr={0}
          min={0}
          second={10}
          onCounterEnd={()=>{console.log("counter Ended")}}
          autoStart={false}
          /> */}
        </div>
        <div className="flex justify-end items-end">
          <div className="mx-2">
            <Button
              // Dark theme button
              onClick={() => setTestVisibility(true)}
              size={'sm'}
            >
              Test
            </Button>
          </div>
          <div className="mx-2">
            <Button size="sm" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

const ConsoleCounterButton: React.FC<{
  onClick: () => void;
  counter: number;
}> = ({ onClick, counter }) => {
  return (
    <RoundedButton className="relative min-w-[12px]" onClick={onClick}>
      <ConsoleIcon />
      {/* {counter > 0 && (
        <strong className=" min-w-12 h-12 px-2 rounded-full text-xs leading-4 absolute top-0  right-0 font-normal p-10">
          {counter}
        </strong>
      )} */}
    </RoundedButton>
  );
};

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
      <Editor isSample={isSample} />
    </SandpackProvider>
  );
}
