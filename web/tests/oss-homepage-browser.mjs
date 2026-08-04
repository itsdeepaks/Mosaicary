import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const endpoint = process.env.CDP_ENDPOINT ?? "http://127.0.0.1:9222";
const origin = process.env.TESSLI_ORIGIN ?? "http://127.0.0.1:3000";
const outputDirectory = new URL(
  "../artifacts/oss-proof-candidate/",
  import.meta.url,
);
const viewports = [
  [1440, 900],
  [1024, 768],
  [768, 1024],
  [390, 844],
  [320, 800],
];

const pending = new Map();
let messageId = 0;
const consoleFailures = [];
let loadResolver = null;

async function delay(milliseconds) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function findPageTarget() {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${endpoint}/json/list`);
      const targets = await response.json();
      const page = targets.find((target) => target.type === "page");
      if (page?.webSocketDebuggerUrl) return page;
    } catch {
      // Chrome may still be starting.
    }
    await delay(100);
  }
  throw new Error("Chrome DevTools endpoint did not become ready.");
}

const page = await findPageTarget();
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.method === "Page.loadEventFired") {
    loadResolver?.();
    loadResolver = null;
  }
  if (message.method === "Runtime.exceptionThrown") {
    consoleFailures.push(message.params.exceptionDetails.text);
  }
  if (
    message.method === "Runtime.consoleAPICalled" &&
    message.params.type === "error"
  ) {
    consoleFailures.push(
      message.params.args
        .map(
          (argument) =>
            argument.value ?? argument.description ?? "console error",
        )
        .join(" "),
    );
  }
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
});

function send(method, params = {}) {
  const id = ++messageId;
  return new Promise((resolve, reject) => {
    pending.set(id, { reject, resolve });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function navigate(url) {
  const loaded = new Promise((resolve) => {
    loadResolver = resolve;
  });
  await send("Page.navigate", { url });
  await Promise.race([
    loaded,
    delay(10_000).then(() => {
      throw new Error(`Timed out loading ${url}`);
    }),
  ]);
  await delay(250);
}

async function querySelector(documentNodeId, selector) {
  const result = await send("DOM.querySelector", {
    nodeId: documentNodeId,
    selector,
  });
  return result.nodeId;
}

async function querySelectorAll(documentNodeId, selector) {
  const result = await send("DOM.querySelectorAll", {
    nodeId: documentNodeId,
    selector,
  });
  return result.nodeIds;
}

async function computedDisplay(nodeId) {
  const result = await send("CSS.getComputedStyleForNode", { nodeId });
  return result.computedStyle.find((entry) => entry.name === "display")?.value;
}

function textFromAxNode(node) {
  return node.name?.value ?? "";
}

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  send("Page.enable"),
  send("Runtime.enable"),
  send("DOM.enable"),
  send("CSS.enable"),
  send("Accessibility.enable"),
]);

const routeResponse = await fetch(`${origin}/proofs/oss-homepage`);
const routeBody = await routeResponse.text();
assert.equal(routeResponse.status, 200, "OSS proof route status");
assert.match(
  routeBody,
  /Your business needs a technical partner, not another hand-off\./u,
);
assert.match(routeBody, /name="robots" content="noindex, nofollow/u);
assert.doesNotMatch(routeBody, /<form/u);
assert.doesNotMatch(routeBody, /<canvas/u);
assert.doesNotMatch(routeBody, /<img/u);

for (const [width, height] of viewports) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 390,
  });
  await navigate(`${origin}/proofs/oss-homepage`);

  const document = await send("DOM.getDocument", { depth: -1, pierce: true });
  const documentNodeId = document.root.nodeId;
  const proofNodeId = await querySelector(
    documentNodeId,
    '[data-oss-proof="ready"]',
  );
  assert.ok(proofNodeId > 0, `proof marker at ${width}`);

  const mainNodeId = await querySelector(documentNodeId, "main#main-content");
  assert.ok(mainNodeId > 0, `main landmark at ${width}`);

  const publicHeaderNodeId = await querySelector(
    documentNodeId,
    "body > header",
  );
  const publicFooterNodeId = await querySelector(
    documentNodeId,
    "[data-site-content] > footer",
  );
  assert.equal(
    await computedDisplay(publicHeaderNodeId),
    "none",
    `public header isolation at ${width}`,
  );
  assert.equal(
    await computedDisplay(publicFooterNodeId),
    "none",
    `public footer isolation at ${width}`,
  );

  const formNodeIds = await querySelectorAll(proofNodeId, "form");
  const canvasNodeIds = await querySelectorAll(proofNodeId, "canvas");
  const imageNodeIds = await querySelectorAll(proofNodeId, "img");
  assert.equal(formNodeIds.length, 0, `no forms at ${width}`);
  assert.equal(canvasNodeIds.length, 0, `no 3D canvas at ${width}`);
  assert.equal(imageNodeIds.length, 0, `no provider images at ${width}`);

  const consultationLinks = await querySelectorAll(
    proofNodeId,
    'a[href="#proof-contact"]',
  );
  assert.ok(consultationLinks.length >= 2, `consultation actions at ${width}`);
  for (const nodeId of consultationLinks) {
    const box = await send("DOM.getBoxModel", { nodeId });
    const heightPixels = box.model.height;
    assert.ok(heightPixels >= 44, `touch target at ${width}`);
  }

  const links = await querySelectorAll(proofNodeId, "a[href]");
  for (const nodeId of links) {
    const attributes = await send("DOM.getAttributes", { nodeId });
    const hrefIndex = attributes.attributes.indexOf("href");
    const href = hrefIndex >= 0 ? attributes.attributes[hrefIndex + 1] : "";
    assert.match(href, /^#/u, `in-page link at ${width}`);
  }

  const layout = await send("Page.getLayoutMetrics");
  assert.ok(
    layout.cssContentSize.width <= layout.cssLayoutViewport.clientWidth + 1,
    `no horizontal overflow at ${width}`,
  );

  const accessibility = await send("Accessibility.getFullAXTree");
  const headings = accessibility.nodes.filter(
    (node) => node.role?.value === "heading",
  );
  assert.ok(headings.length >= 10, `heading coverage at ${width}`);
  assert.equal(
    textFromAxNode(headings[0]),
    "Your business needs a technical partner, not another hand-off.",
    `first heading at ${width}`,
  );
  const headingLevels = headings.map(
    (node) =>
      node.properties?.find((property) => property.name === "level")?.value
        ?.value ?? 0,
  );
  assert.equal(headingLevels[0], 1, `h1 level at ${width}`);
  assert.equal(
    headingLevels.some(
      (level, index) =>
        index > 0 && level > 0 && level - headingLevels[index - 1] > 1,
    ),
    false,
    `heading order at ${width}`,
  );

  const screenshot = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(
    new URL(`oss-homepage-first-${width}x${height}.png`, outputDirectory),
    Buffer.from(screenshot.data, "base64"),
  );
}

socket.close();
assert.deepEqual(
  consoleFailures,
  [],
  `Browser errors: ${consoleFailures.join(" | ")}`,
);
console.log("OSS homepage proof candidate browser matrix passed.");
