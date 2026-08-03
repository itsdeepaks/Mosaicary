# Resource preview overlay verification

Status: **complete — controlled broader batch approved, unattended rollout not approved**

## Result

The five screenshots rejected for visible consent UI in Slice 5.4c-02 were
recaptured successfully. All five now have both machine-verified overlay removal
and independent contact-sheet approval.

- targets: **5**;
- captures: **5 succeeded / 0 failed**;
- verified clear: **5 / 5**;
- visually suitable: **5 / 5**;
- remaining consent overlays: **0**;
- production media records changed: **0**.

This raises the deliberately difficult fifteen-site experiment from **7 suitable
/ 5 recapture / 3 blocked** to **12 suitable / 3 terminal blocked**. The effective
suitability rate is therefore **80%**, with every remaining failure belonging to
a protected-page class rather than an unresolved consent-overlay class.

## Evidence

### Primary five-site run

- workflow run: `30841611029`;
- artifact: `8867042859`;
- digest:
  `sha256:596351064325b51099d90bc6cdfc7f04c36406a89572d58a051b366ebfe237af`;
- captures: **5**;
- first-pass verified clear: **3**;
- first-pass overlays remaining: **2**;
- raw bytes: **971,777**;
- optimized bytes: **120,848**.

Webflow, Framer, and Anima cleared with exact accessible actions. Pixelbuddha and
Relume remained visible and were retained as failures rather than falsely
approved.

### Consolidated edge run

- workflow run: `30843545360`;
- artifact: `8867785188`;
- digest:
  `sha256:1806796e513b13132c61c83c42955886124dc8adf7d0a058dc96ae9d3cad297f`;
- captures: **2**;
- verified clear: **2**;
- overlays remaining: **0**;
- raw bytes: **483,674**;
- optimized bytes: **64,124**.

The final Pixelbuddha and Relume contact sheet is visibly clear.

## Per-site decisions

| Resource | Verified strategy | WebP bytes | Decision |
| --- | --- | ---: | --- |
| Webflow | `Reject all` | 24,910 | suitable |
| Framer | `Reject` | 12,166 | suitable |
| Anima | `Reject non-essential cookies` | 16,904 | suitable |
| Pixelbuddha | disable Preferences, Statistics, and Marketing; prove Necessary remains locked; `Deny` | 30,144 | suitable |
| Relume | prefer consent-panel `Cookie Settings` button; `Reject all cookies` | 33,980 | suitable |

## Technical findings

1. A successful click command is not sufficient. Every action must be followed by
   a fresh accessibility snapshot and overlay audit.
2. `agent-browser` JSON refs can omit checked and disabled state that remains
   present in the textual snapshot. Necessary-only logic must merge both sources.
3. Same-named controls need role-aware selection. Relume exposed both a footer
   link and consent-panel button named `Cookie Settings`.
4. Consent interfaces may change their final action label as state changes.
   Pixelbuddha changed `Allow selection` to `Deny` only after all optional switches
   were off.
5. Exact site-specific actions are acceptable only behind proven state. `Deny`
   cannot run unless Necessary is checked and disabled and every reviewed optional
   switch is off.

## Safety boundary

No Accept, Agree, Allow all, general consent-save, CAPTCHA bypass, login bypass,
paywall bypass, protected-page bypass, DOM deletion, CSS hiding, or screenshot
editing was used.

## Decision

A **controlled twenty-site batch** may proceed with one execution trigger, an
immutable batch identifier, terminal blocked states, post-action verification,
and mandatory contact-sheet review.

An unattended all-catalogue rollout remains unapproved. The five clean images
also remain review artifacts only; publication requires a separate explicit
media-record and Storage slice.
