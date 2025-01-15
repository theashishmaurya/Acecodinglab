import { Spec } from '@codesandbox/sandpack-react/components/Tests/Specs';
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  handleSubmit: (spec: Record<string, Spec>) => void;
}

const SideNavContext = createContext<SideNavContextProps | undefined>(
  undefined,
);

export const SideNavProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(true);
  const [isQuestionPanelOpen, setIsQuestionPanelOpen] = useState(false);
  const [toggleTestPanel, setToggleTestPanel] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onTestComplete = (specs: Record<string, Spec>) => {
    if (isSubmitting) {
      handleSubmit(specs);
    }
  };

  const handleSubmit = (spec: Record<string, Spec>) => {
    /** Submit Logic Here */
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
    handleSubmit,
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
