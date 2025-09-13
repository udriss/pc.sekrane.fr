import { NextRequest, NextResponse } from 'next/server';
import { escapeGamePrisma } from '@/lib/escape-game-db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const sessionId = uuidv4();
    const passSession = generatePass(7);
    const clientIp = req.headers.get('x-forwarded-for') || '0.0.0.0';

    // Fetch questions from the API using an absolute URL
    const questionsResponse = await fetch('https://pc.sekrane.fr/api/fetch-questions');

    const questions = await questionsResponse.json();

    if (typeof questions !== 'object' || questions === null) {
      throw new Error('Invalid response format: questions should be an object');
    }

    // Extract question IDs from all categories
    const questionIdsS = [];
    const questionIdsC = [];
    const questionIdsR = [];

    if (Array.isArray(questions.structure)) {
      questionIdsS.push(...questions.structure.map((q: any) => q.ID));
    }
    if (Array.isArray(questions.conquete)) {
      questionIdsC.push(...questions.conquete.map((q: any) => q.ID));
    }
    if (Array.isArray(questions.rebus)) {
      questionIdsR.push(...questions.rebus.map((q: any) => q.ID));
    }

    const questionIdsSString = questionIdsS.join(',');
    const questionIdsCString = questionIdsC.join(',');
    const questionIdsRString = questionIdsR.join(',');

    // Insert session using Prisma
    const sessionResult = await escapeGamePrisma.escapeGameSession.create({
      data: {
        session_id: sessionId,
        ip: clientIp,
        navigateur: req.headers.get('user-agent') || null
      }
    });

    // Start game and insert record into 'parties' table
    const gameResult = await escapeGamePrisma.partie.create({
      data: {
        passSession,
        scoreS: 0,
        scoreC: 0,
        scoreR: 0,
        scoreE: 0,
        questionIdsS: questionIdsSString,
        questionIdsC: questionIdsCString,
        questionIdsR: questionIdsRString,
        answeredQuestionsS: '',
        answeredQuestionsC: '',
        answeredQuestionsR: ''
      }
    });

    const sessionData = {
      ID: gameResult.id,
      passSession,
      scores: { S: 0, C: 0, R: 0, E: 0 },
      questions
    };

    return NextResponse.json(sessionData);
  } catch (error: any) {
    console.error('Detailed error:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      stack: error.stack
    });
    
    return NextResponse.json({ 
      error: 'Database error', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  } finally {
    await escapeGamePrisma.$disconnect();
  }
}

function generatePass(n: number) {
  const characters = '1234567890ABCDEFGHJKLMNOPQRSTUVWXYZ';
  let randomString = '';

  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * characters.length);
    randomString += characters[index];
  }

  return randomString;
}