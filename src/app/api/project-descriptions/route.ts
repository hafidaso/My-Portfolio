import { NextRequest, NextResponse } from 'next/server';
import { generatePortfolioDescriptions, analyzeRepository, generateProjectDescription } from '@/lib/projectDescriptionGenerator';

export async function POST(request: NextRequest) {
  try {
    const { username, targetLanguage = 'en', specificRepo } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'GitHub username is required' },
        { status: 400 }
      );
    }

    let descriptions;

    if (specificRepo) {
      // Generate description for a specific repository
      const { owner, name } = specificRepo;
      const analysis = await analyzeRepository(owner, name);
      const description = await generateProjectDescription(analysis, targetLanguage);
      descriptions = [description];
    } else {
      // Generate descriptions for portfolio
      descriptions = await generatePortfolioDescriptions(username, targetLanguage);
    }

    return NextResponse.json({
      success: true,
      descriptions
    });

  } catch (error: any) {
    console.error('Project description generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate project descriptions',
        details: error?.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 