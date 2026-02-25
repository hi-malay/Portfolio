import CustomCursor from "@/components/CustomCursor";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import SmoothScroller from "@/components/SmoothScroller";

async function getData() {
  try {
    const [expRes, skillRes] = await Promise.all([
      fetch(
        "https://raw.githubusercontent.com/hi-malay/portfolio-data/refs/heads/main/experience.json",
        { next: { revalidate: 3600 } }
      ),
      fetch(
        "https://raw.githubusercontent.com/hi-malay/portfolio-data/refs/heads/main/skills.json",
        { next: { revalidate: 3600 } }
      ),
    ]);

    const experiences = await expRes.json();
    const skills = await skillRes.json();

    return { experiences, skills };
  } catch (err) {
    console.error("Failed to fetch portfolio data:", err);
    return { experiences: [], skills: [] };
  }
}

export default async function Page() {
  const { experiences, skills } = await getData();

  return (
    <main className="bg-background text-foreground min-h-screen selection:bg-accent/30 selection:text-foreground relative">
      <SmoothScroller />
      <CustomCursor />

      {/* Navigation Layer */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:p-10 flex justify-between items-center mix-blend-difference pointer-events-none">
        <div className="font-bold text-xl md:text-2xl tracking-tighter text-white">
          MALAY
        </div>
        <div className="gap-6 font-mono text-sm tracking-widest uppercase pointer-events-none max-md:hidden flex text-white opacity-80">
          <span>Engineer</span>
          <span>Architect</span>
          <span>Creator</span>
        </div>
      </nav>

      <Hero />
      <Experience experiences={experiences} />
      <Skills skills={skills} />
      <Contact />
    </main>
  );
}
