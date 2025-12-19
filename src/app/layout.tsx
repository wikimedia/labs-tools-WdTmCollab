import React from "react";

/**
 * This is the root layout that is required by Next.js.
 * Since all routes are handled by the `[locale]` segment, this layout is minimal.
 * The main layout of the application, including <html> and <body> tags,
 * is located in `src/app/[locale]/layout.tsx`.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
