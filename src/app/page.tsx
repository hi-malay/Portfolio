"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

import {
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Zap,
  BarChart3,
  Rocket,
  FileSpreadsheet,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Experience = {
  company: string;
  role: string;
  period: string;
  icon: string;
  location: string;
  description: string;
  achievements: string[];
  image: string;
  technologies: string[];
  link: string;
};

type SkillGroup = {
  category: string;
  items: string[];
};

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<SkillGroup[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, skillRes] = await Promise.all([
          fetch(
            "https://raw.githubusercontent.com/hi-malay/portfolio-data/refs/heads/main/experience.json",
          ),
          fetch(
            "https://raw.githubusercontent.com/hi-malay/portfolio-data/refs/heads/main/skills.json",
          ),
        ]);

        const [expData, skillData] = await Promise.all([
          expRes.json(),
          skillRes.json(),
        ]);

        setExperiences(expData);
        setSkills(skillData);
        // Recalc ScrollTrigger positions after content changes page height
        requestAnimationFrame(() => ScrollTrigger.refresh());
      } catch (err) {
        console.error("Failed to fetch portfolio dataa:", err);
      }
    };

    fetchData();
  }, []);

  const iconMap: Record<string, React.ElementType> = {
    Menu,
    X,
    Github,
    Linkedin,
    Mail,
    ExternalLink,
    Zap,
    BarChart3,
    Rocket,
    FileSpreadsheet,
  };

  // Custom cursor with GSAP quickTo
  useEffect(() => {
    if (!cursorRef.current) return;
    const xTo = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.4,
      ease: "power3",
    });
    const yTo = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.4,
      ease: "power3",
    });

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  // Hero section animations
  useGSAP(
    () => {
      // Logo entrance (after splash clears)
      gsap.from(".logo-text", {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        delay: 2.6,
        ease: "back.out(1.7)",
      });

      // Nav links stagger
      gsap.from(".nav-link", {
        opacity: 0,
        y: -10,
        stagger: 0.1,
        duration: 0.5,
        delay: 2.7,
      });

      // Hero content — SplitText animations
      // Splash takes ~2.6s (2s thumbnail + 0.6s slide), start after it clears
      const heroTl = gsap.timeline({ delay: 2.8 });

      // Split the greeting part into words + chars (not the gradient name)
      const greetSplit = SplitText.create(".hero-greet", {
        type: "words,chars",
        mask: "words",
      });
      heroTl.from(greetSplit.chars, {
        yPercent: 120,
        stagger: 0.03,
        duration: 0.7,
        ease: "power4.out",
      });

      // Animate the gradient name as a whole (bg-clip-text breaks on char split)
      heroTl.from(
        ".hero-name",
        {
          yPercent: 120,
          opacity: 0,
          duration: 0.8,
          ease: "power4.out",
        },
        "-=0.4",
      );

      // Split description into lines with mask for yPercent clip
      const descSplit = SplitText.create(".hero-description", {
        type: "lines",
        mask: "lines",
      });
      heroTl.from(
        descSplit.lines,
        {
          yPercent: 100,
          stagger: 0.12,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.3",
      );

      // CTAs
      heroTl.fromTo(
        ".hero-cta",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3",
      );

      // Stat cards — staggered entrance + gentle float
      const statCards = gsap.utils.toArray<HTMLElement>(".stat-card");
      gsap.from(statCards, {
        opacity: 0,
        y: 60,
        scale: 0.85,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(1.4)",
        delay: 3.2,
      });

      statCards.forEach((card, idx) => {
        // Gentle float
        gsap.to(card, {
          y: -12,
          duration: 2.5 + idx * 0.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 3.6 + idx * 0.3,
        });

        // Glow pulse on the border
        gsap.to(card, {
          boxShadow:
            idx === 0
              ? "0 0 30px rgba(34,211,238,0.25)"
              : idx === 1
                ? "0 0 30px rgba(168,85,247,0.25)"
                : "0 0 30px rgba(52,211,153,0.25)",
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: idx * 0.5,
        });
      });
    },
    { scope: containerRef },
  );

  // Experience section animations (re-run when data loads)
  useGSAP(
    () => {
      if (experiences.length === 0) return;

      // Section title
      gsap.utils.toArray<HTMLElement>(".section-title").forEach((title) => {
        gsap.from(title, {
          scrollTrigger: {
            trigger: title,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 20,
          duration: 0.8,
        });
      });

      // Experience cards — stay visible until scrolled well past
      gsap.utils.toArray<HTMLElement>(".exp-card").forEach((card, idx) => {
        const fromX = idx % 2 === 0 ? -80 : 80;
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          x: fromX,
          duration: 0.8,
          ease: "power2.inOut",
        });
      });

      // Experience images
      gsap.utils.toArray<HTMLElement>(".exp-image").forEach((img) => {
        gsap.from(img, {
          scrollTrigger: {
            trigger: img,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          scale: 0.8,
          rotation: -10,
          duration: 0.8,
        });
      });

      // Experience details (descriptions, tech tags)
      gsap.utils.toArray<HTMLElement>(".exp-detail").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          duration: 0.6,
          delay: 0.2,
        });
      });

      // Icon rotation
      gsap.utils.toArray<HTMLElement>(".icon-spin").forEach((icon) => {
        gsap.to(icon, {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: "none",
        });
      });

      // Arrow pulse
      gsap.utils.toArray<HTMLElement>(".arrow-pulse").forEach((arrow, i) => {
        gsap.to(arrow, {
          x: 3,
          duration: 0.75,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.1,
        });
      });

      // External link icon pulse
      gsap.utils.toArray<HTMLElement>(".link-pulse").forEach((link) => {
        gsap.to(link, {
          x: 5,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: containerRef, dependencies: [experiences] },
  );

  // Skills section animations
  useGSAP(
    () => {
      if (skills.length === 0) return;

      // Reset any stale inline styles from previous runs
      gsap.set(".skill-card", { clearProps: "all" });
      gsap.set(".skill-category-title", { clearProps: "all" });
      gsap.set(".skill-tag", { clearProps: "all" });

      gsap.utils.toArray<HTMLElement>(".skill-card").forEach((card) => {
        const title = card.querySelector<HTMLElement>(".skill-category-title");
        const tags = card.querySelectorAll<HTMLElement>(".skill-tag");

        // Card entrance
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play reverse play reverse",
            },
          },
        );

        // Title slide in
        if (title) {
          gsap.fromTo(
            title,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
              },
            },
          );
        }

        // Tags stagger
        if (tags.length) {
          gsap.fromTo(
            tags,
            { opacity: 0, scale: 0.5, y: 10 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              stagger: 0.04,
              duration: 0.3,
              ease: "back.out(1.4)",
              scrollTrigger: {
                trigger: card,
                start: "top 82%",
                toggleActions: "play reverse play reverse",
              },
            },
          );
        }
      });
    },
    { scope: containerRef, dependencies: [skills] },
  );

  // Contact + footer animations — single timeline, one ScrollTrigger
  useGSAP(
    () => {
      // Contact: one timeline tied to the section trigger
      const contactTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".contact-section",
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      contactTl
        .fromTo(
          ".contact-wrapper",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        )
        .fromTo(
          ".contact-title",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.3",
        )
        .fromTo(
          ".contact-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.3",
        )
        .fromTo(
          ".contact-link",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.2",
        );

      // Background dots — runs independently
      gsap.to(".contact-bg-dots", {
        backgroundPositionX: "50px",
        backgroundPositionY: "50px",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Footer
      const footerTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".footer-section",
          start: "top 95%",
          toggleActions: "play none none none",
        },
      });
      footerTl.fromTo(
        ".footer-section",
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
      );

      gsap.to(".footer-text", {
        opacity: 0.5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef },
  );

  const stats = [
    { label: "Years Experience", value: "5+", delay: 0 },
    { label: "Technologies", value: "25+", delay: 0.2 },
    { label: "Projects Built", value: "30+", delay: 0.4 },
  ];

  return (
    <>
      <div
        ref={containerRef}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen overflow-hidden"
      >
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur z-50 border-b border-slate-700">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="logo-text text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer hover:scale-110 transition-transform">
              Malay
            </div>
            <div className="hidden md:flex gap-8">
              {["home", "experience", "skills", "contact", "resume"].map(
                (item) => (
                  <a
                    key={item}
                    href={
                      item === "resume"
                        ? "https://docs.google.com/document/d/1ooxRpsMKrawyWxY7ogWucUhPtU0PYjSdhW1NNqqBJys/edit?tab=t.0"
                        : `#${item}`
                    }
                    className="nav-link capitalize hover:text-cyan-400 transition relative group active:scale-95"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </a>
                ),
              )}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed top-16 left-0 right-0 bg-slate-800 md:hidden z-40 border-b border-slate-700 animate-slide-down">
            <div className="flex flex-col gap-4 p-4">
              {["home", "experience", "skills", "contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="capitalize hover:text-cyan-400"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section
          id="home"
          className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="hero-title text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="hero-greet">Hey, I&apos;m</span>{" "}
                <span className="hero-name inline-block overflow-hidden bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                  Malay Mishra
                </span>
              </h1>
              <p className="hero-description text-l text-slate-300 mb-8 leading-relaxed">
                Fullstack Engineer with 5+ years building high-performance
                systems. Delivered sub-second APIs, led major frontend revamps,
                and shipped AI-driven features. Passionate about performance,
                clean architecture, and mentoring engineers.
              </p>
              <div className="flex gap-4 flex-wrap">
                <a
                  href="mailto:hi.malay879@gmail.com"
                  className="hero-cta bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Get in Touch
                </a>
                <a
                  href="#experience"
                  className="hero-cta border border-cyan-400 text-cyan-400 px-8 py-3 rounded-lg font-semibold hover:bg-cyan-400/10 hover:scale-105 active:scale-95 transition-all"
                >
                  View My Work
                </a>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="flex flex-col gap-6 justify-center">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`stat-card flex items-center gap-5 bg-gradient-to-br ${
                    idx === 0
                      ? "from-blue-500/15 to-cyan-500/15 border-cyan-400/30"
                      : idx === 1
                        ? "from-purple-500/15 to-pink-500/15 border-purple-400/30"
                        : "from-green-500/15 to-emerald-500/15 border-green-400/30"
                  } rounded-2xl backdrop-blur-xl border p-6 hover:scale-[1.03] transition-transform duration-300`}
                >
                  <div
                    className={`text-4xl font-bold ${
                      idx === 0
                        ? "text-cyan-400"
                        : idx === 1
                          ? "text-purple-400"
                          : "text-emerald-400"
                    }`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-base text-slate-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section
          id="experience"
          className="py-40 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        >
          <h2 className="section-title text-4xl font-bold mb-16 text-center">
            Professional Experience
          </h2>
          <div className="space-y-12">
            {experiences.map((exp, idx) => {
              const Icon = iconMap[exp.icon] || ExternalLink;
              return (
                <div
                  key={idx}
                  className="exp-card grid md:grid-cols-2 gap-8 items-center"
                >
                  <div
                    className={`${
                      idx % 2 === 1 ? "md:order-2" : ""
                    } hidden md:block`}
                  >
                    <img
                      src={exp.image}
                      alt={exp.company}
                      className="exp-image rounded-xl shadow-2xl w-full object-cover h-80 hover:scale-105 hover:rotate-1 transition-transform duration-500"
                    />
                  </div>

                  <div className={`${idx % 2 === 1 ? "md:order-1" : ""}`}>
                    <div className="exp-detail bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600 rounded-xl p-8 hover:border-cyan-400/50 transition">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="icon-spin p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                          <Icon className="text-cyan-400" size={28} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-cyan-400">
                            {exp.company}
                          </h3>
                          <p className="text-lg text-slate-300">{exp.role}</p>
                          <p className="text-sm text-slate-400">
                            {exp.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-slate-400">
                          {exp.period}
                        </span>
                        <div className="link-pulse">
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink size={18} className="text-cyan-400" />
                          </a>
                        </div>
                      </div>

                      <p className="text-slate-300 mb-4 pb-4 border-b border-slate-600 text-sm leading-relaxed">
                        {exp.description}
                      </p>

                      <ul className="space-y-2 mb-4">
                        {exp.achievements.map((achievement, i) => (
                          <li
                            key={i}
                            className="text-slate-300 flex items-start gap-3 text-sm"
                          >
                            <span className="arrow-pulse text-cyan-400 mt-1 flex-shrink-0">
                              →
                            </span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-600">
                        {exp.technologies?.map((tech, i) => (
                          <span
                            key={i}
                            className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded hover:scale-105 transition-transform"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Skills Section */}
        <section
          id="skills"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        >
          <h2 className="section-title text-4xl font-bold mb-16 text-center">
            Technical Skills
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skillGroup, idx) => (
              <div
                key={idx}
                className="skill-card bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-cyan-400/30 rounded-xl p-6 hover:border-cyan-400/60 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(34,211,238,0.2)] transition-all duration-300"
              >
                <h3 className="skill-category-title text-xl font-bold text-cyan-400 mb-4">
                  {skillGroup.category}
                </h3>
                <div className="skill-tags-container flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, i) => (
                    <span
                      key={i}
                      className="skill-tag bg-slate-700/50 hover:bg-cyan-500/30 hover:scale-110 active:scale-95 px-3 py-1 rounded-full text-sm text-slate-200 transition-all cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="contact-section py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        >
          <div className="contact-wrapper bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-2xl p-12 text-center relative overflow-hidden">
            <div
              className="contact-bg-dots absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #0ea5e9 1px, transparent 1px)",
                backgroundSize: "50px 50px",
                backgroundPosition: "0% 0%",
              }}
            />

            <div className="relative z-10">
              <h2 className="contact-title text-4xl font-bold mb-6">
                Let&apos;s Work Together
              </h2>
              <p className="contact-subtitle text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                I&apos;m always interested in hearing about new projects and
                opportunities.
              </p>
              <div className="contact-links flex justify-center gap-8 flex-wrap">
                <a
                  href="mailto:hi.malay879@gmail.com"
                  className="contact-link flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all"
                >
                  <Mail size={20} /> Email Me
                </a>
                <a
                  href="https://www.linkedin.com/in/mmalay/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link flex items-center gap-2 border border-slate-400 px-8 py-3 rounded-lg font-semibold hover:border-cyan-400 hover:text-cyan-400 hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all"
                >
                  <Linkedin size={20} /> LinkedIn
                </a>
                <a
                  href="https://github.com/hi-malay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link flex items-center gap-2 border border-slate-400 px-8 py-3 rounded-lg font-semibold hover:border-cyan-400 hover:text-cyan-400 hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all"
                >
                  <Github size={20} /> GitHub
                </a>
                <a
                  href="https://docs.google.com/document/d/1ooxRpsMKrawyWxY7ogWucUhPtU0PYjSdhW1NNqqBJys/edit?tab=t.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link flex items-center gap-2 border border-slate-400 px-8 py-3 rounded-lg font-semibold hover:border-cyan-400 hover:text-cyan-400 hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all"
                >
                  <FileSpreadsheet size={20} /> Resume
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer-section py-8 px-4 text-center text-slate-400 border-t border-slate-700">
          <p className="footer-text">
            © 2025 Malay Mishra. Crafted with React & GSAP.
          </p>
        </footer>

        {/* Custom cursor */}
        <div
          ref={cursorRef}
          className="hidden md:block fixed top-0 left-0 w-6 h-6 bg-cyan-400/50 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        />
      </div>
    </>
  );
}
