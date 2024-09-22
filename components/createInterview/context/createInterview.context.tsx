'use client';
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { IQuestions } from '@/components/practiceTable';
import {
  createInterviewSession,
  ICreateInterviewSession,
} from '@/db/interview/createInterview';

interface CreateInterviewContextType {
  intervieweeEmail: string;
  setIntervieweeEmail: (email: string) => void;
  infoUrl: string;
  setInfoUrl: (url: string) => void;
  interviewerIntro: string;
  setInterviewerIntro: (intro: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  timeFormat: '12h' | '24h';
  setTimeFormat: (format: '12h' | '24h') => void;
  duration: string;
  setDuration: (duration: string) => void;
  sendEmail: boolean;
  setSendEmail: (send: boolean) => void;
  selectedTimezone: string;
  setSelectedTimezone: (timezone: string) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
  tasks: IQuestions[];
  setTasks: (rows: IQuestions[]) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  filePreview: string | null;
  setFilePreview: (preview: string | null) => void;
  handleSubmit: () => void;
}

const CreateInterviewContext = createContext<
  CreateInterviewContextType | undefined
>(undefined);

export const CreateInterviewProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [intervieweeEmail, setIntervieweeEmail] = useState('');
  const [infoUrl, setInfoUrl] = useState('');
  const [interviewerIntro, setInterviewerIntro] = useState('');
  const [notes, setNotes] = useState('');
  // Date when the interview will be live from
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('24h');
  // Duration of the whole interview
  const [duration, setDuration] = useState('30m');
  const [sendEmail, setSendEmail] = useState(true);

  //Time Zone
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata');

  // Selected Time
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [tasks, setTasks] = useState<IQuestions[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedTime) {
      console.error('Selected time is required');
      return;
    }

    const interviewData: ICreateInterviewSession = {
      intervieweeEmail,
      infoUrl,
      interviewerIntro,
      notes,
      selectedDate: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      currentMonth: currentMonth.toISOString(),
      timeFormat,
      duration,
      sendEmail,
      selectedTimezone,
      selectedTime,
      filePreview: filePreview || undefined,
      proctored: false, // Set this based on your requirements
      tasks: tasks.map((task, index) => ({
        ...task,
        task_order: index + 1,
      })),
    };

    const result = await createInterviewSession(interviewData);

    if (result.success) {
      console.log('Interview session created successfully:', result.sessionId);
      // Handle success (e.g., show a success message, redirect, etc.)
    } else {
      console.error('Failed to create interview session:', result.error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <CreateInterviewContext.Provider
      value={{
        intervieweeEmail,
        setIntervieweeEmail,
        infoUrl,
        setInfoUrl,
        interviewerIntro,
        setInterviewerIntro,
        notes,
        setNotes,
        selectedDate,
        setSelectedDate,
        currentMonth,
        setCurrentMonth,
        timeFormat,
        setTimeFormat,
        duration,
        setDuration,
        sendEmail,
        setSendEmail,
        selectedTimezone,
        setSelectedTimezone,
        selectedTime,
        setSelectedTime,
        tasks,
        setTasks,
        file,
        setFile,
        filePreview,
        setFilePreview,
        handleSubmit,
      }}
    >
      {children}
    </CreateInterviewContext.Provider>
  );
};

export const useCreateInterview = () => {
  const context = useContext(CreateInterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
