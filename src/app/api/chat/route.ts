import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  interactionHistory?: string[];
  userPreferences?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { messages, interactionHistory = [], userPreferences = [] }: ChatRequest = await request.json();
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    const previousMessages = messages.slice(0, -1);

    // Track conversation context
    const conversationContext = {
      hasDiscussedDesign: interactionHistory.some(msg => 
        msg.toLowerCase().includes('logo') || 
        msg.toLowerCase().includes('design') || 
        msg.toLowerCase().includes('branding')
      ),
      hasDiscussedVideo: interactionHistory.some(msg => 
        msg.toLowerCase().includes('video') || 
        msg.toLowerCase().includes('motion') || 
        msg.toLowerCase().includes('promo')
      ),
      hasDiscussedData: interactionHistory.some(msg => 
        msg.toLowerCase().includes('data') || 
        msg.toLowerCase().includes('analysis') || 
        msg.toLowerCase().includes('python')
      ),
      hasDiscussedWeb: interactionHistory.some(msg => 
        msg.toLowerCase().includes('website') || 
        msg.toLowerCase().includes('web') || 
        msg.toLowerCase().includes('react')
      ),
      hasDiscussedPricing: interactionHistory.some(msg => 
        msg.toLowerCase().includes('price') || 
        msg.toLowerCase().includes('cost') || 
        msg.toLowerCase().includes('rate')
      ),
      hasDiscussedContact: interactionHistory.some(msg => 
        msg.toLowerCase().includes('contact') || 
        msg.toLowerCase().includes('email') || 
        msg.toLowerCase().includes('linkedin')
      ),
      messageCount: messages.length
    };

    let response = '';

    // Greeting responses with context awareness
    if (lastMessage.includes('hello') || lastMessage.includes('hi') || lastMessage.includes('hey')) {
      if (conversationContext.messageCount > 2) {
        response = "Hello again! 👋 How can I help you further with your project?";
      } else {
        response = "Hello! I'm Hafida Belayd — a multidisciplinary professional based in Morocco. I work across graphic design, video production, data analysis, and web development. How can I assist you today? 😊";
      }
    }
    // Design and creative requests with memory
    else if (lastMessage.includes('logo') || lastMessage.includes('branding') || lastMessage.includes('design') || lastMessage.includes('graphic') || lastMessage.includes('visual identity')) {
      if (conversationContext.hasDiscussedDesign) {
        if (lastMessage.includes('logo')) {
          response = "Since you're interested in logo design specifically, let me share some details about my process:\n\n🎨 **Logo Design Process:**\n1. **Discovery** - Understanding your brand values and target audience\n2. **Concept Development** - Creating multiple design directions\n3. **Refinement** - Iterating based on your feedback\n4. **Finalization** - Delivering files in all necessary formats\n\nI typically deliver 3-5 initial concepts and include unlimited revisions. What industry is your business in? This helps me create designs that resonate with your audience.";
        } else {
          response = "Great to continue our design discussion! What specific aspect would you like to explore further? I can share:\n\n• Examples of my recent design work\n• My design process and timeline\n• Pricing for different project types\n• How I approach brand identity development\n\nWhat interests you most?";
        }
      } else {
        response = "I'd love to help with your design project! I specialize in creating compelling visual identities, logos, and branding materials. I've worked on projects for luxury brands, restaurants, and businesses across various industries.\n\nMy design services include:\n\n🎨 Logo Design & Brand Identity\n📱 Social Media Graphics & Marketing Materials\n📄 Business Presentations & Print Design\n🎬 Video Production & Motion Graphics\n📦 Product Packaging Design\n\nI use Adobe Creative Suite and have experience with both traditional and AI-assisted design approaches. What type of design project do you have in mind?";
      }
    }
    // Video production requests with memory
    else if (lastMessage.includes('video') || lastMessage.includes('motion') || lastMessage.includes('promo') || lastMessage.includes('animation') || lastMessage.includes('editing')) {
      if (conversationContext.hasDiscussedVideo) {
        response = "Since we've talked about video production before, let me dive deeper! What specific aspect interests you?\n\n🎬 **Video Types I Create:**\n• Brand storytelling videos (2-3 minutes)\n• Social media content (15-60 seconds)\n• Product demos and explainer videos\n• Event highlights and promotional content\n\n📊 **Typical Timeline:**\n• Concept development: 1-2 days\n• Production: 3-7 days (depending on complexity)\n• Post-production: 2-5 days\n\nWhat type of video content are you looking to create?";
      } else {
        response = "Excellent! I have extensive experience in video production and motion graphics. I've created promotional videos, social media content, and motion graphics for various clients.\n\nMy video services include:\n\n🎬 Promotional Videos & Commercials\n📱 Social Media Video Content\n🎨 Motion Graphics & Animations\n✂️ Video Editing & Post-Production\n🎭 Brand Storytelling Videos\n\nI've worked on projects for B2B companies, luxury brands, and various industries. What kind of video project are you looking to create?";
      }
    }
    // Data analysis and science requests with memory
    else if (lastMessage.includes('data') || lastMessage.includes('analysis') || lastMessage.includes('analytics') || lastMessage.includes('python') || lastMessage.includes('sql') || lastMessage.includes('machine learning') || lastMessage.includes('ai')) {
      if (conversationContext.hasDiscussedData) {
        response = "Since you're interested in data science, let me share some specific examples of my work:\n\n📊 **Recent Data Projects:**\n• **Morocco Earthquake Analysis** - Analyzed seismic data patterns\n• **Machine Downtime Prediction** - ML model for industrial maintenance\n• **Global Internet Usage** - Comprehensive 2000-2023 analysis\n• **Plant Disease Detection** - AI-powered agricultural solution\n\n🔧 **My Tech Stack:**\n• Python (Pandas, NumPy, Scikit-learn, TensorFlow)\n• R for statistical analysis\n• SQL for database management\n• Power BI & Tableau for visualization\n\nWhat type of data challenge are you facing?";
      } else {
        response = "Perfect! I'm passionate about data science and analytics. I've worked on projects ranging from predictive modeling to business intelligence dashboards.\n\nMy data expertise includes:\n\n📊 Data Analysis & Visualization (Python, R, SQL)\n🤖 Machine Learning & Predictive Modeling\n📈 Business Intelligence (Power BI, Tableau)\n🔍 Statistical Analysis & A/B Testing\n🌐 Web Scraping & Data Automation\n\nI've completed projects like earthquake analysis for Morocco, machine downtime prediction, and global internet usage analysis. What type of data project are you working on?";
      }
    }
    // Web development requests with memory
    else if (lastMessage.includes('website') || lastMessage.includes('web') || lastMessage.includes('react') || lastMessage.includes('next.js') || lastMessage.includes('wordpress') || lastMessage.includes('development') || lastMessage.includes('app')) {
      if (conversationContext.hasDiscussedWeb) {
        response = "Since we've discussed web development, let me share my approach:\n\n🌐 **Development Process:**\n1. **Planning** - Requirements gathering and wireframing\n2. **Design** - UI/UX design and prototyping\n3. **Development** - Coding with modern frameworks\n4. **Testing** - Quality assurance and optimization\n5. **Deployment** - Launch and maintenance\n\n⚡ **Performance Focus:**\n• SEO optimization\n• Mobile-first responsive design\n• Fast loading times\n• Security best practices\n\nWhat type of website or application do you need?";
      } else {
        response = "Great! I have extensive experience in web development across different technologies and platforms.\n\nMy web development services include:\n\n🌐 Modern Web Applications (React, Next.js, TypeScript)\n📱 Responsive Website Design & Development\n🛒 E-commerce Solutions (WooCommerce, Shopify)\n⚡ Performance Optimization & SEO\n🔧 Custom WordPress Development\n\nI've built websites for luxury brands, restaurants, real estate agencies, and personal portfolios. What type of web project do you need help with?";
      }
    }
    // Portfolio and work requests with dynamic responses
    else if (lastMessage.includes('portfolio') || lastMessage.includes('work') || lastMessage.includes('projects') || lastMessage.includes('experience') || lastMessage.includes('show me')) {
      const randomExamples = [
        "I'd be happy to share my work! Here are some highlights from my portfolio:\n\n🎨 **Recent Design Work:**\n• Brand identity for luxury fashion brand\n• Social media campaign for restaurant chain\n• 3D product visualization for e-commerce\n\n📊 **Data Science Projects:**\n• Predictive maintenance system for manufacturing\n• Customer segmentation analysis\n• Real-time dashboard for business metrics\n\n🌐 **Web Development:**\n• E-commerce platform for luxury goods\n• Portfolio website with interactive elements\n• Custom WordPress solution for real estate\n\nWhich area would you like me to elaborate on?",
        
        "Here's a snapshot of my diverse portfolio:\n\n🎨 **Creative Projects:**\n• Logo design for tech startups\n• Video content for social media campaigns\n• 3D modeling for product presentations\n\n📊 **Analytics Work:**\n• Global internet usage analysis (2000-2023)\n• Machine learning for industrial applications\n• Business intelligence dashboards\n\n🌐 **Web Solutions:**\n• Modern React applications\n• WordPress customizations\n• E-commerce platforms\n\nWhat type of project interests you most?",
        
        "Let me share some of my favorite projects:\n\n🎨 **Design Excellence:**\n• Complete brand identity packages\n• Motion graphics for promotional videos\n• Social media content creation\n\n📊 **Data Innovation:**\n• AI-powered educational tools\n• Predictive analytics solutions\n• Interactive data visualizations\n\n🌐 **Web Development:**\n• Performance-optimized websites\n• Custom e-commerce solutions\n• Progressive web applications\n\nWould you like to see specific examples from any category?"
      ];
      
      response = randomExamples[Math.floor(Math.random() * randomExamples.length)];
    }
    // Skills and expertise requests with context
    else if (lastMessage.includes('skill') || lastMessage.includes('expertise') || lastMessage.includes('background') || lastMessage.includes('what can you do') || lastMessage.includes('services')) {
      if (conversationContext.messageCount > 3) {
        response = "Based on our conversation, I can see you're interested in my multidisciplinary approach! Here's what makes me unique:\n\n🎯 **Cross-Disciplinary Expertise:**\n• I bridge creative design with technical implementation\n• Data-driven insights inform my design decisions\n• Technical skills enhance my creative capabilities\n\n🔄 **Integrated Workflow:**\n• Design → Development → Analytics\n• Creative concepts backed by data\n• Technical solutions with beautiful interfaces\n\nWhat specific combination of skills would benefit your project?";
      } else {
        response = "I'm a multidisciplinary professional with expertise across several fields:\n\n🎨 **Creative & Design:**\n• Adobe Creative Suite (Photoshop, Illustrator, After Effects)\n• Logo design, branding, and visual identity\n• Video production and motion graphics\n• 3D modeling (Blender)\n• Social media content creation\n\n📊 **Data & Technology:**\n• Python, R, SQL for data analysis\n• Machine learning and predictive modeling\n• Power BI, Tableau for business intelligence\n• React, Next.js, TypeScript for web development\n• WordPress and e-commerce solutions\n\n🌐 **Web Development:**\n• Full-stack development with modern frameworks\n• Responsive design and UI/UX\n• Performance optimization and SEO\n• Custom WordPress development\n• E-commerce platform development\n\nWhat area interests you most?";
      }
    }
    // Pricing and collaboration requests with memory
    else if (lastMessage.includes('price') || lastMessage.includes('cost') || lastMessage.includes('rate') || lastMessage.includes('collaborate') || lastMessage.includes('hire') || lastMessage.includes('work together')) {
      if (conversationContext.hasDiscussedPricing) {
        response = "Since we've discussed pricing before, let me provide more specific information:\n\n💰 **Project-Based Pricing:**\n• Logo Design: $200-800 (depending on complexity)\n• Website Development: $1,500-5,000+\n• Video Production: $500-2,000+\n• Data Analysis: $300-1,500+\n\n⏰ **Timeline Options:**\n• Rush projects (additional 25% fee)\n• Standard timeline (1-3 weeks)\n• Long-term collaborations (discounted rates)\n\nWould you like to discuss your specific project requirements so I can provide a detailed quote?";
      } else {
        response = "I'm always excited to discuss new projects and collaborations! My rates vary depending on the project scope, timeline, and specific requirements.\n\nFor accurate pricing, I'd need to understand:\n\n📋 Project details and requirements\n⏰ Timeline and deadlines\n🎯 Deliverables and expectations\n💰 Budget considerations\n\nI offer flexible arrangements for different project types and can work on both short-term projects and long-term collaborations. Would you like to share more about your project so I can provide a tailored proposal?";
      }
    }
    // Technology and tools questions with dynamic responses
    else if (lastMessage.includes('technology') || lastMessage.includes('tech') || lastMessage.includes('tools') || lastMessage.includes('software') || lastMessage.includes('platform')) {
      const techResponses = [
        "I work with a comprehensive range of technologies and tools:\n\n🎨 **Design & Creative:**\n• Adobe Creative Suite (Photoshop, Illustrator, After Effects, Premiere Pro)\n• Blender for 3D modeling and animation\n• Figma for UI/UX design\n• Canva for quick social media graphics\n\n📊 **Data & Analytics:**\n• Python (Pandas, NumPy, Scikit-learn, TensorFlow)\n• R for statistical analysis\n• SQL for database management\n• Power BI, Tableau for visualization\n• Jupyter Notebooks for analysis\n\n🌐 **Web Development:**\n• React, Next.js, TypeScript\n• HTML5, CSS3, JavaScript\n• WordPress, WooCommerce\n• Tailwind CSS, Bootstrap\n• Git for version control\n\nWhat specific technology area are you interested in?",
        
        "My tech stack is quite diverse! Here's what I use:\n\n🎨 **Creative Tools:**\n• Adobe Creative Suite for professional design\n• Blender for 3D work and animations\n• Figma for collaborative design\n• Procreate for digital illustration\n\n📊 **Data & ML:**\n• Python ecosystem for data science\n• R for statistical modeling\n• SQL databases and data warehousing\n• Cloud platforms (AWS, Google Cloud)\n\n🌐 **Development:**\n• Modern JavaScript frameworks\n• TypeScript for type safety\n• WordPress ecosystem\n• Performance optimization tools\n\nWhich technology stack would benefit your project?",
        
        "I stay current with the latest technologies:\n\n🎨 **Design Software:**\n• Adobe Creative Suite (industry standard)\n• 3D modeling and animation tools\n• UI/UX design platforms\n• Video editing and motion graphics\n\n📊 **Data Science:**\n• Python for machine learning\n• Statistical analysis tools\n• Business intelligence platforms\n• Data visualization libraries\n\n🌐 **Web Technologies:**\n• Modern frontend frameworks\n• Backend development tools\n• Content management systems\n• E-commerce platforms\n\nWhat specific tools or technologies do you need for your project?"
      ];
      
      response = techResponses[Math.floor(Math.random() * techResponses.length)];
    }
    // Contact information requests with memory
    else if (lastMessage.includes('contact') || lastMessage.includes('email') || lastMessage.includes('linkedin') || lastMessage.includes('reach out') || lastMessage.includes('get in touch') || lastMessage.includes('connect')) {
      if (conversationContext.hasDiscussedContact) {
        response = "I'm here and ready to help! You can reach me at:\n\n📧 Email: hafidabelaidagnaoui@gmail.com\n💼 LinkedIn: https://www.linkedin.com/in/hafida-belayd\n\nFeel free to send me a message about your project details, timeline, or any questions you have. I typically respond within 24 hours! 😊";
      } else {
        response = "I'd love to connect with you! Here's how you can reach me:\n\n📧 Email: hafidabelaidagnaoui@gmail.com\n💼 LinkedIn: https://www.linkedin.com/in/hafida-belayd\n🌐 Portfolio: https://medevs.xyz\n\nFeel free to send me a message about your project, collaboration opportunities, or just to say hello! I'm always excited to discuss new opportunities and creative projects.";
      }
    }
    // Default response with context awareness
    else {
      const defaultResponses = [
        "That's an interesting question! As a multidisciplinary professional, I can help with various projects across design, data, and development. I specialize in:\n\n🎨 **Creative Services:** Logo design, branding, video production, motion graphics\n📊 **Data & Analytics:** Python analysis, machine learning, business intelligence\n🌐 **Web Development:** React, Next.js, WordPress, e-commerce solutions\n\nI'd be happy to discuss your specific needs! You can also reach me directly at:\n\n📧 Email: hafidabelaidagnaoui@gmail.com\n💼 LinkedIn: https://www.linkedin.com/in/hafida-belayd\n\nWhat type of project are you working on? 😊",
        
        "Great question! I work across multiple disciplines, which allows me to offer integrated solutions:\n\n🎨 **Design & Creative:** Brand identity, video content, social media graphics\n📊 **Data Science:** Analytics, machine learning, business intelligence\n🌐 **Web Development:** Modern websites, e-commerce, custom applications\n\nMy multidisciplinary approach means I can handle projects that require both creative and technical skills. What kind of project do you have in mind?\n\n📧 Email: hafidabelaidagnaoui@gmail.com\n💼 LinkedIn: https://www.linkedin.com/in/hafida-belayd",
        
        "I love that question! My background spans creative and technical fields:\n\n🎨 **Creative Expertise:** Logo design, video production, brand development\n📊 **Technical Skills:** Data analysis, machine learning, web development\n🌐 **Integrated Solutions:** Combining design with technology\n\nThis unique combination allows me to create solutions that are both beautiful and functional. What type of project are you considering?\n\n📧 Email: hafidabelaidagnaoui@gmail.com\n💼 LinkedIn: https://www.linkedin.com/in/hafida-belayd"
      ];
      
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Return the response in the format expected by useChat
    return new Response(response, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
} 