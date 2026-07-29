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

async function setViewport(width, height) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
}

async function navigate(pathname, readyExpression) {
  await send("Page.navigate", { url: `${origin}${pathname}` });
  await waitFor(
    `document.readyState === "complete" && (${readyExpression})`,
    pathname,
  );
}

function rowCountExpression(count) {
  return `document.querySelectorAll('[data-reference-table] tbody [data-reference-row]').length === ${count}`;
}

await send("Page.enable");
await send("Runtime.enable");
await setViewport(1440, 1200);
await navigate("/resources", rowCountExpression(295));

assert.equal(
  await evaluate(
    `getComputedStyle(document.querySelector('[data-full-reference-desktop]')).display !== 'none'`,
  ),
  true,
);
assert.equal(
  await evaluate(
    `getComputedStyle(document.querySelector('[data-full-reference-handoff]')).display === 'none'`,
  ),
  true,
);
assert.equal(
  await evaluate(
    `document.querySelectorAll('[data-reference-table] tbody [data-reference-row]').length`,
  ),
  295,
);
assert.equal(
  await evaluate(
    `document.querySelectorAll('[data-reference-table] [data-resource-save]').length`,
  ),
  0,
);
assert.equal(
  await evaluate(
    `document.querySelectorAll('[data-reference-table] a[target="_blank"][rel="noopener noreferrer"]').length`,
  ),
  295,
);
assert.equal(
  await evaluate(
    `document.querySelector('nav[aria-label="Primary navigation"] a[aria-current="page"]')?.textContent?.trim()`,
  ),
  "Resources",
);

await evaluate(`(() => {
  const input = document.querySelector('[data-full-reference-search]');
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  ).set;
  setter.call(input, 'motion');
  input.dispatchEvent(new Event('input', { bubbles: true }));
})()`);
await waitFor(
  `new URLSearchParams(window.location.search).get('q') === 'motion'`,
  "search URL state",
);
await waitFor(
  `Number(document.querySelector('[data-reference-announcement]')?.textContent.match(/^\\d+/)?.[0]) > 0 && document.querySelector('[data-reference-announcement]')?.textContent.includes('match “motion”')`,
  "search result announcement",
);
const motionCount = await evaluate(
  `document.querySelectorAll('[data-reference-table] tbody [data-reference-row]').length`,
);
assert.equal(motionCount > 0 && motionCount < 295, true);

await evaluate(
  `document.querySelector('[data-reference-category="motion-3d"]')?.click()`,
);
await waitFor(
  `new URLSearchParams(window.location.search).get('category') === 'motion-3d'`,
  "category URL state",
);
assert.equal(
  await evaluate(
    `Array.from(document.querySelectorAll('[data-reference-table] tbody [data-reference-row]')).every((row) => row.getAttribute('data-reference-category') === 'motion-3d')`,
  ),
  true,
);

await evaluate(
  `document.querySelector('[data-reference-access="free"]')?.click()`,
);
await waitFor(
  `new URLSearchParams(window.location.search).get('access') === 'free'`,
  "access URL state",
);
assert.equal(
  await evaluate(
    `Array.from(document.querySelectorAll('[data-reference-table] tbody [data-reference-row]')).every((row) => row.getAttribute('data-reference-access') === 'free')`,
  ),
  true,
);

await evaluate(`(() => {
  const select = document.querySelector('[data-reference-sort]');
  select.value = 'name-desc';
  select.dispatchEvent(new Event('change', { bubbles: true }));
})()`);
await waitFor(
  `new URLSearchParams(window.location.search).get('sort') === 'name-desc'`,
  "sort URL state",
);
const sortedNames = await evaluate(
  `Array.from(document.querySelectorAll('[data-reference-table] tbody [data-reference-name]')).map((row) => row.getAttribute('data-reference-name'))`,
);
assert.deepEqual(
  sortedNames,
  [...sortedNames].sort((left, right) =>
    right.localeCompare(left, "en", { numeric: true, sensitivity: "base" }),
  ),
);

await evaluate("window.history.back()");
await waitFor(
  `new URLSearchParams(window.location.search).get('sort') === null && document.querySelector('[data-reference-sort]')?.value === 'curated'`,
  "Back restored curated sort",
);
await evaluate("window.history.forward()");
await waitFor(
  `new URLSearchParams(window.location.search).get('sort') === 'name-desc' && document.querySelector('[data-reference-sort]')?.value === 'name-desc'`,
  "Forward restored descending sort",
);

await navigate(
  "/resources?q=zzzz-no-reference-match",
  `document.querySelector('[data-reference-state="empty"]') !== null`,
);
assert.equal(
  await evaluate(
    `document.querySelector('[data-reference-empty-reset]')?.textContent?.trim()`,
  ),
  "Reset reference view",
);
await evaluate(
  `document.querySelector('[data-reference-empty-reset]')?.click()`,
);
await waitFor(rowCountExpression(295), "empty-state reset");
assert.equal(
  await evaluate("window.location.pathname + window.location.search"),
  "/resources",
);

await setViewport(768, 1200);
await navigate(
  "/resources?q=type&category=typography&access=free&sort=name-asc",
  `document.querySelector('[data-full-reference-handoff]') !== null`,
);
assert.equal(
  await evaluate(
    `getComputedStyle(document.querySelector('[data-full-reference-desktop]')).display === 'none'`,
  ),
  true,
);
assert.equal(
  await evaluate(
    `getComputedStyle(document.querySelector('[data-full-reference-handoff]')).display !== 'none'`,
  ),
  true,
);
assert.equal(
  await evaluate(
    `document.querySelector('[data-full-reference-handoff] a')?.getAttribute('href')`,
  ),
  "/?q=type&category=typography&access=free&sort=name-asc",
);
assert.equal(
  await evaluate("document.documentElement.scrollWidth <= window.innerWidth"),
  true,
);

socket.close();
console.log("Full Reference desktop state and responsive handoff checks passed.");
