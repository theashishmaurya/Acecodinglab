"use server"

import { unstable_cache } from 'next/cache'
import { getListOfQuestion, readFromFolder } from "@/lib/readFromFolder";
import { IQuestions } from "../practiceTable";

async function fetchQuestions() {
  let questions: IQuestions[] = [];

  try {
    const data = await getListOfQuestion(); // from File system
    
    questions = await Promise.all(data.map(async (d) => {
      try {
        const metaInfo = JSON.parse(d as string);
        const content = await readFromFolder(`${metaInfo.key}`);
        return { ...metaInfo, content };
      } catch (e) {
        console.error(`Error processing question: ${(e as Error).message}`);
        return null; // Return null for failed questions
      }
    }));

    // Filter out any null results (failed questions)
    questions = questions.filter((q): q is IQuestions => q !== null);
    return questions;

  } catch (e) {
    console.error(`Error fetching questions: ${(e as Error).message}`);
    throw e; // Re-throw the error to be handled by the caller
  }
}

export const getListOfQuestions = unstable_cache(
  async () => {
    return fetchQuestions();
  },
  ['questions-cache-key'],
  {
    revalidate: 3600, // Cache for 1 hour (3600 seconds)
    tags: ['questions']
  }
)