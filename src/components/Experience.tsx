"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ExternalLink, Briefcase } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ExperienceProps = {
  experiences: any[];
};

export default function Experience({ experiences }: ExperienceProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!experiences.length) return;

    const cards = gsap.utils.toArray(".exp-card");
    
    cards.forEach((card: any, i) => {
      gsap.fromTo(card, 
        { opacity: 0, y: 100, rotateX: -5 },
        {
          opacity: 1, 
          y: 0, 
          rotateX: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Timeline line drawing
    gsap.fromTo(".timeline-line", 
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top center",
          end: "bottom center",
          scrub: true
        }
      }
    );

    gsap.utils.toArray(".timeline-dot").forEach((dot: any) => {
      gsap.fromTo(dot, 
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 0.5,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: dot,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

  }, { scope: container, dependencies: [experiences] });

  return (
    <section id="experience" ref={container} className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative cursor-default">
      <div className="mb-32 relative text-center">
        <h2 className="text-4xl md:text-5xl font-bold relative z-10 tracking-tight">Professional Experience</h2>
      </div>

      <div className="timeline-container relative pl-8 md:pl-0 mt-20">
        {/* Central Timeline Line for Desktop, Left for Mobile */}
        <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-[2px] bg-foreground/10 origin-top flex align-center justify-center">
            <div className="timeline-line w-full h-full bg-linear-to-b from-accent/50 via-accent to-purple-500/50 origin-top" />
        </div>

        <div className="space-y-32">
          {experiences.map((exp, idx) => (
            <div key={idx} className={`exp-card relative flex flex-col md:flex-row gap-8 md:gap-16 items-start ${idx % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
              
              {/* Timeline Dot */}
              <div className="timeline-dot absolute left-[-41px] md:left-1/2 md:-ml-[24px] w-12 h-12 rounded-full bg-background border-2 border-accent flex items-center justify-center z-10 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                <Briefcase size={20} className="text-accent" />
              </div>

              {/* Content Side */}
              <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? "md:pl-16 text-left" : "md:pr-16 md:text-right"}`}>
                <div className="bg-foreground/2 border border-foreground/10 p-8 md:p-10 rounded-3xl backdrop-blur-md hover:bg-foreground/4 hover:border-accent/30 transition-all duration-500 group relative overflow-hidden">
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className={`flex items-center gap-4 mb-4 ${idx % 2 === 0 ? "" : "md:justify-end"}`}>
                      <span className="text-xs font-mono tracking-wider text-accent bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20">
                        {exp.period}
                      </span>
                    </div>
                    <h4 className="text-3xl font-bold mb-2 group-hover:text-accent transition-colors duration-300">{exp.company}</h4>
                    <h5 className="text-xl text-foreground/70 mb-6 font-medium tracking-wide">{exp.role} <span className="text-foreground/40 text-sm ml-2">| {exp.location}</span></h5>
                    
                    <p className="text-foreground/60 text-base leading-relaxed mb-8">
                      {exp.description}
                    </p>

                    <ul className={`space-y-3 mb-8 text-sm text-foreground/80 ${idx % 2 === 0 ? "" : "md:text-right inline-block w-full"}`}>
                      {exp.achievements.map((ach: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 justify-start md:justify-end">
                          <span className={`text-accent mt-1 shrink-0 ${idx % 2 === 0 ? "block" : "md:hidden block"}`}>→</span>
                          <span className="text-left max-w-lg">{ach}</span>
                          <span className={`text-accent mt-1 shrink-0 hidden ${idx % 2 === 0 ? "" : "md:block"}`}>←</span>
                        </li>
                      ))}
                    </ul>

                    <div className={`flex flex-wrap gap-2 ${idx % 2 === 0 ? "" : "md:justify-end"}`}>
                      {exp.technologies?.map((tech: string, i: number) => (
                        <span key={i} className="text-xs font-medium bg-foreground/10 px-3 py-1.5 rounded-lg text-foreground/80 border border-foreground/5 pointer-events-none">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Side */}
              <div className={`hidden md:block w-1/2 ${idx % 2 === 0 ? "pr-16" : "pl-16"}`}>
                <div className="relative w-full h-[450px] rounded-3xl overflow-hidden group">
                  <div className="absolute inset-0 bg-accent/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10 opacity-60" />
                  <img src={exp.image} alt={exp.company} className="w-full h-full object-cover filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                  
                  {exp.link && (
                    <a href={exp.link} target="_blank" rel="noopener noreferrer" className="magnetic-wrap absolute bottom-8 right-8 z-20 w-14 h-14 bg-background/90 backdrop-blur-sm border border-foreground/10 text-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent hover:text-background hover:scale-110 translate-y-4 group-hover:translate-y-0">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
