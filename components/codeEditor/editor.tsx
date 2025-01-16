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
import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames';

import { practiceSessionsAPI } from '@/db/practiceSession/practiceSession.client';
import { useParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Spec } from '@codesandbox/sandpack-react/components/Tests/Specs';
import { useSideNav } from '@/app/lab/sideNav.provider';

interface CustomBottomPanel {
  consoleVisibility: boolean;
  verticalSize: number;
}

const CustomBottomPanel = memo((props: CustomBottomPanel) => {
  const { consoleVisibility, verticalSize } = props;
  const { toggleTestPanel, onTestComplete } = useSideNav();

  return (
    <>
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
        {!toggleTestPanel && (
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
        {toggleTestPanel ? (
          <SandpackTests
            className="h-full min-h-full block"
            onComplete={test => {
              onTestComplete(test);
            }}
          />
        ) : null}
      </div>
    </>
  );
});
CustomBottomPanel.displayName = 'CustomBottomPanel';

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
          />
        </RightColumn>
      </SandpackLayout>
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
    </RoundedButton>
  );
};

export default Editor;
