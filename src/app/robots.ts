import { MetadataRoute } from "next";

import { SITE } from "@/data/links";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
