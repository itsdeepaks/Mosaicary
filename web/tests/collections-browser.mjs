import assert from "node:assert/strict";

const endpoint = process.env.CDP_ENDPOINT ?? "http://127.0.0.1:9222";
const origin = process.env.TESSLI_ORIGIN ?? "http://127.0.0.1:3000";
const pending = new Map();
let messageId = 0;

const collectionSlugs = [
  "saas-landing-pages",
  "typography-font-tools",
  "motion-starter-pack",
  "open-source-ui-libraries",
  "accessible-colour-tools",
  "design-systems-worth-studying",
];

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

async function navigate(pathname, readyExpression) {
  await send("Page.navigate", { url: `${origin}${pathname}` });
  await waitFor(
    `document.readyState === "complete" && (${readyExpression})`,
    pathname,
  );
}

await send("Page.enable");
await send("Runtime.enable");
await navigate(
  "/collections",
  'document.querySelectorAll("[data-collection-card]").length === 6',
);

assert.equal(
  await evaluate('document.querySelectorAll("[data-collection-card]").length'),
  6,
);
assert.equal(
  await evaluate(
    'document.querySelectorAll("[data-collection-variant=featured]").length',
  ),
  2,
);
assert.equal(
  await evaluate(
    'document.querySelectorAll("[data-collection-variant=compact]").length',
  ),
  4,
);
assert.deepEqual(
  await evaluate(
    'Array.from(document.querySelectorAll("[data-collection-card] a")).map((link) => link.getAttribute("href"))',
  ),
  collectionSlugs.map((slug) => `/collections/${slug}`),
);
assert.equal(
  await evaluate(
    'document.querySelectorAll("[data-collection-card] button, [data-collection-card] [data-resource-save]").length',
  ),
  0,
  "Collection index cards must remain navigation-only.",
);
assert.equal(
  await evaluate(
    `document.querySelector('nav[aria-label="Primary navigation"] a[aria-current="page"]')?.textContent?.trim()`,
  ),
  "Collections",
);
assert.equal(
  await evaluate("document.documentElement.scrollWidth <= window.innerWidth"),
  true,
);

await evaluate('localStorage.removeItem("tessli-saved-resource-ids-v2")');

for (const [index, slug] of collectionSlugs.entries()) {
  await navigate(
    `/collections/${slug}`,
    `document.querySelector('[data-collection-detail="${slug}"]')?.getAttribute('data-collection-resource-count') === '10'`,
  );

  assert.equal(
    await evaluate(
      'document.querySelectorAll("[data-collection-resource-grid] > li").length',
    ),
    10,
    `${slug} should expose ten ordered resources.`,
  );
  assert.equal(
    await evaluate(
      'document.querySelectorAll("[data-collection-resource-grid] [data-resource-save]").length',
    ),
    10,
    `${slug} should expose one persistent Save control per resource.`,
  );
  assert.equal(
    await evaluate(
      `document.querySelectorAll('[data-collection-resource-grid] [data-resource-card] > a[target="_blank"][rel="noopener noreferrer"]').length`,
    ),
    10,
  );

  if (index === 0) {
    const savedResourceId = await evaluate(`(() => {
      const button = document.querySelector('[data-collection-resource-grid] [data-resource-save]');
      const card = button?.closest('[data-resource-card]');
      button?.click();
      return card?.getAttribute('data-resource-id') ?? null;
    })()`);

    assert.ok(savedResourceId, "The first collection resource should expose a stable ID.");
    await waitFor(
      `document.querySelector('[data-collection-resource-grid] [data-resource-save]')?.getAttribute('aria-pressed') === 'true'`,
      "collection resource save state",
    );
    assert.deepEqual(
      await evaluate(
        'JSON.parse(localStorage.getItem("tessli-saved-resource-ids-v2") ?? "[]")',
      ),
      [savedResourceId],
    );
  }

  assert.equal(
    await evaluate(
      `document.querySelector('nav[aria-label="Primary navigation"] a[aria-current="page"]')?.textContent?.trim()`,
    ),
    "Collections",
  );
  assert.equal(
    await evaluate(
      `document.querySelector('a[href="/suggest"]')?.textContent?.trim()`,
    ),
    "Suggest an improvement",
  );
  assert.equal(
    await evaluate("document.documentElement.scrollWidth <= window.innerWidth"),
    true,
  );
}

socket.close();
console.log("Collections index, detail, and persistent save checks passed.");
