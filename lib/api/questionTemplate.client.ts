'use client';

import {
  QuestionTemplate,
  QuestionFiles,
} from '@/components/questionTemplate/context/questionTemplate.context';
import * as serverAPI from './questionTemplate';

// Client-side API functions for question templates
export const questionTemplateAPI = {
  // Get all question templates
  async getTemplates(): Promise<QuestionTemplate[]> {
    try {
      return await serverAPI.getQuestionTemplates();
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw new Error('Failed to fetch templates');
    }
  },

  // Get question template files
  async getTemplateFiles(templateKey: string): Promise<QuestionFiles> {
    try {
      return await serverAPI.getQuestionTemplateFiles(templateKey);
    } catch (error) {
      console.error(`Error fetching template files for ${templateKey}:`, error);
      throw new Error('Failed to fetch template files');
    }
  },

  // Create or update a question template
  async saveTemplate(
    template: QuestionTemplate,
    files: QuestionFiles,
  ): Promise<QuestionTemplate> {
    try {
      return await serverAPI.saveQuestionTemplate(template, files);
    } catch (error) {
      console.error('Error saving template:', error);
      throw new Error('Failed to save template');
    }
  },

  // Delete a question template
  async deleteTemplate(templateKey: string): Promise<void> {
    try {
      await serverAPI.deleteQuestionTemplate(templateKey);
    } catch (error) {
      console.error(`Error deleting template ${templateKey}:`, error);
      throw new Error('Failed to delete template');
    }
  },

  // Change template status
  async changeTemplateStatus(
    templateKey: string,
    status: 'draft' | 'test' | 'live',
  ): Promise<void> {
    try {
      await serverAPI.changeTemplateStatus(templateKey, status);
    } catch (error) {
      console.error(
        `Error changing status for template ${templateKey}:`,
        error,
      );
      throw new Error('Failed to change template status');
    }
  },
};
