from pathlib import Path


def replace_once(path: Path, old: str, new: str, label: str) -> None:
    content = path.read_text(encoding="utf-8")
    if content.count(old) != 1:
        raise SystemExit(f"Expected exactly one {label} match in {path}")
    path.write_text(content.replace(old, new), encoding="utf-8")


build_slices = Path("build-slices.md")
replace_once(
    build_slices,
    "| 10.2a | Credential-ready auth shell and unavailable state | NEXT | 10.1c |",
    "| 10.2a | Credential-ready auth shell and unavailable state | DONE | 10.1c |",
    "10.2a ledger status",
)

release_browser = Path("web/tests/release-gate-browser.mjs")
replace_once(
    release_browser,
    '  ["/suggest", 200, "What this route does today"],\n  ["/collections/not-a-real-collection", 404, "Page not found"],',
    '  ["/suggest", 200, "What this route does today"],\n  ["/auth", 200, "Account access unavailable"],\n  ["/collections/not-a-real-collection", 404, "Page not found"],',
    "auth route check",
)
replace_once(
    release_browser,
    '  { name: "about", path: "/about", selector: "#main-content article" },\n  {\n    name: "contribution-guidance",',
    '  { name: "about", path: "/about", selector: "#main-content article" },\n  {\n    name: "auth",\n    path: "/auth",\n    selector: "[data-auth-shell=ready]",\n    auth: true,\n  },\n  {\n    name: "contribution-guidance",',
    "auth visual case",
)
replace_once(
    release_browser,
    '    assert.ok(audit.title.length > 0, `${visualCase.name} title at ${width}`);\n\n    const screenshot = await send("Page.captureScreenshot", {',
    '''    assert.ok(audit.title.length > 0, `${visualCase.name} title at ${width}`);\n\n    if (visualCase.auth) {\n      const authAudit = await evaluate(`(() => {\n        const shell = document.querySelector('[data-auth-shell=ready]');\n        const fieldset = shell?.querySelector('fieldset');\n        const controls = [...(fieldset?.querySelectorAll('button, input') ?? [])];\n        return {\n          configuration: shell?.getAttribute('data-auth-configuration'),\n          controlsDisabled:\n            controls.length === 3 && controls.every((control) => control.disabled),\n          fieldsetDisabled: Boolean(fieldset?.disabled),\n          noSubmitCopy: document.body.textContent.includes(\n            'No sign-in request is sent from this page yet',\n          ),\n        };\n      })()`);\n      assert.equal(\n        authAudit.configuration,\n        "unconfigured",\n        `auth configuration at ${width}`,\n      );\n      assert.equal(\n        authAudit.fieldsetDisabled,\n        true,\n        `auth fieldset disabled at ${width}`,\n      );\n      assert.equal(\n        authAudit.controlsDisabled,\n        true,\n        `auth controls disabled at ${width}`,\n      );\n      assert.equal(\n        authAudit.noSubmitCopy,\n        true,\n        `auth no-submit copy at ${width}`,\n      );\n    }\n\n    const screenshot = await send("Page.captureScreenshot", {''',
    "auth browser audit",
)

Path(".github/scripts/patch-auth-shell-contracts.py").unlink()
