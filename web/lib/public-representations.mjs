export const PUBLIC_SOURCE_REPRESENTATION_CONTRACT = "tessli.public-source.v1";
export const PUBLIC_COLLECTION_REPRESENTATION_CONTRACT =
  "tessli.public-collection.v1";

const CACHE_CONTROL =
  "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800";

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeLineEndings(value) {
  return String(value ?? "").replace(/\r\n?/gu, "\n");
}

function inline(value, fallback = "Not recorded") {
  const normalized = normalizeLineEndings(value)
    .trim()
    .replace(/\s*\n\s*/gu, " ");
  return normalized || fallback;
}

function markdown(lines) {
  return `${lines
    .flatMap((line) => normalizeLineEndings(line).split("\n"))
    .map((line) => line.replace(/[ \t]+$/gu, ""))
    .join("\n")
    .replace(/\n+$/gu, "")}\n`;
}

function pushList(lines, title, values) {
  lines.push(`### ${title}`, "");
  if (!Array.isArray(values) || values.length === 0) {
    lines.push("None recorded", "");
    return;
  }
  for (const value of values) lines.push(`- ${inline(value)}`);
  lines.push("");
}

function publicEvidence(evidence) {
  return Array.isArray(evidence)
    ? evidence.map((item) => ({
        claim: item.claim,
        sourceUrl: item.sourceUrl,
        sourceType: item.sourceType,
        verifiedAt: item.verifiedAt,
        ...(item.confidence ? { confidence: item.confidence } : {}),
      }))
    : [];
}

function publicIntelligence(profile) {
  const intelligence = profile.intelligence;
  if (!isPlainObject(intelligence)) return null;
  return {
    profileVersion: intelligence.profileVersion,
    repositoryStatus: intelligence.status,
    recordedVerifiedAt: intelligence.verifiedAt,
    summary: intelligence.summary,
    designTools: [...(intelligence.designTools ?? [])],
    deliveryFormats: [...(intelligence.deliveryFormats ?? [])],
    agentInterfaces: (intelligence.agentInterfaces ?? []).map((item) => ({
      type: item.type,
      ...(item.transport ? { transport: item.transport } : {}),
      ...(item.endpoint ? { endpoint: item.endpoint } : {}),
      ...(item.status ? { status: item.status } : {}),
    })),
    discovery: {
      textSearch: Boolean(intelligence.discovery?.textSearch),
      ...(intelligence.discovery?.semanticSearch
        ? { semanticSearch: intelligence.discovery.semanticSearch }
        : {}),
      facets: [...(intelligence.discovery?.facets ?? [])],
    },
    governance: intelligence.governance
      ? {
          defaultPersistence: intelligence.governance.defaultPersistence,
          assetRedistribution: intelligence.governance.assetRedistribution,
          sourceAttribution: intelligence.governance.sourceAttribution,
          userCredentialRequired: Boolean(
            intelligence.governance.userCredentialRequired,
          ),
          termsReviewRequired: Boolean(
            intelligence.governance.termsReviewRequired,
          ),
          notes: [...(intelligence.governance.notes ?? [])],
        }
      : null,
  };
}

export function createPublicSourceRepresentation(profile) {
  if (!isPlainObject(profile) || typeof profile.slug !== "string") {
    throw new TypeError("A canonical Tessli SourceProfile is required.");
  }
  const canonicalPath = `/resources/${profile.slug}`;
  const jsonPath = `${canonicalPath}/profile.json`;
  const markdownPath = `${canonicalPath}/profile.md`;
  return {
    contract: PUBLIC_SOURCE_REPRESENTATION_CONTRACT,
    canonicalPath,
    representations: { json: jsonPath, markdown: markdownPath },
    source: {
      contractVersion: profile.contractVersion,
      id: profile.id,
      slug: profile.slug,
      name: profile.name,
      url: profile.url,
      domain: profile.domain,
      summary: profile.summary,
      category: profile.category,
      sourceType: profile.sourceType,
      sourceTypeBasis: profile.sourceTypeBasis,
      accessModel: {
        access: profile.accessModel.access,
        subscriptionRequired: profile.accessModel.subscriptionRequired,
      },
      profileLevel: profile.profileLevel,
      status: profile.status,
      verifiedAt: profile.verifiedAt,
      coverage: {
        level: profile.coverage.level,
        reason: profile.coverage.reason,
        profileStatus: profile.coverage.profileStatus,
        lastVerifiedAt: profile.coverage.lastVerifiedAt,
        confidence: profile.coverage.confidence,
        humanReviewStatus: profile.coverage.humanReviewStatus,
        freshnessStatus: profile.coverage.freshnessStatus,
        evidenceCount: profile.coverage.evidenceCount,
      },
      bestFor: [...profile.bestFor],
      capabilities: [...profile.capabilities],
      contentObjects: [...profile.contentObjects],
      platforms: [...profile.platforms],
      frameworks: [...profile.frameworks],
      integrationMethods: [...profile.integrationMethods],
      limitations: [...profile.limitations],
      evidence: publicEvidence(profile.evidence),
      intelligence: publicIntelligence(profile),
    },
    boundaries: [
      "Repository intelligence is not live-provider verification.",
      "Revalidate provider access, pricing, licensing, terms, availability, and time-sensitive claims.",
      "Tessli classifications are research guidance, not provider claims or universal rankings.",
      "No browser-local Board, Saved, account, cookie, or credential data is included.",
    ],
  };
}

export function createPublicCollectionRepresentation(
  collection,
  sourceProfiles,
) {
  if (!isPlainObject(collection) || typeof collection.slug !== "string") {
    throw new TypeError("A published Tessli collection is required.");
  }
  const byId = new Map(sourceProfiles.map((profile) => [profile.id, profile]));
  const resources = collection.resourceIds.map((resourceId, index) => {
    const profile = byId.get(resourceId);
    if (!profile) {
      throw new Error(
        `Collection ${collection.slug} references missing source ${resourceId}.`,
      );
    }
    return {
      order: index + 1,
      id: profile.id,
      slug: profile.slug,
      name: profile.name,
      url: profile.url,
      domain: profile.domain,
      summary: profile.summary,
      category: profile.category,
      sourceType: profile.sourceType,
      accessModel: {
        access: profile.accessModel.access,
        subscriptionRequired: profile.accessModel.subscriptionRequired,
      },
      profileLevel: profile.profileLevel,
      status: profile.status,
      tessliPath: `/resources/${profile.slug}`,
      jsonPath: `/resources/${profile.slug}/profile.json`,
      markdownPath: `/resources/${profile.slug}/profile.md`,
    };
  });
  const canonicalPath = `/collections/${collection.slug}`;
  const jsonPath = `${canonicalPath}/collection.json`;
  const markdownPath = `${canonicalPath}/collection.md`;
  return {
    contract: PUBLIC_COLLECTION_REPRESENTATION_CONTRACT,
    canonicalPath,
    representations: { json: jsonPath, markdown: markdownPath },
    collection: {
      id: collection.id,
      slug: collection.slug,
      title: collection.title,
      description: collection.description,
      status: collection.status,
      lastReviewedAt: collection.lastReviewedAt,
      resourceCount: resources.length,
    },
    resources,
    boundaries: [
      "Resource order is editorial and does not represent popularity, sponsorship, or universal quality.",
      "Repository intelligence is not live-provider verification.",
      "Revalidate provider access, pricing, licensing, terms, availability, and time-sensitive claims.",
      "No browser-local Board, Saved, account, cookie, or credential data is included.",
    ],
  };
}

export function serializePublicJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function serializePublicSourceMarkdown(document) {
  const source = document.source;
  const lines = [
    `# Tessli Source Profile — ${inline(source.name)}`,
    "",
    `Contract: ${document.contract}`,
    `Canonical Tessli path: ${document.canonicalPath}`,
    `JSON representation: ${document.representations.json}`,
    `Markdown representation: ${document.representations.markdown}`,
    "",
    "## Source identity",
    "",
    `- **ID:** ${inline(source.id)}`,
    `- **Slug:** ${inline(source.slug)}`,
    `- **Provider URL:** ${inline(source.url)}`,
    `- **Domain:** ${inline(source.domain)}`,
    `- **Category:** ${inline(source.category)}`,
    `- **Source type:** ${inline(source.sourceType)}`,
    `- **Access:** ${inline(source.accessModel.access)}`,
    `- **Subscription required:** ${inline(
      source.accessModel.subscriptionRequired,
    )}`,
    `- **Availability:** ${inline(source.status)}`,
    `- **Profile level:** ${inline(source.profileLevel)}`,
    "",
    "## Canonical summary",
    "",
    inline(source.summary),
    "",
    "## Coverage",
    "",
    `- **Level:** ${inline(source.coverage.level)}`,
    `- **Reason:** ${inline(source.coverage.reason)}`,
    `- **Repository profile status:** ${inline(source.coverage.profileStatus)}`,
    `- **Last recorded verification:** ${inline(
      source.coverage.lastVerifiedAt,
    )}`,
    `- **Confidence:** ${inline(source.coverage.confidence)}`,
    `- **Human review:** ${inline(source.coverage.humanReviewStatus)}`,
    `- **Freshness:** ${inline(source.coverage.freshnessStatus)}`,
    "",
  ];
  pushList(lines, "Best for", source.bestFor);
  pushList(lines, "Capabilities", source.capabilities);
  pushList(lines, "Content objects", source.contentObjects);
  pushList(lines, "Platforms", source.platforms);
  pushList(lines, "Frameworks", source.frameworks);
  pushList(lines, "Integration methods", source.integrationMethods);
  pushList(lines, "Limitations", source.limitations);
  lines.push("## Evidence", "");
  if (source.evidence.length === 0) {
    lines.push("None recorded", "");
  } else {
    for (const item of source.evidence) {
      const confidence = item.confidence
        ? `; confidence: ${item.confidence}`
        : "";
      lines.push(
        `- ${inline(item.sourceType)} verified ${inline(
          item.verifiedAt,
        )}${confidence}: ${inline(item.claim)} (${inline(item.sourceUrl)})`,
      );
    }
    lines.push("");
  }
  if (source.intelligence?.governance) {
    const governance = source.intelligence.governance;
    lines.push(
      "## Governance",
      "",
      `- **Default persistence:** ${inline(governance.defaultPersistence)}`,
      `- **Asset redistribution:** ${inline(governance.assetRedistribution)}`,
      `- **Source attribution:** ${inline(governance.sourceAttribution)}`,
      `- **User credential required:** ${
        governance.userCredentialRequired ? "yes" : "no"
      }`,
      `- **Terms review required:** ${
        governance.termsReviewRequired ? "yes" : "no"
      }`,
      "",
    );
  }
  lines.push("## Interpretation boundaries", "");
  for (const boundary of document.boundaries) {
    lines.push(`- ${inline(boundary)}`);
  }
  lines.push("");
  return markdown(lines);
}

export function serializePublicCollectionMarkdown(document) {
  const collection = document.collection;
  const lines = [
    `# Tessli Collection — ${inline(collection.title)}`,
    "",
    `Contract: ${document.contract}`,
    `Canonical Tessli path: ${document.canonicalPath}`,
    `JSON representation: ${document.representations.json}`,
    `Markdown representation: ${document.representations.markdown}`,
    "",
    "## Collection",
    "",
    inline(collection.description),
    "",
    `- **ID:** ${inline(collection.id)}`,
    `- **Status:** ${inline(collection.status)}`,
    `- **Last reviewed:** ${inline(collection.lastReviewedAt)}`,
    `- **Resource count:** ${collection.resourceCount}`,
    "",
    "## Ordered resources",
    "",
  ];
  for (const resource of document.resources) {
    lines.push(
      `### ${resource.order}. ${inline(resource.name)}`,
      "",
      `- **Source ID:** ${inline(resource.id)}`,
      `- **Provider URL:** ${inline(resource.url)}`,
      `- **Tessli profile:** ${inline(resource.tessliPath)}`,
      `- **Category:** ${inline(resource.category)}`,
      `- **Source type:** ${inline(resource.sourceType)}`,
      `- **Access:** ${inline(resource.accessModel.access)}`,
      `- **Profile level:** ${inline(resource.profileLevel)}`,
      `- **Summary:** ${inline(resource.summary)}`,
      "",
    );
  }
  lines.push("## Interpretation boundaries", "");
  for (const boundary of document.boundaries) {
    lines.push(`- ${inline(boundary)}`);
  }
  lines.push("");
  return markdown(lines);
}

export function createPublicRepresentationHeaders({
  format,
  filename,
  canonicalPath,
  jsonPath,
  markdownPath,
}) {
  const contentType =
    format === "json"
      ? "application/json; charset=utf-8"
      : "text/markdown; charset=utf-8";
  return {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": CACHE_CONTROL,
    "Content-Disposition": `inline; filename="${filename}"`,
    "Content-Type": contentType,
    "Cross-Origin-Resource-Policy": "cross-origin",
    Link: `<${canonicalPath}>; rel="canonical"; type="text/html", <${jsonPath}>; rel="alternate"; type="application/json", <${markdownPath}>; rel="alternate"; type="text/markdown"`,
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "index, follow",
  };
}

export function createPublicOptionsHeaders() {
  return {
    Allow: "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Max-Age": "86400",
    "Cross-Origin-Resource-Policy": "cross-origin",
    "X-Content-Type-Options": "nosniff",
  };
}
