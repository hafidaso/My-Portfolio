import { NextRequest, NextResponse } from 'next/server';
import { aiChatService } from '@/lib/aiChatService';
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  interactionHistory?: string[];
  userPreferences?: string[];
  sessionId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { 
      messages, 
      interactionHistory = [], 
      userPreferences = [],
      sessionId 
    }: ChatRequest = await request.json();
    
    // Get the latest user message
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    // Generate or use existing session ID
    const currentSessionId = sessionId || uuidv4();
    
    // Use AI Chat Service to generate intelligent response
    const response = await aiChatService.generateResponse(
      lastMessage,
      currentSessionId,
      {
        includeContext: true,
        contextLimit: 5
      }
    );

    // Return the AI-generated response in the format expected by useChat
    return new Response(response, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Session-ID': currentSessionId,
      },
    });

  } catch (error) {
    console.error('AI Chat API error:', error);
    
    // Intelligent fallback based on the error
    const fallbackResponse = getFallbackResponse(error);
    
    return new Response(fallbackResponse, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}

// Intelligent fallback response based on error type
function getFallbackResponse(error: any): string {
  const errorMessage = error?.message?.toLowerCase() || '';
  
  if (errorMessage.includes('api') || errorMessage.includes('openai')) {
    return `Hi! I'm experiencing some technical difficulties with my AI systems right now, but I'm still here to help! 

I'm Hafida Belayd, and I specialize in:

🔬 **Data Science & Analytics:** Python, Machine Learning, Statistical Analysis, Power BI
🌐 **Web Development:** React, Next.js, WordPress, Full-stack solutions  
🎨 **Creative Design:** Graphic design, video production, 3D modeling, branding

For immediate assistance or detailed project discussions, you can reach me directly:
📧 hafidabelaidagnaoui@gmail.com
💼 LinkedIn: [LinkedIn](https://www.linkedin.com/in/hafida-belayd)

What would you like to know about my work or how I can help with your project?`;
  }
  
  if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
    return `I'm experiencing some connectivity issues, but I'm still here to help!

I'm Hafida Belayd, a multidisciplinary professional specializing in data science, web development, and creative design. I've worked on projects ranging from AI-powered applications to luxury brand websites.

**My Recent Highlights:**
• AI Counter-Propaganda Detector with 95% accuracy
• Global Internet Usage Analysis dashboard
• Multiple luxury brand websites and e-commerce platforms
• Machine learning models for predictive maintenance

Would you like to know more about any specific area of my expertise?`;
  }
  
  // General fallback
  return `Hello! I'm Hafida Belayd. While I'm experiencing some technical difficulties with my chat system, I can still share information about my work:

**My Expertise Areas:**
🔬 Data Science & Machine Learning
🌐 Web Development & E-commerce
🎨 Graphic Design & Video Production
📊 Business Intelligence & Analytics

**Contact Me:**
📧 hafidabelaidagnaoui@gmail.com
💼 [LinkedIn](https://www.linkedin.com/in/hafida-belayd)
🌐 Portfolio: https://hafida-belayd.netlify.app/

How can I help you with your project?`;
}
 