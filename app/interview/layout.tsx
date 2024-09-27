import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { ReactNode } from 'react';
import CodeEditor from '@/components/codeEditor';
import { CodeEditorMode } from '@/components/codeEditor/types';

export const description =
  'A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action.';

const navItems = [
  { number: '1', text: 'Matrix Multiplication', href: '#', active: false },
  { number: '2', text: 'React toastify', href: '#', active: false },
  {
    number: '3',
    text: 'Implement socket.io',
    href: '#',
    active: true,
  },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:flex flex-col border-r bg-muted/40 w-[80px] group hover:w-[220px] lg:hover:w-[280px] transition-all duration-300 ease-in-out">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 overflow-hidden">
            <Link
              href=""
              className="flex items-center gap-2 font-semibold whitespace-nowrap"
            >
              <span className="group-hover:hidden">ACL</span>
              <span className="hidden group-hover:inline">AceCodingLab</span>
            </Link>
          </div>
          <div className="flex-1 overflow-hidden">
            <nav className="grid items-start px-2 text-md font-large lg:px-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    item.active ? 'text-primary' : 'text-muted-foreground'
                  } ${item.active ? 'bg-muted' : ''}`}
                >
                  <span className="w-6 text-center">{item.number}</span>
                  <span className="hidden group-hover:inline overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.text}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1"></div>
          <Button>Start</Button>
        </header>
        <main className="flex flex-1 flex-col">
          <CodeEditor
            files={{}}
            isSample={false}
            mode={CodeEditorMode.INTERVIEW}
          />
        </main>
      </div>
    </div>
  );
}
