import { canonicalSocial, SITE } from "@/data/links";

export default function Schema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Malay Mishra",
    alternateName: ["Malay", "Malay Mishra Fullstack"],
    jobTitle: "Fullstack Engineer",
    description:
      "Fullstack Engineer with 5+ years of experience in Python, GO, React, Next.js, Node.js. Specialized in Micro Frontend, Performance Optimization, and Web Development.",
    url: SITE,
    image: `${SITE}/thumbnail_cropped.png`,
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
    // Canonical profile URLs, not the vanity subdomains — a redirect hop
    // weakens entity resolution.
    sameAs: canonicalSocial,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
