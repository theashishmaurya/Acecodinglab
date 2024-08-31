"use client";
import {
  ConsoleIcon,
  RoundedButton,
  Sandpack,
  SandpackCodeEditor,
  SandpackConsole,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackStack,
  SandpackTests,
} from "@codesandbox/sandpack-react";
import React, { useState } from "react";
import classNames from "classnames";

export default function CodeEditor({ files }: { files: any }) {
  const [consoleVisibility, setConsoleVisibility] = React.useState(true);
  const [counter, setCouter] = useState(0);

  const dragEventTargetRef = React.useRef<any>(null);
  const [horizontalSize, setHorizontalSize] = React.useState(50); // 50% of the screen
  const [verticalSize, setVerticalSize] = React.useState(70);
  const [showFile, setShowFile] = React.useState(false);
  const [testVisibility, setTestVisibility] = React.useState(false);
  const RightColumn = SandpackStack;
  const MenuColumn = SandpackStack;

  const rightColumnStyle = {
    flexGrow: 100 - horizontalSize,
    flexShrink: 100 - horizontalSize,
    flexBasis: 0,
    width: 100 + "%",
    display: "flex",
    gap: consoleVisibility ? 1 : 0,
    height: "100%",
  };

  const topRowStyle = {
    flexGrow: verticalSize,
    flexShrink: verticalSize,
    flexBasis: 0,
    overflow: "hidden",
    height: "100%",
  };

  const rightColumnProps = {
    className: ".sp" + "-preset-column",
    style: rightColumnStyle,
  };

  const actionsChildren = (
    <ConsoleCounterButton
      counter={counter}
      onClick={(): void => {
        testVisibility
          ? setTestVisibility(false)
          : setConsoleVisibility((prev) => !prev);
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
      | "horizontal"
      | "vertical";
    const isHorizontal = direction === "horizontal";

    const { left, top, height, width } = container.getBoundingClientRect();
    const offset = isHorizontal
      ? ((event.clientX - left) / width) * 100
      : ((event.clientY - top) / height) * 100;
    const boundaries = Math.min(Math.max(offset, 25), 75);

    if (isHorizontal) {
      setHorizontalSize(boundaries);
    } else {
      console.log(boundaries);
      setVerticalSize(boundaries);
    }

    container.querySelectorAll(`.sp-stack`).forEach((item) => {
      (item as HTMLDivElement).style.pointerEvents = "none";
    });
  };

  const stopDragging = (): void => {
    const container = dragEventTargetRef.current?.parentElement as
      | HTMLDivElement
      | undefined;

    if (!container) return;

    container.querySelectorAll(`.sp-stack`).forEach((item) => {
      (item as HTMLDivElement).style.pointerEvents = "";
    });

    dragEventTargetRef.current = null;
  };

  React.useEffect(() => {
    document.body.addEventListener("mousemove", onDragMove);
    document.body.addEventListener("mouseup", stopDragging);

    return (): void => {
      document.body.removeEventListener("mousemove", onDragMove);
      document.body.removeEventListener("mouseup", stopDragging);
    };
  }, []);

  return (
    <>
      <SandpackProvider
        template="react"
        theme="dark"
        files={files}
        customSetup={{
          //Jest and react-testing-library
          dependencies: {
            "@testing-library/jest-dom": "5.11.4",
            "@testing-library/react": "11.2.7",
          },
        }}
      >
        <SandpackLayout
          style={{
            height: "90vh",
          }}
        >

        <div className="flex flex-col">
          <svg
            onClick={() => setShowFile((prev) => !prev)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            height={24}
            width={24}
            style={{
              cursor: "pointer",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>


          <svg
            onClick={() => setShowFile((prev) => !prev)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            height={24}
            width={24}
            style={{
              cursor: "pointer",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>

          </div>

          {showFile ? (
            <SandpackFileExplorer style={{ height: "100%" }} />
          ) : null}

          <SandpackCodeEditor
            style={{
              height: "100%", // use the original editor height
              flexGrow: horizontalSize,
              flexShrink: horizontalSize,
              flexBasis: 0,
              overflow: "hidden",
            }}
            
          />

          <div
            className={classNames("resize-handler", [])}
            style={{
              left: `calc(${horizontalSize}% - 5px)`,
              width: 10,
              cursor: "ew-resize",
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
            <div
              className={classNames("resize-handler", [
                // dragHandler({ direction: "vertical" }),
              ])}
              data-direction="vertical"
              onMouseDown={(event): void => {
                dragEventTargetRef.current = event.target;
              }}
              style={{
                top: `calc(${verticalSize}% - 5px)`,
                cursor: "ns-resize",
                width: 100 + "%",
                height: 10,
              }}
            />

            <div
              className="console-wrapper w-full overflow-hidden"
              style={{
                flexGrow: consoleVisibility ? 100 - verticalSize : 0,
                flexShrink: consoleVisibility ? 100 - verticalSize : 0,
                flexBasis: 0,
                width: "100%",
                maxHeight: consoleVisibility
                  ? `calc(${100 - verticalSize}% - 1px)`
                  : 0,
              }}
            >
              {!testVisibility && (
                <SandpackConsole
                  className={classNames("overflow-y", [
                    // Displaty the console when the consoleVisibility is true
                    consoleVisibility ? "block" : "hidden",
                  ])}
                  // onLogsChange={(logs) => { // causing rerender
                  //   setCouter(logs.length);
                  // }}
                  showHeader={false}
                />
              )}
              {testVisibility ? (
                <SandpackTests className="h-full min-h-full block" />
              ) : null}
            </div>
          </RightColumn>
        </SandpackLayout>
      </SandpackProvider>
      <div className="flex justify-end items-end w-full my-4">
        <div className="mx-2">
          <button
            // Dark theme button
            className="bg-gray-800 text-white px-6 py-1"
            onClick={() => setTestVisibility((prev) => !prev)}
          >
            Test
          </button>
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
