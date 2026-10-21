import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Experience from "@/components/sections/Experience";
import OpenSource from "@/components/sections/OpenSource";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Work />
      <Experience />
      <OpenSource />
      <Contact />
    </main>
  );
}
