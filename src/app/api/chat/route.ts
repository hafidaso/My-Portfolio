/**
 * Enhanced AI Chat API with Multi-language Support and Advanced Features
 */
import { getVectorStore } from "@/lib/supabase";
import { Message as VercelChatMessage } from "ai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { detectLanguage, getLanguagePrompt, SupportedLanguageCode } from "@/lib/languageDetection";
import { getProjectRecommendations, getTechnologyRecommendations, getPersonalizedRecommendations } from "@/lib/projectRecommendations";
import { analyzeResume } from "@/lib/resumeAnalysis";
import { generatePortfolioDescriptions } from "@/lib/projectDescriptionGenerator";
import { getOllamaModel, generateResponse, MOCK_RESPONSES } from "@/lib/freeAIService";

/**
 * Main API handler for chat requests
 */
export async function POST(req: Request) {
  try {
    // Parse incoming request
    const body = await req.json();
    const messages = body.messages;
    const userPreferences = body.userPreferences || [];
    const interactionHistory = body.interactionHistory || [];

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Invalid request: messages array is required" },
        { status: 400 }
      );
    }

    // Get the current user message
    const currentMessageContent = messages[messages.length - 1].content;
    
    // Detect language from user message
    const detectedLanguage = detectLanguage(currentMessageContent);
    const languageCode = detectedLanguage.code as SupportedLanguageCode;
    const languagePrompt = getLanguagePrompt(languageCode);
    
    // Format previous messages for context
    const previousMessages = messages.slice(0, -1)
      .map(m => `${m.role === 'user' ? 'Human' : 'Assistant'}: ${m.content}`)
      .join('\n');

    // Initialize the language model using free AI service
    const model = getOllamaModel();
    
    // If Ollama is not available, use fallback
    if (!model) {
      // Return a simple response for now, will be handled in the chain
      console.warn("Ollama model not available, using fallback responses");
    }

    // Initialize the vector store and retriever
    const vectorStore = await getVectorStore();
    
    // Perform similarity search to find relevant resume information
    let resumeContext = "";
    try {
      const relevantDocs = await vectorStore.similaritySearch(currentMessageContent, 5);
      
      if (relevantDocs && relevantDocs.length > 0) {
        // Format the retrieved documents
        resumeContext = relevantDocs
          .map(doc => {
            const content = typeof doc.pageContent === 'string' 
              ? doc.pageContent 
              : String(doc.pageContent || '');
            return content;
          })
          .join('\n\n');
      }
    } catch (error) {
      console.error("Error retrieving documents:", error);
      resumeContext = "Error retrieving resume information.";
    }
    
    // If no context was found, provide a fallback
    if (!resumeContext.trim()) {
      resumeContext = `
        I am Hafida Belayd, a data analyst.
        I have worked at ePhilos AG as a Data Analyst, as a freelance Data Analyst, and as a Data Analyst intern at HM Communication.
        My skills include React, Next.js, JavaScript, TypeScript, HTML, CSS, Node.js, and more.
        My email is hafidabelaidagnaoui@gmail.com.
      `;
    }

    // Get AI-powered recommendations
    let recommendations = '';
    try {
      const projectRecs = getProjectRecommendations(currentMessageContent, 2);
      const techRecs = getTechnologyRecommendations(currentMessageContent, 3);
      const personalizedRecs = getPersonalizedRecommendations(interactionHistory, userPreferences);
      
      if (projectRecs.length > 0 || techRecs.length > 0) {
        recommendations = '\n\n## AI Recommendations:\n';
        
        if (projectRecs.length > 0) {
          recommendations += '\n**Related Projects:**\n';
          projectRecs.forEach(rec => {
            recommendations += `- ${rec.project.name}: ${rec.reason}\n`;
          });
        }
        
        if (techRecs.length > 0) {
          recommendations += '\n**Related Technologies:**\n';
          techRecs.forEach(rec => {
            recommendations += `- ${rec.technology} (${rec.category}): ${rec.reason}\n`;
          });
        }
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }

    // Create an enhanced prompt template with multi-language support
    const promptTemplate = PromptTemplate.fromTemplate(`
      You are Hafida Belayd, a data analyst answering questions about yourself on your portfolio website.
      
      ## Language Instruction
      {languagePrompt}
      
      ## Personality & Voice
      - Always speak in first person ("I", "me", "my") as Hafida Belayd
      - Be friendly, confident, and professional with a touch of enthusiasm
      - Keep responses concise and focused on the question
      - Show personality but prioritize being helpful and informative
      - Adapt your communication style to the detected language

      ## Content Guidelines
      - ONLY answer questions about your personal information, skills, experience, projects, education, or contact info
      - Base your answers STRICTLY on the context provided below - it contains your resume information
      - ALWAYS provide SPECIFIC details from your resume when asked about your experience, skills, etc.
      - When asked about where you worked, list the specific companies from your experience section
      - When asked about skills, provide the actual skills listed in your resume
      - When asked about projects, describe the specific projects in your portfolio
      - If asked about topics outside your portfolio/resume, politely redirect: "I'm here to talk about my work, skills, or experience—ask me anything about that!"
      
      ## Recruiter-Focused Responses
      - When answering recruiter questions, provide professional, objective assessments
      - Include specific metrics when available (GitHub stars, commit frequency, project complexity)
      - Highlight both technical skills and soft skills (collaboration, problem-solving, etc.)
      - Be honest about strengths and areas for growth
      - Provide context about project impact and business value
      - Mention any leadership, mentoring, or team collaboration experiences
      
      ## Special Features
      - If the user asks about project recommendations, use the AI recommendations provided
      - If the user asks about technology suggestions, provide relevant tech recommendations
      - If the user asks for resume analysis or improvements, offer to analyze their GitHub profile
      - If the user asks about project descriptions, offer to generate AI-enhanced descriptions

      ## Formatting
      - ALWAYS use Markdown formatting to improve readability:
        - Use bullet points (- ) for listing items like skills, responsibilities, etc.
        - Use numbered lists (1. 2. 3.) for sequential information or steps
        - Use **bold** for emphasis on important terms or titles
        - Use section headers (## ) to organize longer responses
      - Structure your answers with clear paragraphs and line breaks
      - When listing multiple items (skills, projects, etc.), ALWAYS use bullet points instead of comma-separated lists
      - Format links properly as [text](url) with no spaces in the URL
      - Use proper hyphenation for terms like "full-stack", "front-end", etc.
      - Ensure clean formatting with NO spaces between asterisks/text in bold/italic formatting
      
      ## Example of Well-Formatted Response
      When asked about your skills, respond like this:
      
      I specialize in full-stack development with expertise in:
      
      **Front-end Technologies:**
      - React
      - Next.js
      - TypeScript
      - HTML5/CSS3
      - Tailwind CSS
      
      **Back-end Technologies:**
      - Node.js
      - Express.js
      - PHP/Laravel
      - MySQL/MongoDB
      
      **DevOps & Tools:**
      - Git
      - Docker
      - CI/CD
      - Jest
      
      ## Resume Information
      {resumeContext}
      
      ## AI Recommendations
      {recommendations}
      
      ## Conversation History
      {chatHistory}
      
      ## Current Question
      {question}
      
      Your response:
    `);

    // Create a text encoder for the stream
    const encoder = new TextEncoder();
    
    // Create a readable stream
    const readable = new ReadableStream({
      async start(controller) {
        try {
          if (model) {
            // Use Ollama model if available
            const chain = promptTemplate
              .pipe(model)
              .pipe(new StringOutputParser());
            
            const stream = await chain.stream({
              languagePrompt: languagePrompt,
              resumeContext: resumeContext,
              recommendations: recommendations,
              chatHistory: previousMessages,
              question: currentMessageContent
            });

            for await (const chunk of stream) {
              // Ensure chunk is a string
              const text = typeof chunk === 'string' ? chunk : String(chunk || '');
              controller.enqueue(encoder.encode(text));
            }
          } else {
            // Use fallback response
            const fallbackResponse = await generateResponse(
              `Answer this question: ${currentMessageContent}`,
              resumeContext
            );
            controller.enqueue(encoder.encode(fallbackResponse));
          }
          controller.close();
        } catch (error) {
          console.error("Error processing stream:", error);
          // Send fallback response on error
          const fallbackResponse = MOCK_RESPONSES.chat.default;
          controller.enqueue(encoder.encode(fallbackResponse));
          controller.close();
        }
      },
    });

    // Return the stream as a response
    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    
    // Provide meaningful error response
    return Response.json(
      { 
        error: "Chat processing failed", 
        details: error?.message || "Unknown error occurred"
      }, 
      { status: 500 }
    );
  }
}