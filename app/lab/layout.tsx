import SideNavBar from "@/components/ui/sideNav";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  
    return (        
    <TooltipProvider  >
      <div className="grid h-screen w-full sm:py-4">
          <SideNavBar />
          <div className="flex flex-col flex-1 overflow-hidden  sm:pl-14">
              <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
        </TooltipProvider>

    );
  }
  