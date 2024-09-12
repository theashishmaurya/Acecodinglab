import {
    ListFilter,
  } from "lucide-react"

  
  import { Button } from "@/components/ui/button"
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

  

  import {
    Tabs,
    TabsContent,
   
  } from "@/components/ui/tabs"
import QuestionTable, { IQuestions } from "@/components/practiceTable"
import { getListOfQuestion, readFromFolder } from "@/lib/readFromFolder"


export default async function Page ({ searchParams }:any) {

  const activeTab = searchParams.tab || 'all';


  let questions:IQuestions[] = [];

  try {
    const data = await getListOfQuestion(); //from File system
    
    questions = await Promise.all(data.map(async (d) => {
      try {
        const metaInfo = JSON.parse(d as string);
        const content = await readFromFolder(`${metaInfo.key}`);
        return { ...metaInfo, content };
      } catch (e) {
        console.error(`Error processing question: ${(e as any)?.message }`);
        return null; // Return null for failed questions
      }
    }));

    // Filter out any null results (failed questions)
    questions = questions.filter(q => q !== null);

  } catch (e) {
    console.error(`Error fetching questions: ${(e as any).message}`);
    return <>Error Happened</> // Re-throw the error for the component to handle
  }


    return (
      <Tabs defaultValue={activeTab}>
      <div className="flex items-center">
        {/* <TabsList>
          <TabsTrigger value="all" asChild>
            <Link href="?tab=all">All</Link>
          </TabsTrigger>
          <TabsTrigger value="active" asChild>
            <Link href="?tab=active">In Progress</Link>
          </TabsTrigger>
          <TabsTrigger value="completed" asChild>
            <Link href="?tab=completed">Completed</Link>
          </TabsTrigger>
        </TabsList> */}
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Completed</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {['all', 'active', 'completed'].map((tab) => (
        <TabsContent key={tab} value={tab} className="sm:py-10 py-10">
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>
                Click on a question to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionTable questions={questions} activeTab={tab} />
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>{questions.length}</strong> questions
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      ))}
    </Tabs>

    )
}