# Smart Portfolio with AI Integration

This project is a modern portfolio website built with Next.js 15, featuring AI-powered components including a chatbot, tech stack validation, and interactive visualizations.

## Key Features

- **AI-powered Chatbot**: Interactive portfolio exploration using LangChain and Ollama (free local AI), with vector search capabilities through Supabase pgvector
- **AI-powered Chatbot**: Interactive portfolio exploration with recruiter-focused questions
- **GitHub Integration**: Dynamic GitHub statistics, featured projects, and contribution graphs
- **Responsive Design**: Fully responsive UI with dark/light mode support using Tailwind CSS and NextUI components
- **Blog System**: Markdown-based blog with reading time estimation and syntax highlighting
- **Performance Optimized**: Server components, static generation, and efficient caching strategies

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS, NextUI components, Framer Motion
- **Database**: Supabase with pgvector for vector embeddings
- **AI/ML**: 
  - LangChain for chat functionality
  - Ollama for local AI models (free)
- Hugging Face for embeddings and fallback (free)
  - ReactFlow for tech stack visualization
- **GitHub API**: Octokit for repository and contribution data
- **UI Components**: 
  - React Icons
  - Lucide React
  - Recharts for data visualization
- **Content**: 
  - React Markdown
  - Gray Matter for frontmatter parsing
  - React Syntax Highlighter

## Features Summary

1. **Home Page**: Featuring about section, skills, timeline, and featured projects
2. **Blog System**: Markdown-based blog with filtering capabilities
3. **AI Chatbot**: Conversational interface for exploring the portfolio with recruiter-focused questions
4. **GitHub Integration**: Dynamic display of repositories and statistics

## Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- Git
- Ollama (for free local AI) - [Installation Guide](FREE-AI-SETUP.md)

## Installation Guide

### 1. Setup Ollama (Free AI)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a free model
ollama pull llama3.1:8b

# Start Ollama
ollama serve
```

### 2. Setup the Project

1. **Clone the Repository**
   ```bash
   git clone https://github.com/hafidaso/smart-portfolio.git
   cd smart-portfolio
   ```
2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Environment Setup**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Ollama (Local AI - Free)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# Hugging Face (Optional - Free)
HUGGINGFACE_API_KEY=your_huggingface_token_here

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # GitHub
   NEXT_PUBLIC_GITHUB_TOKEN=your_github_token

   # Optional: Add any other API keys needed for additional features
   ```
4. **Database Setup**
   Run the following SQL in your Supabase SQL editor to set up vector search:
   ```sql
   -- Enable the pgvector extension
   create extension if not exists vector;

   -- Create documents table for vector storage
   create table if not exists documents (
     id bigserial primary key,
     content text,
     metadata jsonb,
     embedding vector(1536)
   );

   -- Create the matching function
   create or replace function match_documents(
     query_embedding vector(1536),
     filter jsonb default '{}'::jsonb,
     match_count int default 10
   ) returns table (
     id bigint,
     content text,
     metadata jsonb,
     similarity float
   )
   language plpgsql
   as $$
   begin
     return query
     select
       id,
       content,
       metadata,
       1 - (documents.embedding <=> query_embedding) as similarity
     from documents
     where metadata @> filter
     order by documents.embedding <=> query_embedding
     limit match_count;
   end;
   $$;
   ```
5. **Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at `http://localhost:3000`
6. **Build for Production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## Project Structure

For a detailed breakdown of the project’s folders and files, see [Project-Structure.md](./Project-Structure.md).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.