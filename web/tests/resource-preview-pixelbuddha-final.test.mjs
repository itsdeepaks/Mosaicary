import assert from "node:assert/strict";
import test from "node:test";

import {
  PIXELBUDDHA_BATCH,
  PIXELBUDDHA_FINAL_ACTION,
  PIXELBUDDHA_TARGET,
  hydrateControls,
  selectNecessaryOnlyDeny,
} from "../scripts/capture-resource-preview-pixelbuddha-final.mjs";

test("final recapture remains fixed to Pixelbuddha", () => {
  assert.equal(PIXELBUDDHA_BATCH, "pixelbuddha-necessary-only-v4-20260803");
  assert.equal(PIXELBUDDHA_TARGET.name, "Pixelbuddha");
  assert.equal(PIXELBUDDHA_TARGET.resourceId, "resource-424e130e8422");
  assert.equal(PIXELBUDDHA_FINAL_ACTION, "deny");
});

test("snapshot text hydrates state omitted from JSON refs", () => {
  const refs = {
    e1: { role: "checkbox", name: "Necessary" },
    e2: { role: "switch", name: "Preferences" },
  };
  const snapshotText = [
    '- checkbox "Necessary" [checked=true, disabled, ref=e1]',
    '- switch "Preferences" [checked=false, ref=e2]',
  ].join("\n");
  const controls = hydrateControls(refs, snapshotText);
  assert.deepEqual(controls[0], {
    ref: "@e1",
    role: "checkbox",
    name: "necessary",
    checked: true,
    disabled: true,
  });
  assert.equal(controls[1].checked, false);
});

test("Deny is selectable only after necessary-only state is proven", () => {
  const refs = {
    e1: { role: "checkbox", name: "Necessary" },
    e2: { role: "switch", name: "Preferences" },
    e3: { role: "switch", name: "Statistics" },
    e4: { role: "switch", name: "Marketing" },
    e5: { role: "button", name: "Deny" },
    e6: { role: "button", name: "Allow all" },
  };
  const safeSnapshot = [
    '- checkbox "Necessary" [checked=true, disabled, ref=e1]',
    '- switch "Preferences" [checked=false, ref=e2]',
    '- switch "Statistics" [checked=false, ref=e3]',
    '- switch "Marketing" [checked=false, ref=e4]',
    '- button "Deny" [ref=e5]',
    '- button "Allow all" [ref=e6]',
  ].join("\n");
  assert.equal(selectNecessaryOnlyDeny(refs, safeSnapshot).ref, "@e5");
  assert.equal(
    selectNecessaryOnlyDeny(
      refs,
      safeSnapshot.replace(
        'switch "Marketing" [checked=false',
        'switch "Marketing" [checked=true',
      ),
    ),
    undefined,
  );
  assert.equal(
    selectNecessaryOnlyDeny(
      refs,
      safeSnapshot.replace("checked=true, disabled", "checked=true"),
    ),
    undefined,
  );
});
