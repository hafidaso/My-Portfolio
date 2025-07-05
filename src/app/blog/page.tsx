import { Metadata } from "next";
import BlogContent from "@/components/blog/BlogContent";
import { getSortedPostsData, getAllCategories, getAllTags } from "../../../utils/markdown";

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

export default async function Blog() {
  const posts = await getSortedPostsData();
  const categories = await getAllCategories();
  const tags = await getAllTags();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-24 text-center">
          📝 Blog
        </h1>
        <BlogContent posts={posts} categories={categories} tags={tags} />
      </main>
    </div>
  );
}