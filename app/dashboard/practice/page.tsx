import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import QuestionTable, { IQuestions } from '@/components/practiceTable';
import { getListOfQuestion, readFromFolder } from '@/lib/readFromFolder';
import { UserTracker } from '@/components/userTracker';
import { TabsNavigation } from '@/components/TabsNavigation';
import { DifficultyFilter } from '@/components/DifficultyFilter';

export default async function Page(props: any) {
  const searchParams = await props.searchParams;

  const activeTab = searchParams.tab || 'all';
  const difficulty = searchParams.difficulty || 'all';

  let questions: IQuestions[] = [];

  try {
    const data = await getListOfQuestion(); //from File system

    questions = await Promise.all(
      data.map(async d => {
        try {
          const metaInfo = JSON.parse(d as string);
          const content = (await readFromFolder(`${metaInfo.key}`)).template;
          return { ...metaInfo, content };
        } catch (e) {
          console.error(`Error processing question: ${(e as any)?.message}`);
          return null; // Return null for failed questions
        }
      }),
    );

    // Filter out any null results (failed questions)
    questions = questions.filter(q => q !== null);

    // Filter by difficulty if specified
    if (difficulty !== 'all') {
      questions = questions.filter(
        q => q.difficulty.toLowerCase() === difficulty.toLowerCase(),
      );
    }
  } catch (e) {
    console.error(`Error fetching questions: ${(e as any).message}`);
    return <>Error Happened</>; // Re-throw the error for the component to handle
  }

  return (
    <Tabs defaultValue={activeTab}>
      <UserTracker />
      <div className="flex items-center">
          {/* <TabsNavigation activeTab={activeTab} difficulty={difficulty} /> */}
        <DifficultyFilter activeTab={activeTab} difficulty={difficulty} />
      </div>
      {['all', 'active', 'completed'].map(tab => (
        <TabsContent key={tab} value={tab} className="sm:py-10 py-10">
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>
                {difficulty !== 'all'
                  ? `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty - `
                  : ''}
                Click on a question to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionTable questions={questions} activeTab={tab} />
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of{' '}
                <strong>{questions.length}</strong> questions
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
