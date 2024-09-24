'use client';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import DarkCalendarTimeSelector from './dateAndTimeSelector';
import Stepper from '@/components/ui/stepper';
import CreateInterViewForm from './createInterviewForm';
import QuestionTable from './QuestionTable';
import { useCreateInterview } from './context/createInterview.context';

export default function CreateInterView() {
  const steps = [
    { title: 'Step 1', content: <CreateInterViewForm /> },
    { title: 'Step 2', content: <QuestionTable /> },
    { title: 'Step 3', content: <DarkCalendarTimeSelector /> },
  ];
  const { handleSubmit } = useCreateInterview();
  return (
    <div className="min-h-screen p-4">
      <Card className="mx-auto max-w-6xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold pb-4">
              Create Interview
            </CardTitle>
            {/* <p className="text-sm">Tuesday, Jan 5, 2023</p> */}
          </div>
        </CardHeader>
        <Stepper steps={steps} orientation="vertical" onFinish={handleSubmit} />
      </Card>
    </div>
  );
}
