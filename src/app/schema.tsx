export default function Schema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Malay Mishra",
    alternateName: ["Malay", "Malay Mishra Fullstack"],
    jobTitle: "Fullstack Engineer",
    description:
      "Fullstack Engineer with 4+ years of experience in Python, GO, React, Next.js, Node.js. Specialized in Micro Frontend, Performance Optimization, and Web Development.",
    url: "https://malaymishra.com",
    image: "https://malaymishra.com/thumbnail_cropped.png",
    worksFor: {
      "@type": "Organization",
      name: "AdeptMind",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    knowsAbout: [
      "Python",
      "GO",
      "React",
      "Next.js",
      "Node.js",
      "Micro Frontend",
      "Performance Optimization",
      "Web Development",
      "Fullstack Development",
      "Software Engineering",
    ],
    sameAs: [
      // Add your social media profiles here
      // "https://linkedin.com/in/yourprofile",
      // "https://github.com/yourusername",
      // "https://twitter.com/yourhandle",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
