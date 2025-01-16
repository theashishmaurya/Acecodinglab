import { Spec } from '@codesandbox/sandpack-react/components/Tests/Specs';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { isEqual } from 'lodash';
import {
  FlattenedTestResult,
  flattenTestResults,
} from '@/lib/flattenTestResults';

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
  testResult: FlattenedTestResult[] | null;
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
  const [testResult, setTestResult] = useState<FlattenedTestResult[] | null>(
    null,
  );

  const lastTestResultRef = useRef<FlattenedTestResult[] | null>(null);
  useEffect(() => {
    console.log('TestPanelToogled', toggleTestPanel);
  }, [toggleTestPanel]);

  useEffect(() => {
    if (isSubmitting && testResult) {
      setShowTestResult(true); // Open the modal
      setIsSubmitting(false); // Reset submitting state
    }
  }, [isSubmitting]);

  const onTestComplete = useCallback((specs: Record<string, Spec>) => {
    const key = Object.keys(specs)[0];
    const testObject = specs[key];
    if (Object.keys(testObject.describes).length === 0) {
      return; // Exit silently if 'describes' is empty
    }
    const flattenedResults = flattenTestResults(testObject);

    if (!isEqual(lastTestResultRef.current, flattenedResults)) {
      lastTestResultRef.current = flattenedResults; // Update ref

      setTestResult(flattenedResults); // Update state
    }
  }, []);

  const values = useMemo(
    () => ({
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
    }),
    [
      isFileExplorerOpen,
      isQuestionPanelOpen,
      isSubmitting,
      toggleTestPanel,
      showTestResult,
      testResult,
      onTestComplete,
    ],
  );

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
