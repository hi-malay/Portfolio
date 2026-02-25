"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type SkillGroup = {
  category: string;
  items: string[];
};

export default function Skills({ skills }: { skills: SkillGroup[] }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!skills.length) return;

    gsap.fromTo(".skill-category",
      { y: 100, opacity: 0, rotateX: -10 },
      {
        y: 0, opacity: 1, rotateX: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".skills-grid",
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.utils.toArray(".skill-pill").forEach((pill: any) => {
      gsap.fromTo(pill,
        { scale: 0.5, opacity: 0, y: 20 },
        {
          scale: 1, opacity: 1, y: 0,
          duration: 0.8,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: pill,
            start: "top 95%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

  }, { scope: container, dependencies: [skills] });

  return (
    <section id="skills" ref={container} className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      <div className="mb-24 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Technical Skills</h2>
      </div>

      <div className="skills-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((group, idx) => (
          <div key={idx} className="skill-category relative group rounded-3xl p-8 bg-foreground/2 border border-foreground/5 hover:bg-foreground/4 transition-colors duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-[60px] group-hover:bg-accent/30 transition-colors duration-700 -translate-y-1/2 translate-x-1/2" />
            
            <h4 className="text-2xl font-bold mb-8 text-foreground/90 group-hover:text-accent transition-colors duration-300 relative z-10 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              {group.category}
            </h4>
            
            <div className="flex flex-wrap gap-3 relative z-10">
              {group.items.map((skill, i) => (
                <div key={i} className="skill-pill magnetic-wrap">
                  <span className="block px-4 py-2 bg-foreground/5 hover:bg-accent hover:text-background border border-foreground/10 rounded-full font-medium text-sm text-foreground/80 transition-all duration-300 cursor-default shadow-sm hover:shadow-accent/40 hover:-translate-y-1">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
