'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { questionTemplateAPI } from '@/lib/api/questionTemplate.client';

// Define the types for our question template
export type QuestionTemplate = {
  id?: string;
  name: string;
  key: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  author: string;
  company: string[];
  status: 'draft' | 'test' | 'live';
  createdAt?: string;
  updatedAt?: string;
};

export type QuestionFiles = {
  'question.mdx': string;
  'App.js': string;
  'index.js': string;
  'styles.css': string;
  'data.js'?: string;
  [key: string]: string | undefined;
};

// Context interface
interface QuestionTemplateContextProps {
  templates: QuestionTemplate[];
  selectedTemplate: QuestionTemplate | null;
  templateFiles: QuestionFiles | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedTemplate: (template: QuestionTemplate | null) => void;
  createTemplate: (
    template: QuestionTemplate,
    files: QuestionFiles,
  ) => Promise<void>;
  updateTemplate: (
    template: QuestionTemplate,
    files?: QuestionFiles,
  ) => Promise<void>;
  deleteTemplate: (templateId: string) => Promise<void>;
  loadTemplates: () => Promise<void>;
  loadTemplateFiles: (templateKey: string) => Promise<void>;
  changeTemplateStatus: (
    templateId: string,
    status: 'draft' | 'test' | 'live',
  ) => Promise<void>;
}

// Create context with default values
const QuestionTemplateContext = createContext<
  QuestionTemplateContextProps | undefined
>(undefined);

// Provider component
export const QuestionTemplateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [templates, setTemplates] = useState<QuestionTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<QuestionTemplate | null>(null);
  const [templateFiles, setTemplateFiles] = useState<QuestionFiles | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  // Load templates from the server
  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await questionTemplateAPI.getTemplates();
      setTemplates(data);
    } catch (err) {
      setError('Failed to load templates');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load template files from the server
  const loadTemplateFiles = async (templateKey: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const files = await questionTemplateAPI.getTemplateFiles(templateKey);
      setTemplateFiles(files);
    } catch (err) {
      setError('Failed to load template files');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new template
  const createTemplate = async (
    template: QuestionTemplate,
    files: QuestionFiles,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const savedTemplate = await questionTemplateAPI.saveTemplate(
        template,
        files,
      );
      setTemplates([...templates, savedTemplate]);
      setSelectedTemplate(savedTemplate);
      setTemplateFiles(files);
    } catch (err) {
      setError('Failed to create template');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing template
  const updateTemplate = async (
    template: QuestionTemplate,
    files?: QuestionFiles,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedTemplate = await questionTemplateAPI.saveTemplate(
        template,
        files || templateFiles!,
      );

      setTemplates(
        templates.map(t => (t.id === template.id ? updatedTemplate : t)),
      );
      setSelectedTemplate(updatedTemplate);

      if (files) {
        setTemplateFiles(files);
      }
    } catch (err) {
      setError('Failed to update template');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a template
  const deleteTemplate = async (templateId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const templateToDelete = templates.find(t => t.id === templateId);
      if (!templateToDelete) throw new Error('Template not found');

      await questionTemplateAPI.deleteTemplate(templateToDelete.key);

      setTemplates(templates.filter(t => t.id !== templateId));

      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(null);
        setTemplateFiles(null);
      }
    } catch (err) {
      setError('Failed to delete template');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Change template status
  const changeTemplateStatus = async (
    templateId: string,
    status: 'draft' | 'test' | 'live',
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const templateToUpdate = templates.find(t => t.id === templateId);
      if (!templateToUpdate) throw new Error('Template not found');

      await questionTemplateAPI.changeTemplateStatus(
        templateToUpdate.key,
        status,
      );

      const updatedTemplates = templates.map(t => {
        if (t.id === templateId) {
          return { ...t, status };
        }
        return t;
      });

      setTemplates(updatedTemplates);

      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate({ ...selectedTemplate, status });
      }
    } catch (err) {
      setError('Failed to change template status');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    templates,
    selectedTemplate,
    templateFiles,
    isLoading,
    error,
    setSelectedTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    loadTemplates,
    loadTemplateFiles,
    changeTemplateStatus,
  };

  return (
    <QuestionTemplateContext.Provider value={value}>
      {children}
    </QuestionTemplateContext.Provider>
  );
};

// Custom hook to use the context
export const useQuestionTemplate = () => {
  const context = useContext(QuestionTemplateContext);
  if (context === undefined) {
    throw new Error(
      'useQuestionTemplate must be used within a QuestionTemplateProvider',
    );
  }
  return context;
};
