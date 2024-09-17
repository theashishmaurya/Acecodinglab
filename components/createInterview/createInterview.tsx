import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DarkCalendarTimeSelector from "./dateAndTimeSelector"
import Stepper from "@/components/ui/stepper"
import DataTable from "./QuestionTable"
import CreateInterViewForm from "./createInterviewForm"
import QuestionTable from "./QuestionTable"


export default function CreateInterView() {

    const steps = [
        { title: "Step 1", content: <CreateInterViewForm/> },
        { title: "Step 2", content: <QuestionTable/> },
        { title: "Step 3", content: <DarkCalendarTimeSelector/>},
      ]
  return (
    <div className="min-h-screen p-4">
      <Card className="mx-auto max-w-6xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold pb-4">Create Interview</CardTitle>
            {/* <p className="text-sm">Tuesday, Jan 5, 2023</p> */}
          </div>
        </CardHeader>
        <Stepper steps={steps} orientation="vertical" />        
      </Card>
    </div>
  )
}