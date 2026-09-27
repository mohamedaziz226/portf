import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import {
  About,
  Achievements,
  Contact,
  Education,
  Experience,
  Projects,
  Skills,
} from "@/components/sections";
import { BackToTop, ScrollProgress } from "@/components/ui";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900"
      >
        Skip to content
      </a>

      <ScrollProgress />
      <Navbar />

      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Achievements />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
