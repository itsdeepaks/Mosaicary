import assert from "node:assert/strict";

const endpoint = process.env.CDP_ENDPOINT ?? "http://127.0.0.1:9222";
const origin = process.env.TESSLI_ORIGIN ?? "http://127.0.0.1:3000";
const pending = new Map();
let messageId = 0;

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
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
});

function send(method, params = {}) {
  const id = ++messageId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const response = await send("Runtime.evaluate", {
    awaitPromise: true,
    expression,
    returnByValue: true,
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.text);
  }
  return response.result.value;
}

async function waitFor(expression, label, timeout = 10_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return;
    await delay(75);
  }
  throw new Error(`Timed out waiting for ${label}.`);
}

async function navigate(pathname) {
  await send("Page.navigate", { url: `${origin}${pathname}` });
  await waitFor(
    `document.readyState === "complete" && Boolean(document.querySelector('[data-browse-view]'))`,
    pathname,
  );
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 1000,
  deviceScaleFactor: 1,
  mobile: false,
});

await navigate("/resources");
const cardAudit = await evaluate(`(() => ({
  cards: document.querySelectorAll('[data-browse-view=cards] article').length,
  internalLinks: [...document.querySelectorAll('[data-browse-view=cards] article > a')]
    .every((link) => link.getAttribute('href')?.startsWith('/resources/')),
  providerLinks: document.querySelectorAll('[data-browse-view=cards] a[target=_blank][rel="noopener noreferrer"]').length,
  saves: document.querySelectorAll('[data-browse-view=cards] button[aria-pressed]').length,
  nextHref: [...document.querySelectorAll('nav[aria-label="Browse pages"] a')]
    .find((link) => link.textContent.trim() === 'Next')?.getAttribute('href'),
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
}))()`);
assert.equal(cardAudit.cards, 24);
assert.equal(cardAudit.internalLinks, true);
assert.ok(cardAudit.providerLinks > 0);
assert.equal(cardAudit.saves, 24);
assert.match(cardAudit.nextHref, /page=2/);
assert.equal(cardAudit.overflow, false);

await navigate("/resources?view=list&page=2");
assert.equal(
  await evaluate(
    `document.querySelectorAll('[data-browse-view=list] > li').length`,
  ),
  50,
);
assert.equal(
  await evaluate(
    `document.querySelector('[data-browse-view=list] a')?.getAttribute('href')?.startsWith('/resources/')`,
  ),
  true,
);

await navigate("/resources?view=table&profileLevel=profiled");
const tableAudit = await evaluate(`(() => ({
  rows: document.querySelectorAll('[data-browse-view=table] tbody tr').length,
  caption: Boolean(document.querySelector('[data-browse-view=table] caption')),
  levels: [...document.querySelectorAll('[data-browse-view=table] tbody tr td:nth-child(4)')]
    .every((cell) => cell.textContent.trim() === 'profiled'),
}))()`);
assert.equal(tableAudit.rows, 30);
assert.equal(tableAudit.caption, true);
assert.equal(tableAudit.levels, true);

await send("Page.navigate", { url: `${origin}/resources?sort=verified` });
await waitFor(
  `document.readyState === "complete" && Boolean(document.querySelector('[data-browse-view=cards]'))`,
  "legacy verification sort",
);
assert.equal(
  await evaluate(`new URLSearchParams(window.location.search).get('sort')`),
  "verified",
);
assert.equal(
  await evaluate(`document.querySelector('select[name=sort]')?.value`),
  "curated",
);

await send("Page.navigate", { url: `${origin}/resources/designindex` });
await waitFor(
  `document.readyState === "complete" && Boolean(document.querySelector('[data-source-detail=designindex]'))`,
  "internal source profile",
);
assert.equal(
  await evaluate(`document.querySelector('h1')?.textContent.trim()`),
  "DesignIndex",
);

socket.close();
console.log("Canonical Browse browser checks passed.");
