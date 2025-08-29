import { ChatOllama } from "@langchain/ollama";
import { HfInference } from "@huggingface/inference";

// Configuration for free AI services
export const AI_CONFIG = {
  // Ollama configuration (local, free)
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "llama3.1:8b", // Free model
    temperature: 0.7,
  },
  
  // Hugging Face configuration (free tier)
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY || "", // Optional for some models
    model: "microsoft/DialoGPT-medium", // Free model
  },
  
  // Fallback configuration
  fallback: {
    enabled: true,
    useMockResponses: true,
  }
};

// Initialize Ollama chat model
export function getOllamaModel() {
  try {
    return new ChatOllama({
      baseUrl: AI_CONFIG.ollama.baseUrl,
      model: AI_CONFIG.ollama.model,
      temperature: AI_CONFIG.ollama.temperature,
    });
  } catch (error) {
    console.error("Failed to initialize Ollama model:", error);
    return null;
  }
}

// Initialize Hugging Face inference
export function getHuggingFaceInference() {
  try {
    return new HfInference(AI_CONFIG.huggingface.apiKey);
  } catch (error) {
    console.error("Failed to initialize Hugging Face inference:", error);
    return null;
  }
}

// Mock responses for fallback when AI services are unavailable
export const MOCK_RESPONSES = {
  chat: {
    greeting: "Hello! I'm Hafida Belayd, a data analyst with a passion for turning data into actionable insights. I'm here to help you explore my work, skills, and experience. What would you like to know?",
    skills: "I specialize in data analysis, data visualization, and applied data science. I'm proficient in Python, SQL, Power BI, and Tableau. I also have experience with statistics, machine learning, and working with business intelligence tools to support data-driven decision-making.",
  projects: "I've worked on a wide range of data projects including predictive modeling for healthcare outcomes, marketing analytics dashboards, and smart city performance tracking. These projects have strengthened my ability to clean, analyze, and visualize complex datasets.",
  contact: "You can reach me at hafidabelaidagnaoui@gmail.com. I'm open to opportunities in data analytics, data science, and related roles where I can apply my skills to real-world challenges.",
  default: "I'm here to help you learn about my experience and skills in data analysis and data science. Feel free to ask about my tools, projects, or career journey!",
  recruiter: {
    strongestSkills: "My strongest skills include data cleaning, exploratory data analysis (EDA), dashboard development in Power BI/Tableau, and predictive modeling using Python (scikit-learn, pandas, etc.).",
    languages: "I primarily work with Python and SQL for data analysis. I'm also familiar with R, Java (basics), and DAX for Power BI.",
    recentProjects: "Recent projects include analyzing diabetes risk factors using machine learning, visualizing newsletter engagement metrics with HubSpot data, and developing dashboards to monitor supplier networks.",
    technologies: "I work with Python (pandas, numpy, matplotlib, seaborn, scikit-learn), SQL, Power BI, Tableau, and Excel. I also use Jupyter, VS Code, and GitHub for my workflow.",
    activity: "I maintain consistent GitHub activity and participate in data science competitions. My repositories show a mix of personal projects, case studies, and collaborative work.",
    experience: "I have over 3 years of experience in data analytics. I’ve worked on projects involving business intelligence, statistical analysis, and ML prototyping, often collaborating with cross-functional teams.",
    teamwork: "I collaborate effectively with business, marketing, and product teams to translate data into insights. I document my code clearly and use visuals to communicate findings to both technical and non-technical stakeholders."
  }
  },
  
  validation: {
    default: {
      isValid: true,
      message: "Stack validation completed",
      overall_score: 75,
      scores: {
        overall: 75,
        performance: 70,
        scalability: 80,
        maintainability: 75,
        security: 70,
        cost_efficiency: 85
      },
      analysis: {
        strengths: ["Good technology choices", "Modern stack"],
        weaknesses: ["Could improve security"],
        performance_impact: "Good performance characteristics",
        scalability_assessment: "Scalable architecture",
        security_considerations: "Consider security best practices",
        cost_efficiency: "Cost-effective solution",
        learning_curve: "Moderate learning curve",
        community_support: "Good community support"
      },
      compatibility_matrix: {
        compatible_pairs: ["React + Node.js", "TypeScript + Next.js"],
        incompatible_pairs: [],
        suggestions: ["Consider adding testing framework"]
      },
      recommendations: {
        immediate_actions: ["Add unit tests", "Implement security measures"],
        future_considerations: ["Monitor performance", "Plan for scaling"],
        alternative_technologies: ["Consider alternatives for specific use cases"]
      }
    }
  }
};

// Check if Ollama is available
export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${AI_CONFIG.ollama.baseUrl}/api/tags`);
    return response.ok;
  } catch (error) {
    console.warn("Ollama not available:", error);
    return false;
  }
}

// Get the best available AI service
export async function getBestAIService() {
  const ollamaAvailable = await isOllamaAvailable();
  
  if (ollamaAvailable) {
    return "ollama";
  } else if (AI_CONFIG.huggingface.apiKey) {
    return "huggingface";
  } else {
    return "fallback";
  }
}

// Generate response using available AI service
export async function generateResponse(prompt: string, context: string = "") {
  const service = await getBestAIService();
  
  switch (service) {
    case "ollama":
      try {
        const model = getOllamaModel();
        if (model) {
          const response = await model.invoke(`${prompt}\n\nContext: ${context}`);
          return response.content as string;
        }
      } catch (error) {
        console.error("Ollama error:", error);
      }
      break;
      
    case "huggingface":
      try {
        const hf = getHuggingFaceInference();
        if (hf) {
          const response = await hf.textGeneration({
            model: AI_CONFIG.huggingface.model,
            inputs: `${prompt}\n\nContext: ${context}`,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.7,
            }
          });
          return response.generated_text;
        }
      } catch (error) {
        console.error("Hugging Face error:", error);
      }
      break;
      
    case "fallback":
    default:
      // Return appropriate mock response based on prompt content
      const promptLower = prompt.toLowerCase();
      
      // Recruiter-specific responses
      if (promptLower.includes("strongest skills") || promptLower.includes("strongest skill")) {
        return MOCK_RESPONSES.chat.recruiter.strongestSkills;
      } else if (promptLower.includes("programming languages") || promptLower.includes("languages")) {
        return MOCK_RESPONSES.chat.recruiter.languages;
      } else if (promptLower.includes("recent projects") || promptLower.includes("summarize")) {
        return MOCK_RESPONSES.chat.recruiter.recentProjects;
      } else if (promptLower.includes("technologies") && promptLower.includes("specialize")) {
        return MOCK_RESPONSES.chat.recruiter.technologies;
      } else if (promptLower.includes("active") && promptLower.includes("consistent")) {
        return MOCK_RESPONSES.chat.recruiter.activity;
      } else if (promptLower.includes("experience") && (promptLower.includes("frontend") || promptLower.includes("backend") || promptLower.includes("full-stack"))) {
        return MOCK_RESPONSES.chat.recruiter.experience;
      } else if (promptLower.includes("teamwork") || promptLower.includes("independence")) {
        return MOCK_RESPONSES.chat.recruiter.teamwork;
      }
      
      // General responses
      if (promptLower.includes("skill")) {
        return MOCK_RESPONSES.chat.skills;
      } else if (promptLower.includes("project")) {
        return MOCK_RESPONSES.chat.projects;
      } else if (promptLower.includes("contact")) {
        return MOCK_RESPONSES.chat.contact;
      } else {
        return MOCK_RESPONSES.chat.default;
      }
  }
  
  return MOCK_RESPONSES.chat.default;
} 