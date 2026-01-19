import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrueDogAge — Real Dog Age Calculator",
  description:
    "Calculate your dog's true age in human years using the latest scientific formula based on epigenetic research.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
