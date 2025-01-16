'use client';
import React from 'react';
import Link from 'next/link';
import { Triangle, LucideIcon, Files, BookCheck, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { useSideNav } from '@/app/lab/sideNav.provider';

import UserNav from '@/components/ui/nav-user';
interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

const NavItem = ({ href, icon: Icon, label, onClick }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname.includes(href);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href}>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-lg ${isActive ? 'bg-muted' : ''}`}
            aria-label={label}
            onClick={() => {
              onClick?.();
            }}
          >
            <Icon className="size-5" />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

export const LabSideNavBar = () => {
  const {
    isFileExplorerOpen,
    isQuestionPanelOpen,
    setIsFileExplorerOpen,
    setIsQuestionPanelOpen,
  } = useSideNav();
  return (
    <Card className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
      <div className="border-b p-2 ">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" aria-label="Home">
            <Triangle className="size-5 fill-foreground" />
          </Button>
        </Link>
      </div>
      <nav className="grid gap-1 p-2">
        <NavItem href="/dashboard/practice" icon={Book} label="Question Bank" />
        <NavItem
          href="#"
          icon={Files}
          label="File Explorer"
          onClick={() => {
            setIsFileExplorerOpen(!isFileExplorerOpen);
          }}
        />
        <NavItem
          href="#"
          icon={BookCheck}
          label="Question Panel"
          onClick={() => {
            setIsQuestionPanelOpen(!isQuestionPanelOpen);
          }}
        />
      </nav>
      <nav className="mt-auto grid gap-1 p-2">
        <UserNav />
      </nav>
    </Card>
  );
};

export default LabSideNavBar;
