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
      response.exceptionDetails.exception?.description ??
        response.exceptionDetails.text ??
        "Browser evaluation failed.",
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

async function navigate(pathname) {
  await send("Page.navigate", { url: `${origin}${pathname}` });
  await waitFor(
    'document.readyState === "complete" && Boolean(document.querySelector("[data-explore-results]"))',
    `Explore results at ${pathname}`,
  );
}

function resultCountExpression(expected) {
  return `Number(document.querySelector('[data-explore-results]')?.getAttribute('data-result-count')) === ${expected}`;
}

async function loadEveryResult() {
  while (
    await evaluate(
      'Boolean(document.querySelector("[data-load-more-resources]"))',
    )
  ) {
    const before = await evaluate(
      'Number(document.querySelector("[data-explore-results]")?.getAttribute("data-visible-result-count"))',
    );
    await evaluate(
      'document.querySelector("[data-load-more-resources]")?.click()',
    );
    await waitFor(
      `Number(document.querySelector('[data-explore-results]')?.getAttribute('data-visible-result-count')) > ${before}`,
      `a result batch after ${before}`,
    );
  }
}

await send("Page.enable");
await send("Runtime.enable");
await navigate("/");
await evaluate(
  `(() => {
    const legacyUrl = document.querySelector('[data-resource-slug="designindex"] a')?.getAttribute('href');
    localStorage.clear();
    localStorage.setItem('mosaicary-saved-resources-v1', JSON.stringify([legacyUrl]));
  })()`,
);
await navigate("/");

await waitFor(resultCountExpression(295), "the complete catalogue count");
assert.equal(
  await evaluate(
    'Number(document.querySelector("[data-explore-results]")?.getAttribute("data-visible-result-count"))',
  ),
  48,
);
assert.equal(
  await evaluate(
    'document.querySelectorAll("[data-resource-grid] > li").length',
  ),
  48,
);
assert.equal(
  await evaluate(
    'document.querySelectorAll("[data-resource-grid] [data-resource-save]").length',
  ),
  48,
  "Explore must expose browser-persistent save controls.",
);
await waitFor(
  'document.querySelector("[data-resource-slug=designindex] [data-resource-save]")?.getAttribute("aria-pressed") === "true"',
  "legacy save migration",
);
const designIndexId = await evaluate(
  'document.querySelector("[data-resource-slug=designindex] [data-resource-save]")?.getAttribute("data-resource-save")',
);
assert.equal(
  await evaluate(
    `JSON.parse(localStorage.getItem('tessli-saved-resource-ids-v2') ?? '[]').includes(${JSON.stringify(designIndexId)})`,
  ),
  true,
  "Legacy URL saves should migrate to stable resource IDs.",
);
assert.equal(
  await evaluate(
    "localStorage.getItem('mosaicary-saved-resources-v1') !== null",
  ),
  true,
  "Migration must leave the legacy key intact.",
);
await evaluate(
  'document.querySelector("[data-resource-slug=designindex] [data-resource-save]")?.click()',
);
await waitFor(
  'document.querySelector("[data-resource-slug=designindex] [data-resource-save]")?.getAttribute("aria-pressed") === "false"',
  "independent save removal",
);
assert.equal(
  await evaluate(
    `JSON.parse(localStorage.getItem('tessli-saved-resource-ids-v2') ?? '[]').includes(${JSON.stringify(designIndexId)})`,
  ),
  false,
  "Removing a save should update the stable-ID store.",
);
assert.equal(
  await evaluate(
    'document.querySelectorAll("[data-resource-grid] [data-media-state=generated]").length',
  ),
  36,
  "Only reviewed media in the first result batch should replace generated fallbacks.",
);
assert.equal(
  await evaluate(
    'document.querySelectorAll("[data-resource-grid] [data-media-state=preview]").length',
  ),
  9,
  "Approved media records should render their previews in the first result batch.",
);
assert.equal(
  await evaluate(
    'document.querySelectorAll("[data-resource-grid] [data-media-state=favicon]").length',
  ),
  3,
  "Approved favicon-only records should render before generated fallbacks.",
);
assert.match(
  await evaluate(
    'Array.from(document.querySelectorAll("[aria-live=polite]")).map((node) => node.textContent).join(" ")',
  ),
  /Showing 48 of 295/,
);

await evaluate('document.querySelector("[data-load-more-resources]")?.click()');
await waitFor(
  'document.querySelectorAll("[data-resource-grid] > li").length === 96',
  "the second result batch",
);
assert.equal(
  await evaluate(
    'Number(document.querySelector("[data-explore-results]")?.getAttribute("data-visible-result-count"))',
  ),
  96,
);

await loadEveryResult();
assert.equal(
  await evaluate(
    'Number(document.querySelector("[data-explore-results]")?.getAttribute("data-visible-result-count"))',
  ),
  295,
  "Every matching resource should be reachable through Load more.",
);
assert.equal(
  await evaluate(
    'document.querySelectorAll("[data-resource-grid] > li").length',
  ),
  295,
);
assert.equal(
  await evaluate(
    'Boolean(document.querySelector("[data-load-more-resources]"))',
  ),
  false,
);
assert.match(
  await evaluate(
    'document.querySelector("[data-explore-results]")?.textContent ?? ""',
  ),
  /All matching resources are visible/,
);

await evaluate('document.querySelector("[data-category=icons]")?.click()');
await waitFor(
  'new URLSearchParams(window.location.search).get("category") === "icons"',
  "icons URL state",
);
await waitFor(
  'document.querySelector("[data-explore-results]")?.getAttribute("data-explore-results") === "ready"',
  "icons results",
);
assert.equal(
  await evaluate(
    'Array.from(document.querySelectorAll("[data-resource-grid] [data-resource-card]")).every((card) => card.getAttribute("data-resource-category") === "icons")',
  ),
  true,
);
assert.equal(
  await evaluate(
    'Number(document.querySelector("[data-explore-results]")?.getAttribute("data-visible-result-count")) <= 48',
  ),
  true,
  "Changing category should reset the load-more window.",
);

await evaluate('document.querySelector("[data-category=all]")?.click()');
await waitFor(
  'new URLSearchParams(window.location.search).get("category") === null',
  "All categories URL state",
);
await evaluate('document.querySelector("[data-filter-trigger]")?.click()');
await waitFor(
  'document.querySelector("[data-filter-dialog]")?.open === true',
  "access filter dialog",
);
await evaluate('document.querySelector("[data-access-filter=paid]")?.click()');
await waitFor(
  'new URLSearchParams(window.location.search).get("access") === "paid"',
  "paid access URL state",
);
await waitFor(
  'document.querySelectorAll("[data-resource-grid] [data-resource-card]").length > 0',
  "paid resource cards",
);
assert.equal(
  await evaluate(
    'Array.from(document.querySelectorAll("[data-resource-grid] [data-resource-card]")).every((card) => card.getAttribute("data-resource-access") === "paid")',
  ),
  true,
);
await evaluate(
  `document.querySelector('[data-filter-dialog] button[aria-label="Close filters"]')?.click()`,
);
await waitFor(
  'document.querySelector("[data-filter-dialog]")?.open === false',
  "filter dialog close",
);

await evaluate(`(() => {
  const select = document.querySelector('[data-discovery-sort-select]');
  select.value = 'name-desc';
  select.dispatchEvent(new Event('change', { bubbles: true }));
})()`);
await waitFor(
  'new URLSearchParams(window.location.search).get("sort") === "name-desc"',
  "descending sort URL state",
);
const visibleNames = await evaluate(
  'Array.from(document.querySelectorAll("[data-resource-grid] [data-resource-name]")).map((card) => card.getAttribute("data-resource-name"))',
);
assert.deepEqual(
  visibleNames,
  [...visibleNames].sort((left, right) =>
    right.localeCompare(left, "en", { numeric: true, sensitivity: "base" }),
  ),
  "Visible resources should follow deterministic descending name order.",
);

await navigate("/?q=zzzz-no-tessli-match");
await waitFor(
  'document.querySelector("[data-explore-results]")?.getAttribute("data-explore-results") === "empty"',
  "the no-results state",
);
assert.equal(
  await evaluate('Boolean(document.querySelector("[data-reset-discovery]"))'),
  true,
);
assert.match(
  await evaluate(
    'Array.from(document.querySelectorAll("[aria-live=polite]")).map((node) => node.textContent).join(" ")',
  ),
  /0 resources match/,
);

await evaluate('document.querySelector("[data-reset-discovery]")?.click()');
await waitFor(resultCountExpression(295), "reset complete catalogue");
assert.equal(
  await evaluate("window.location.pathname + window.location.search"),
  "/",
);

await evaluate("window.history.back()");
await waitFor(
  'new URLSearchParams(window.location.search).get("q") === "zzzz-no-tessli-match"',
  "Back restored no-results query",
);
await waitFor(
  'document.querySelector("[data-explore-results]")?.getAttribute("data-explore-results") === "empty"',
  "Back restored no-results state",
);

await evaluate("window.history.forward()");
await waitFor(resultCountExpression(295), "Forward restored full results");
assert.equal(
  await evaluate("document.documentElement.scrollWidth <= window.innerWidth"),
  true,
  "Explore results must not overflow horizontally.",
);

socket.close();
console.log(
  "Explore result filtering, sorting, loading, and history checks passed.",
);
