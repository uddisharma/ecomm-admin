import { MainDomain } from "@/constants";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/order"],
    },
    sitemap: `${MainDomain}/sitemap.xml`,
  };
}
