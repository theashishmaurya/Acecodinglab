import CodeEditor from "@/components/codeEditor";
import { readFromFolder } from "@/utils/readFromFolder";

export default async function Home({ params }: { params: { slug: string } }) {
  let content = {};

  try {
    content = await readFromFolder(params.slug);
  } catch (e) {
    console.log(e);
    // Error Page for showing error message when the folder is not found
    return <div>Error</div>;
  }

  return (
    <div>
      <CodeEditor files={content} />
    </div>
  );
}
