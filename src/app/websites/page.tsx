import { Metadata } from "next";
import WebsitesGrid from "@/components/WebsitesGrid";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Websites - Web Development Portfolio",
  description: "Explore Hafida Belayd's web development projects. View responsive websites, web applications, and modern web solutions with live demos and source code. Professional web development portfolio.",
  keywords: [
    "Web Development Projects",
    "Responsive Websites",
    "Web Applications",
    "React Projects",
    "Next.js Projects",
    "Frontend Development",
    "Full Stack Projects",
    "Portfolio Websites",
    "Web Design Projects",
    "Modern Web Development",
    "JavaScript Projects",
    "TypeScript Projects",
    "UI/UX Design",
    "Progressive Web Apps"
  ],
  openGraph: {
    title: "Websites - Web Development Portfolio | Hafida Belayd",
    description: "Explore Hafida Belayd's web development projects. View responsive websites, web applications, and modern web solutions with live demos and source code.",
    url: "https://hafida-belayd.me/websites",
    type: "website",
    siteName: "Hafida Belayd Portfolio",
  },
  twitter: {
    title: "Websites - Web Development Portfolio | Hafida Belayd",
    description: "Explore Hafida Belayd's web development projects. View responsive websites, web applications, and modern web solutions with live demos and source code.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://hafida-belayd.me/websites",
  },
};

export default function Websites() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <Breadcrumbs items={[{ label: "Websites" }]} />
        <h1 className="text-5xl font-bold mb-24 text-center">
          🌐 Websites
        </h1>
        <WebsitesGrid />
      </main>
    </div>
  );
} 