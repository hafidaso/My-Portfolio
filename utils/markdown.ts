// File: utils/markdown.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
  id: string;
  date: string;
  title: string;
  readTime: string;
  tags: string[];
  category: string;
  description: string;
  author: string;
  image?: string; // Add this line
}

export interface PostContent extends PostData {
  content: string;
}

export async function getSortedPostsData(): Promise<PostData[]> {
  try {
    const fileNames = await fs.readdir(postsDirectory);
    const allPostsData = await Promise.all(
      fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(async (fileName) => {
          try {
            const id = fileName.replace(/\.md$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = await fs.readFile(fullPath, 'utf8');
            const matterResult = matter(fileContents);
            const readTime = readingTime(matterResult.content).text;

            return {
              id,
              readTime,
              ...(matterResult.data as Omit<PostData, 'id' | 'readTime'>),
            };
          } catch (error) {
            console.warn(`Error processing post ${fileName}:`, error);
            return null;
          }
        })
    );

    return allPostsData
      .filter((post): post is PostData => post !== null)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.warn('Error reading posts directory:', error);
    return [];
  }
}

export async function getPostData(id: string): Promise<PostContent | null> {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const readTime = readingTime(matterResult.content).text;

    return {
      id,
      content: matterResult.content,
      readTime,
      ...(matterResult.data as Omit<PostData, 'id' | 'readTime'>),
    };
  } catch (error) {
    console.warn(`Error reading post ${id}:`, error);
    return null;
  }
}

export async function getAllPostIds(): Promise<{ params: { id: string } }[]> {
  try {
    const fileNames = await fs.readdir(postsDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => ({
        params: {
          id: fileName.replace(/\.md$/, ''),
        },
      }));
  } catch (error) {
    console.warn('Error reading posts directory:', error);
    // Return empty array if posts directory doesn't exist or can't be read
    return [];
  }
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getSortedPostsData();
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag: string) => tags.add(tag));
  });
  return Array.from(tags);
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getSortedPostsData();
  const categories = new Set<string>();
  posts.forEach((post) => {
    categories.add(post.category);
  });
  return Array.from(categories);
}