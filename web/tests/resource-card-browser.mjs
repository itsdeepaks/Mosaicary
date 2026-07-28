import assert from "node:assert/strict";

const endpoint = process.env.CDP_ENDPOINT ?? "http://127.0.0.1:9222";
const pageUrl =
  process.env.TESSLI_RESOURCE_CARD_URL ??
  "http://127.0.0.1:3000/lab/resource-cards";
const pending = new Map();
let messageId = 0;

async function delay(milliseconds) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function pageTargets() {
  const response = await fetch(`${endpoint}/json/list`);
  const targets = await response.json();
  return targets.filter((target) => target.type === "page");
}

async function findPageTarget() {
  const deadline = Date.now() + 10_000;

  while (Date.now() < deadline) {
    try {
      const page = (await pageTargets())[0];
      if (page?.webSocketDebuggerUrl) {
        return page;
      }
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

  if (!request) {
    return;
  }

  pending.delete(message.id);
  if (message.error) {
    request.reject(new Error(message.error.message));
  } else {
    request.resolve(message.result);
  }
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

  if (response.exceptionDetails) {
    throw new Error(
      response.exceptionDetails.text ?? "Browser evaluation failed.",
    );
  }

  return response.result.value;
}

async function waitFor(expression, label, timeout = 7_500) {
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    if (await evaluate(expression)) {
      return;
    }

    await delay(50);
  }

  throw new Error(`Timed out waiting for ${label}.`);
}

async function waitForNewTarget(existingIds, label) {
  const deadline = Date.now() + 5_000;

  while (Date.now() < deadline) {
    const target = (await pageTargets()).find(
      (candidate) => !existingIds.has(candidate.id),
    );
    if (target) {
      return target;
    }
    await delay(50);
  }

  throw new Error(`Timed out waiting for ${label}.`);
}

async function closeTarget(targetId) {
  await fetch(`${endpoint}/json/close/${targetId}`);
}

async function activateCardLink({ button, modifiers = 0 }) {
  const point = await evaluate(`(() => {
    const link = document.querySelector('[data-resource-slug="land-book"] a');
    const rect = link.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.bottom - 34 };
  })()`);
  const existingIds = new Set((await pageTargets()).map((target) => target.id));

  await send("Input.dispatchMouseEvent", {
    button,
    clickCount: 1,
    modifiers,
    type: "mousePressed",
    x: point.x,
    y: point.y,
  });
  await send("Input.dispatchMouseEvent", {
    button,
    clickCount: 1,
    modifiers,
    type: "mouseReleased",
    x: point.x,
    y: point.y,
  });

  const target = await waitForNewTarget(existingIds, `${button} link target`);
  await closeTarget(target.id);
}

await send("Page.enable");
await send("Runtime.enable");
await send("Page.navigate", { url: pageUrl });
await waitFor(
  'document.readyState === "complete" && document.querySelectorAll("[data-resource-card]").length === 12',
  "twelve resource-card fixtures",
);

assert.equal(
  await evaluate(
    'document.querySelectorAll("[data-resource-card] > a[target=_blank][rel=\"noopener noreferrer\"]").length',
  ),
  12,
  "Every card should expose one protected native external link.",
);

await waitFor(
  'document.querySelector("[data-resource-slug=land-book]")?.getAttribute("data-media-state") === "preview" && document.querySelector("[data-resource-slug=land-book] [data-media-loaded]")?.getAttribute("data-media-loaded") === "true"',
  "the valid preview image",
);
await waitFor(
  'document.querySelector("[data-resource-slug=lapa-ninja]")?.getAttribute("data-media-state") === "favicon"',
  "broken preview to fall back to favicon",
);
await waitFor(
  'document.querySelector("[data-resource-slug=godly]")?.getAttribute("data-media-state") === "generated"',
  "broken preview to fall back to generated mark",
);

const originalUrl = await evaluate("window.location.href");
await evaluate(
  'document.querySelector("[data-resource-slug=designindex] [data-resource-save]")?.click()',
);
await waitFor(
  'document.querySelector("[data-resource-slug=designindex] [data-resource-save]")?.getAttribute("aria-pressed") === "true"',
  "independent save state",
);
assert.equal(
  await evaluate("window.location.href"),
  originalUrl,
  "Save must not trigger the external card link.",
);
await waitFor(
  'document.querySelector("[aria-live=polite]")?.textContent.includes("DesignIndex saved") === true',
  "the save announcement",
);

assert.equal(
  await evaluate(`(() => {
    const card = document.querySelector('[data-resource-slug="toools-design"]');
    const paragraph = Array.from(card.querySelectorAll('p')).find(
      (candidate) => candidate.textContent.trim().length > 80,
    );
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(paragraph);
    selection.removeAllRanges();
    selection.addRange(range);
    return selection.toString().length > 80;
  })()`),
  true,
  "Card text should remain selectable.",
);

await activateCardLink({ button: "middle" });
await activateCardLink({ button: "left", modifiers: 2 });
assert.equal(
  await evaluate("window.location.href"),
  originalUrl,
  "Modifier and middle click should leave the source page in place.",
);

assert.equal(
  await evaluate("document.documentElement.scrollWidth <= window.innerWidth"),
  true,
  "The pilot route must not overflow horizontally.",
);

socket.close();
console.log("Resource card fallback, save, and native-link checks passed.");
