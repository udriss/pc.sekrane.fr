import { NextRequest, NextResponse } from 'next/server';
import { escapeGamePrisma } from '@/lib/escape-game-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { gameId, scores, answeredQuestions } = body;

    if (!gameId) {
      return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
    }

    // Format the answered questions to be stored in the database
    const answeredQuestionsS = answeredQuestions.S.length ? answeredQuestions.S.join(',') : '';
    const answeredQuestionsC = answeredQuestions.C.length ? answeredQuestions.C.join(',') : '';
    const answeredQuestionsR = answeredQuestions.R.length ? answeredQuestions.R.join(',') : '';

    try {
      // Check if session exists
      const sessionData = await escapeGamePrisma.partie.findUnique({
        where: { id: gameId },
        select: { 
          questionIdsS: true, 
          questionIdsC: true, 
          questionIdsR: true, 
          passSession: true 
        }
      });
      
      if (!sessionData) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      
      // Update the scores and answered questions using Prisma
      const updatedSession = await escapeGamePrisma.partie.update({
        where: { id: gameId },
        data: {
          scoreS: scores.S,
          scoreC: scores.C,
          scoreR: scores.R,
          scoreE: scores.E,
          answeredQuestionsS,
          answeredQuestionsC,
          answeredQuestionsR
        },
        select: {
          passSession: true,
          scoreS: true,
          scoreC: true,
          scoreR: true,
          scoreE: true
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Escape game progress updated successfully',
        passSession: updatedSession.passSession,
        scores: {
          S: updatedSession.scoreS || 0,
          C: updatedSession.scoreC || 0,
          R: updatedSession.scoreR || 0,
          E: updatedSession.scoreE || 0
        }
      });
    } finally {
      await escapeGamePrisma.$disconnect();
    }
  } catch (error) {
    console.error('Error updating escape game activity:', error);
    return NextResponse.json(
      { error: 'Failed to update escape game activity', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}