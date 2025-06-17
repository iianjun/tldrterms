import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastmod = new Date().toISOString();
  return [
    {
      url: "https://www.tldrterms.app",
      lastModified: lastmod,
    },
    {
      url: "https://www.tldrterms.app/terms",
      lastModified: lastmod,
    },
    {
      url: "https://www.tldrterms.app/privacy",
      lastModified: lastmod,
    },
  ];
}
