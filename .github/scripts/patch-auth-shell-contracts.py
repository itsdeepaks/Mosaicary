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

web_ci = Path(".github/workflows/web-ci.yml")
replace_once(
    web_ci,
    '''          curl --fail --silent --show-error \\
            http://127.0.0.1:3000/resources > /tmp/tessli-resources.html\n\n          grep -q "Find better design resources, faster" /tmp/tessli-home.html''',
    '''          curl --fail --silent --show-error \\
            http://127.0.0.1:3000/resources > /tmp/tessli-resources.html\n          curl --fail --silent --show-error \\
            http://127.0.0.1:3000/auth > /tmp/tessli-auth.html\n\n          grep -q "Find better design resources, faster" /tmp/tessli-home.html''',
    "auth curl",
)
replace_once(
    web_ci,
    '''          grep -q "Source-backed, not ranked" /tmp/tessli-resources.html\n\n          unknown_collection_status''',
    '''          grep -q "Source-backed, not ranked" /tmp/tessli-resources.html\n          grep -q 'data-auth-shell="ready"' /tmp/tessli-auth.html\n          grep -q 'data-auth-configuration="unconfigured"' /tmp/tessli-auth.html\n          grep -q "Account access unavailable" /tmp/tessli-auth.html\n          grep -q "No sign-in request is sent from this page yet" \\
            /tmp/tessli-auth.html\n\n          unknown_collection_status''',
    "auth server assertions",
)
replace_once(
    web_ci,
    '''            test -s "artifacts/responsive-ui/full-reference-$width.png"\n          done''',
    '''            test -s "artifacts/responsive-ui/full-reference-$width.png"\n\n            "$chrome_bin" \\
              --headless=new \\
              --no-sandbox \\
              --disable-gpu \\
              --disable-dev-shm-usage \\
              --hide-scrollbars \\
              --force-device-scale-factor=1 \\
              --virtual-time-budget=2200 \\
              --window-size="$width,$height" \\
              --dump-dom \\
              http://127.0.0.1:3000/auth \\
              > "artifacts/responsive-ui/auth-$width.html"\n            grep -q 'data-auth-shell="ready"' \\
              "artifacts/responsive-ui/auth-$width.html"\n            grep -q 'data-auth-configuration="unconfigured"' \\
              "artifacts/responsive-ui/auth-$width.html"\n            grep -q "Account access unavailable" \\
              "artifacts/responsive-ui/auth-$width.html"\n\n            "$chrome_bin" \\
              --headless=new \\
              --no-sandbox \\
              --disable-gpu \\
              --disable-dev-shm-usage \\
              --hide-scrollbars \\
              --force-device-scale-factor=1 \\
              --virtual-time-budget=2200 \\
              --window-size="$width,$height" \\
              --screenshot="artifacts/responsive-ui/auth-$width.png" \\
              http://127.0.0.1:3000/auth\n            test -s "artifacts/responsive-ui/auth-$width.png"\n          done''',
    "auth responsive screenshots",
)
replace_once(
    web_ci,
    '          for route in "" "collections" "collections/saas-landing-pages" "lab/resource-cards" "resources"; do',
    '          for route in "" "collections" "collections/saas-landing-pages" "lab/resource-cards" "resources" "auth"; do',
    "auth 320 route",
)
replace_once(
    web_ci,
    '''              "lab/resource-cards") artifact="resource-cards" ;;\n              *) artifact="full-reference" ;;''',
    '''              "lab/resource-cards") artifact="resource-cards" ;;\n              "resources") artifact="full-reference" ;;\n              *) artifact="auth" ;;''',
    "auth 320 artifact",
)
replace_once(
    web_ci,
    '''          grep -q 'data-full-reference-page="true"' \\
            "artifacts/responsive-ui/full-reference-$width.html"''',
    '''          grep -q 'data-full-reference-page="true"' \\
            "artifacts/responsive-ui/full-reference-$width.html"\n          grep -q 'data-auth-shell="ready"' \\
            "artifacts/responsive-ui/auth-$width.html"\n          grep -q 'data-auth-configuration="unconfigured"' \\
            "artifacts/responsive-ui/auth-$width.html"''',
    "auth 320 assertions",
)

for helper in (
    Path(".github/scripts/patch-auth-shell-contracts.py"),
    Path(".github/workflows/auth-shell-contract-patch.yml"),
    Path(".github/workflows/auth-shell-pr-patch.yml"),
):
    helper.unlink(missing_ok=True)
