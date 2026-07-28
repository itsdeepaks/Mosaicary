import Link from "next/link";

export default function FoundationPage() {
  return (
    <main className="foundation-page" id="main-content">
      <section aria-labelledby="foundation-title" className="foundation-panel">
        <p className="foundation-label">Application preview</p>
        <h1 id="foundation-title">Tessli application foundation</h1>
        <p>
          This isolated Next.js workspace establishes the verified product
          foundation while the current public Tessli experience remains served
          from the repository root.
        </p>
        <Link href="/lab">Open the design foundation lab</Link>
      </section>
    </main>
  );
}
