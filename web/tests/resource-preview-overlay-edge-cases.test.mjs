import assert from "node:assert/strict";
import test from "node:test";

import {
  EDGE_BATCH,
  EDGE_FINAL_ACTIONS,
  EDGE_TARGETS,
  NECESSARY_ONLY_SAVE_ACTIONS,
  OPTIONAL_SWITCH_NAMES,
  chooseFinalRejection,
  chooseSettingsButton,
  findNecessaryOnlyPlan,
} from "../scripts/capture-resource-preview-overlay-edge-cases.mjs";

test("edge-case recapture remains fixed to Pixelbuddha and Relume", () => {
  assert.equal(EDGE_BATCH, "overlay-edge-v3-20260803");
  assert.deepEqual(
    EDGE_TARGETS.map((site) => site.name),
    ["Pixelbuddha", "Relume"],
  );
});

test("settings selection prefers the consent-panel button over a footer link", () => {
  const selected = chooseSettingsButton({
    e1: { role: "link", name: "Cookie Settings" },
    e2: { role: "button", name: "Cookie Settings" },
  });
  assert.equal(selected.ref, "@e2");
  assert.equal(selected.role, "button");
});

test("rejection selection excludes affirmative actions", () => {
  const selected = chooseFinalRejection({
    e1: { role: "button", name: "Accept Cookies" },
    e2: { role: "button", name: "Reject All Cookies" },
  });
  assert.equal(selected.ref, "@e2");
  assert.ok(EDGE_FINAL_ACTIONS.includes("reject all cookies"));
});

test("necessary-only plan requires a locked necessary control and exact save action", () => {
  const refs = {
    e1: { role: "checkbox", name: "Necessary", checked: true, disabled: true },
    e2: { role: "switch", name: "Preferences", checked: true },
    e3: { role: "switch", name: "Statistics", checked: true },
    e4: { role: "switch", name: "Marketing", checked: true },
    e5: { role: "button", name: "Allow selection" },
    e6: { role: "button", name: "Allow all" },
  };
  const snapshotText = [
    '- checkbox "Necessary" [checked=true, disabled, ref=e1]',
    '- switch "Preferences" [checked=true, ref=e2]',
    '- switch "Statistics" [checked=true, ref=e3]',
    '- switch "Marketing" [checked=true, ref=e4]',
    '- button "Allow selection" [ref=e5]',
  ].join("\n");
  const stateFreeRefs = Object.fromEntries(
    Object.entries(refs).map(([ref, descriptor]) => [
      ref,
      { role: descriptor.role, name: descriptor.name },
    ]),
  );
  const plan = findNecessaryOnlyPlan(stateFreeRefs, snapshotText);
  assert.equal(plan.necessary.ref, "@e1");
  assert.deepEqual(
    plan.optional.map((control) => control.name),
    OPTIONAL_SWITCH_NAMES,
  );
  assert.equal(plan.save.ref, "@e5");
  assert.deepEqual(NECESSARY_ONLY_SAVE_ACTIONS, ["allow selection"]);
  assert.equal(
    findNecessaryOnlyPlan(
      stateFreeRefs,
      snapshotText.replace("checked=true, disabled", "checked=true"),
    ),
    null,
  );
});
