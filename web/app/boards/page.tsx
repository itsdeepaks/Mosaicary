import catalogue from "@/data/catalogue.json";
import { ProjectBoardsExperience } from "@/components/project-boards/project-boards-experience";

export const metadata = {
  title: "Project boards",
  description:
    "Private browser-local project boards for Tessli research sources and notes.",
};

const resources = catalogue.resources.map((resource) => ({
  id: resource.id,
  slug: resource.slug,
  name: resource.name,
  domain: resource.domain,
  category: resource.category,
}));

export default function BoardsPage() {
  return (
    <main id="main-content">
      <ProjectBoardsExperience resources={resources} />
    </main>
  );
}
