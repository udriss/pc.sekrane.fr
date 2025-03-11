import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseConnection } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  let connection;
  try {
    // Test connection first
    connection = await getDatabaseConnection();
    await connection.ping();

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

    // Verify table exists
    const [tables] = await connection.query('SHOW TABLES LIKE "sessions"');
    if (!Array.isArray(tables) || tables.length === 0) {
      throw new Error('Sessions table not found');
    }

    // Insert with error checking
    const [result] = await connection.execute(
      'INSERT INTO sessions (session_id, ip, navigateur) VALUES (?, ?, ?)',
      [sessionId, clientIp, req.headers.get('user-agent')]
    );

    if (!result) {
      throw new Error('Failed to insert session');
    }

    // Start game and insert record into 'parties' table
    const gameId = await startGame(connection, passSession, 0, 0, 0, 0, questionIdsSString, questionIdsCString, questionIdsRString);
    const sessionData = {
      ID: gameId,
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
    if (connection) {
      connection.release();
    }
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

async function startGame(connection: any, passSession: string, scoreS: number, scoreC: number, scoreR: number, scoreE: number, questionIdsS: string, questionIdsC: string, questionIdsR: string) {
  // Check if the table exists
  const [tables] = await connection.query('SHOW TABLES LIKE "parties"');
  if (!Array.isArray(tables) || tables.length === 0) {
    // Make the table if it doesn't exist
    await connection.query(`
      CREATE TABLE parties (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        passSession VARCHAR(255),
        scoreS INT,
        scoreC INT,
        scoreR INT,
        scoreE INT,
        questionIdsS TEXT,
        questionIdsC TEXT,
        questionIdsR TEXT,
        answeredQuestionsS TEXT,
        answeredQuestionsC TEXT,
        answeredQuestionsR TEXT
      )
    `);
  }

  // Insert a new record into the table and return the ID
  const [result] = await connection.execute(
    'INSERT INTO parties (passSession, scoreS, scoreC, scoreR, scoreE, questionIdsS, questionIdsC, questionIdsR, answeredQuestionsS, answeredQuestionsC, answeredQuestionsR) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [passSession, scoreS, scoreC, scoreR, scoreE, questionIdsS, questionIdsC, questionIdsR, '', '', '']
  );

  return result.insertId;
}