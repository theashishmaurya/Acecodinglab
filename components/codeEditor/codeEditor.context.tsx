'use client';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { CodeEditorMode } from './types';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/supabaseClient';
import { getListOfQuestions } from '../createInterview/getQuestions.action';
import { IQuestions } from '../practiceTable';
import { DebouncedState, useDebouncedCallback } from 'use-debounce';
import { practiceSessionsAPI } from '@/db/practiceSession/practiceSession.client';

// Supabase Initialization

const supabase = createClient();

// Define the shape of our context
interface CodeEditorContextType {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;

  tasks: InterviewTasks[];
  setCurrentTask: React.Dispatch<React.SetStateAction<InterviewTasks | null>>;
  currentTask: InterviewTasks | null;

  handleOnCodeChange: () => DebouncedState<(code: string) => void>;
}

// Create the context with a default value
const CodeEditorContext = createContext<CodeEditorContextType | undefined>(
  undefined,
);

// Props type for the provider component
interface CodeEditorProviderProps {
  children: ReactNode;
  mode: CodeEditorMode;
}

interface InterviewTasks {
  id: string;
  attempt_id: string;
  code_snapshot: string;
  submitted_at: string;
  template_id: string;
  template_name: string;
  attempted: boolean;
}
// Create a provider component
export const CodeEditorProvider: React.FC<CodeEditorProviderProps> = ({
  children,
  mode,
}) => {
  /**
   * All the tasks we get from the backend, also we need to continously keep writting to the local state as user changes the code
   */
  const [tasks, setTasks] = useState<InterviewTasks[]>([]);

  /**
   * Current Task details here
   */

  const [currentTask, setCurrentTask] = useState<InterviewTasks | null>(null);
  const [language, setLanguage] = useState<string>('typescript');

  const { slug } = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    getSessions(slug as string);
  }, [slug]);

  const getSessions = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('id', id);

      if (error) {
        return error;
      }

      const { tasks } = data[0];
      const getAllQuestions = await getListOfQuestions();

      const tasksList = getAllQuestions.filter(question => {
        return (tasks as string[]).includes(question.key);
      });

      await createInterviewAttempt(id, tasksList);

      return data;
    } catch (error) {
      console.error(error, 'Something went wring with  getting session');
    }
  };

  const createInterviewAttempt = async (
    sessionId: string,
    taskList: IQuestions[],
  ) => {
    /**
     * Check if a interview attempt for user exist for same interview session
     *
     * if not create new
     */

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userAttempt = await getUserAttempt(
        slug as string,
        user?.id as string,
      );

      if (userAttempt && userAttempt?.length < 1) {
        const createAttemptPayload = {
          session_id: sessionId,
          user_id: user?.id,
        };
        const { data: attempt_data, error } = await supabase
          .from('interview_attempts')
          .insert(createAttemptPayload)
          .select('*');

        if (error) {
          throw error;
        }

        taskList.forEach(async task => {
          const taskPayload = {
            attempt_id: attempt_data[0].id,
            code_snapshot: task.content,
            template_id: task.key,
            template_name: task.name,
          };

          const { data: taskData, error } = await supabase
            .from('task_responses')
            .insert(taskPayload)
            .select('*');

          if (error) {
            throw error;
          }

          setTasks(prev => {
            return [...prev, taskData[0]];
          });
        });
      } else {
        /** Get the task and populate ? */

        const taskData = await getTasks(userAttempt[0].id);
        setTasks(taskData);
      }
    } catch (err) {
      console.error(
        err,
        `Something went wrong while creating Interview attemp for interviewSession:${sessionId}`,
      );
    }
  };

  /**
   * Checks the attemp if exist or not , returns attemp or null
   *
   */

  const getUserAttempt = async (sessionId: string, userId: string) => {
    /**
     * Checks on the basis of userId and session Id
     */

    const { data, error } = await supabase
      .from('interview_attempts')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return data;
  };

  /**
   * Get all the task Response on the basis of attempId and
   */
  const getTasks = async (attemptId: string) => {
    const { data, error } = await supabase
      .from('task_responses')
      .select('*')
      .eq('attempt_id', attemptId);

    if (error) {
      throw error;
    }

    return data;
  };

  const [editorMode, setEditorMode] = useState<CodeEditorMode>(
    CodeEditorMode.PRACTICE,
  );

  console.log(mode);
  const debouncedUpdateCode = useDebouncedCallback(
    async (code: string) => {
      if (mode === CodeEditorMode.PRACTICE) {
        practiceSessionsAPI.updateSessionCode(slug[0], code).catch(error => {
          console.error('Failed to update session code:', error);
          // You might want to show an error message to the user here
        });
      } else {
        console.log(slug, 'Slug from Interview');
        console.log(searchParams.get('task_id'), 'task Id');
        const { data, error } = await supabase
          .from('task_responses')
          .update({ code_snapshot: code })
          .eq('id', searchParams.get('task_id'))
          .select();

        if (error) {
          console.error(error, 'Something went wring while updating the code');
        }

        console.log(data, 'data After update');
      }
    },
    3000, // Debounce for 3 second
  );
  const handleOnCodeChange = () => {
    return debouncedUpdateCode;
  };

  const handleStartInterview = () => {};

  const Submit = () => {};

  const value: CodeEditorContextType = {
    language,
    setLanguage,
    tasks,
    setCurrentTask,
    currentTask,
    handleOnCodeChange,
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
