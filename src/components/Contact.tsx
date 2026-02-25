"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Github, Linkedin, Mail, FileText } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const isMobile = window.innerWidth <= 768;

    gsap.fromTo(".contact-anim",
      { y: isMobile ? 50 : 100, opacity: 0 },
      {
        y: 0, opacity: 1,
        stagger: 0.1,
        duration: isMobile ? 1 : 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: container.current,
          start: isMobile ? "top 90%" : "top 75%",
          toggleActions: "play none none none"
        }
      }
    );

    gsap.fromTo(".social-link",
      { scale: 0, opacity: 0 },
      {
        scale: 1, opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: container.current,
          start: isMobile ? "top 60%" : "top 40%",
          toggleActions: "play none none none"
        }
      }
    );
  }, { scope: container });

  return (
    <section 
      id="contact" 
      ref={container} 
      className="mt-16 sm:mt-32 pt-16 sm:pt-32 pb-12 bg-foreground text-background rounded-t-4xl md:rounded-t-[5xl] overflow-hidden relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
    >
      <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-between min-h-[60vh]">
        
        <div className="mb-20">
          <h2 className="contact-anim text-4xl sm:text-8xl md:text-[9rem] font-black tracking-tighter leading-[0.9] mb-12">
            LET'S <br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-background hover:to-accent transition-all duration-700 cursor-default">COLLABORATE.</span>
          </h2>
          
          <div className="contact-anim inline-block relative group mt-8">
            <a href="mailto:hi.malay879@gmail.com" className="flex items-center gap-2 sm:gap-4 text-lg sm:text-2xl md:text-5xl font-light hover:text-accent transition-colors pb-4 border-b-2 border-background/20 hover:border-accent break-all sm:break-normal">
              <span>hi.malay879@gmail.com</span>
              <div className="bg-background text-foreground p-2 sm:p-3 rounded-full group-hover:bg-accent group-hover:text-background transition-colors origin-center group-hover:rotate-45 duration-300 shrink-0">
                <ArrowUpRight strokeWidth={1.5} className="w-5 h-5 sm:w-8 sm:h-8" />
              </div>
            </a>
          </div>
        </div>

        <div className="social-container flex flex-col md:flex-row justify-between items-center gap-12 text-background/60 text-sm font-medium pt-12 border-t border-background/10 font-mono uppercase tracking-widest mt-auto">
          <div className="flex gap-4 sm:gap-8 flex-wrap justify-center">
            <a href="https://linkedin.com/in/mmalay/" target="_blank" rel="noreferrer" className="social-link magnetic-wrap group flex items-center gap-2 hover:text-accent transition-colors p-3 bg-background/5 rounded-full hover:bg-background/10 border border-background/5 hover:border-accent/30">
              <Linkedin size={18} />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <a href="https://github.com/hi-malay" target="_blank" rel="noreferrer" className="social-link magnetic-wrap group flex items-center gap-2 hover:text-accent transition-colors p-3 bg-background/5 rounded-full hover:bg-background/10 border border-background/5 hover:border-accent/30">
              <Github size={18} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a href="https://docs.google.com/document/d/1ooxRpsMKrawyWxY7ogWucUhPtU0PYjSdhW1NNqqBJys/edit?tab=t.0" target="_blank" rel="noreferrer" className="social-link magnetic-wrap group flex items-center gap-2 hover:text-accent transition-colors p-3 bg-background/5 rounded-full hover:bg-background/10 border border-background/5 hover:border-accent/30">
              <FileText size={18} />
              <span className="hidden sm:inline">Resume</span>
            </a>
          </div>
          <div className="social-link text-center md:text-right flex items-center gap-2">
            © {new Date().getFullYear()} <span className="text-background font-bold tracking-normal text-lg ml-2 font-sans">Malay Mishra</span>
          </div>
        </div>
      </div>
    </section>
  );
}
