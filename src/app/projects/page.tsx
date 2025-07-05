import ProjectsGrid  from "@/components/ProjectsGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore Hafida Belayd's data analysis and AI projects. View Python, Machine Learning, Power BI, and data visualization projects with GitHub links and live demos.",
  keywords: [
    "Data Analysis Projects",
    "Python Projects",
    "Machine Learning Projects",
    "Power BI Projects",
    "Data Visualization",
    "AI Projects",
    "GitHub Projects",
    "Portfolio Projects"
  ],
  openGraph: {
    title: "Projects - Hafida Belayd",
    description: "Explore Hafida Belayd's data analysis and AI projects. View Python, Machine Learning, Power BI, and data visualization projects.",
    url: "https://hafida-belayd.netlify.app/projects",
  },
  twitter: {
    title: "Projects - Hafida Belayd",
    description: "Explore Hafida Belayd's data analysis and AI projects. View Python, Machine Learning, Power BI, and data visualization projects.",
  },
};

export default function Projects() {
  return (
    <div className="min-h-screen">

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-24 text-center">
            👩‍💻Projects
        </h1>
        <ProjectsGrid />
      </main>
    </div>
  )
}