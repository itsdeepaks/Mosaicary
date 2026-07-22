# Product definition

## Working definition

The Design Context Engine is a private, local-first tool that converts a product brief, repository constraints, curated UI patterns, and user preferences into compact, traceable design decisions that coding agents can implement and later verify.

It is not primarily a gallery. The resource directory is an input surface for the engine.

## Target user

The first user is a solo builder who uses Codex or another coding agent to design and implement web products and wants better decisions with fewer repeated prompts and correction cycles. The user may have product judgment and references but no complete Figma file or dedicated product designer.

Later users may include small product teams and design engineers, but their needs must not shape the private MVP prematurely.

## Primary problem

Coding agents are often given a vague brief, an oversized list of inspiration links, and incomplete repository constraints. They can produce plausible UI, but they frequently guess at hierarchy, pattern choice, density, responsive behavior, states, and visual direction. The user then spends more tokens re-explaining intent and repairing inconsistencies.

## Product promise

Given a project and target screen, produce a concise, justified, editable design plan that:

- fits the users, job, brand, content, and technical constraints;
- cites a small set of relevant patterns and references;
- maps decisions to existing tokens and components;
- states responsive, interaction, accessibility, and state requirements;
- exports cleanly for a coding agent;
- can later be checked against the rendered result;
- remembers what the user accepted or rejected.

## Primary workflow

```text
Create or select project
→ enter product brief and repository constraints
→ review normalized Project Context
→ define a target Screen
→ retrieve suitable Patterns and References
→ choose or revise the recommendation
→ generate a Design Decision Pack
→ export Markdown/YAML for a coding agent
→ later run a browser Review
→ record accepted/rejected decisions as Project Rules
```

Human approval is a first-class step. The engine recommends and explains; it does not silently lock in taste or product decisions.

## Initial use cases

1. Turn rough product notes into a reusable project-context artifact.
2. Plan a new page or product screen before asking an agent to write UI code.
3. Find task-relevant patterns rather than browse generic inspiration endlessly.
4. Export a screen pack that can be attached to Codex, Claude Code, or Cursor.
5. Preserve constraints and preferences across multiple screens in one project.
6. Later, compare a local implementation with its approved pack at desktop and mobile widths.

## MVP boundary

The private MVP is complete when one user can:

- create, edit, duplicate, and archive local projects;
- create a normalized Project Context without requiring an AI API key;
- browse a small, manually curated pattern library and the existing resources;
- define a target Screen;
- select patterns/references and write or generate traceable Design Decisions;
- assemble and edit a Design Decision Pack;
- export project context and packs as Markdown and YAML;
- see source attribution and data freshness;
- back up or move local data in an understandable format.

MCP, automatic repository scanning, embeddings, AI-assisted synthesis, and visual review are valuable next phases, not prerequisites for proving the core decision workflow.

## Non-goals for the private MVP

- Accounts, subscriptions, payment processing, teams, or permissions.
- Community submissions, social features, public profiles, or a marketplace.
- Large-scale scraping or redistribution of paid screenshot libraries.
- A Mobbin-sized corpus.
- Custom model training.
- Automatic website publishing.
- A full design canvas or Figma replacement.
- One-click “make it beautiful” generation.
- A single opaque design-quality score.
- Support for every frontend framework or MCP client.

## Product principles

1. **Decision quality over corpus size.** A small set of structured patterns is more valuable than thousands of unclassified links.
2. **Explain selection.** Every recommendation should state why it fits and when it does not.
3. **Structured core, human-readable exports.** Store typed records; emit concise Markdown/YAML.
4. **Local and inspectable.** Personal project data, screenshots, and decisions remain understandable and movable.
5. **Human approval before build.** Recommendations remain editable and their status is explicit.
6. **Verification is part of design.** A future review loop must inspect the real browser, not only source code.
7. **Token efficiency by retrieval.** Agents receive one project summary and one screen pack, not the whole library.
8. **Provenance over copying.** Store attribution, rights notes, and observations; do not mirror commercial collections.

## Differentiation

| Product/category | What it primarily provides | This product's difference |
|---|---|---|
| DesignIndex and directories | Discovery of tools and inspiration sites | Converts selected knowledge into project-specific decisions and reusable context |
| Mobbin | Large searchable corpus of shipped screens and flows | Focuses on fit, rationale, constraints, memory, and verification; does not compete on screenshot count |
| Component libraries | Production-ready primitives and examples | Decides which patterns/components suit the task and how they compose into a screen |
| Figma MCP | Structured context from an existing Figma design | Creates design context when the starting point is a brief and repository rather than an approved design |
| AI UI builders | Generate a UI within their own workflow | Produces portable decision artifacts that can guide multiple coding agents and existing repositories |

## Success measures

For a repeated benchmark of real frontend tasks, compare agent-only work with engine-assisted work:

- input/output tokens to accepted UI;
- number of agent iterations and manual corrections;
- time to approved design pack and accepted implementation;
- responsive, accessibility, console, and missing-state failures;
- reuse of existing components/tokens;
- human ratings for hierarchy, content fit, coherence, and distinctiveness;
- percentage of implemented choices traceable to a project rule, decision, or selected pattern.

The product is useful only if it improves accepted outcomes or reduces iteration cost, not merely if it creates more documents.
