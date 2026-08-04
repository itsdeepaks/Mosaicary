import type { MetadataRoute } from "next";

import { getPublishedCollections } from "@/lib/collections";
import { getAllSourceProfiles } from "@/lib/source-profiles";

function siteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) return `https://${vercelProduction.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  const staticRoutes = [
    "",
    "/resources",
    "/collections",
    "/saved",
    "/boards",
    "/about",
    "/curation",
    "/privacy",
    "/terms",
    "/content-policy",
  ];

  return [
    ...staticRoutes.map((route) => ({ url: `${origin}${route}` })),
    ...getPublishedCollections().map((collection) => ({
      url: `${origin}/collections/${collection.slug}`,
    })),
    ...getAllSourceProfiles().map((profile) => ({
      url: `${origin}/resources/${profile.slug}`,
    })),
  ];
}
