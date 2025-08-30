import ProjectsGrid  from "@/components/ProjectsGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Data Analysis & AI Portfolio",
  description: "Explore Hafida Belayd's data analysis and AI projects. View Python, Machine Learning, Power BI, and data visualization projects with GitHub links and live demos. Professional portfolio showcasing technical expertise.",
  keywords: [
    "Data Analysis Projects",
    "Python Projects",
    "Machine Learning Projects",
    "Power BI Projects",
    "Data Visualization",
    "AI Projects",
    "GitHub Projects",
    "Portfolio Projects",
    "Data Science Portfolio",
    "Machine Learning Portfolio",
    "Python Development Projects",
    "Business Intelligence Projects"
  ],
  openGraph: {
    title: "Projects - Data Analysis & AI Portfolio | Hafida Belayd",
    description: "Explore Hafida Belayd's data analysis and AI projects. View Python, Machine Learning, Power BI, and data visualization projects with GitHub links and live demos.",
    url: "https://hafida-belayd.me/projects",
    type: "website",
    siteName: "Hafida Belayd Portfolio",
  },
  twitter: {
    title: "Projects - Data Analysis & AI Portfolio | Hafida Belayd",
    description: "Explore Hafida Belayd's data analysis and AI projects. View Python, Machine Learning, Power BI, and data visualization projects with GitHub links and live demos.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://hafida-belayd.me/projects",
  },
};

export default function Projects() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <Breadcrumbs items={[{ label: "Projects" }]} />
        <h1 className="text-5xl font-bold mb-24 text-center">
            👩‍💻Projects
        </h1>
        <ProjectsGrid />
      </main>
    </div>
  )
}