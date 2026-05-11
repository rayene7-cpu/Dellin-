import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dellin Brain Dashboard",
  description: "Autonomous male mind control room"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
