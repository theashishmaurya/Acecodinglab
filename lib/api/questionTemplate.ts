'use server';

import { join } from 'path';
import fs from 'fs/promises';
import {
  QuestionTemplate,
  QuestionFiles,
} from '@/components/questionTemplate/context/questionTemplate.context';

const QUESTIONS_DIR = join(process.cwd(), 'question');

// Get all question templates
export async function getQuestionTemplates(): Promise<QuestionTemplate[]> {
  try {
    const dirs = await fs.readdir(QUESTIONS_DIR);

    const templates = await Promise.all(
      dirs.map(async dir => {
        try {
          const metaPath = join(QUESTIONS_DIR, dir, 'metainfo.json');
          const metaContent = await fs.readFile(metaPath, 'utf8');
          const meta = JSON.parse(metaContent);

          // Add status based on filesystem convention or default to "live"
          // In a real app, you'd store this in a database
          return {
            ...meta,
            status: meta.status || 'live',
            id: meta.key || dir,
          } as QuestionTemplate;
        } catch (err) {
          console.error(`Error reading metadata for ${dir}:`, err);
          return null;
        }
      }),
    );

    return templates.filter(Boolean) as QuestionTemplate[];
  } catch (err) {
    console.error('Error reading question templates:', err);
    throw new Error('Failed to load question templates');
  }
}

// Get question template files
export async function getQuestionTemplateFiles(
  templateKey: string,
): Promise<QuestionFiles> {
  try {
    const templateDir = join(QUESTIONS_DIR, templateKey, 'template');
    const files = await fs.readdir(templateDir);

    const fileContents: QuestionFiles = {} as QuestionFiles;

    await Promise.all(
      files.map(async file => {
        try {
          const content = await fs.readFile(join(templateDir, file), 'utf8');
          fileContents[file] = content;
        } catch (err) {
          console.error(`Error reading file ${file}:`, err);
        }
      }),
    );

    return fileContents;
  } catch (err) {
    console.error(`Error reading template files for ${templateKey}:`, err);
    throw new Error('Failed to load template files');
  }
}

// Create or update a question template
export async function saveQuestionTemplate(
  template: QuestionTemplate,
  files: QuestionFiles,
): Promise<QuestionTemplate> {
  try {
    // Create directory structure if it doesn't exist
    const templateDir = join(QUESTIONS_DIR, template.key);
    const templateFilesDir = join(templateDir, 'template');

    await fs.mkdir(templateDir, { recursive: true });
    await fs.mkdir(templateFilesDir, { recursive: true });

    // Save metadata
    const metaPath = join(templateDir, 'metainfo.json');
    await fs.writeFile(metaPath, JSON.stringify(template, null, 2));

    // Save files
    await Promise.all(
      Object.entries(files).map(async ([fileName, content]) => {
        const filePath = join(templateFilesDir, fileName);
        await fs.writeFile(filePath, content || '');
      }),
    );

    return template;
  } catch (err) {
    console.error('Error saving question template:', err);
    throw new Error('Failed to save question template');
  }
}

// Delete a question template
export async function deleteQuestionTemplate(
  templateKey: string,
): Promise<void> {
  try {
    const templateDir = join(QUESTIONS_DIR, templateKey);
    await fs.rm(templateDir, { recursive: true, force: true });
  } catch (err) {
    console.error(`Error deleting template ${templateKey}:`, err);
    throw new Error('Failed to delete question template');
  }
}

// Change template status
export async function changeTemplateStatus(
  templateKey: string,
  status: 'draft' | 'test' | 'live',
): Promise<void> {
  try {
    const metaPath = join(QUESTIONS_DIR, templateKey, 'metainfo.json');
    const metaContent = await fs.readFile(metaPath, 'utf8');
    const meta = JSON.parse(metaContent);

    // Update status
    meta.status = status;

    // Save updated metadata
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2));
  } catch (err) {
    console.error(`Error changing status for template ${templateKey}:`, err);
    throw new Error('Failed to change template status');
  }
}
