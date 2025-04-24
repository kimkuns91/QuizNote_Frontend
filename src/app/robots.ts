import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing", "/support"],
        disallow: ["/api/*", "/dashboard/*", "/lectures/*"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 2,
      },
    ],
    sitemap: "https://quiz-note-frontend.vercel.app/sitemap.xml",
    host: "https://quiz-note-frontend.vercel.app",
  };
}
