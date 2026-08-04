import Link from "next/link";

import type { SourceProfile } from "@/lib/source-profiles";
import type { SimilarSourceMatch } from "@/lib/similar-sources";

function label(value: string) {
  return value
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function List({ title, items }: { title: string; items: readonly string[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{label(item)}</li>
        ))}
      </ul>
    </section>
  );
}

export function IntelligenceDetail({
  profile,
  similar,
}: {
  profile: SourceProfile;
  similar: readonly SimilarSourceMatch[];
}) {
  const intelligence = profile.intelligence;

  return (
    <>
      {intelligence ? (
        <section data-enriched-intelligence aria-labelledby="intelligence-title">
          <p>Research intelligence</p>
          <h2 id="intelligence-title">Recorded capabilities and boundaries</h2>
          <p>
            This is a Profiled record, not a live provider verification. Details
            are limited to the linked evidence and recorded review date.
          </p>
          <List title="Capabilities" items={profile.capabilities} />
          <List title="Content objects" items={profile.contentObjects} />
          <List title="Platforms" items={profile.platforms} />
          <List title="Frameworks" items={profile.frameworks} />
          <List
            title="Integration methods"
            items={profile.integrationMethods}
          />
          <List
            title="Delivery formats"
            items={intelligence.deliveryFormats}
          />
          <List title="Design tools" items={intelligence.designTools} />
          <section>
            <h3>Governance</h3>
            <ul>
              <li>
                Persistence: {label(intelligence.governance.defaultPersistence)}
              </li>
              <li>
                Redistribution:{" "}
                {label(intelligence.governance.assetRedistribution)}
              </li>
              <li>
                Attribution: {label(intelligence.governance.sourceAttribution)}
              </li>
              <li>
                User credential required:{" "}
                {intelligence.governance.userCredentialRequired ? "Yes" : "No"}
              </li>
              <li>
                Terms review required:{" "}
                {intelligence.governance.termsReviewRequired ? "Yes" : "No"}
              </li>
            </ul>
          </section>
          <section>
            <h3>Evidence</h3>
            <ul>
              {profile.evidence.map((item) => (
                <li key={`${item.claim}-${item.sourceUrl}`}>
                  {item.claim} ({label(item.sourceType)}, {item.verifiedAt})
                </li>
              ))}
            </ul>
          </section>
        </section>
      ) : null}

      <section aria-labelledby="similar-sources-title">
        <p>Alternative discovery</p>
        <h2 id="similar-sources-title">Similar sources</h2>
        <p>
          Related by category, source type, and recorded capability overlap. This
          is not a universal quality ranking.
        </p>
        <ul>
          {similar.map((match) => (
            <li key={match.profile.id}>
              <Link href={`/resources/${match.profile.slug}`}>
                {match.profile.name}
              </Link>
              <p>{match.reasons.join(" · ")}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
