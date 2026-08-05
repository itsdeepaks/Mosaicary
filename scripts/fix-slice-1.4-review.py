from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    target = Path(path)
    content = target.read_text(encoding="utf-8")
    count = content.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected one match, found {count}: {old!r}")
    target.write_text(content.replace(old, new, 1), encoding="utf-8")


replace_once(
    "README.md",
    "The next repository slice is **1.5 Verification Contract and Operator Workflow**. It improves the shared website/export/MCP source truth and does not claim that the OSS proof succeeded.",
    "The next repository slice is **1.5 Verification Contract and Operator Workflow**. It defines claim-level evidence, freshness, reviewer, credential, persistence, redistribution, and safe-failure rules without promoting a source or claiming that the OSS proof succeeded.",
)

replace_once(
    "web/tests/release-hardening.test.mjs",
    '''  assert.match(
    plan,
    /## 5\\. Phase 1 — Source Intelligence Foundation\\n\\nStatus: \\*\\*ACTIVE\\*\\*/,
  );
  assert.match(
    plan,
    /### 1\\.4 Priority Source Profile Expansion — Batch 2\\n\\nStatus: \\*\\*DONE\\*\\*/,
  );''',
    '''  assert.match(
    plan,
    /## 5\\. Phase 1 — Source Intelligence Foundation\\n\\nStatus: \\*\\*ACTIVE\\*\\*/,
  );
  assert.match(
    plan,
    /### 1\\.3 Priority Source Profile Expansion — Batch 1\\n\\nStatus: \\*\\*DONE\\*\\*/,
  );
  assert.match(
    plan,
    /### 1\\.4 Priority Source Profile Expansion — Batch 2\\n\\nStatus: \\*\\*DONE\\*\\*/,
  );''',
)
