import Link from "next/link";

export default function FoundationPage() {
  return (
    <main className="foundation-page">
      <section aria-labelledby="foundation-title" className="foundation-panel">
        <p className="foundation-label">Slice 1.1</p>
        <h1 id="foundation-title">Tessli application foundation</h1>
        <p>
          This isolated Next.js workspace establishes TypeScript, Tailwind CSS,
          linting, tests, builds, and continuous integration. The current public
          Tessli experience is still served from the repository root.
        </p>
        <Link href="/lab">Open the scaffold lab</Link>
      </section>
    </main>
  );
}
