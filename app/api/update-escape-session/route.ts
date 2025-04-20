import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

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

    let connection;
    try {
      connection = await getDatabaseConnection();
      
      // Récupérer d'abord les questionIdsS, questionIdsC, questionIdsR existants
      const [sessionRows] = await connection.execute<RowDataPacket[]>(
        'SELECT questionIdsS, questionIdsC, questionIdsR, passSession FROM parties WHERE ID = ?',
        [gameId]
      );
      
      if (!Array.isArray(sessionRows) || sessionRows.length === 0) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      
      const sessionData = sessionRows[0];
      
      // Update the scores and answered questions in the database
      const query = `
        UPDATE parties 
        SET scoreS = ?, 
            scoreC = ?, 
            scoreR = ?, 
            scoreE = ?,
            answeredQuestionsS = ?, 
            answeredQuestionsC = ?, 
            answeredQuestionsR = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE ID = ?
      `;
      
      const [result] = await connection.execute(
        query,
        [
          scores.S,
          scores.C,
          scores.R,
          scores.E,
          answeredQuestionsS,
          answeredQuestionsC,
          answeredQuestionsR,
          gameId
        ]
      );
      
      // Get the updated timestamp and all session data
      const [updatedRows] = await connection.execute<RowDataPacket[]>(
        'SELECT updated_at, passSession, scoreS, scoreC, scoreR, scoreE FROM parties WHERE ID = ?',
        [gameId]
      );
      
      return NextResponse.json({ 
        success: true, 
        message: 'Escape game progress updated successfully',
        updatedAt: updatedRows[0]?.updated_at,
        passSession: updatedRows[0]?.passSession,
        scores: {
          S: updatedRows[0]?.scoreS || 0,
          C: updatedRows[0]?.scoreC || 0,
          R: updatedRows[0]?.scoreR || 0,
          E: updatedRows[0]?.scoreE || 0
        }
      });
    } finally {
      if (connection) connection.release();
    }
  } catch (error) {
    console.error('Error updating escape game activity:', error);
    return NextResponse.json(
      { error: 'Failed to update escape game activity', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}