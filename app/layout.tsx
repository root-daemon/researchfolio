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

// Restore the saved phosphor theme before paint. Older visits stored "light"/"dark".
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light')t='paper';if(t==='amber'||t==='paper')document.documentElement.dataset.theme=t}catch(e){}`;

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
