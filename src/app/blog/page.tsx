import { Metadata } from "next";
import BlogContent from "@/components/blog/BlogContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSortedPostsData, getAllCategories, getAllTags } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Blog - Data Science & AI Articles",
  description: "Read Hafida Belayd's blog posts about data science, Python programming, machine learning, AI, and data analysis. Expert insights and tutorials for data professionals.",
  keywords: [
    "Data Science Blog",
    "Python Tutorials",
    "Machine Learning Blog",
    "AI Articles",
    "Data Analysis Blog",
    "Programming Tutorials",
    "Tech Blog",
    "Data Science Articles",
    "Machine Learning Tutorials",
    "Python Programming Blog",
    "AI Development Blog",
    "Data Visualization Blog"
  ],
  openGraph: {
    title: "Blog - Data Science & AI Articles | Hafida Belayd",
    description: "Read Hafida Belayd's blog posts about data science, Python programming, machine learning, AI, and data analysis. Expert insights and tutorials.",
    url: "https://hafida-belayd.me/blog",
    type: "website",
    siteName: "Hafida Belayd Portfolio",
  },
  twitter: {
    title: "Blog - Data Science & AI Articles | Hafida Belayd",
    description: "Read Hafida Belayd's blog posts about data science, Python programming, machine learning, AI, and data analysis. Expert insights and tutorials.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://hafida-belayd.me/blog",
  },
};

export default async function Blog() {
  const posts = await getSortedPostsData();
  const categories = await getAllCategories();
  const tags = await getAllTags();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <Breadcrumbs items={[{ label: "Blog" }]} />
        <h1 className="text-5xl font-bold mb-24 text-center">
          📝 Blog
        </h1>
        <BlogContent posts={posts} categories={categories} tags={tags} />
      </main>
    </div>
  );
}