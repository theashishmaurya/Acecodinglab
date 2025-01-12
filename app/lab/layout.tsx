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
    <TooltipProvider>
      <div className="grid h-screen w-full ">
        <div className="flex flex-col flex-1 overflow-hidden  sm:pl-14">
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
