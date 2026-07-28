import type { Metadata } from "next";
import type { ReactNode } from "react";

import { displayFont, interfaceFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tessli application foundation",
    template: "%s — Tessli",
  },
  description:
    "The isolated Next.js foundation for Tessli's phased product rebuild.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-grain="on">
      <body className={`${interfaceFont.variable} ${displayFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
