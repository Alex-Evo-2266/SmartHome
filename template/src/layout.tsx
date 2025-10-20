// app/layout.tsx
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "__MODULE_NAME__",
  description: "__MODULE_NAME__",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
