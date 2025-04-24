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
    sitemap: "https://www.quiznote.co.kr/sitemap.xml",
    host: "https://www.quiznote.co.kr",
  };
}
