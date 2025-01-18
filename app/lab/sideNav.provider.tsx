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
import { practiceSessionsAPI } from '@/db/practiceSession/practiceSession.client';
import { useParams, useRouter } from 'next/navigation';

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

  showTestResultModal: boolean;
  setShowTestResultModal: React.Dispatch<React.SetStateAction<boolean>>;
  testResult: FlattenedTestResult[] | null;

  handleSubmit: () => void;
  handleCloseModal: () => void;
  preSubmitTask: () => void;
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
  const [showTestResultModal, setShowTestResultModal] =
    useState<boolean>(false);
  const [testResult, setTestResult] = useState<FlattenedTestResult[] | null>(
    null,
  );

  // Add the slug here
  const params = useParams();
  const slug = params.slug as string;

  const router = useRouter();

  const lastTestResultRef = useRef<FlattenedTestResult[] | null>(null);

  useEffect(() => {
    if (isSubmitting && testResult) {
      setShowTestResultModal(true); // Open the modal
    }
  }, [isSubmitting, testResult]);

  const onTestComplete = useCallback(
    (specs: Record<string, Spec>) => {
      const key = Object.keys(specs)[0];
      const testObject = specs[key];
      if (Object.keys(testObject?.describes)?.length === 0) {
        return; // Exit silently if 'describes' is empty
      }
      const flattenedResults = flattenTestResults(testObject);

      if (isSubmitting) {
        if (!isEqual(lastTestResultRef.current, flattenedResults)) {
          lastTestResultRef.current = flattenedResults; // Update ref

          setTestResult(flattenedResults); // Update state
        }
      }
    },
    [isSubmitting],
  );

  /** A trick to rerender the test panel before submitting */
  const preSubmitTask = () => {
    // Delete any previous test
    setIsSubmitting(true);
    /** If Test Panel open close it wait for a sec open it again. */
    if (toggleTestPanel === true) {
      setToggleTestPanel(false);
      setTimeout(() => {
        setToggleTestPanel(true);
      }, 1);
    } else {
      setToggleTestPanel(true);
    }
  };

  const handleCloseModal = () => {
    // Delete the tests
    setTestResult(null);

    // setIs subbmitting false
    setIsSubmitting(false);
    // close the modal
    setShowTestResultModal(false);
  };
  const submitToBackend = () => {
    // Actual submission logic here
    return practiceSessionsAPI.completeSession(slug);
  };

  const handleSubmit = () => {
    // Make a call to backend.
    submitToBackend()
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        // setIs subbmitting false
        setIsSubmitting(false);
        // Reset the test
        setTestResult(null);
        // Close the modal
        setShowTestResultModal(false);
        router.push('/dashboard/practice');
      });
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
