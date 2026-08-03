import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllSourceProfiles, getSourceProfile } from "@/lib/source-profiles";

export function generateStaticParams() {
  return getAllSourceProfiles().map((profile) => ({ slug: profile.slug }));
}

type SourceProfilePageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export async function generateMetadata({ params }: SourceProfilePageProps) {
  const profile = getSourceProfile((await params).slug);
  if (!profile) return { title: "Source not found" };
  return {
    title: profile.name,
    description: profile.summary,
  };
}

export default async function SourceProfilePage({ params }: SourceProfilePageProps) {
  const profile = getSourceProfile((await params).slug);
  if (!profile) notFound();

  const providerAvailable = profile.status !== "inactive";

  return (
    <main id="main-content">
      <article className="tessli-container" style={{ paddingBlock: "3rem 5rem" }}>
        <nav aria-label="Breadcrumb">
          <Link href="/resources">Browse</Link> / {profile.name}
        </nav>
        <header style={{ maxWidth: "52rem", marginBlock: "2rem" }}>
          <p>{profile.domain}</p>
          <h1>{profile.name}</h1>
          <p>{profile.summary}</p>
        </header>
        <dl>
          <div>
            <dt>Coverage</dt>
            <dd>{profile.profileLevel}</dd>
          </div>
          <div>
            <dt>Source type</dt>
            <dd>{profile.sourceType.replaceAll("-", " ")}</dd>
          </div>
          <div>
            <dt>Access</dt>
            <dd>{profile.accessModel.access}</dd>
          </div>
          <div>
            <dt>Coverage note</dt>
            <dd>{profile.coverage.reason}</dd>
          </div>
        </dl>
        <p style={{ marginTop: "2rem" }}>
          {providerAvailable ? (
            <a href={profile.url} rel="noopener noreferrer" target="_blank">
              Visit source ↗
            </a>
          ) : (
            <span>Provider currently unavailable</span>
          )}
        </p>
        <p>
          This is the minimum truthful profile boundary. Capabilities, evidence,
          limitations, and related-source sections are expanded in the next
          approved Source Detail slice.
        </p>
      </article>
    </main>
  );
}
