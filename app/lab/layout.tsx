import { CodeEditorProvider } from '@/components/codeEditor/codeEditor.context';
import { CodeEditorMode } from '@/components/codeEditor/types';
import SideNavBar from '@/components/ui/sideNav';
import { TooltipProvider } from '@radix-ui/react-tooltip';

export const metadata = {
  title: 'AceCodingLab',
  description:
    'Your go-to platform for mastering frontend coding and system design, with real-world practice and interview simulations that lead to success.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CodeEditorProvider mode={CodeEditorMode.PRACTICE}>
      <TooltipProvider>
        <div className="grid h-screen w-full ">
          <SideNavBar />
          <div className="flex flex-col flex-1 overflow-hidden  sm:pl-14">
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </div>
      </TooltipProvider>
    </CodeEditorProvider>
  );
}
