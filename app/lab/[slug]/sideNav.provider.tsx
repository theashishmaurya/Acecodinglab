import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SideNavContextProps {
  isFileExplorerOpen: boolean;
  setIsFileExplorerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isQuestionPanelOpen: boolean;
  setIsQuestionPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideNavContext = createContext<SideNavContextProps | undefined>(
  undefined,
);

export const SideNavProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(true);
  const [isQuestionPanelOpen, setIsQuestionPanelOpen] = useState(false);

  const values = {
    isFileExplorerOpen,
    setIsFileExplorerOpen,
    isQuestionPanelOpen,
    setIsQuestionPanelOpen,
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
