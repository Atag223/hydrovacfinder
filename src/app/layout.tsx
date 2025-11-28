import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hydrovac Finder - Find Hydro-Excavation Services Near You",
  description: "Find trusted hydro-excavation and vacuum excavation services in your area. Safe, efficient, and non-destructive digging solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
