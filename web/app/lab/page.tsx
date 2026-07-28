import Link from "next/link";

const checks = [
  "Next.js App Router",
  "Strict TypeScript",
  "Tailwind CSS v4 pipeline",
  "ESLint and Prettier",
  "Node test baseline",
  "Production build and GitHub Actions",
] as const;

export const metadata = {
  title: "Scaffold lab",
};

export default function ScaffoldLabPage() {
  return (
    <main className="foundation-page">
      <section aria-labelledby="lab-title" className="foundation-panel">
        <p className="foundation-label">Developer-only route</p>
        <h1 id="lab-title">Tessli scaffold lab</h1>
        <p>
          Visual foundations, fonts, tokens, and component specimens begin in
          Slice 1.2. This page intentionally proves structure rather than design.
        </p>
        <ul>
          {checks.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>
        <Link href="/">Return to the foundation page</Link>
      </section>
    </main>
  );
}
