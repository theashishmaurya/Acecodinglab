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
  useSandpack,
} from "@codesandbox/sandpack-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { isMDFile } from "@/lib/isMDFile";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from 'next-mdx-remote/serialize';



interface CustomBottomPanel {

consoleVisibility:boolean,
verticalSize:number
testVisibility:boolean

}

const CustomBottomPanel = (props:CustomBottomPanel)=>{
  const {consoleVisibility, verticalSize , testVisibility } = props
  const {sandpack} = useSandpack()
  const {activeFile} = sandpack
  const [isBottomPanelVisible,setIsBottomPanelVisible] = useState<boolean>(true)


  useEffect(()=>{

    if(isMDFile(activeFile)){
      setIsBottomPanelVisible(false)
    }else {
      setIsBottomPanelVisible(true)
    }

  },[activeFile])
  return (
    <>
    {isBottomPanelVisible && <div
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
            </div>}
    </>
  

  )

}


interface ICustomPreview {
  actionsChildren :JSX.Element,
  style?: React.CSSProperties 
}

interface MDFileState {
  isMdFile: boolean;
  content: string;
  mdxSource: MDXRemoteSerializeResult | null;
}


const CustomPreview = (props : ICustomPreview) => {

  const {actionsChildren,style} = props

  const { sandpack } = useSandpack();
  const { files , activeFile  , runSandpack  } = sandpack;
  const [mdFile, setMdFile] = useState<MDFileState>({
    isMdFile: false,
    content: '',
    mdxSource: null,
  });
  const prevIsMdFile = useRef<boolean>(false)

  useEffect(() => {
    const updateMdFile = async () => {
      if (isMDFile(activeFile)) {
        const mdFileContent = files[activeFile].code;
        const mdxSource = await serialize(mdFileContent);
        setMdFile({
          isMdFile: true,
          content: mdFileContent,
          mdxSource,
        });
        prevIsMdFile.current = true
        
      } else  {
        setMdFile({
          isMdFile: false,
          content: '',
          mdxSource: null,
        });
        if(prevIsMdFile.current){
        runSandpack()
        }

        prevIsMdFile.current = false
      }
    };

    updateMdFile();
  }, [activeFile, files, runSandpack]);


  console.log(files,activeFile, mdFile)

  return (


    <>
      {mdFile.isMdFile ? (
        <div className="markdown-preview" style={style}>
          {mdFile.content && <MDXRemote compiledSource={mdFile.mdxSource?.compiledSource || ''} scope={undefined} frontmatter={undefined} />}
        </div>
      ) : (
        <SandpackPreview
          actionsChildren={actionsChildren}
          style={style}
          showNavigator={true}
          showOpenInCodeSandbox={true}
          showRefreshButton={true}
          showSandpackErrorOverlay={true}
          
        />
      )}
    </>
  )
}

export default function CodeEditor({ files }: { files: any }) {
  const [consoleVisibility, setConsoleVisibility] = React.useState(true);
  const [counter, setCouter] = useState(0);
  const dragEventTargetRef = React.useRef<any>(null);
  const [horizontalSize, setHorizontalSize] = React.useState(50); // 50% of the screen
  const [verticalSize, setVerticalSize] = React.useState(70);
  const [showFile, setShowFile] = React.useState(true);
  const [testVisibility, setTestVisibility] = React.useState(false);
  const [bottomPanelVisible, setBottomPanelVisible] = useState(true)
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
          {showFile ? (
            <SandpackFileExplorer style={{ height: "100%" }}   />
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
          <CustomPreview 
          style = {topRowStyle}
          actionsChildren={actionsChildren}
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

            <CustomBottomPanel consoleVisibility={consoleVisibility} verticalSize={verticalSize} testVisibility={testVisibility} />
            
            
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
