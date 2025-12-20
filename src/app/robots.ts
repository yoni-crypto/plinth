import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/settings/"],
      },
    ],
    sitemap: "https://github.com/yoni-crypto/plinth/sitemap.xml",
  };
}
