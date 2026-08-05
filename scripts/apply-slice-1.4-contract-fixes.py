from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    target = Path(path)
    content = target.read_text(encoding="utf-8")
    count = content.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected one match, found {count}: {old!r}")
    target.write_text(content.replace(old, new, 1), encoding="utf-8")


replace_once(
    "web/tests/full-reference-browser.mjs",
    "assert.equal(tableAudit.rows, 30);",
    "assert.equal(tableAudit.rows, 40);",
)
replace_once(
    "web/tests/for-ai-browser.mjs",
    'document.body.textContent.includes("265") && document.body.textContent.includes("30")',
    'document.body.textContent.includes("255") && document.body.textContent.includes("40")',
)
