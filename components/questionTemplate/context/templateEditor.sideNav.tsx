'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { isEqual } from 'lodash';
import { Spec } from '@codesandbox/sandpack-react/components/Tests/Specs';
import {
  FlattenedTestResult,
  flattenTestResults,
} from '@/lib/flattenTestResults';

interface TemplateSideNavContextProps {
  isFileExplorerOpen: boolean;
  setIsFileExplorerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isQuestionPanelOpen: boolean;
  setIsQuestionPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTestPanel: boolean;
  setToggleTestPanel: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  onTestComplete: (specs: Record<string, Spec>) => void;
  showTestResultModal: boolean;
  setShowTestResultModal: React.Dispatch<React.SetStateAction<boolean>>;
  testResult: FlattenedTestResult[] | null;
  handleSubmit: () => void;
  handleCloseModal: () => void;
  preSubmitTask: () => void;
}

const TemplateSideNavContext = createContext<
  TemplateSideNavContextProps | undefined
>(undefined);

export const TemplateSideNavProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(true);
  const [isQuestionPanelOpen, setIsQuestionPanelOpen] = useState(true);
  const [toggleTestPanel, setToggleTestPanel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showTestResultModal, setShowTestResultModal] =
    useState<boolean>(false);
  const [testResult, setTestResult] = useState<FlattenedTestResult[] | null>(
    null,
  );
  const lastTestResultRef = React.useRef<FlattenedTestResult[] | null>(null);

  // Handle test completion
  const onTestComplete = useCallback(
    (specs: Record<string, Spec>) => {
      const key = Object.keys(specs)[0];
      const testObject = specs[key];
      if (Object.keys(testObject?.describes)?.length === 0) {
        return;
      }
      const flattenedResults = flattenTestResults(testObject);

      if (isSubmitting) {
        if (!isEqual(lastTestResultRef.current, flattenedResults)) {
          lastTestResultRef.current = flattenedResults;
          setTestResult(flattenedResults);
        }
      }
    },
    [isSubmitting],
  );

  // Prepare to run tests
  const preSubmitTask = () => {
    setIsSubmitting(true);
    if (toggleTestPanel === true) {
      setToggleTestPanel(false);
      setTimeout(() => {
        setToggleTestPanel(true);
      }, 1);
    } else {
      setToggleTestPanel(true);
    }
  };

  // Close test result modal
  const handleCloseModal = () => {
    setTestResult(null);
    setIsSubmitting(false);
    setShowTestResultModal(false);
  };

  // Mock submit function for template context
  const handleSubmit = () => {
    console.log('Template test submitted');
    setIsSubmitting(false);
    setTestResult(null);
    setShowTestResultModal(false);
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
    showTestResultModal,
    setShowTestResultModal,
    testResult,
    handleSubmit,
    handleCloseModal,
    preSubmitTask,
  };

  return (
    <TemplateSideNavContext.Provider value={values}>
      {children}
    </TemplateSideNavContext.Provider>
  );
};

// Custom hook to use the context
export const useTemplateSideNav = (): TemplateSideNavContextProps => {
  const context = useContext(TemplateSideNavContext);
  if (!context) {
    throw new Error(
      'useTemplateSideNav must be used within a TemplateSideNavProvider',
    );
  }
  return context;
};

// Compatibility hook for the original useSideNav interface
export const useSideNav = useTemplateSideNav;
