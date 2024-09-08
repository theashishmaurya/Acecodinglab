import { join } from "path";
import fs from "fs";

const DIR = join(process.cwd(), "question");

const preProcessSlug = (slug: string) => {
  return slug.toLowerCase().replace(/ /g, "");
};

const ReadFolder = (path: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
};

const ReadFile = (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const getQuestion = (slug: string) => {
  const questionDir = join(DIR, slug, "question.mdx");
};

const getTemplate = async (slug: string) => {
  const templateDir = join(DIR, slug, "template");

  try {
    const files = await ReadFolder(templateDir);
    let content: Record<string, string> = {};

    for (const file of files) {
      try {
        const data = await ReadFile(join(templateDir, file));
        content[file] = data;
      } catch (err) {
        // Handle error if needed
        console.error(err, "Error while reading file");
      }
    }

    return content;
  } catch (err) {
    // Handle error if needed
    console.log(err);
    return new Error("Error while reading files");
  }
};

const getMetaInfo = async(slug:string) => {
  const path = join(DIR, slug, "metainfo.json");

  try {
  const data = await ReadFile(path);
  return data
  }catch(Err){
    console.error(Err)
    return new Error("Error while reading Meta files");
  }






};

const solution = () => {};

/**
 * @description Read all files from a question folder
 */
export const readFromFolder = async (slug: string) => {
  console.log(slug,"slug")
  //Read all files from a question folder and see if the folder exists
  try {
    const files = await ReadFolder(DIR);
    const slugFolder = preProcessSlug(slug);
    const file = files.find((file) => {
      return file === slugFolder;
    });

    if (file) {
      return await getTemplate(slugFolder);
    } else {
      throw new Error("Folder not found");
    }
  } catch (err) {
    throw err; // Rethrow the error to handle it in the caller's catch block.
  }
};


export const getListOfQuestion = async ()=>{

  const files = await ReadFolder(DIR);

 const data = files.map(async(slug)=>{
    const metaInfo = await getMetaInfo(slug)
    return metaInfo
  })

  return Promise.all(data)

}