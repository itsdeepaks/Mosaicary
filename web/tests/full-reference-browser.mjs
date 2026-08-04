import assert from "node:assert/strict";
import http from "node:http";
import { WebSocket } from "ws";

const origin = "http://127.0.0.1:3000";
const cdpOrigin = "http://127.0.0.1:9222";

function requestJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          if (response.statusCode !== 200) {
            reject(new Error(`Request failed: ${response.statusCode} ${body}`));
            return;
          }
          resolve(JSON.parse(body));
        });
      })
      .on("error", reject);
  });
}

const targets = await requestJson(`${cdpOrigin}/json/list`);
const page = targets.find((target) => target.type === "page");
if (!page?.webSocketDebuggerUrl) {
  throw new Error("No Chrome page target found.");
}

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.once("open", resolve);
  socket.once("error", reject);
});

let messageId = 0;
const pending = new Map();
socket.on("message", (data) => {
  const message = JSON.parse(data.toString());
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function send(method, params = {}) {
  messageId += 1;
  const id = messageId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return result.result.value;
}

async function waitFor(expression, label, timeoutMs = 10_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await evaluate(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for ${label}.`);
}

async function navigate(path) {
  await send("Page.navigate", { url: `${origin}${path}` });
  await waitFor(
    `document.readyState === "complete" && Boolean(document.querySelector('[data-browse-page=true]'))`,
    path,
  );
}

await send("Page.enable");
await send("Runtime.enable");

await navigate("/resources");
assert.equal(
  await evaluate(
    `document.querySelectorAll('[data-browse-view=cards] > article').length`,
  ),
  24,
);
assert.equal(
  await evaluate(
    `document.querySelector('[data-browse-view=cards] a')?.getAttribute('href')?.startsWith('/resources/')`,
  ),
  true,
);

await navigate("/resources?view=list");
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
assert.equal(tableAudit.rows, 20);
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
