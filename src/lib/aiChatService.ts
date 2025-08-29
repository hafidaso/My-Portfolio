import { Mistral } from '@mistralai/mistralai';
import { searchKnowledgeBase, getAllKnowledgeItems, getComprehensiveContext, KnowledgeItem } from './knowledgeBase';
import { embeddingService, EmbeddingService } from './embeddingService';

// Enhanced AI Chat Service Configuration
export interface ChatConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatContext {
  conversationHistory: ChatMessage[];
  userPreferences: string[];
  topicsDiscussed: string[];
  relevantKnowledge: KnowledgeItem[];
}

// Default configuration
const DEFAULT_CONFIG: ChatConfig = {
  model: 'mistral-small-latest', // Cost-effective model for portfolio chatbot
  temperature: 0.7, // Balanced creativity and consistency
  maxTokens: 800, // Reasonable length for chat responses
  systemPrompt: `You are Hafida Belayd, a multidisciplinary professional speaking directly to potential clients and collaborators. Respond as yourself in first person.

CORE IDENTITY:
- You are Hafida Belayd, speaking directly to visitors
- You share your own work, skills, and experience personally
- You provide accurate, helpful information about your portfolio
- You maintain a professional yet friendly conversational tone
- You are passionate about your work and always eager to help with new projects

RESPONSE STYLE:
- Speak as yourself (Hafida) in first person: "I have experience...", "My projects include...", "I can help you with..."
- Be conversational and engaging, not robotic
- Use specific examples from your own work when relevant
- Provide detailed, informative responses about your experience
- Share your contact information naturally when appropriate
- Show enthusiasm for your diverse skill set and passion for your work
- Use emojis sparingly and professionally

YOUR EXPERTISE:
- Data Science & Analytics (Python, Machine Learning, Statistical Analysis)
- Creative Design (Graphic Design, Video Production, Motion Graphics, 3D Modeling)
- Web Development (React, Next.js, WordPress, Full-stack development)
- Your specific projects and achievements
- Your professional experience and educational background
- Your technical skills and certifications

YOUR CONTACT INFORMATION:
- Email: hafidabelaidagnaoui@gmail.com
- LinkedIn: https://www.linkedin.com/in/hafida-belayd
- Portfolio: https://hafida-belayd.netlify.app/
- GitHub: https://github.com/hafidaso

IMPORTANT LINK FORMATTING:
- Always format external links as proper markdown links: [Link Text](URL)
- For LinkedIn: [LinkedIn](https://www.linkedin.com/in/hafida-belayd)
- For Behance: [Behance Portfolio](https://www.behance.net/gallery/214249171/Travel-Logo) or specific project links
- For GitHub: [GitHub](https://github.com/hafidaso)
- For portfolio projects: [Live Demo](URL) or [GitHub Repository](URL)
- Never just mention "LinkedIn 🔗" or "Behance portfolio 🔗" without the actual clickable link

Always provide accurate information based on the provided context. If you don't have specific information, acknowledge this and offer to help connect the user with Hafida directly.`
};

// Initialize Mistral client
let mistralClient: Mistral | null = null;

function getMistralClient(): Mistral | null {
  if (!mistralClient && process.env.MISTRAL_API_KEY) {
    mistralClient = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY,
    });
  }
  return mistralClient;
}

// Enhanced AI Chat Service Class
export class AIChatService {
  private config: ChatConfig;
  private knowledgeBase: KnowledgeItem[];
  private conversationMemory: Map<string, ChatContext> = new Map();
  private embeddingService: EmbeddingService;
  private embeddedKnowledgeReady: boolean = false;
  
  // Memory management constants
  private readonly MAX_SESSIONS = 100;
  private readonly MAX_MEMORY_SIZE = 50 * 1024 * 1024; // 50MB

  constructor(config: Partial<ChatConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.knowledgeBase = getAllKnowledgeItems();
    this.embeddingService = embeddingService;
    this.initializeEmbeddings();
  }

  // Initialize embeddings for the knowledge base
  private async initializeEmbeddings(): Promise<void> {
    try {
      console.log('Initializing embeddings for knowledge base...');
      await this.embeddingService.generateEmbeddings(this.knowledgeBase);
      this.embeddedKnowledgeReady = true;
      console.log('Knowledge base embeddings ready');
    } catch (error) {
      console.warn('Failed to initialize embeddings, falling back to keyword search:', error);
      this.embeddedKnowledgeReady = false;
    }
  }

  // Generate intelligent response using Mistral AI with RAG
  async generateResponse(
    userMessage: string,
    sessionId: string,
    options: {
      includeContext?: boolean;
      searchQuery?: string;
      contextLimit?: number;
    } = {}
  ): Promise<string> {
    // Input validation and sanitization
    if (!userMessage?.trim()) {
      throw new Error('User message is required');
    }
    
    if (userMessage.length > 1000) {
      throw new Error('User message too long (max 1000 characters)');
    }
    
    if (!sessionId?.trim()) {
      throw new Error('Session ID is required');
    }
    
    const { includeContext = true, searchQuery, contextLimit = 5 } = options;
    
    // Sanitize context limit
    const safeContextLimit = Math.min(Math.max(contextLimit, 1), 20);
    
    // Sanitize user message
    const sanitizedMessage = userMessage.trim().slice(0, 1000);

    try {
      // Get or create conversation context
      const context = this.getOrCreateContext(sessionId);
      
      // Search relevant knowledge using semantic or keyword search
      const query = searchQuery || sanitizedMessage;
      const relevantKnowledge = await this.searchRelevantKnowledge(query, safeContextLimit);
      
      // Build dynamic context
      const dynamicContext = this.buildDynamicContext(sanitizedMessage, relevantKnowledge, context);
      
      // Prepare messages for Mistral AI
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: includeContext ? 
            `${this.config.systemPrompt}\n\n=== RELEVANT CONTEXT ===\n${dynamicContext}` : 
            this.config.systemPrompt
        },
        ...context.conversationHistory.slice(-6), // Last 6 messages for context
        {
          role: 'user',
          content: sanitizedMessage
        }
      ];

      // Generate response with Mistral
      const response = await this.callMistral(messages);
      
      // Update conversation context
      this.updateContext(sessionId, sanitizedMessage, response, relevantKnowledge);
      
      // Cleanup memory if needed
      this.cleanupMemory();
      
      return response;

    } catch (error) {
      console.error('Mistral AI Chat Service Error:', error);
      return this.getFallbackResponse(sanitizedMessage);
    }
  }

  // Call Mistral API
  private async callMistral(messages: ChatMessage[]): Promise<string> {
    const client = getMistralClient();
    
    if (!client) {
      throw new Error('Mistral client not available');
    }

    const completion = await client.chat.complete({
      model: this.config.model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
    });

    const content = completion.choices?.[0]?.message?.content;
    
    // Handle both string and ContentChunk array responses
    if (typeof content === 'string') {
      return content;
    } else if (Array.isArray(content)) {
      // If content is an array of ContentChunk, extract text from each chunk
      return content.map(chunk => {
        if (typeof chunk === 'string') return chunk;
        if (chunk && typeof chunk === 'object' && 'text' in chunk) return chunk.text;
        return '';
      }).join('');
    }
    
    return 'I apologize, but I encountered an issue generating a response. Please try again.';
  }

  // Enhanced knowledge search using embeddings when available
  private async searchRelevantKnowledge(query: string, limit: number): Promise<KnowledgeItem[]> {
    if (this.embeddedKnowledgeReady) {
      try {
        // Use semantic search with embeddings
        const embeddedItems = this.embeddingService.getAllEmbeddedItems();
        const searchResults = await this.embeddingService.hybridSearch(query, embeddedItems, limit, 0.7);
        return searchResults.map(result => result.item);
      } catch (error) {
        console.warn('Embedding search failed, falling back to keyword search:', error);
      }
    }
    
    // Fallback to keyword search
    return searchKnowledgeBase(query, this.knowledgeBase, limit);
  }

  // Build dynamic context based on user query and knowledge
  private buildDynamicContext(
    userMessage: string, 
    relevantKnowledge: KnowledgeItem[], 
    context: ChatContext
  ): string {
    const sections: string[] = [];

    // Add relevant knowledge
    if (relevantKnowledge.length > 0) {
      sections.push('=== RELEVANT PORTFOLIO INFORMATION ===');
      relevantKnowledge.forEach(item => {
        sections.push(`${item.title}:\n${item.content.substring(0, 500)}...`);
      });
    }

    // Add conversation context
    if (context.topicsDiscussed.length > 0) {
      sections.push(`\n=== CONVERSATION CONTEXT ===`);
      sections.push(`Topics discussed: ${context.topicsDiscussed.join(', ')}`);
    }

    // Add user preferences
    if (context.userPreferences.length > 0) {
      sections.push(`User interests: ${context.userPreferences.join(', ')}`);
    }

    return sections.join('\n\n');
  }

  // Get or create conversation context
  private getOrCreateContext(sessionId: string): ChatContext {
    if (!this.conversationMemory.has(sessionId)) {
      this.conversationMemory.set(sessionId, {
        conversationHistory: [],
        userPreferences: [],
        topicsDiscussed: [],
        relevantKnowledge: []
      });
    }
    return this.conversationMemory.get(sessionId)!;
  }

  // Update conversation context
  private updateContext(
    sessionId: string, 
    userMessage: string, 
    aiResponse: string, 
    relevantKnowledge: KnowledgeItem[]
  ): void {
    const context = this.getOrCreateContext(sessionId);
    
    // Add messages to history
    context.conversationHistory.push(
      { role: 'user', content: userMessage, timestamp: new Date() },
      { role: 'assistant', content: aiResponse, timestamp: new Date() }
    );

    // Extract and add topics
    const extractedTopics = this.extractTopics(userMessage);
    extractedTopics.forEach(topic => {
      if (!context.topicsDiscussed.includes(topic)) {
        context.topicsDiscussed.push(topic);
      }
    });

    // Add user preferences
    const preferences = this.extractPreferences(userMessage);
    preferences.forEach(pref => {
      if (!context.userPreferences.includes(pref)) {
        context.userPreferences.push(pref);
      }
    });

    // Update relevant knowledge
    context.relevantKnowledge = relevantKnowledge;

    // Limit memory size to prevent bloat
    if (context.conversationHistory.length > 20) {
      context.conversationHistory = context.conversationHistory.slice(-20);
    }
    if (context.topicsDiscussed.length > 10) {
      context.topicsDiscussed = context.topicsDiscussed.slice(-10);
    }
  }

  // Memory management to prevent memory leaks
  private cleanupMemory(): void {
    if (this.conversationMemory.size > this.MAX_SESSIONS) {
      const entries = Array.from(this.conversationMemory.entries());
      const sortedEntries = entries.sort((a, b) => {
        const aTime = a[1].conversationHistory[a[1].conversationHistory.length - 1]?.timestamp?.getTime() || 0;
        const bTime = b[1].conversationHistory[b[1].conversationHistory.length - 1]?.timestamp?.getTime() || 0;
        return aTime - bTime;
      });
      
      // Remove oldest sessions
      const toRemove = sortedEntries.slice(0, this.conversationMemory.size - this.MAX_SESSIONS);
      toRemove.forEach(([sessionId]) => this.conversationMemory.delete(sessionId));
      
      console.log(`Cleaned up ${toRemove.length} old sessions`);
    }
  }

  // Extract topics from user message
  private extractTopics(message: string): string[] {
    const topics: string[] = [];
    const messageLower = message.toLowerCase();

    const topicKeywords = {
      'data_science': ['data', 'analysis', 'analytics', 'machine learning', 'ml', 'python', 'statistics', 'modeling'],
      'web_development': ['web', 'website', 'development', 'react', 'next.js', 'wordpress', 'frontend', 'backend'],
      'design': ['design', 'graphic', 'creative', 'branding', 'logo', 'visual', 'ui', 'ux'],
      'video': ['video', 'motion', 'animation', 'editing', 'promo', 'production'],
      'projects': ['project', 'portfolio', 'work', 'experience'],
      'skills': ['skill', 'technology', 'tool', 'expertise', 'proficiency'],
      'contact': ['contact', 'hire', 'collaborate', 'email', 'linkedin'],
      'pricing': ['price', 'cost', 'rate', 'budget', 'pricing']
    };

    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        topics.push(topic);
      }
    });

    return topics;
  }

  // Extract user preferences
  private extractPreferences(message: string): string[] {
    const preferences: string[] = [];
    const messageLower = message.toLowerCase();

    if (messageLower.includes('data') || messageLower.includes('analytics')) {
      preferences.push('data_science');
    }
    if (messageLower.includes('web') || messageLower.includes('development')) {
      preferences.push('web_development');
    }
    if (messageLower.includes('design') || messageLower.includes('creative')) {
      preferences.push('design');
    }

    return preferences;
  }

  // Intelligent fallback responses
  private getFallbackResponse(userMessage: string): string {
    const messageLower = userMessage.toLowerCase();

    // Categorize the question
    if (messageLower.includes('project') || messageLower.includes('portfolio')) {
      return `I'd be happy to share information about Hafida's portfolio! She has worked on diverse projects including:

🔬 **Data Science Projects:** AI-powered propaganda detection, global internet usage analysis, machine downtime prediction
🌐 **Web Development:** Modern portfolio sites, e-commerce platforms, and WordPress solutions
🎨 **Creative Design:** Brand identity work, social media content, video production, and 3D modeling

Which area interests you most? You can also view her complete portfolio at https://hafida-belayd.netlify.app/ or reach out directly at hafidabelaidagnaoui@gmail.com.`;
    }

    if (messageLower.includes('skill') || messageLower.includes('expertise')) {
      return `Hafida has a diverse skill set spanning multiple disciplines:

**Technical Skills:**
• Data Science: Python, Machine Learning, Statistical Analysis, Power BI, Tableau
• Web Development: React, Next.js, TypeScript, WordPress, HTML/CSS
• Design Tools: Adobe Creative Suite, Blender, Figma

**Languages:** Arabic (Native),  French (Fluent), English (Professional)

**Specializations:** Data visualization, predictive modeling, creative design, and full-stack development.

What specific skills or projects would you like to know more about?`;
    }

    if (messageLower.includes('contact') || messageLower.includes('hire') || messageLower.includes('collaborate')) {
      return `I'd be happy to help you connect with me! Here's how you can reach me:

📧 **Email:** hafidabelaidagnaoui@gmail.com
💼 **LinkedIn:** [LinkedIn](https://www.linkedin.com/in/hafida-belayd)
🌐 **Portfolio:** [My Portfolio](https://hafida-belayd.netlify.app/)
💻 **GitHub:** [GitHub](https://github.com/hafidaso)

I'm always interested in discussing new projects and collaboration opportunities across data science, web development, and creative design. Feel free to reach out directly!`;
    }

    // Default response
    return `Hello! I'm Hafida Belayd, and I'm excited to connect with you! I'm a multidisciplinary professional specializing in:

🔬 **Data Science & Analytics**
🌐 **Web Development** 
🎨 **Creative Design & Video Production**

Feel free to ask about my projects, skills, experience, or how I can help with your needs. You can also reach me directly at hafidabelaidagnaoui@gmail.com.

What would you like to know about my work or how I can help you?`;
  }

  // Clear conversation memory for a session
  clearSession(sessionId: string): void {
    this.conversationMemory.delete(sessionId);
  }

  // Get conversation summary
  getConversationSummary(sessionId: string): string | null {
    const context = this.conversationMemory.get(sessionId);
    if (!context) return null;

    return `Topics: ${context.topicsDiscussed.join(', ')} | Messages: ${context.conversationHistory.length} | Interests: ${context.userPreferences.join(', ')}`;
  }
}

// Export singleton instance
export const aiChatService = new AIChatService();
