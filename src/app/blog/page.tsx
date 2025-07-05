import LatestPosts from "@/components/LatestPosts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read Hafida Belayd's blog posts about data science, Python programming, machine learning, AI, and data analysis. Expert insights and tutorials.",
  keywords: [
    "Data Science Blog",
    "Python Tutorials",
    "Machine Learning Blog",
    "AI Articles",
    "Data Analysis Blog",
    "Programming Tutorials",
    "Tech Blog",
    "Data Science Articles"
  ],
  openGraph: {
    title: "Blog - Hafida Belayd",
    description: "Read Hafida Belayd's blog posts about data science, Python programming, machine learning, AI, and data analysis.",
    url: "https://hafida-belayd.netlify.app/blog",
  },
  twitter: {
    title: "Blog - Hafida Belayd",
    description: "Read Hafida Belayd's blog posts about data science, Python programming, machine learning, AI, and data analysis.",
  },
};

export default function Blog() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-24 text-center">
          📝 Blog
        </h1>
        <LatestPosts />
      </main>
    </div>
  );
}