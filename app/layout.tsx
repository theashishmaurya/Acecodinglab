import { SandPackCSS } from "@/components/codeEditor/sandpack-styles";
import "./globals.css";
import { Inter as FontSans } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"




import { cn } from "@/lib/utils"
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})


export const metadata = {
  title: "JSCodeLabs",
  description: "Your go-to platform for mastering frontend coding and system design, with real-world practice and interview simulations that lead to success.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
       <html lang="en" suppressHydrationWarning className="dark">
      <head />
      
        <SandPackCSS />
      
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >{children}
      <Analytics/>
      </body>
    </html>
  );
}
