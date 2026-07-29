import { PublicContentPage } from "@/components/public-content/public-content-page";
export const metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <PublicContentPage
      eyebrow="Privacy"
      title="Browse and save without creating an account."
      summary="This statement describes Tessli's current Phase 1 public application. It is limited to functionality that exists today and will be revised before any account, analytics, or form system is introduced."
      relatedLinks={[
        { href: "/terms", label: "Terms" },
        { href: "/content-policy", label: "Content policy" },
        { href: "/about", label: "About Tessli" },
      ]}
      sections={[
        {
          id: "current-data",
          title: "What Tessli currently stores.",
          paragraphs: [
            "Tessli does not require an account, profile, email address, or password to browse the public catalogue. The current application does not provide a public form submission flow, analytics control, or cloud user-data workspace.",
            "When you save a resource, its stable catalogue identifier is stored in local browser storage on the browser and device you use. This lets Saved work without sending your saved list to a Tessli account or database.",
          ],
        },
        {
          id: "browser-storage",
          title: "Browser-local saves are under your browser's control.",
          paragraphs: [
            "Saved resources remain private to the current browser profile. Clearing browser storage, using a different browser or device, or removing an individual saved item can change what appears in Saved.",
            "Older Tessli and Mosaicary local save keys are read only to migrate compatible destinations into the current browser-local format. The older keys are not deleted by that migration.",
          ],
        },
        {
          id: "third-parties",
          title: "External destinations have their own practices.",
          paragraphs: [
            "Opening a resource takes you to an independent third-party site. Review that destination's privacy information before using it.",
            "Tessli may display limited external preview metadata where it is available. Resource cards use a no-referrer image policy for arbitrary external images and remain complete if those images fail.",
          ],
        },
      ]}
    />
  );
}
