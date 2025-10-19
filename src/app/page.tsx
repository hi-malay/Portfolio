"use client";
import { useState, useEffect } from "react";
import { easeInOut, easeOut, motion } from "framer-motion";
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
  Book,
} from "lucide-react";

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // SEO Meta tags
  useEffect(() => {
    document.title =
      "Malay Mishra - Fullstack Engineer | React, Next.js, Node.js Developer in Bangalore";

    const metaTags = [
      {
        name: "description",
        content:
          "Fullstack Engineer with 4+ years of experience in React, Next.js, Node.js. Python, GO, Flask, Specialized in Micro Frontend, Performance Optimization, and Web Development. Based in Bangalore.",
      },
      {
        name: "keywords",
        content:
          "Fullstack Developer, React Developer, Next.js, Node.js, Frontend Engineer, Backend Developer, Bangalore, Web Developer, JavaScript, TypeScript, Malay Mishra",
      },
      { name: "author", content: "Malay Mishra" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { property: "og:title", content: "Malay Mishra - Fullstack Engineer" },
      {
        property: "og:description",
        content:
          "Expert in building high-performance full stack applications with React, Next.js, flask, GO, Python, and Node.js",
      },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop",
      },
      { property: "og:url", content: "https://malaymishra.dev" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Malay Mishra - Fullstack Engineer" },
      {
        name: "twitter:description",
        content: "Fullstack Developer specialized in React, Next.js, Node.js",
      },
    ];

    metaTags.forEach((tag) => {
      let element = document.querySelector(
        `meta[${Object.keys(tag)[0]}="${Object.values(tag)[0]}"]`
      );
      if (!element) {
        element = document.createElement("meta");
        Object.entries(tag).forEach(([key, value]) => {
          element?.setAttribute(key, value);
        });
        document.head.appendChild(element);
      }
    });

    // Structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Malay Mishra",
      url: "https://malaymishra.dev",
      jobTitle: "Fullstack Engineer",
      sameAs: [
        "https://linkedin.com/in/malay-mishra",
        "https://github.com/malay879",
      ],
      email: "hi.malay879@gmail.com",
      telephone: "+918107680129",
      worksFor: [
        {
          "@type": "Organization",
          name: "PLIVO",
          position: "SDE | Founding Team",
        },
      ],
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easeOut },
    },
  };

  const slideInVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: easeInOut },
    },
  };

  const slideInRightVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: easeOut },
    },
  };

  const scaleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: easeOut },
    },
  };

  const skills = [
    {
      category: "Frontend",
      items: [
        "React Js",
        "Next Js",
        "Vue Js",
        "TypeScript",
        "Redux",
        "Angular Js",
        "Tailwind CSS",
      ],
    },
    {
      category: "Backend",
      items: ["Node Js", "Python", "Flask", "Django", "GraphQL", "Express"],
    },
    { category: "Mobile", items: ["React Native", "Electron JS"] },
    {
      category: "DevOps & Tools",
      items: [
        "AWS",
        "CI/CD",
        "Docker",
        "Webpack/Vite",
        "Bun JS",
        "Monorepo Lerna",
      ],
    },
    { category: "Databases", items: ["PostgreSQL", "MongoDB", "Firebase"] },
    {
      category: "Other",
      items: [
        "Microfrontend",
        "GraphQL",
        "C++",
        "Go",
        "Storybook",
        "Jest",
        "Testing",
      ],
    },
  ];

  const experiences = [
    {
      company: "PLIVO (Contacto)",
      role: "SDE | Founding Team",
      period: "06/2022 - Present",
      icon: Rocket,
      location: "Bangalore, KA",
      description:
        "Contacto is a product solution that enables businesses to set up their contact center with a few button clicks and drag and drop functionality.",
      achievements: [
        "Converted Electron.js desktop app to web with 50% speed improvement using WebSockets and BroadcastListeners for real-time communication",
        "Migrated Create React App (CRA) to Vite: 2x dev time reduction, 4x faster builds with Rollup",
        "Independently led development of Email and WhatsApp channels, Agent Monitoring, and Barging features, attracting 4 customers",
        "Developed UI component library using Storybook and Material UI, integrated LogRocket logging and test automation pipeline reducing bugs by 40%",
        "Implemented advanced browser features for seamless real-time communication without platform switching or multiple logins",
      ],
      image: "./portfolio1.jpeg",
      technologies: [
        "React",
        "Vite",
        "WebSockets",
        "Storybook",
        "Material UI",
        "TypeScript",
        "Node.js",
      ],
    },
    {
      company: "KREDX",
      role: "SDE",
      period: "06/2021 - 06/2022",
      icon: BarChart3,
      location: "Bangalore, KA",
      description:
        "Designed and developed critical components for fintech vendor onboarding platform using micro frontend architecture.",
      achievements: [
        "Integrated single SPA package for Micro FrontEnd architecture reducing deployment time by 60%",
        "Enabled independent feature development by multiple developers simultaneously with isolated deployments",
        "Designed server-driven forms that dynamically adapt to backend response for flexible vendor onboarding",
        "Developed central document upload module with maker-checker functionality for team-wide reusability",
        "Implemented GraphQL code generator for auto-generating types, reducing buggy code in production",
        "Achieved 60% test coverage across entire Capvel repository with comprehensive unit and integration tests",
      ],
      image: "./portfolio2.jpeg",
      technologies: [
        "React",
        "Micro Frontend",
        "GraphQL",
        "JavaScript",
        "Jest",
        "Single SPA",
      ],
    },
    {
      company: "GOODHEALTH",
      role: "SDE | Founding Team",
      period: "05/2020 - 04/2021",
      icon: Zap,
      location: "Bangalore, KA",
      description:
        "Built and optimized high-performance healthcare platform website with focus on UX and accessibility.",
      achievements: [
        "Created entire website from scratch using Ant Design component library with modern UI/UX",
        "Optimized user experience with lazy loading, progressive image loading, and Brotli asset compression",
        "Implemented parallax effects and animated UI for attractive and engaging user interactions",
        "Ensured device accessibility and PWA requirements for cross-device compatibility",
        "Achieved optimal performance metrics with 50% reduction in page load times",
        "Implemented responsive design supporting all modern devices and screen sizes",
      ],
      image: "./portfolio3.jpeg",
      technologies: [
        "React",
        "Ant Design",
        "PWA",
        "CSS",
        "JavaScript",
        "Web Performance",
      ],
    },
  ];

  const stats = [
    { label: "Years Experience", value: "4+", delay: 0 },
    { label: "Technologies", value: "25+", delay: 0.2 },
    { label: "Projects Built", value: "30+", delay: 0.4 },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen overflow-hidden">
      {/* Navigation */}
      <motion.nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur z-50 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer"
          >
            Malay
          </motion.div>
          <div className="hidden md:flex gap-8">
            {["home", "experience", "skills", "contact"].map((item) => (
              <motion.a
                key={item}
                href={`#${item}`}
                className="capitalize hover:text-cyan-400 transition relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 left-0 right-0 bg-slate-800 md:hidden z-40 border-b border-slate-700"
        >
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
        </motion.div>
      )}

      {/* Hero Section */}
      <motion.section
        id="home"
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={slideInVariants}>
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Hey, I&apos;m{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Malay Mishra
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-300 mb-8 leading-relaxed"
            >
              Fullstack Engineer with 4+ years building impactful digital
              experiences. Passionate about performance optimization and
              mentoring teams.
            </motion.p>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex gap-4 flex-wrap"
            >
              <motion.a
                href="mailto:hi.malay879@gmail.com"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Get in Touch
              </motion.a>
              <motion.a
                href="#experience"
                whileHover={{ scale: 1.05, borderColor: "#06b6d4" }}
                whileTap={{ scale: 0.95 }}
                className="border border-cyan-400 text-cyan-400 px-8 py-3 rounded-lg font-semibold hover:bg-cyan-400/10 transition"
              >
                View My Work
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Animated Cards with Images */}
          <motion.div className="relative h-96">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 0 }}
                animate={{ y: [50, -5, 50] }}
                transition={{
                  duration: 3 + idx * 0.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: stat.delay,
                }}
                className={`absolute inset-0 ${
                  idx === 0
                    ? "translate-y-0 translate-x-0"
                    : idx === 1
                    ? "translate-y-20 translate-x-8"
                    : "translate-y-40 translate-x-4"
                } bg-gradient-to-br ${
                  idx === 0
                    ? "from-blue-500/20 to-cyan-500/20"
                    : idx === 1
                    ? "from-purple-500/20 to-pink-500/20"
                    : "from-green-500/20 to-emerald-500/20"
                } rounded-2xl backdrop-blur-xl border ${
                  idx === 0
                    ? "border-cyan-400/30"
                    : idx === 1
                    ? "border-purple-400/30"
                    : "border-green-400/30"
                } p-8 flex-col justify-center`}
              >
                <motion.div className="text-5xl font-bold mb-2">
                  {stat.value}
                </motion.div>
                <motion.div className="text-lg text-slate-300">
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Experience Section with Images */}
      <motion.section
        id="experience"
        className="py-40 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-4xl font-bold mb-16 text-center"
        >
          Professional Experience
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="space-y-12"
        >
          {experiences.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <motion.div
                key={idx}
                variants={
                  idx % 2 === 0 ? slideInVariants : slideInRightVariants
                }
                className="grid md:grid-cols-2 gap-8 items-center"
              >
                <div className={`${idx % 2 === 1 ? "md:order-2" : ""}`}>
                  <motion.img
                    src={exp.image}
                    alt={exp.company}
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: false, amount: 0.2 }}
                    className="rounded-xl shadow-2xl w-full object-cover h-80"
                  />
                </div>

                <div className={`${idx % 2 === 1 ? "md:order-1" : ""}`}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: false, amount: 0.2 }}
                    className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600 rounded-xl p-8 hover:border-cyan-400/50 transition"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: false, amount: 0.2 }}
                      className="flex items-center gap-4 mb-4"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity }}
                        className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg"
                      >
                        <Icon className="text-cyan-400" size={28} />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold text-cyan-400">
                          {exp.company}
                        </h3>
                        <p className="text-lg text-slate-300">{exp.role}</p>
                        <p className="text-sm text-slate-400">{exp.location}</p>
                      </div>
                    </motion.div>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-slate-400">
                        {exp.period}
                      </span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <ExternalLink size={18} className="text-cyan-400" />
                      </motion.div>
                    </div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: false, amount: 0.2 }}
                      className="text-slate-300 mb-4 pb-4 border-b border-slate-600 text-sm leading-relaxed"
                    >
                      {exp.description}
                    </motion.p>

                    <motion.ul
                      variants={containerVariants}
                      className="space-y-2 mb-4"
                    >
                      {exp.achievements.map((achievement, i) => (
                        <motion.li
                          key={i}
                          variants={itemVariants}
                          className="text-slate-300 flex items-start gap-3 text-sm"
                        >
                          <motion.span
                            animate={{ x: [0, 3, 0] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                            className="text-cyan-400 mt-1 flex-shrink-0"
                          >
                            →
                          </motion.span>
                          <span>{achievement}</span>
                        </motion.li>
                      ))}
                    </motion.ul>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      viewport={{ once: false, amount: 0.2 }}
                      className="flex flex-wrap gap-2 pt-4 border-t border-slate-600"
                    >
                      {exp.technologies?.map((tech, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Skills Section with Enhanced Animation */}
      <motion.section
        id="skills"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-4xl font-bold mb-16 text-center"
        >
          Technical Skills
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {skills.map((skillGroup, idx) => (
            <motion.div
              key={idx}
              variants={scaleVariants}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px rgba(34, 211, 238, 0.2)",
              }}
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-cyan-400/30 rounded-xl p-6 hover:border-cyan-400/60 transition"
            >
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: false, amount: 0.2 }}
                className="text-xl font-bold text-cyan-400 mb-4"
              >
                {skillGroup.category}
              </motion.h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="flex flex-wrap gap-2"
              >
                {skillGroup.items.map((skill, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, scale: 0 },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        transition: { delay: i * 0.05 },
                      },
                    }}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(34, 211, 238, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-slate-700/50 hover:bg-slate-600/50 px-3 py-1 rounded-full text-sm text-slate-200 transition cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.2 }}
          className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-2xl p-12 text-center relative overflow-hidden"
        >
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, #0ea5e9 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          <motion.div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, amount: 0.2 }}
              className="text-4xl font-bold mb-6"
            >
              Let&apos;s Work Together
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false, amount: 0.2 }}
              className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto"
            >
              I&apos;m always interested in hearing about new projects and
              opportunities.
            </motion.p>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="flex justify-center gap-8 flex-wrap"
            >
              <motion.a
                href="mailto:hi.malay879@gmail.com"
                variants={itemVariants}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition"
              >
                <Mail size={20} /> Email Me
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/malay-mishra-34a914143/"
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 border border-slate-400 px-8 py-3 rounded-lg font-semibold hover:border-cyan-400 hover:text-cyan-400 transition"
              >
                <Linkedin size={20} /> LinkedIn
              </motion.a>
              <motion.a
                href="https://github.com/hi-malay"
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 border border-slate-400 px-8 py-3 rounded-lg font-semibold hover:border-cyan-400 hover:text-cyan-400 transition"
              >
                <Github size={20} /> GitHub
              </motion.a>
              <motion.a
                href="https://docs.google.com/document/d/1ooxRpsMKrawyWxY7ogWucUhPtU0PYjSdhW1NNqqBJys/edit?tab=t.0"
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 border border-slate-400 px-8 py-3 rounded-lg font-semibold hover:border-cyan-400 hover:text-cyan-400 transition"
              >
                <Book size={20} /> Docs
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.2 }}
        className="py-8 px-4 text-center text-slate-400 border-t border-slate-700"
      >
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          © 2025 Malay Mishra. Crafted with React & Framer Motion.
        </motion.p>
      </motion.footer>
    </div>
  );
}
