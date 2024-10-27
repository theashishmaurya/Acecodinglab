import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { ReactNode } from 'react';

import { CodeEditorProvider } from '@/components/codeEditor/codeEditor.context';
import SideNav from '@/components/interviewLab/SideNav';
import { CodeEditorMode } from '@/components/codeEditor/types';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <CodeEditorProvider mode={CodeEditorMode.INTERVIEW}>
      <div className="flex min-h-screen w-full">
        <div className="hidden md:flex flex-col border-r bg-muted/40 w-[80px] group hover:w-[220px] lg:hover:w-[280px] transition-all duration-300 ease-in-out">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[50px] lg:px-6 overflow-hidden">
              <Link
                href=""
                className="flex items-center gap-2 font-semibold whitespace-nowrap"
              >
                <span className="group-hover:hidden">ACL</span>
                <span className="hidden group-hover:inline">AceCodingLab</span>
              </Link>
            </div>
            <div className="flex-1 overflow-hidden">
              <SideNav />
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <header className="flex h-12 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[50px] lg:px-6">
            <div className="w-full flex-1"></div>
            {/* <Button>Start</Button> */}
          </header>
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </div>
    </CodeEditorProvider>
  );
}
