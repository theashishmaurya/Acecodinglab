'use client';
import {
  ConsoleIcon,
  RoundedButton,
  SandpackCodeEditor,
  SandpackConsole,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackStack,
  SandpackTests,
  useSandpack,
} from '@codesandbox/sandpack-react';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { isMDFile } from '@/lib/isMDFile';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { MDXComponents } from 'mdx/types';
import { practiceSessionsAPI } from '@/db/practiceSession/practiceSession.client';
import { useParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Spec } from '@codesandbox/sandpack-react/components/Tests/Specs';
import Image from 'next/image';
import { useSideNav } from '@/app/lab/[slug]/sideNav.provider';

interface CustomBottomPanel {
  consoleVisibility: boolean;
  verticalSize: number;
  testVisibility: boolean;
  onTestComplete: (specs: Record<string, Spec>) => void;
}

const CustomBottomPanel = (props: CustomBottomPanel) => {
  const { consoleVisibility, verticalSize, testVisibility, onTestComplete } =
    props;
  const [isBottomPanelVisible, setIsBottomPanelVisible] =
    useState<boolean>(true);

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

const CustomEditor = (props: ICustomPreview) => {
  const { style } = props;

  return (
    <>
      <SandpackCodeEditor
        style={{ ...style, overflow: 'hidden' }}
        closableTabs
      />
    </>
  );
};

function Editor({ isSample }: { isSample: boolean }) {
  const [consoleVisibility, setConsoleVisibility] = React.useState(true);
  const [counter, setCouter] = useState(0);
  const dragEventTargetRef = React.useRef<any>(null);
  const [horizontalSize, setHorizontalSize] = React.useState(50); // 50% of the screen
  const [verticalSize, setVerticalSize] = React.useState(70);
  const [testResults, setTestResults] = useState<Record<string, Spec>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sandpack } = useSandpack();
  const params = useParams();
  const slug = params.slug as string;

  const { toggleTestPanel, setToggleTestPanel, onTestComplete } = useSideNav();

  const debouncedUpdateCode = useDebouncedCallback(
    (code: string) => {
      practiceSessionsAPI.updateSessionCode(slug, code).catch(error => {
        console.error('Failed to update session code:', error);
        // You might want to show an error message to the user here
      });
    },
    3000, // Debounce for 3 second
  );

  useEffect(() => {
    if (!sandpack.files) return;

    if (!isSample) {
      debouncedUpdateCode(JSON.stringify(sandpack.files));
    }
  }, [sandpack.files, debouncedUpdateCode, isSample]);

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
        toggleTestPanel
          ? setToggleTestPanel(false)
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

  const handleTestComplete = (specs: Record<string, Spec>) => {
    setTestResults(specs);

    if (isSubmitting) {
      const allTestsPassed = Object.values(specs).every(file =>
        Object.values(file.tests).every(test => test.status === 'pass'),
      );

      if (allTestsPassed) {
        submitToBackend();
        console.log(specs, 'Submitted to backend');
      } else {
        setIsSubmitting(false);
        // Optionally, show a message that not all tests passed
      }
    }
  };

  const submitToBackend = () => {
    // Actual submission logic here
    practiceSessionsAPI
      .completeSession(slug)
      .then(() => {
        console.log('Submission successful');
        // Handle successful submission (e.g., show a success message)
      })
      .catch(error => {
        console.error('Failed to submit session:', error);
        // Handle submission error (e.g., show an error message)
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const EditorStyle = {
    height: '100%', // use the original editor height
    flexGrow: horizontalSize,
    flexShrink: horizontalSize,
    flexBasis: 0,
  };

  return (
    <div className="flex flex-col w-full">
      <SandpackLayout
        style={{
          height: '88vh',
        }}
      >
        {/* {showFile ? <SandpackFileExplorer style={{ height: '100%' }} /> : null} */}

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
            showOpenInCodeSandbox={false}
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
            testVisibility={toggleTestPanel}
            onTestComplete={onTestComplete}
          />
        </RightColumn>
      </SandpackLayout>
      {/* <div className="flex justify-between items-end w-full my-4">
        <div className="mx-2">
          <CountDown
            hr={0}
            min={0}
            second={10}
            onCounterEnd={() => {
              console.log('counter Ended');
            }}
            autoStart={false}
          />
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
      </div> */}
    </div>
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

export default Editor;
