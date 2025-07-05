import { NextRequest, NextResponse } from 'next/server';
import { analyzeResume } from '@/lib/resumeAnalysis';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'GitHub username is required' },
        { status: 400 }
      );
    }

    // Analyze the resume
    const analysis = await analyzeResume(username);

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error: any) {
    console.error('Resume analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze resume',
        details: error?.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 