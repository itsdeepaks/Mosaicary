import type { Metadata } from "next";

import { OssHumanReviewForm } from "@/components/oss-human-review/oss-human-review-form";

export const metadata: Metadata = {
  title: "OSS homepage human review",
  description:
    "A browser-local human-review workspace for the retained Online Scope Studio homepage proof candidate.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function OssHomepageHumanReviewPage() {
  return <OssHumanReviewForm />;
}
