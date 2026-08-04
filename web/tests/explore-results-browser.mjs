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
    pending.set(id, { reject, resolve });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const response = await send("Runtime.evaluate", {
    awaitPromise: true,
    expression,
    returnByValue: true,
  });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
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

await send("Page.enable");
await send("Runtime.enable");
await send("Page.navigate", { url: `${origin}/` });
await waitFor(
  `document.readyState === "complete" && document.querySelector('[data-explore-results]')?.getAttribute('data-result-count') === '12'`,
  "bounded homepage preview",
);

const previewAudit = await evaluate(`(() => ({
  total: Number(document.querySelector('[data-explore-results]')?.getAttribute('data-total-resource-count')),
  results: Number(document.querySelector('[data-explore-results]')?.getAttribute('data-result-count')),
  visible: Number(document.querySelector('[data-explore-results]')?.getAttribute('data-visible-result-count')),
  cards: document.querySelectorAll('[data-resource-grid] > li').length,
  saves: document.querySelectorAll('[data-resource-grid] [data-resource-save]').length,
  hasLoadMore: Boolean(document.querySelector('[data-load-more-resources]')),
  searchAction: document.querySelector('form[aria-label="Search Tessli resources"]')?.getAttribute('action'),
  searchName: document.querySelector('[data-explore-search-input]')?.getAttribute('name'),
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
}))()`);

assert.equal(previewAudit.total, 12);
assert.equal(previewAudit.results, 12);
assert.equal(previewAudit.visible, 12);
assert.equal(previewAudit.cards, 12);
assert.equal(previewAudit.saves, 12);
assert.equal(previewAudit.hasLoadMore, false);
assert.equal(previewAudit.searchAction, "/resources");
assert.equal(previewAudit.searchName, "q");
assert.equal(previewAudit.overflow, false);

await evaluate(`(() => {
  const button = document.querySelector('[data-resource-save]');
  localStorage.clear();
  button?.click();
})()`);
await waitFor(
  `document.querySelector('[data-resource-save]')?.getAttribute('aria-pressed') === 'true'`,
  "homepage preview save",
);
assert.equal(
  await evaluate(
    `JSON.parse(localStorage.getItem('tessli-saved-resource-ids-v2') ?? '[]').length`,
  ),
  1,
);

socket.close();
console.log("Bounded homepage preview browser checks passed.");
