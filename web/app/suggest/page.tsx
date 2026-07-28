import { RoutePlaceholder } from "@/components/route-placeholder/route-placeholder";

export const metadata = {
  title: "Suggest an improvement",
};

export default function SuggestPage() {
  return (
    <RoutePlaceholder
      eyebrow="Improve the index"
      title="Corrections and improvements will use a reviewed workflow."
      summary="Suggestions may cover outdated descriptions, access labels, broken destinations, missing metadata, or clearer categorisation. Nothing will publish directly without review."
      details={[
        "The current preview does not send or store suggestion form data.",
        "Repository history will preserve accepted catalogue corrections.",
        "Validated forms and moderation state are owned by Slices 12.1 and 12.2.",
      ]}
    />
  );
}
