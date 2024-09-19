"use server"
import { getListOfQuestion, readFromFolder } from "@/lib/readFromFolder";
import { IQuestions } from "../practiceTable";


 export async function getListOfQuestions(){
    let questions:IQuestions[] = [];

  try {
    const data = await getListOfQuestion(); //from File system
    
    questions = await Promise.all(data.map(async (d) => {
      try {
        const metaInfo = JSON.parse(d as string);
        const content = await readFromFolder(`${metaInfo.key}`);
        console.log(content)
        return { ...metaInfo, content };
      } catch (e) {
        console.error(`Error processing question: ${(e as any)?.message }`);
        return e // Return null for failed questions
      }
    }));

    // Filter out any null results (failed questions)
    questions = questions.filter(q => q !== null);
    return questions

  } catch (e) {
    console.error(`Error fetching questions: ${(e as any).message}`);
    return e
  }
}