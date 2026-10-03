import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppProviders } from "@/shared/providers/AppProviders";

import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Frontend Template",
  description: "Reusable App Router template for frontend-first Next.js applications.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
