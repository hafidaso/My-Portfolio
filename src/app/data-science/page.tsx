import { Metadata } from "next";
import DataScienceProjectsGrid from "@/components/DataScienceProjectsGrid";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "MY PLANET IN DATA - Data Science Projects",
  description: "Data science and analysis projects by Hafida Belayd. Machine learning, statistical analysis, and data visualization insights from real-world datasets.",
  keywords: [
    "Data Science Projects",
    "Data Analysis",
    "Machine Learning",
    "Statistical Analysis",
    "Data Visualization",
    "Python Projects",
    "Jupyter Notebooks",
    "Data Insights",
    "Renewable Energy Analysis",
    "Predictive Modeling",
    "Data Science Portfolio",
    "Statistical Modeling",
    "Data Mining",
    "Big Data Analysis",
    "Business Analytics"
  ],
  openGraph: {
    title: "MY PLANET IN DATA - Data Science Projects | Hafida Belayd",
    description: "Data science and analysis projects by Hafida Belayd. Machine learning, statistical analysis, and data visualization insights from real-world datasets.",
    url: "https://hafida-belayd.me//data-science",
    type: "website",
    siteName: "Hafida Belayd Portfolio",
  },
  twitter: {
    title: "MY PLANET IN DATA - Data Science Projects | Hafida Belayd",
    description: "Data science and analysis projects by Hafida Belayd. Machine learning, statistical analysis, and data visualization insights from real-world datasets.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://hafida-belayd.me//data-science",
  },
};

export default function DataScience() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <Breadcrumbs items={[{ label: "MY PLANET IN DATA" }]} />
        <h1 className="text-5xl font-bold mb-24 text-center">
          🌍 MY PLANET IN DATA
        </h1>
        <DataScienceProjectsGrid />
      </main>
    </div>
  );
} 