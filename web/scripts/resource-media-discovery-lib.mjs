import dns from "node:dns/promises";
import net from "node:net";

import {
  ALLOWED_RASTER_TYPES,
  validateCandidateUrl,
} from "./resource-media-review-lib.mjs";

export const DEFAULT_DISCOVERY_LIMITS = Object.freeze({
  maxRedirects: 3,
  timeoutMs: 8000,
  maxHtmlBytes: 1024 * 1024,
});

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

function ipv4Number(value) {
  const parts = value.split(".").map(Number);
  if (
    parts.length !== 4 ||
    parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  ) {
    return null;
  }
  return (
    (((parts[0] << 24) >>> 0) +
      (parts[1] << 16) +
      (parts[2] << 8) +
      parts[3]) >>>
    0
  );
}

function ipv4InRange(value, network, prefix) {
  const address = ipv4Number(value);
  const base = ipv4Number(network);
  if (address === null || base === null) return false;
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  return (address & mask) === (base & mask);
}

function expandIpv6(value) {
  let input = value.toLowerCase().split("%")[0];
  const mappedMatch = input.match(/^(.*:)(\d+\.\d+\.\d+\.\d+)$/);
  if (mappedMatch) {
    const ipv4 = ipv4Number(mappedMatch[2]);
    if (ipv4 === null) return null;
    input = `${mappedMatch[1]}${((ipv4 >>> 16) & 0xffff).toString(16)}:${(
      ipv4 & 0xffff
    ).toString(16)}`;
  }

  const halves = input.split("::");
  if (halves.length > 2) return null;
  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const missing = 8 - left.length - right.length;
  if (missing < 0 || (halves.length === 1 && missing !== 0)) return null;
  const parts = [...left, ...Array(missing).fill("0"), ...right];
  if (
    parts.length !== 8 ||
    parts.some((part) => !/^[0-9a-f]{1,4}$/.test(part))
  ) {
    return null;
  }
  return parts.map((part) => Number.parseInt(part, 16));
}

function ipv6BigInt(value) {
  const parts = expandIpv6(value);
  if (!parts) return null;
  return parts.reduce((result, part) => (result << 16n) | BigInt(part), 0n);
}

function ipv6InRange(value, network, prefix) {
  const address = ipv6BigInt(value);
  const base = ipv6BigInt(network);
  if (address === null || base === null) return false;
  const shift = BigInt(128 - prefix);
  return address >> shift === base >> shift;
}

export function isPublicIpAddress(address) {
  const family = net.isIP(address);
  if (family === 4) {
    const blocked = [
      ["0.0.0.0", 8],
      ["10.0.0.0", 8],
      ["100.64.0.0", 10],
      ["127.0.0.0", 8],
      ["169.254.0.0", 16],
      ["172.16.0.0", 12],
      ["192.0.0.0", 24],
      ["192.0.2.0", 24],
      ["192.168.0.0", 16],
      ["198.18.0.0", 15],
      ["198.51.100.0", 24],
      ["203.0.113.0", 24],
      ["224.0.0.0", 4],
      ["240.0.0.0", 4],
    ];
    return !blocked.some(([network, prefix]) =>
      ipv4InRange(address, network, prefix),
    );
  }
  if (family === 6) {
    const normalized = address.toLowerCase();
    if (normalized.startsWith("::ffff:")) {
      const mapped = normalized.slice("::ffff:".length);
      if (net.isIP(mapped) === 4) return isPublicIpAddress(mapped);
    }
    const blocked = [
      ["::", 128],
      ["::1", 128],
      ["fc00::", 7],
      ["fe80::", 10],
      ["ff00::", 8],
      ["2001:db8::", 32],
    ];
    return !blocked.some(([network, prefix]) =>
      ipv6InRange(address, network, prefix),
    );
  }
  return false;
}

export async function validatePublicNetworkUrl(
  value,
  { lookup = dns.lookup } = {},
) {
  const staticError = validateCandidateUrl(value);
  if (staticError) throw new Error(staticError);
  const url = new URL(value);
  const addresses = await lookup(url.hostname, {
    all: true,
    verbatim: true,
  });
  if (!Array.isArray(addresses) || addresses.length === 0) {
    throw new Error("Hostname did not resolve to an address.");
  }
  const unsafe = addresses.find((entry) => !isPublicIpAddress(entry.address));
  if (unsafe) {
    throw new Error(
      `Hostname resolved to a non-public address (${unsafe.address}).`,
    );
  }
  return url;
}

function tagEnd(html, start) {
  let quote = null;
  for (let index = start; index < html.length; index += 1) {
    const character = html[index];
    if (quote) {
      if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") quote = character;
    else if (character === ">") return index;
  }
  return -1;
}

function parseAttributes(tag) {
  const firstSpace = tag.search(/\s/);
  const body = firstSpace === -1 ? "" : tag.slice(firstSpace);
  const attributes = {};
  let index = 0;
  while (index < body.length) {
    while (index < body.length && /\s|\//.test(body[index])) index += 1;
    if (index >= body.length) break;
    const nameStart = index;
    while (index < body.length && !/[\s=/>]/.test(body[index])) {
      index += 1;
    }
    const name = body.slice(nameStart, index).toLowerCase();
    while (index < body.length && /\s/.test(body[index])) index += 1;
    let value = "";
    if (body[index] === "=") {
      index += 1;
      while (index < body.length && /\s/.test(body[index])) index += 1;
      if (body[index] === '"' || body[index] === "'") {
        const quote = body[index];
        index += 1;
        const valueStart = index;
        while (index < body.length && body[index] !== quote) index += 1;
        value = body.slice(valueStart, index);
        if (body[index] === quote) index += 1;
      } else {
        const valueStart = index;
        while (index < body.length && !/[\s>]/.test(body[index])) {
          index += 1;
        }
        value = body.slice(valueStart, index);
      }
    }
    if (name) attributes[name] = value;
  }
  return attributes;
}

function decodeEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

export function extractMetadataCandidates(html, pageUrl) {
  const metas = [];
  const links = [];
  const lower = html.toLowerCase();
  let cursor = 0;
  while (cursor < html.length) {
    const nextMeta = lower.indexOf("<meta", cursor);
    const nextLink = lower.indexOf("<link", cursor);
    const start = [nextMeta, nextLink]
      .filter((value) => value >= 0)
      .sort((left, right) => left - right)[0];
    if (start === undefined) break;
    const end = tagEnd(html, start);
    if (end === -1) break;
    const tag = html.slice(start + 1, end);
    const name = tag.split(/\s/, 1)[0].toLowerCase();
    const attributes = parseAttributes(tag);
    if (name === "meta") metas.push(attributes);
    if (name === "link") links.push(attributes);
    cursor = end + 1;
  }

  const metaMap = new Map();
  for (const attributes of metas) {
    const key = (attributes.property || attributes.name || "").toLowerCase();
    const content = attributes.content
      ? decodeEntities(attributes.content.trim())
      : "";
    if (key && content && !metaMap.has(key)) metaMap.set(key, content);
  }

  const previewCandidates = [];
  const seenPreviewUrls = new Set();
  for (const sourceProperty of [
    "og:image:secure_url",
    "og:image",
    "twitter:image",
    "twitter:image:src",
  ]) {
    const value = metaMap.get(sourceProperty);
    if (!value) continue;
    try {
      const resolved = new URL(value, pageUrl).toString();
      if (seenPreviewUrls.has(resolved)) continue;
      seenPreviewUrls.add(resolved);
      previewCandidates.push({
        url: resolved,
        source: sourceProperty.startsWith("twitter:")
          ? "twitter"
          : "open-graph",
        sourceProperty,
      });
    } catch {
      // Invalid metadata is represented by the absence of a safe candidate.
    }
  }

  const faviconLinks = links
    .map((attributes, index) => ({
      index,
      rel: (attributes.rel || "").toLowerCase().split(/\s+/),
      href: attributes.href,
      sizes: attributes.sizes || "",
    }))
    .filter(
      (entry) =>
        entry.href &&
        entry.rel.some((rel) =>
          new Set(["icon", "shortcut", "apple-touch-icon"]).has(rel),
        ),
    )
    .sort((left, right) => {
      const leftApple = left.rel.includes("apple-touch-icon") ? 1 : 0;
      const rightApple = right.rel.includes("apple-touch-icon") ? 1 : 0;
      if (leftApple !== rightApple) return rightApple - leftApple;
      const area = (value) => {
        const match = value.match(/(\d+)x(\d+)/);
        return match ? Number(match[1]) * Number(match[2]) : 0;
      };
      return area(right.sizes) - area(left.sizes) || left.index - right.index;
    });

  const faviconUrls = [];
  for (const entry of faviconLinks) {
    try {
      const resolved = new URL(decodeEntities(entry.href), pageUrl).toString();
      if (!faviconUrls.includes(resolved)) faviconUrls.push(resolved);
    } catch {
      // Ignore invalid link metadata.
    }
  }
  const defaultFavicon = new URL("/favicon.ico", pageUrl).toString();
  if (!faviconUrls.includes(defaultFavicon)) {
    faviconUrls.push(defaultFavicon);
  }
  return { previewCandidates, faviconUrls };
}

async function cancelBody(response) {
  try {
    await response.body?.cancel();
  } catch {
    // Cancellation is best-effort after response headers are sufficient.
  }
}

async function readLimitedText(response, maxBytes) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let text = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error(`HTML response exceeded ${maxBytes} bytes.`);
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

async function requestWithValidatedRedirects(
  initialUrl,
  {
    fetchImpl = globalThis.fetch,
    lookup = dns.lookup,
    limits = DEFAULT_DISCOVERY_LIMITS,
    headers = {},
  } = {},
) {
  let current = initialUrl;
  const redirects = [];
  for (let index = 0; index <= limits.maxRedirects; index += 1) {
    await validatePublicNetworkUrl(current, { lookup });
    const response = await fetchImpl(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(limits.timeoutMs),
      headers,
    });
    if (!REDIRECT_STATUSES.has(response.status)) {
      return { response, finalUrl: current, redirects };
    }
    const location = response.headers.get("location");
    await cancelBody(response);
    if (!location) {
      throw new Error(`Redirect ${response.status} did not include Location.`);
    }
    if (redirects.length >= limits.maxRedirects) {
      throw new Error(`Redirect limit of ${limits.maxRedirects} exceeded.`);
    }
    current = new URL(location, current).toString();
    redirects.push(current);
  }
  throw new Error(`Redirect limit of ${limits.maxRedirects} exceeded.`);
}

export async function probeRasterUrl(value, options = {}) {
  const { response, finalUrl, redirects } = await requestWithValidatedRedirects(
    value,
    {
      ...options,
      headers: {
        Accept: "image/avif,image/webp,image/png,image/jpeg;q=0.9,*/*;q=0.1",
        Range: "bytes=0-0",
        "User-Agent": "TessliMediaReview/1.0 (+repository metadata review)",
      },
    },
  );
  const contentType = (response.headers.get("content-type") || "")
    .split(";", 1)[0]
    .trim()
    .toLowerCase();
  await cancelBody(response);
  if (!response.ok && response.status !== 206) {
    throw new Error(`Media request returned HTTP ${response.status}.`);
  }
  if (!ALLOWED_RASTER_TYPES.has(contentType)) {
    throw new Error(
      contentType === "image/svg+xml"
        ? "Remote SVG media is not allowed."
        : `Unsupported media content type: ${contentType || "missing"}.`,
    );
  }
  return { url: finalUrl, contentType, redirects };
}

export async function discoverResourceMedia(
  resource,
  {
    checkedAt,
    fetchImpl = globalThis.fetch,
    lookup = dns.lookup,
    limits = DEFAULT_DISCOVERY_LIMITS,
  } = {},
) {
  const result = {
    resourceId: resource.id,
    resourceName: resource.name,
    canonicalUrl: resource.url,
    discoveryStatus: "failed",
    reviewerStatus: "needs-review",
    checkedAt,
    sourcePageUrl: resource.url,
    issues: [],
  };

  try {
    const source = await requestWithValidatedRedirects(resource.url, {
      fetchImpl,
      lookup,
      limits,
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9",
        "User-Agent": "TessliMediaReview/1.0 (+repository metadata review)",
      },
    });
    result.sourcePageUrl = source.finalUrl;
    result.redirects = source.redirects;
    if (!source.response.ok) {
      await cancelBody(source.response);
      result.discoveryStatus = new Set([401, 403, 429]).has(
        source.response.status,
      )
        ? "blocked"
        : "failed";
      result.issues.push({
        code: `source-http-${source.response.status}`,
        message: `Source page returned HTTP ${source.response.status}.`,
        url: source.finalUrl,
      });
      return result;
    }

    const contentType = (source.response.headers.get("content-type") || "")
      .split(";", 1)[0]
      .trim()
      .toLowerCase();
    if (!new Set(["text/html", "application/xhtml+xml"]).has(contentType)) {
      await cancelBody(source.response);
      result.discoveryStatus = "failed";
      result.issues.push({
        code: "source-not-html",
        message: `Source page returned ${contentType || "no content type"} instead of HTML.`,
        url: source.finalUrl,
      });
      return result;
    }

    const html = await readLimitedText(source.response, limits.maxHtmlBytes);
    const metadata = extractMetadataCandidates(html, source.finalUrl);

    for (const previewCandidate of metadata.previewCandidates) {
      try {
        const probed = await probeRasterUrl(previewCandidate.url, {
          fetchImpl,
          lookup,
          limits,
        });
        result.preview = {
          url: probed.url,
          source: previewCandidate.source,
          sourceProperty: previewCandidate.sourceProperty,
          contentType: probed.contentType,
          provenance: "response-header",
          checkedAt,
        };
        break;
      } catch (error) {
        result.issues.push({
          code: "preview-rejected",
          message:
            error instanceof Error
              ? error.message
              : "Preview candidate was rejected.",
          url: previewCandidate.url,
        });
      }
    }

    for (const faviconUrl of metadata.faviconUrls) {
      try {
        const probed = await probeRasterUrl(faviconUrl, {
          fetchImpl,
          lookup,
          limits,
        });
        result.favicon = {
          url: probed.url,
          contentType: probed.contentType,
          provenance: "response-header",
          checkedAt,
        };
        break;
      } catch (error) {
        result.issues.push({
          code: "favicon-rejected",
          message:
            error instanceof Error
              ? error.message
              : "Favicon candidate was rejected.",
          url: faviconUrl,
        });
      }
    }

    if (result.preview || result.favicon) {
      result.discoveryStatus = "candidate";
      if (result.issues.length === 0) delete result.issues;
    } else {
      result.discoveryStatus =
        metadata.previewCandidates.length || metadata.faviconUrls.length
          ? "uncertain"
          : "no-raster-media";
      if (result.issues.length === 0) {
        result.issues.push({
          code: "no-raster-metadata",
          message:
            "No approved raster Open Graph image or favicon candidate was found.",
          url: source.finalUrl,
        });
      }
    }
    if (result.redirects.length === 0) delete result.redirects;
    return result;
  } catch (error) {
    result.discoveryStatus = "blocked";
    result.issues.push({
      code: "source-blocked",
      message:
        error instanceof Error
          ? error.message
          : "Source page could not be safely fetched.",
      url: resource.url,
    });
    return result;
  }
}
