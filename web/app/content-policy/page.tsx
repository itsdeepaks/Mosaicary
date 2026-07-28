import { RoutePlaceholder } from "@/components/route-placeholder/route-placeholder";

export const metadata = {
  title: "Content policy",
};

export default function ContentPolicyPage() {
  return (
    <RoutePlaceholder
      eyebrow="Content and takedown preview"
      title="Tessli indexes references without claiming ownership of them."
      summary="The catalogue stores destination links and limited descriptive metadata. It must not scrape, proxy, or redistribute protected third-party content without permission."
      details={[
        "Remote SVG markup is never injected into the interface.",
        "Incorrect information, broken links, trademark concerns, and takedown requests require a reviewed correction path.",
        "The complete content, trademark, and takedown policy is owned by Slice 9.1.",
      ]}
    />
  );
}
