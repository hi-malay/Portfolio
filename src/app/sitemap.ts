import { MetadataRoute } from "next";

import { SITE as baseUrl } from "@/data/links";

// Section anchors mirror the [data-stage] sections rendered by the landing page.
const sections: { anchor: string; priority: number }[] = [
  { anchor: "hero", priority: 0.9 },
  { anchor: "about", priority: 0.8 },
  { anchor: "work", priority: 0.8 },
  { anchor: "skills", priority: 0.7 },
  { anchor: "impact", priority: 0.7 },
  { anchor: "focus", priority: 0.7 },
  { anchor: "contact", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...sections.map(({ anchor, priority }) => ({
      url: `${baseUrl}/#${anchor}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    })),
  ];
}
