'use client';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { CodeEditorMode } from './types';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/supabaseClient';

// Supabase Initialization

const supabase = createClient();

// Define the shape of our context
interface CodeEditorContextType {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with a default value
const CodeEditorContext = createContext<CodeEditorContextType | undefined>(
  undefined,
);

// Props type for the provider component
interface CodeEditorProviderProps {
  children: ReactNode;
}

// Create a provider component
export const CodeEditorProvider: React.FC<CodeEditorProviderProps> = ({
  children,
}) => {
  /**
   * All the tasks we get from the backend, also we need to continously keep writting to the local state as user changes the code
   */
  const [tasks, setTasks] = useState<string[]>([]);
  /**
   * SelectedTask keeps the track of which task is selected
   */
  const [selectedTask, setSelectedTaks] = useState<number>(0);

  /**
   * Current Session details here
   */

  const [currentSession, setCurrentSession] = useState();

  const { slug } = useParams();

  useEffect(() => {
    getSessions(slug as string);
  }, [slug]);

  const getSessions = async (id: string) => {
    const sessionDetails = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', id);
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', id);

    if (error) {
      console.error('Error fetching sessions:', error);
      return null;
    }

    const { tasks } = data[0];
    console.log(tasks);
    return sessionDetails;
  };

  const createInterviewAttempt = () => {
    /**
     * Check if a interview attempt for user exist for same interview session
     *
     * if not create new
     */
  };

  const getTasks = () => {};

  const [editorMode, setEditorMode] = useState<CodeEditorMode>(
    CodeEditorMode.PRACTICE,
  );

  const handleOnCodeChange = () => {};

  const handleStartInterview = () => {};

  const Submit = () => {};
  const [language, setLanguage] = useState<string>('typescript');

  const value: CodeEditorContextType = {
    language,
    setLanguage,
  };

  return (
    <CodeEditorContext.Provider value={value}>
      {children}
    </CodeEditorContext.Provider>
  );
};

// Create a custom hook for using the context
export const useCodeEditor = (): CodeEditorContextType => {
  const context = useContext(CodeEditorContext);
  if (context === undefined) {
    throw new Error('useCodeEditor must be used within a CodeEditorProvider');
  }
  return context;
};

// Export the context for any advanced use cases
export { CodeEditorContext };
