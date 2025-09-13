import { NextRequest, NextResponse } from 'next/server';
import { escapeGamePrisma } from '@/lib/escape-game-db';

interface RequestData {
  type: 'conquete' | 'structure' | 'rebus' | 'enigmes';
  index: number;
  questionID: number;
  userAnswer: string;
  gameId: number;
}

export async function POST(req: NextRequest) {
  try {
  const { type: rawType, index, questionID, userAnswer, gameId } = await req.json() as any;
  const type = (rawType === 'enigme' ? 'enigmes' : rawType) as RequestData['type'];
    
    let correct = false;

    // Query the appropriate table using Prisma Client
    let questionRow: { reponse: string | null } | null = null;
    if (type === 'conquete') {
      questionRow = await escapeGamePrisma.conquete.findUnique({
        where: { id: questionID },
        select: { reponse: true }
      });
    } else if (type === 'structure') {
      questionRow = await escapeGamePrisma.structure.findUnique({
        where: { id: questionID },
        select: { reponse: true }
      });
    } else if (type === 'rebus') {
      questionRow = await escapeGamePrisma.rebus.findUnique({
        where: { id: questionID },
        select: { reponse: true }
      });
    } else if (type === 'enigmes') {
      questionRow = await escapeGamePrisma.enigmes.findUnique({
        where: { id: questionID },
        select: { reponse: true }
      });
    }

    if (questionRow) {
      // Compare answers case-insensitive and trimmed
      const correctAnswer = questionRow.reponse?.trim()?.toLowerCase();
      const userAnswerCleaned = userAnswer?.trim()?.toLowerCase();
      correct = correctAnswer === userAnswerCleaned;
      
      if (correct) {
        const category = type === 'structure' ? 'S' : 
                        type === 'conquete' ? 'C' : 
                        type === 'rebus' ? 'R' : '';

        // Only update scores/answers for S/C/R categories
        if (category) {
          // Get current session data
          const currentSession = await escapeGamePrisma.partie.findUnique({
            where: { id: gameId },
            select: {
              answeredQuestionsS: true,
              answeredQuestionsC: true,
              answeredQuestionsR: true,
              scoreS: true,
              scoreC: true,
              scoreR: true
            }
          });

          if (!currentSession) {
            throw new Error('Session data not found');
          }

          const answeredField = `answeredQuestions${category}` as keyof typeof currentSession;
          const scoreField = `score${category}` as keyof typeof currentSession;
          
          const currentAnsweredString = currentSession[answeredField] as string | null;
          const currentAnswered = currentAnsweredString 
            ? currentAnsweredString.split(',').map(Number)
            : [];

          if (!currentAnswered.includes(questionID)) {
            const newAnswered = [...currentAnswered, questionID].join(',');
            const currentScore = currentSession[scoreField] as number;
            const updatedScore = currentScore + 1;
            
            // Update the session with new answers and score
            const updateData: any = {};
            updateData[answeredField as string] = newAnswered;
            updateData[scoreField as string] = updatedScore;
            
            await escapeGamePrisma.partie.update({
              where: { id: gameId },
              data: updateData,
              select: { id: true }
            });
            
            return NextResponse.json({ 
              correct: true,
              scoreUpdated: true,
              updatedAnswers: [...currentAnswered, questionID],
              updatedScore,
              updated_at: new Date().toISOString()
            });
          }
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
    await escapeGamePrisma.$disconnect();
  }
}