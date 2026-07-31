import catalogue from "../data/catalogue.json" with { type: "json" };
import {
  getIntelligenceBadge,
  getIntelligenceProfile,
  type ResourceIntelligenceProfile,
} from "./intelligence.ts";

export interface ResearchStackItem {
  id: string;
  slug: string;
  name: string;
  url: string;
  domain: string;
  category: string;
  access: string;
  description: string;
  intelligenceProfile: ResourceIntelligenceProfile | null;
  badge: string | null;
}

export interface ResearchStack {
  taskName: string;
  generatedAt: string;
  resources: ResearchStackItem[];
}

export interface ResearchStackOptions {
  generatedAt?: string;
}

export function buildResearchStack(
  taskName: string,
  resourceIdsOrSlugs: readonly string[],
  options: ResearchStackOptions = {},
): ResearchStack {
  const resourceMap = new Map<string, (typeof catalogue.resources)[0]>();
  for (const item of catalogue.resources) {
    resourceMap.set(item.id, item);
    resourceMap.set(item.slug, item);
  }

  const items: ResearchStackItem[] = [];
  const selectedResourceIds = new Set<string>();

  for (const identifier of resourceIdsOrSlugs) {
    const raw = resourceMap.get(identifier);
    if (!raw || selectedResourceIds.has(raw.id)) continue;

    const profile =
      getIntelligenceProfile(raw.id) || getIntelligenceProfile(raw.slug);
    const badge = profile ? getIntelligenceBadge(profile) : null;

    items.push({
      id: raw.id,
      slug: raw.slug,
      name: raw.name,
      url: raw.url,
      domain: raw.domain,
      category: raw.category,
      access: raw.access,
      description: raw.description,
      intelligenceProfile: profile,
      badge,
    });
    selectedResourceIds.add(raw.id);
  }

  return {
    taskName,
    generatedAt: options.generatedAt ?? "2026-07-31",
    resources: items,
  };
}

export function generateMarkdownReferencePacket(stack: ResearchStack): string {
  const lines: string[] = [];

  lines.push(`# Tessli Reference Packet — ${stack.taskName}`);
  lines.push(``);
  lines.push(`Generated: ${stack.generatedAt}`);
  lines.push(`Total References: ${stack.resources.length}`);
  lines.push(``);
  lines.push(`## 1. Research Protocol`);
  lines.push(``);
  lines.push(
    `1. Inspect structural references and landing/layout inspiration.`,
  );
  lines.push(`2. Inspect component libraries and source code patterns.`);
  lines.push(`3. Review typography, accessibility, and visual tokens.`);
  lines.push(`4. Follow explicit governance & attribution notes.`);
  lines.push(``);
  lines.push(`## 2. Selected Reference Stack`);
  lines.push(``);

  for (const res of stack.resources) {
    lines.push(`### ${res.name} (${res.domain})`);
    lines.push(`- **Category:** ${res.category}`);
    lines.push(`- **Access:** ${res.access}`);
    lines.push(`- **URL:** ${res.url}`);
    if (res.badge) {
      lines.push(`- **Capability Badge:** ${res.badge}`);
    }
    lines.push(`- **Description:** ${res.description}`);

    if (res.intelligenceProfile) {
      const p = res.intelligenceProfile;
      lines.push(`- **Capabilities:** ${p.capabilities.join(", ")}`);
      lines.push(
        `- **Frameworks:** ${p.frameworks.join(", ") || "None specified"}`,
      );
      lines.push(
        `- **Governance:** Attribution=${p.governance.sourceAttribution}, Persistence=${p.governance.defaultPersistence}`,
      );
      lines.push(`- **Evidence:**`);
      for (const evidence of p.evidence) {
        const confidence = evidence.confidence
          ? `; confidence: ${evidence.confidence}`
          : "";
        lines.push(
          `  - ${evidence.sourceType} verified ${evidence.verifiedAt}${confidence}: ${evidence.claim} (${evidence.sourceUrl})`,
        );
      }
      lines.push(
        `- **Interpretation boundary:** Capabilities and workflow fit are Tessli classifications; revalidate provider claims before relying on them.`,
      );
    }
    lines.push(``);
  }

  lines.push(`## 3. Agent Implementation Handoff Checklist`);
  lines.push(``);
  lines.push(
    `- [ ] Verify responsive breakpoints across 1440px, 1024px, 768px, 390px.`,
  );
  lines.push(
    `- [ ] Ensure visible focus indicators and accessible touch targets.`,
  );
  lines.push(`- [ ] Validate evidence claims before deployment.`);
  lines.push(
    `- [ ] Use references for principles, not copied layouts, content, or provider-rendered assets.`,
  );
  lines.push(``);

  return lines.join("\n");
}
