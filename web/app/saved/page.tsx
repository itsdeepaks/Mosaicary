import { RoutePlaceholder } from "@/components/route-placeholder/route-placeholder";

export const metadata = {
  title: "Saved resources",
};

export default function SavedPage() {
  return (
    <RoutePlaceholder
      eyebrow="Private browser workspace"
      title="Saved resources will remain private to this browser."
      summary="This route now gives Tessli's resource-view navigation a stable destination. Saving, clearing, and undo behaviour will appear only after the resource-card interaction is complete."
      details={[
        "Browsing Tessli does not require an account or personal information.",
        "Future guest saves will use versioned browser storage rather than a remote profile.",
        "The empty, clear, and undo states will be designed before saving is enabled.",
      ]}
    />
  );
}
