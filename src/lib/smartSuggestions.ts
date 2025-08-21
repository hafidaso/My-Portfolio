// Smart Follow-up Suggestions System
// Analyzes AI responses and generates contextually relevant follow-up questions

export interface FollowUpSuggestion {
  id: string;
  text: string;
  icon: string;
  category: 'technical' | 'project' | 'collaboration' | 'details' | 'portfolio';
  priority: number; // 1-5, higher = more relevant
}

export interface SuggestionContext {
  userMessage: string;
  aiResponse: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  topics: string[];
}

// Keywords and patterns for different types of suggestions
const SUGGESTION_PATTERNS = {
  technical: {
    keywords: ['python', 'javascript', 'react', 'machine learning', 'ai', 'database', 'api', 'framework', 'library', 'tool', 'technology', 'algorithm', 'model'],
    suggestions: [
      { text: "What specific tools and technologies did you use?", icon: "🛠️" },
      { text: "Can you explain the technical implementation?", icon: "⚙️" },
      { text: "What challenges did you face technically?", icon: "🧩" },
      { text: "How did you optimize performance?", icon: "⚡" },
      { text: "What would you do differently next time?", icon: "🔄" }
    ]
  },
  
  project: {
    keywords: ['project', 'built', 'developed', 'created', 'designed', 'worked on', 'implemented', 'portfolio', 'case study'],
    suggestions: [
      { text: "Can you show me more projects like this?", icon: "📁" },
      { text: "How long did this project take?", icon: "⏱️" },
      { text: "What was the most challenging part?", icon: "🎯" },
      { text: "What were the key results or outcomes?", icon: "📈" },
      { text: "Can I see the live project or code?", icon: "🔗" }
    ]
  },
  
  collaboration: {
    keywords: ['team', 'client', 'collaboration', 'work together', 'hire', 'freelance', 'consultant', 'availability', 'rate'],
    suggestions: [
      { text: "What's your availability for new projects?", icon: "📅" },
      { text: "How do you typically work with clients?", icon: "🤝" },
      { text: "What are your rates for this type of work?", icon: "💰" },
      { text: "Can you help me with a similar project?", icon: "🚀" },
      { text: "What's your project process like?", icon: "📋" }
    ]
  },
  
  details: {
    keywords: ['experience', 'skill', 'background', 'education', 'certification', 'years', 'expertise'],
    suggestions: [
      { text: "Tell me more about your experience in this area", icon: "📚" },
      { text: "What other skills complement this expertise?", icon: "🎨" },
      { text: "How did you learn these skills?", icon: "🎓" },
      { text: "What certifications do you have?", icon: "🏆" },
      { text: "What's your favorite part about this work?", icon: "❤️" }
    ]
  },
  
  portfolio: {
    keywords: ['design', 'graphic', 'web development', 'data science', 'analytics', 'creative', 'branding', 'ui', 'ux'],
    suggestions: [
      { text: "Can you show me your portfolio for this?", icon: "🎨" },
      { text: "What other services do you offer?", icon: "🌟" },
      { text: "Do you have any case studies I can see?", icon: "📖" },
      { text: "What makes your approach unique?", icon: "✨" },
      { text: "Can you walk me through your design process?", icon: "🎯" }
    ]
  }
};

// Smart suggestion generator
export class SmartSuggestionGenerator {
  
  generateSuggestions(context: SuggestionContext): FollowUpSuggestion[] {
    const suggestions: FollowUpSuggestion[] = [];
    const responseText = context.aiResponse.toLowerCase();
    const userText = context.userMessage.toLowerCase();
    
    // Analyze content and generate suggestions for each category
    Object.entries(SUGGESTION_PATTERNS).forEach(([category, config]) => {
      const relevanceScore = this.calculateRelevance(responseText, userText, config.keywords);
      
      if (relevanceScore > 0) {
        // Pick top suggestions based on relevance
        const categoryName = category as keyof typeof SUGGESTION_PATTERNS;
        const categorySuggestions = this.selectBestSuggestions(
          config.suggestions, 
          relevanceScore, 
          categoryName,
          context
        );
        
        suggestions.push(...categorySuggestions);
      }
    });
    
    // Add generic helpful suggestions if no specific ones found
    if (suggestions.length === 0) {
      suggestions.push(...this.getGenericSuggestions());
    }
    
    // Sort by priority and return top suggestions
    return suggestions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 4); // Limit to 4 suggestions
  }
  
  private calculateRelevance(responseText: string, userText: string, keywords: string[]): number {
    let score = 0;
    
    keywords.forEach(keyword => {
      // Check in AI response (higher weight)
      if (responseText.includes(keyword)) {
        score += 2;
      }
      // Check in user message (lower weight)
      if (userText.includes(keyword)) {
        score += 1;
      }
    });
    
    return score;
  }
  
  private selectBestSuggestions(
    suggestions: Array<{ text: string; icon: string }>, 
    relevanceScore: number, 
    category: keyof typeof SUGGESTION_PATTERNS,
    context: SuggestionContext
  ): FollowUpSuggestion[] {
    
    // Take top suggestions based on relevance
    const numSuggestions = Math.min(relevanceScore > 5 ? 2 : 1, suggestions.length);
    
    return suggestions.slice(0, numSuggestions).map((suggestion, index) => ({
      id: `${category}_${index}_${Date.now()}`,
      text: suggestion.text,
      icon: suggestion.icon,
      category: category as any,
      priority: relevanceScore + (suggestions.length - index) // Higher priority for more relevant and earlier suggestions
    }));
  }
  
  private getGenericSuggestions(): FollowUpSuggestion[] {
    return [
      {
        id: `generic_1_${Date.now()}`,
        text: "Tell me more about this",
        icon: "💬",
        category: 'details',
        priority: 1
      },
      {
        id: `generic_2_${Date.now()}`,
        text: "What other projects have you worked on?",
        icon: "📁",
        category: 'portfolio',
        priority: 1
      },
      {
        id: `generic_3_${Date.now()}`,
        text: "How can we work together?",
        icon: "🤝",
        category: 'collaboration',
        priority: 1
      }
    ];
  }
  
  // Analyze conversation topics for better context
  extractTopics(context: SuggestionContext): string[] {
    const allText = [
      context.userMessage,
      context.aiResponse,
      ...context.conversationHistory.map(msg => msg.content)
    ].join(' ').toLowerCase();
    
    const topics: string[] = [];
    
    // Common topic patterns
    const topicPatterns = {
      'data-science': ['data science', 'machine learning', 'ai', 'analytics', 'python', 'statistics'],
      'web-development': ['web development', 'react', 'javascript', 'frontend', 'backend', 'full-stack'],
      'design': ['design', 'graphic', 'ui', 'ux', 'branding', 'creative', 'logo'],
      'business': ['business', 'client', 'project', 'freelance', 'consultant', 'rates'],
      'technical': ['technical', 'code', 'programming', 'framework', 'library', 'api']
    };
    
    Object.entries(topicPatterns).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => allText.includes(keyword))) {
        topics.push(topic);
      }
    });
    
    return topics;
  }
}

// Singleton instance
export const smartSuggestionGenerator = new SmartSuggestionGenerator();
