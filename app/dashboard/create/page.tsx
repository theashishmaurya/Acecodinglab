import { CreateInterviewProvider } from '@/components/createInterview/context/createInterview.context';
import CreateInterView from '@/components/createInterview/createInterview';

export default async function Page({ searchParams }: any) {
  return (
    <div>
      <CreateInterviewProvider>
        <CreateInterView />
      </CreateInterviewProvider>
    </div>
  );
}
