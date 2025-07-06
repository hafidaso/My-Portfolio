import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

    // Personalized responses as Hafida Belayd
    let response = '';

    // Greeting responses
    if (lastMessage.includes('hello') || lastMessage.includes('hi') || lastMessage.includes('hey')) {
      response = "Hello! I'm Hafida Belayd — a Data Analyst and Creative Technologist. I turn complex data into smart solutions and compelling stories. How can I assist you today? 😊";
    }
    // Blog app requests
    else if (lastMessage.includes('blog') || lastMessage.includes('app for blog')) {
      response = "That's exciting! I can help you with that. I've built SEO-friendly blogs using modern stacks like Astro, React, and Markdown (e.g., Your Daily Way).\n\nWould you like:\n\n• A fast static blog (e.g., Astro/Markdown)?\n• A dynamic blog (e.g., Next.js + CMS)?\n• SEO optimization advice?\n\nJust let me know what you're aiming for — I can suggest a plan or even help you build it!";
    }
    // Analysis project requests
    else if (lastMessage.includes('analysis') || lastMessage.includes('data analysis') || lastMessage.includes('analysis project')) {
      response = "Great! I'd love to support your data project. I've worked on real-world analysis like earthquake monitoring for Morocco, as well as B2B marketing insights using Power BI, Python, and Tableau.\n\nWant help with:\n\n• Predictive modeling?\n• Dashboard design (Power BI/Tableau)?\n• Business intelligence strategy?\n• Data storytelling?\n\nTell me your goal, and I'll help outline your next steps.";
    }
    // Power BI questions
    else if (lastMessage.includes('power bi') || lastMessage.includes('powerbi')) {
      response = "Absolutely! I've used Power BI extensively — especially in my work at Yma Digital — to turn raw business data into interactive, decision-ready dashboards.\n\nI can help you:\n\n• Create compelling visuals\n• Design automated reports\n• Connect to SQL, Excel, or APIs\n• Build KPIs for business teams\n\nWant to see examples or start a dashboard project?";
    }
    // Skills and experience
    else if (lastMessage.includes('skill') || lastMessage.includes('experience') || lastMessage.includes('background') || lastMessage.includes('tell me about your skills')) {
      response = "Sure! I blend data analysis with design and software development. Here are my key strengths:\n\n🧠 Technical: Python, Power BI, SQL, Excel, Tableau, Flask, React\n📊 Data: Predictive modeling, dashboarding, A/B testing, ETL\n🎨 Creative: Adobe Suite, UI/UX, B2B content, WordPress\n🤝 Soft Skills: Strategic thinking, storytelling, team collaboration\n\nWant to see my portfolio or talk about a project idea?";
    }
    // Scientist question
    else if (lastMessage.includes('scientist') || lastMessage.includes('are you a scientist')) {
      response = "Yes! My journey began in creative design and evolved into data science — where I now apply statistical modeling, machine learning, and analytics to real-world problems. I'm certified in Data Science (DataCamp, Udacity) and trained in AI, BI, and software engineering (ALX, Google BI, etc.).\n\nI'm passionate about using data for impact, not just insight.";
    }
    // General project help
    else if (lastMessage.includes('project') || lastMessage.includes('help') || lastMessage.includes('build')) {
      response = "I'd be happy to help you with your project! As a Data Analyst and Creative Technologist, I can assist with data analysis, visualization, statistical modeling, or building applications. What specific type of project are you working on?";
    }
    // Technology questions
    else if (lastMessage.includes('technology') || lastMessage.includes('tech') || lastMessage.includes('stack')) {
      response = "I work with a variety of technologies including Python, R, SQL, React, Next.js, Power BI, Tableau, and data visualization tools. I'm particularly experienced in statistical analysis, machine learning, and building data-driven applications. What specific technology area are you interested in?";
    }
    // Contact information requests
    else if (lastMessage.includes('contact') || lastMessage.includes('email') || lastMessage.includes('linkedin') || lastMessage.includes('reach out') || lastMessage.includes('get in touch')) {
      response = "I'd love to connect with you! Here's how you can reach me:\n\n📧 Email: hafidabelaidagnaoui@gmail.com\n💼 LinkedIn: linkedin.com/in/hafida-belayd\n\nFeel free to send me a message about your project, collaboration opportunities, or just to say hello!";
    }
    // Default response with contact information
    else {
      response = "That's an interesting question! While I can help with many topics related to data analysis, technology, and my professional experience, some questions might be better answered through a direct conversation.\n\nI'd be happy to discuss this further! You can reach me at:\n\n📧 Email: hafidabelaidagnaoui@gmail.com\n💼 LinkedIn: linkedin.com/in/hafida-belayd\n\nFeel free to send me a message, and I'll get back to you as soon as possible! 😊";
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