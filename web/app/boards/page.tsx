import { ProjectBoardsExperience } from "@/components/project-boards/project-boards-experience";
import { getAllSourceProfiles } from "@/lib/source-profiles";

export const metadata = {
  title: "Project boards",
  description:
    "Private browser-local project boards for Tessli research sources, decisions, notes, and Markdown export.",
};

const resources = getAllSourceProfiles().map((profile) => ({
  id: profile.id,
  slug: profile.slug,
  name: profile.name,
  domain: profile.domain,
  url: profile.url,
  category: profile.category,
  access: profile.accessModel.access,
  profileLevel: profile.profileLevel,
  summary: profile.summary,
  bestFor: profile.bestFor,
  capabilities: profile.capabilities,
  limitations: profile.limitations,
  evidence: profile.evidence.map((item) => ({
    claim: item.claim,
    sourceUrl: item.sourceUrl,
    sourceType: item.sourceType,
    verifiedAt: item.verifiedAt,
    ...(item.confidence ? { confidence: item.confidence } : {}),
  })),
}));

export default function BoardsPage() {
  return (
    <main id="main-content">
      <ProjectBoardsExperience resources={resources} />
    </main>
  );
}
