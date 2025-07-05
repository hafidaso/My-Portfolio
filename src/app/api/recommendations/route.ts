import { NextRequest, NextResponse } from 'next/server';
import { 
  getProjectRecommendations, 
  getTechnologyRecommendations, 
  getPersonalizedRecommendations 
} from '@/lib/projectRecommendations';

export async function POST(request: NextRequest) {
  try {
    const { 
      query, 
      type = 'all', 
      limit = 5, 
      interactionHistory = [], 
      userPreferences = [] 
    } = await request.json();

    if (!query && type !== 'personalized') {
      return NextResponse.json(
        { error: 'Query is required for project and technology recommendations' },
        { status: 400 }
      );
    }

    let recommendations: any = {};

    if (type === 'personalized' || type === 'all') {
      // Get personalized recommendations
      const personalized = getPersonalizedRecommendations(interactionHistory, userPreferences);
      recommendations.personalized = personalized;
    }

    if (type === 'projects' || type === 'all') {
      // Get project recommendations
      const projects = getProjectRecommendations(query, limit);
      recommendations.projects = projects;
    }

    if (type === 'technologies' || type === 'all') {
      // Get technology recommendations
      const technologies = getTechnologyRecommendations(query, limit);
      recommendations.technologies = technologies;
    }

    return NextResponse.json({
      success: true,
      recommendations
    });

  } catch (error: any) {
    console.error('Recommendations error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate recommendations',
        details: error?.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 