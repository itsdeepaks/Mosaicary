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

async function pressKey({ code, key, modifiers = 0, virtualKeyCode }) {
  const params = {
    code,
    key,
    modifiers,
    nativeVirtualKeyCode: virtualKeyCode,
    windowsVirtualKeyCode: virtualKeyCode,
  };

  await send("Input.dispatchKeyEvent", { ...params, type: "keyDown" });
  await send("Input.dispatchKeyEvent", { ...params, type: "keyUp" });
}

async function navigate(pathname) {
  await send("Page.navigate", { url: `${origin}${pathname}` });
  await waitFor(
    'document.readyState === "complete" && Boolean(document.querySelector("[data-discovery-category]"))',
    `discovery controls at ${pathname}`,
  );
}

function urlParameter(name) {
  return `new URLSearchParams(window.location.search).get(${JSON.stringify(name)})`;
}

await send("Page.enable");
await send("Runtime.enable");

await navigate(
  "/?q=type&category=typography&access=free,open-source&sort=name-asc",
);
await waitFor(
  `${urlParameter("access")} === "free,open-source"`,
  "canonical access URL state",
);

assert.equal(
  await evaluate(
    'document.querySelector("[data-explore-search-input]")?.value',
  ),
  "type",
);
assert.equal(
  await evaluate(
    'document.querySelector("[data-category=typography]")?.getAttribute("aria-pressed")',
  ),
  "true",
);
assert.equal(
  await evaluate(
    'document.querySelector("[data-discovery-sort-select]")?.value',
  ),
  "name-asc",
);
assert.equal(
  await evaluate('document.querySelector("[data-filter-count]")?.textContent'),
  "3",
);

await send("Emulation.setDeviceMetricsOverride", {
  deviceScaleFactor: 1,
  height: 900,
  mobile: false,
  width: 1280,
});
await delay(100);
await evaluate(`(() => {
  const trigger = document.querySelector('[aria-controls="overflow-categories"]');
  trigger?.scrollIntoView({ block: 'center' });
  trigger?.click();
})()`);
await waitFor(
  `(() => {
    const panel = document.querySelector('[data-more-categories-panel]');
    if (!panel) return false;
    const rect = panel.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + 16, rect.top + 16);
    return rect.width > 0 && rect.height > 0 && panel.contains(hit);
  })()`,
  "visible More categories above the category scroller",
);
await pressKey({ code: "Escape", key: "Escape", virtualKeyCode: 27 });
await waitFor(
  '!document.querySelector("[data-more-categories-panel]")',
  "More categories closing",
);
await waitFor(
  'document.activeElement?.getAttribute("aria-controls") === "overflow-categories"',
  "More trigger focus return",
);
await send("Emulation.clearDeviceMetricsOverride");

await evaluate('document.querySelector("[data-filter-trigger]")?.click()');
await waitFor(
  'document.querySelector("[data-filter-dialog]")?.open === true',
  "filter dialog opening",
);
await waitFor(
  'document.activeElement?.getAttribute("aria-label") === "Close filters"',
  "filter-dialog initial focus",
);

assert.deepEqual(
  await evaluate(`Array.from(
    document.querySelectorAll('[data-access-filter]:checked')
  ).map((input) => input.getAttribute('data-access-filter'))`),
  ["free", "open-source"],
);

await pressKey({
  code: "KeyK",
  key: "k",
  modifiers: 2,
  virtualKeyCode: 75,
});
assert.equal(
  await evaluate(
    'document.activeElement?.hasAttribute("data-explore-search-input") === true',
  ),
  false,
  "Search shortcuts must not move focus behind an open modal.",
);

await evaluate('document.querySelector("[data-access-filter=paid]")?.click()');
await waitFor(
  `${urlParameter("access")} === "free,paid,open-source"`,
  "stable multi-access ordering",
);
assert.equal(
  await evaluate('document.querySelector("[data-filter-count]")?.textContent'),
  "4",
);

await pressKey({ code: "Escape", key: "Escape", virtualKeyCode: 27 });
await waitFor(
  'document.querySelector("[data-filter-dialog]")?.open === false',
  "Escape closing the filter dialog",
);
await waitFor(
  'document.activeElement?.hasAttribute("data-filter-trigger") === true',
  "filter trigger focus return",
);

await evaluate('document.querySelector("[data-category=icons]")?.click()');
await waitFor(`${urlParameter("category")} === "icons"`, "icons category URL");
await evaluate('document.querySelector("[data-category=motion-3d]")?.click()');
await waitFor(
  `${urlParameter("category")} === "motion-3d"`,
  "motion category URL",
);

await evaluate("window.history.back()");
await waitFor(`${urlParameter("category")} === "icons"`, "Back URL state");
await waitFor(
  'document.querySelector("[data-category=icons]")?.getAttribute("aria-pressed") === "true"',
  "Back restored category control",
);

await evaluate("window.history.forward()");
await waitFor(
  `${urlParameter("category")} === "motion-3d"`,
  "Forward URL state",
);
await waitFor(
  'document.querySelector("[data-category=motion-3d]")?.getAttribute("aria-pressed") === "true"',
  "Forward restored category control",
);

await evaluate(`(() => {
  const select = document.querySelector('[data-discovery-sort-select]');
  select.value = 'name-desc';
  select.dispatchEvent(new Event('change', { bubbles: true }));
})()`);
await waitFor(`${urlParameter("sort")} === "name-desc"`, "sort URL state");

await evaluate(`Array.from(document.querySelectorAll('button')).find(
  (button) => button.textContent?.trim() === 'Clear filters' && !button.closest('dialog')
)?.click()`);
await waitFor(
  `${urlParameter("category")} === null && ${urlParameter("access")} === null`,
  "cleared category and access filters",
);
assert.equal(await evaluate(urlParameter("q")), "type");
assert.equal(await evaluate(urlParameter("sort")), "name-desc");
assert.equal(
  await evaluate('Boolean(document.querySelector("[data-filter-count]"))'),
  false,
);

assert.equal(
  await evaluate(
    'Boolean(document.querySelector("[aria-label=\\"Resource views\\"]"))',
  ),
  false,
  "Homepage controls must not duplicate the dedicated Browse and Saved routes.",
);

await navigate("/?category=not-real&access=free,bogus&sort=not-real");
assert.equal(
  await evaluate(
    'document.querySelector("[data-category=all]")?.getAttribute("aria-pressed")',
  ),
  "true",
);
assert.equal(
  await evaluate(
    'document.querySelector("[data-discovery-sort-select]")?.value',
  ),
  "curated",
);
assert.equal(
  await evaluate('document.querySelector("[data-filter-count]")?.textContent'),
  "1",
);

await evaluate('document.querySelector("[data-filter-trigger]")?.click()');
await waitFor(
  'document.querySelector("[data-filter-dialog]")?.open === true',
  "fallback filter dialog",
);
assert.deepEqual(
  await evaluate(`Array.from(
    document.querySelectorAll('[data-access-filter]:checked')
  ).map((input) => input.getAttribute('data-access-filter'))`),
  ["free"],
);
await evaluate(
  `document.querySelector('[aria-label="Close filters"]')?.click()`,
);
await waitFor(
  'document.querySelector("[data-filter-dialog]")?.open === false',
  "fallback dialog close",
);

socket.close();
console.log("Discovery URL, menu, modal, and history checks passed.");
