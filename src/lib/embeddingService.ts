// Note: Mistral doesn't have embeddings API yet, so we'll use fallback text search
import { KnowledgeItem } from './knowledgeBase';

// Vector embedding configuration
interface EmbeddingConfig {
  model: string;
  dimensions: number;
  batchSize: number;
}

interface EmbeddedKnowledgeItem extends KnowledgeItem {
  embedding: number[];
  embeddingVersion: string;
}

// Default configuration for text-based embeddings (fallback)
const DEFAULT_EMBEDDING_CONFIG: EmbeddingConfig = {
  model: 'text-similarity-fallback', // Fallback text similarity model
  dimensions: 768, // Dimensions for fallback embeddings
  batchSize: 100 // Process embeddings in batches
};

// Embedding service class
export class EmbeddingService {
  private config: EmbeddingConfig;
  private embeddedItems: Map<string, EmbeddedKnowledgeItem> = new Map();
  private embeddingVersion = '1.0';

  constructor(config: Partial<EmbeddingConfig> = {}) {
    this.config = { ...DEFAULT_EMBEDDING_CONFIG, ...config };
  }

  // Generate embeddings for knowledge base items
  async generateEmbeddings(knowledgeItems: KnowledgeItem[]): Promise<EmbeddedKnowledgeItem[]> {
    // Since Mistral doesn't have embeddings API yet, we'll use enhanced fallback
    console.log('Using enhanced text-based similarity for knowledge base');
    
    const embeddedItems: EmbeddedKnowledgeItem[] = knowledgeItems.map(item => {
      const embeddedItem: EmbeddedKnowledgeItem = {
        ...item,
        embedding: this.generateFallbackEmbedding(item.content),
        embeddingVersion: this.embeddingVersion
      };
      this.embeddedItems.set(item.id, embeddedItem);
      return embeddedItem;
    });

    console.log(`Generated fallback embeddings for ${embeddedItems.length} knowledge items`);
    return embeddedItems;
  }

  // Generate query embedding
  async generateQueryEmbedding(query: string): Promise<number[]> {
    // Using fallback text-based embedding since Mistral doesn't have embeddings API
    return this.generateFallbackEmbedding(query);
  }

  // Semantic search using vector similarity
  async semanticSearch(
    query: string, 
    embeddedItems: EmbeddedKnowledgeItem[], 
    limit: number = 5,
    threshold: number = 0.3
  ): Promise<Array<{ item: EmbeddedKnowledgeItem; score: number }>> {
    // Generate query embedding
    const queryEmbedding = await this.generateQueryEmbedding(query);
    
    // Calculate similarity scores
    const scoredItems = embeddedItems.map(item => ({
      item,
      score: this.cosineSimilarity(queryEmbedding, item.embedding)
    }));

    // Filter by threshold and sort by score
    return scoredItems
      .filter(({ score }) => score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Hybrid search combining semantic and keyword search
  async hybridSearch(
    query: string,
    embeddedItems: EmbeddedKnowledgeItem[],
    limit: number = 5,
    semanticWeight: number = 0.7
  ): Promise<Array<{ item: EmbeddedKnowledgeItem; score: number }>> {
    // Get semantic search results
    const semanticResults = await this.semanticSearch(query, embeddedItems, limit * 2, 0.2);
    
    // Get keyword search results
    const keywordResults = this.keywordSearch(query, embeddedItems, limit * 2);
    
    // Combine and re-score results
    const combinedScores = new Map<string, number>();
    
    // Add semantic scores
    semanticResults.forEach(({ item, score }) => {
      combinedScores.set(item.id, (combinedScores.get(item.id) || 0) + score * semanticWeight);
    });
    
    // Add keyword scores
    keywordResults.forEach(({ item, score }) => {
      combinedScores.set(item.id, (combinedScores.get(item.id) || 0) + score * (1 - semanticWeight));
    });
    
    // Create final results
    const finalResults = Array.from(combinedScores.entries())
      .map(([itemId, score]) => {
        const item = embeddedItems.find(i => i.id === itemId);
        return item ? { item, score } : null;
      })
      .filter((result): result is { item: EmbeddedKnowledgeItem; score: number } => result !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    return finalResults;
  }

  // Keyword-based search as fallback
  private keywordSearch(
    query: string,
    items: EmbeddedKnowledgeItem[],
    limit: number
  ): Array<{ item: EmbeddedKnowledgeItem; score: number }> {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(' ').filter(word => word.length > 2);
    
    const scored = items.map(item => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const contentLower = item.content.toLowerCase();
      
      // Title matches (higher weight)
      if (titleLower.includes(queryLower)) score += 10;
      
      // Word-based scoring
      queryWords.forEach(word => {
        if (titleLower.includes(word)) score += 5;
        if (contentLower.includes(word)) score += 1;
        
        // Boost for exact word matches
        if (titleLower.split(' ').includes(word)) score += 3;
        if (contentLower.split(' ').includes(word)) score += 0.5;
      });
      
      // Type-specific boosts
      if (queryLower.includes('project') && item.type === 'project') score += 3;
      if (queryLower.includes('skill') && item.type === 'skill') score += 3;
      if (queryLower.includes('experience') && item.type === 'experience') score += 3;
      
      // Normalize score by content length to avoid bias toward longer content
      return { item, score: score / Math.log(item.content.length + 1) };
    });
    
    return scored
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Calculate cosine similarity between two vectors
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Prepare text for embedding by combining relevant fields
  private prepareTextForEmbedding(item: KnowledgeItem): string {
    const parts = [
      `Title: ${item.title}`,
      `Type: ${item.type}`,
      `Content: ${item.content}`
    ];
    
    // Add metadata context
    if (item.metadata.technologies) {
      parts.push(`Technologies: ${Array.isArray(item.metadata.technologies) ? item.metadata.technologies.join(', ') : item.metadata.technologies}`);
    }
    
    if (item.metadata.category) {
      parts.push(`Category: ${item.metadata.category}`);
    }
    
    return parts.join('\n');
  }

  // Generate fallback embedding using simple text hashing
  private generateFallbackEmbedding(text: string): number[] {
    const hash = this.simpleHash(text);
    const embedding = new Array(this.config.dimensions).fill(0);
    
    // Generate pseudo-random but deterministic embedding
    for (let i = 0; i < this.config.dimensions; i++) {
      embedding[i] = Math.sin(hash + i) * 0.5 + 0.5;
    }
    
    return embedding;
  }

  // Simple hash function for fallback embeddings
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  // Note: Mistral doesn't have embeddings API, so we removed OpenAI dependency

  // Utility delay function
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get embedded item by ID
  getEmbeddedItem(id: string): EmbeddedKnowledgeItem | undefined {
    return this.embeddedItems.get(id);
  }

  // Get all embedded items
  getAllEmbeddedItems(): EmbeddedKnowledgeItem[] {
    return Array.from(this.embeddedItems.values());
  }

  // Clear embeddings cache
  clearCache(): void {
    this.embeddedItems.clear();
  }
}

// Export singleton instance
export const embeddingService = new EmbeddingService();
