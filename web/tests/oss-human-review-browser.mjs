import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const endpoint = process.env.CDP_ENDPOINT ?? "http://127.0.0.1:9222";
const origin = process.env.TESSLI_ORIGIN ?? "http://127.0.0.1:3000";
const reviewPath = "/proofs/oss-homepage/review";
const storageKey = "tessli-oss-homepage-human-review-v1";
const outputDirectory = new URL(
  "../artifacts/oss-human-review/",
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
let loadResolver = null;
const consoleFailures = [];

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
  await delay(300);
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

async function clickAxNode(node) {
  const box = await send("DOM.getBoxModel", {
    backendNodeId: node.backendDOMNodeId,
  });
  const [x1, y1, x2, , , y3] = box.model.content;
  const x = (x1 + x2) / 2;
  const y = (y1 + y3) / 2;
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x,
    y,
    button: "left",
    clickCount: 1,
  });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x,
    y,
    button: "left",
    clickCount: 1,
  });
}

function findAxNode(nodes, role, name) {
  return nodes.find(
    (node) => node.role?.value === role && node.name?.value === name,
  );
}

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  send("Page.enable"),
  send("Runtime.enable"),
  send("DOM.enable"),
  send("CSS.enable"),
  send("Accessibility.enable"),
  send("DOMStorage.enable"),
]);

const routeResponse = await fetch(`${origin}${reviewPath}`);
const routeBody = await routeResponse.text();
assert.equal(routeResponse.status, 200, "OSS human-review route status");
assert.match(routeBody, /Review the direction, not just the screenshot\./u);
assert.match(routeBody, /name="robots" content="noindex, nofollow/u);
assert.match(routeBody, /no automatic upload/iu);
assert.doesNotMatch(routeBody, /checked=""|checked="checked"/u);

const storageId = { securityOrigin: origin, isLocalStorage: true };
await send("DOMStorage.setDOMStorageItem", {
  storageId,
  key: storageKey,
  value: "{malformed-json",
});

for (const [index, [width, height]] of viewports.entries()) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 390,
  });
  await navigate(`${origin}${reviewPath}`);

  const document = await send("DOM.getDocument", { depth: -1, pierce: true });
  const documentNodeId = document.root.nodeId;
  const reviewNodeId = await querySelector(
    documentNodeId,
    '[data-oss-review="ready"]',
  );
  assert.ok(reviewNodeId > 0, `review marker at ${width}`);

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

  const articles = await querySelectorAll(reviewNodeId, "article");
  const radios = await querySelectorAll(reviewNodeId, 'input[type="radio"]');
  const checkedRadios = await querySelectorAll(
    reviewNodeId,
    'input[type="radio"]:checked',
  );
  const textareas = await querySelectorAll(reviewNodeId, "textarea");
  assert.equal(articles.length, 12, `dimension count at ${width}`);
  assert.equal(radios.length, 63, `score and decision radios at ${width}`);
  assert.equal(checkedRadios.length, 0, `no prefilled judgment at ${width}`);
  assert.equal(textareas.length, 13, `dimension and overall notes at ${width}`);

  const layout = await send("Page.getLayoutMetrics");
  assert.ok(
    layout.cssContentSize.width <= layout.cssLayoutViewport.clientWidth + 1,
    `no horizontal overflow at ${width}`,
  );

  const accessibility = await send("Accessibility.getFullAXTree");
  const headings = accessibility.nodes.filter(
    (node) => node.role?.value === "heading",
  );
  assert.equal(
    headings[0]?.name?.value,
    "Review the direction, not just the screenshot.",
    `first heading at ${width}`,
  );
  const radioNodes = accessibility.nodes.filter(
    (node) => node.role?.value === "radio",
  );
  assert.equal(radioNodes.length, 63, `accessible radio count at ${width}`);
  assert.ok(
    findAxNode(accessibility.nodes, "button", "Copy JSON"),
    `Copy JSON button at ${width}`,
  );
  assert.ok(
    findAxNode(accessibility.nodes, "button", "Download JSON"),
    `Download JSON button at ${width}`,
  );
  assert.ok(
    findAxNode(accessibility.nodes, "link", "Open candidate"),
    `candidate link at ${width}`,
  );

  if (index === 0) {
    const copyButton = findAxNode(accessibility.nodes, "button", "Copy JSON");
    await clickAxNode(copyButton);
    await delay(250);
    const refreshed = await send("DOM.getDocument", {
      depth: -1,
      pierce: true,
    });
    const alertNodeId = await querySelector(
      refreshed.root.nodeId,
      '[role="alert"]',
    );
    assert.ok(alertNodeId > 0, "empty review shows validation alert");
    const errorItems = await querySelectorAll(alertNodeId, "li");
    assert.equal(errorItems.length, 28, "all required fields are reported");

    const storage = await send("DOMStorage.getDOMStorageItems", { storageId });
    const storedReview = storage.entries.find(
      ([key]) => key === storageKey,
    )?.[1];
    assert.ok(storedReview, "review draft persisted locally");
    const parsed = JSON.parse(storedReview);
    assert.equal(parsed.reviewer, "");
    assert.equal(parsed.decision, "");
    assert.equal(
      Object.values(parsed.dimensions).every(
        (dimension) => dimension.score === null && dimension.note === "",
      ),
      true,
      "malformed draft recovered without invented scores",
    );
  }

  const screenshot = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(
    new URL(`oss-human-review-${width}x${height}.png`, outputDirectory),
    Buffer.from(screenshot.data, "base64"),
  );
}

socket.close();
assert.deepEqual(
  consoleFailures,
  [],
  `Browser errors: ${consoleFailures.join(" | ")}`,
);
console.log("OSS human-review browser matrix passed.");
