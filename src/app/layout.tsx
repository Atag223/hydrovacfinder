import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HydroVacFinder.com - America's #1 Hydro-Vac & Disposal Facility Directory",
  description: "Find hydro-vac companies and disposal facilities near you. HydroVacFinder is a nationwide platform connecting Hydro-Vac Companies and Disposal Facilities with contractors, utilities, pipeline crews, municipalities, and project managers across the United States.",
  keywords: "hydro vac companies near me, hydro excavation companies near me, hydrovac disposal sites near me, hydrovac services, disposal facilities",
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
