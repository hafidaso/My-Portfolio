import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

let client: any = null;

function getClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error(
      "Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.",
    );
  }
  
  if (!client) {
    client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }
  
  return client;
}

// Function to get a vector store instance from an existing index
export async function getVectorStore() {
  // Use free Hugging Face embeddings via API
  const embeddings = new HuggingFaceInferenceEmbeddings({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    apiKey: process.env.HUGGINGFACE_API_KEY, // Optional for some models
  });
  
  return new SupabaseVectorStore(
    embeddings,
    {
      client: getClient(),
      tableName: 'documents',
      queryName: 'match_documents',
      filter: {},
    }
  );
}

// Function to get a reference to the embeddings collection
export async function getEmbeddingsCollection() {
  return getClient().from('documents');
}
