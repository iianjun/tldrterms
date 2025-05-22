import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastmod = new Date().toISOString();
  return [
    {
      url: "https://tldrterms.app",
      lastModified: lastmod,
    },
    {
      url: "https://tldrterms.app/terms",
      lastModified: lastmod,
    },
    {
      url: "https://tldrterms.app/privacy",
      lastModified: lastmod,
    },
  ];
}
