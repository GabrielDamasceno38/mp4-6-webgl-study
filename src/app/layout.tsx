import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "McLaren MP4/6 · WebGL Study",
  description:
    "A frontend study built with Next.js, TypeScript and Three.js, featuring Drive and Studio experiences around the McLaren MP4/6.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
