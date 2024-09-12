"use client"
import React from 'react';
import Link from "next/link";
import {
  Book,
  Bot,
  Code2,
  LifeBuoy,
  Settings2,
  SquareTerminal,
  SquareUser,
  Triangle,
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from 'next/navigation';
import { Card } from './card';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const NavItem = ({ href, icon: Icon, label }: NavItemProps) => {
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

export const SideNavBar = () => {
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
        <NavItem href="/lab" icon={SquareTerminal} label="CodeLabs"  />
        {/* <NavItem href="/dashboard/models" icon={Bot} label="Models" /> */}
        {/* <NavItem href="/dashboard/codelab" icon={Code2} label="CodeLabs" /> */}
      </nav>
      <nav className="mt-auto grid gap-1 p-2">
        <NavItem href="/dashboard/settings" icon={Settings2} label="Settings" />
        <NavItem href="/dashboard/help" icon={LifeBuoy} label="Help" />
        <NavItem href="/dashboard/account" icon={SquareUser} label="Account" />
      </nav>
    </Card>
  );
};

export default SideNavBar;