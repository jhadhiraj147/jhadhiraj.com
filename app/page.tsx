import PhotoBackdrop from "@/components/ui/PhotoBackdrop";
import Hero from "@/components/sections/Hero";
import { personal } from "@/lib/data";

export default function Home() {
  return (
    <>
      <PhotoBackdrop />
      <noscript>
        <style>{`body { overflow: auto; } .terminal-shell { height: auto; min-height: 100dvh; } .terminal-input-area { display: none; }`}</style>
        <div className="relative z-20 border-b border-accent/25 bg-page px-4 py-3 text-slate-900">
          Terminal commands need JavaScript. You can still{" "}
          <a className="tty-link" href="/assets/resume/resume_jhadhiraj147.pdf" download>download my resume</a>{" "}
          or <a className="tty-link" href={`mailto:${personal.email}`}>email me</a>.
        </div>
      </noscript>
      <main className="relative z-10">
        <Hero />
      </main>
    </>
  );
}
