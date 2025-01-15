import { Spec } from '@codesandbox/sandpack-react/components/Tests/Specs';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';

interface SideNavContextProps {
  isFileExplorerOpen: boolean;
  setIsFileExplorerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isQuestionPanelOpen: boolean;
  setIsQuestionPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTestPanel: boolean;
  setToggleTestPanel: React.Dispatch<React.SetStateAction<boolean>>;

  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;

  onTestComplete: (specs: Record<string, Spec>) => void;

  showTestResult: boolean;
  setShowTestResult: React.Dispatch<React.SetStateAction<boolean>>;
  testResult: Spec | undefined;
  setTestResult: React.Dispatch<React.SetStateAction<Spec | undefined>>;
}

const SideNavContext = createContext<SideNavContextProps | undefined>(
  undefined,
);

export const SideNavProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(true);
  const [isQuestionPanelOpen, setIsQuestionPanelOpen] = useState(false);
  const [toggleTestPanel, setToggleTestPanel] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showTestResult, setShowTestResult] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<Spec>();

  const onTestComplete = (specs: Record<string, Spec>) => {
    if (isSubmitting) {
      triggerTestResultModal(specs);
    }
  };

  const triggerTestResultModal = (spec: Record<string, Spec>) => {
    /** Submit Logic Here */
    const key = Object.keys(spec)[0];

    // Access the value using the key
    const testObject = spec[key];
    setTestResult(testObject);
    setShowTestResult(true);
    setIsSubmitting(false);
  };

  const values = {
    isFileExplorerOpen,
    setIsFileExplorerOpen,
    isQuestionPanelOpen,
    setIsQuestionPanelOpen,

    isSubmitting,
    setIsSubmitting,

    toggleTestPanel,
    setToggleTestPanel,

    onTestComplete,

    showTestResult,
    setShowTestResult,

    testResult,
    setTestResult,
  };

  return (
    <SideNavContext.Provider value={values}>{children}</SideNavContext.Provider>
  );
};

export const useSideNav = (): SideNavContextProps => {
  const context = useContext(SideNavContext);
  if (!context) {
    throw new Error('useSideNav must be used within a SideNavProvider');
  }
  return context;
};
