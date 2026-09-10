import PhotoBackdrop from "@/components/ui/PhotoBackdrop";
import SoundProvider from "@/components/ui/SoundProvider";
import Navbar        from "@/components/layout/Navbar";
import Hero          from "@/components/sections/Hero";
import About         from "@/components/sections/About";
import Skills        from "@/components/sections/Skills";
import Experience    from "@/components/sections/Experience";
import Projects      from "@/components/sections/Projects";
import Flashfs       from "@/components/sections/Flashfs";
import Education     from "@/components/sections/Education";
import PersonalFacts from "@/components/sections/PersonalFacts";
import Offtofly      from "@/components/sections/Offtofly";
import Contact       from "@/components/sections/Contact";
import Footer        from "@/components/sections/Footer";

export default function Home() {
  return (
    <SoundProvider>
      <PhotoBackdrop />
      <Navbar />
      <main className="relative z-10 overflow-x-hidden">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Flashfs />
        <Projects />
        <Education />
        <PersonalFacts />
        <Offtofly />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </SoundProvider>
  );
}
