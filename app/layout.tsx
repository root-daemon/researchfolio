import type { Metadata } from "next";
import { JetBrains_Mono, VT323 } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import PageTransition from "@/components/providers/PageTransition";
import Preloader from "@/components/ui/Preloader";
import Cursor from "@/components/ui/Cursor";
import Nav from "@/components/ui/Nav";
import "./globals.css";

const display = VT323({ subsets: ["latin"], variable: "--font-display", weight: "400" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Srivishal Sivasubramanian, Lead Engineer",
  description: "Video pipelines, meeting bots, scrapers and small Mac apps. Portfolio of Srivishal Sivasubramanian.",
};

// Before paint: restore the saved phosphor theme (older visits stored "light"/"dark"), and
// hide the boot screen if it already ran this session so it never flashes on reload.
const themeScript = `try{var d=document.documentElement,t=localStorage.getItem('theme');if(t==='light')t='paper';if(t==='amber'||t==='paper')d.dataset.theme=t;if(sessionStorage.getItem('booted')==='1')d.classList.add('booted')}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} is-loading`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SmoothScroll>
          <Preloader />
          <PageTransition>
            <Nav />
            <div id="page">{children}</div>
          </PageTransition>
          <Cursor />
          <div className="crt" aria-hidden />
        </SmoothScroll>
      </body>
    </html>
  );
}
