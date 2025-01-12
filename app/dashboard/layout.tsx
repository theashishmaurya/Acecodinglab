import { SideNavBar } from '@/components/ui/sideNav';
import { TooltipProvider } from '@/components/ui/tooltip';

import DynamicBreadcrumb from '@/components/dynamicBreadCrump';

export const metadata = {
  title: 'AceCodingLab',
  description:
    'Your go-to platform for mastering frontend coding and system design, with real-world practice and interview simulations that lead to success.',
};

const DashboardHeader = ({ params }: any) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 ">
      <DynamicBreadcrumb />
      {/* <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div> */}
      {/* <UserMenu /> */}
    </header>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-screen w-full ">
      <TooltipProvider>
        <SideNavBar />
        <div className="flex flex-col flex-1 overflow-hidden  sm:px-24 sm:py-4 ">
          <DashboardHeader />
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </TooltipProvider>
    </div>
  );
}
