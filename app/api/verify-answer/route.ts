import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseConnection } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface RequestData {
  type: 'conquete' | 'structure' | 'rebus' | 'enigmes';
  index: number;
  questionID: number;
  userAnswer: string;
  gameId: number;
}

interface QuestionRow extends RowDataPacket {
  reponse: string;
}

interface SessionRow extends RowDataPacket {
  answeredQuestionsS: string;
  answeredQuestionsC: string;
  answeredQuestionsR: string;
  scoreS: number;
  scoreC: number;
  scoreR: number;
  updated_at: string;
}

export async function POST(req: NextRequest) {
  let connection;
  try {
    const { type, index, questionID, userAnswer, gameId } = await req.json() as RequestData;
    
    connection = await getDatabaseConnection();
    let correct = false;

    const queries: Record<RequestData['type'], string> = {
      conquete: 'SELECT reponse FROM conquete WHERE ID = ?',
      structure: 'SELECT reponse FROM structure WHERE ID = ?',
      rebus: 'SELECT reponse FROM rebus WHERE ID = ?',
      enigmes: 'SELECT reponse FROM enigmes WHERE ID = ?'
    };

    if (type in queries) {
      const [rows] = await connection.execute<QuestionRow[]>(queries[type], [questionID]);
      console.log('rows:', rows);
      
      // Compare answers case-insensitive and trimmed
      const correctAnswer = rows[0]?.reponse?.trim()?.toLowerCase();
      const userAnswerCleaned = userAnswer?.trim()?.toLowerCase();
      correct = correctAnswer === userAnswerCleaned;
      
      if (correct) {
        const category = type === 'structure' ? 'S' : 
                        type === 'conquete' ? 'C' : 
                        type === 'rebus' ? 'R' : '';

        const [currentData] = await connection.execute<SessionRow[]>(
          'SELECT COALESCE(answeredQuestionsS, \'\') as answeredQuestionsS, ' +
          'COALESCE(answeredQuestionsC, \'\') as answeredQuestionsC, ' +
          'COALESCE(answeredQuestionsR, \'\') as answeredQuestionsR, ' +
          'scoreS, scoreC, scoreR, updated_at ' +
          'FROM parties WHERE ID = ?',
          [gameId]
        );

        if (!currentData[0]) {
          throw new Error('Session data not found');
        }

        const answeredField = `answeredQuestions${category}` as keyof SessionRow;
        const scoreField = `score${category}` as keyof SessionRow;
        
        const currentAnswered = currentData[0][answeredField] 
          ? currentData[0][answeredField].split(',').map(Number)
          : [];

        if (!currentAnswered.includes(questionID)) {
          const newAnswered = [...currentAnswered, questionID].join(',');
          const currentScore = currentData[0][scoreField] as number;
          const updatedScore = currentScore + 1;
          
          await connection.execute(
            `UPDATE parties SET ${answeredField} = ?, ${scoreField} = ?, updated_at = CURRENT_TIMESTAMP WHERE ID = ?`,
            [newAnswered, updatedScore, gameId]
          );
          
          // Récupérer la date de mise à jour
          const [updatedData] = await connection.execute<SessionRow[]>(
            'SELECT updated_at FROM parties WHERE ID = ?',
            [gameId]
          );
          
          return NextResponse.json({ 
            correct: true,
            scoreUpdated: true,
            updatedAnswers: [...currentAnswered, questionID],
            updatedScore,
            updated_at: updatedData[0]?.updated_at
          });
        }
      }
    }

    return NextResponse.json({ correct });
  } catch (error) {
    console.error('Error in verify-answer:', error);
    return NextResponse.json({ 
      error: 'Database error',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined 
    }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}