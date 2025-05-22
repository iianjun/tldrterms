import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/terms", "/privacy"],
      disallow: [
        "/login",
        "/signup",
        "/account",
        "/reset-password",
        "/forgot-password",
        "/analytics",
      ],
    },
    sitemap: "https://tldrterms.app/sitemap.xml",
  };
}
