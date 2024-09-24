'use client';
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { IQuestions } from '@/components/practiceTable';
import {
  createInterviewSession,
  ICreateInterviewSession,
} from '@/db/interview/createInterview';
import { createClient } from '@/lib/supabase/supabaseClient';

export const timezones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Dubai',
  'Australia/Sydney',
  'Asia/Kolkata',
];

interface CreateInterviewContextType {
  intervieweeEmail: string;
  setIntervieweeEmail: (email: string) => void;
  title: string;
  setTitle: (url: string) => void;
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
  duration: number;
  setDuration: (duration: number) => void;
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

const supabase = createClient();

const CreateInterviewContext = createContext<
  CreateInterviewContextType | undefined
>(undefined);

export const CreateInterviewProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [intervieweeEmail, setIntervieweeEmail] = useState('');
  const [title, setTitle] = useState('');
  const [interviewerIntro, setInterviewerIntro] = useState('');
  const [notes, setNotes] = useState('');
  // Date when the interview will be live from
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('24h');
  // Duration of the whole interview
  const [duration, setDuration] = useState<number>(30);
  const [sendEmail, setSendEmail] = useState(true);

  //Time Zone
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata');

  // Selected Time
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [tasks, setTasks] = useState<IQuestions[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const getTimezoneOffset = (timezone: string, date: Date): string => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });

    const parts = formatter.formatToParts(date);
    let offset = parts.find(part => part.type === 'timeZoneName')?.value || '';
    offset = offset.replace('GMT', '');

    // Ensure the offset is in the correct format (±HH:mm)
    if (offset.length === 3) {
      offset = offset.slice(0, 1) + '0' + offset.slice(1) + ':00';
    } else if (offset.length === 5 && !offset.includes(':')) {
      offset = offset.slice(0, 3) + ':' + offset.slice(3);
    }

    return offset;
  };

  const createTimestamptz = (
    date: Date,
    time: string,
    timezone: string,
  ): string => {
    const [hours, minutes] = time.split(':');
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const offset = getTimezoneOffset(timezone, date);

    // Construct the timestamptz string
    return `${year}-${month}-${day}T${hours}:${minutes}:00${offset}`;
  };

  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const handleSubmit = async () => {
    if (!selectedTime) {
      console.error('Selected time is required');
      return;
    }

    const startDate = selectedDate;
    const endDate = addDays(startDate, 30);

    const startTimestamptz = createTimestamptz(
      startDate,
      selectedTime,
      selectedTimezone,
    );
    const endTimestamptz = createTimestamptz(
      endDate,
      selectedTime,
      selectedTimezone,
    );

    const user = (await supabase.auth.getUser()).data.user;
    const interviewData = {
      p_description: notes,
      p_end_date: endTimestamptz,
      p_is_public: true,
      p_max_participants: `${200}`,
      p_start_date: startTimestamptz,
      p_tasks: tasks.map(task => task.key),
      p_title: title,
      p_duration: duration,
      p_invited_users: null,
      p_created_by: user?.id,
    };

    const { data, error } = await supabase.rpc(
      'create_interview_session',
      interviewData,
    );

    if (data) {
      console.log('Interview session created successfully:', data);
      // Handle success (e.g., show a success message, redirect, etc.)
    } else {
      console.error('Failed to create interview session:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <CreateInterviewContext.Provider
      value={{
        intervieweeEmail,
        setIntervieweeEmail,
        title,
        setTitle,
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
