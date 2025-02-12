'use client';
import {
  ConsoleIcon,
  RoundedButton,
  SandpackCodeEditor,
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  SandpackTests,
  useSandpack,
} from '@codesandbox/sandpack-react';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { practiceSessionsAPI } from '@/db/practiceSession/practiceSession.client';
import { useParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Spec } from '@codesandbox/sandpack-react/components/Tests/Specs';
import { useSideNav } from '@/app/lab/sideNav.provider';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../ui/resizable';

interface CustomBottomPanel {
  consoleVisibility: boolean;
}

const CustomBottomPanel = (props: CustomBottomPanel) => {
  const { consoleVisibility } = props;
  const { toggleTestPanel, onTestComplete } = useSideNav();

  return (
    <>
      <div className="console-wrapper w-full overflow-hidden h-full">
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

  const topRowStyle = {
    flexBasis: 0,
    overflow: 'hidden',
    height: '100%',
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

  const EditorStyle = {
    height: '100%', // use the original editor height
  };

  return (
    <ResizablePanelGroup direction="horizontal" className=" rounded-lg border ">
      <SandpackLayout
        style={{
          height: '88vh',
        }}
      >
        <ResizablePanel defaultSize={50}>
          <CustomEditor style={EditorStyle} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              <SandpackPreview
                actionsChildren={actionsChildren}
                style={topRowStyle}
                showNavigator={true}
                showOpenInCodeSandbox={false}
                showRefreshButton={true}
                showSandpackErrorOverlay={true}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
              <CustomBottomPanel consoleVisibility={consoleVisibility} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </SandpackLayout>
    </ResizablePanelGroup>
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
