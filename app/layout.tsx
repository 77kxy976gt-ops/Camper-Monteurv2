import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frontdesk AI Assistent",
  description: "Een AI-assistent voor de frontdesk van een caravan- en camperbedrijf om klantmeldingen te analyseren en om te zetten in werkopdrachten.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="bg-brand-dark">{children}</body>
    </html>
  );
}
