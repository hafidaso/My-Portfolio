import { Metadata } from "next";
import GraphicsGrid from "@/components/GraphicsGrid";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Graphics - Creative Design Portfolio",
  description: "Explore Hafida Belayd's graphic design projects. View creative designs, branding work, and visual projects showcased on Behance. Professional graphic design portfolio with modern aesthetics.",
  keywords: [
    "Graphic Design Projects",
    "Creative Design",
    "Branding Projects",
    "Visual Design",
    "Behance Portfolio",
    "Design Work",
    "Creative Portfolio",
    "Visual Projects",
    "Digital Art",
    "Brand Identity Design",
    "Logo Design",
    "UI/UX Design",
    "Creative Direction",
    "Visual Communication"
  ],
  openGraph: {
    title: "Graphics - Creative Design Portfolio | Hafida Belayd",
    description: "Explore Hafida Belayd's graphic design projects. View creative designs, branding work, and visual projects showcased on Behance. Professional graphic design portfolio.",
    url: "https://hafida-belayd.me/graphics",
    type: "website",
    siteName: "Hafida Belayd Portfolio",
  },
  twitter: {
    title: "Graphics - Creative Design Portfolio | Hafida Belayd",
    description: "Explore Hafida Belayd's graphic design projects. View creative designs, branding work, and visual projects showcased on Behance. Professional graphic design portfolio.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://hafida-belayd.me/graphics",
  },
};

export default function Graphics() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <Breadcrumbs items={[{ label: "Graphics" }]} />
        <h1 className="text-5xl font-bold mb-24 text-center">
          🎨 Graphics
        </h1>
        <GraphicsGrid />
      </main>
    </div>
  );
} 