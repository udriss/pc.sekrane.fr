import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function POST(req: NextRequest) {
  let connection;
  try {
    connection = await getDatabaseConnection();
    const { passSession } = await req.json();

    if (!passSession) {
      return NextResponse.json({ error: 'passSession is required' }, { status: 400 });
    }

    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM parties WHERE passSession = ?',
      [passSession]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    const sessionData = rows[0];

    // Extract question IDs from session
    const questionIdsS: number[] = sessionData.questionIdsS ? sessionData.questionIdsS.split(',').map(Number) : [];
    const questionIdsC: number[] = sessionData.questionIdsC ? sessionData.questionIdsC.split(',').map(Number) : [];
    const questionIdsR: number[] = sessionData.questionIdsR ? sessionData.questionIdsR.split(',').map(Number) : [];

    let structureQuestions: RowDataPacket[] = [];
    let conqueteQuestions: RowDataPacket[] = [];
    let rebusQuestions: RowDataPacket[] = [];
    let enigmesQuestions: RowDataPacket[] = [];

    // Retrieve structure questions based on IDs stored in questionIdsS
    if (questionIdsS.length) {
      const placeholders = questionIdsS.map(() => '?').join(',');
      const [structureRows] = await connection.execute<RowDataPacket[]>(
         `SELECT ID, question, reponse FROM structure WHERE ID IN (${placeholders})`,
         questionIdsS
      );
      structureQuestions = structureRows;
    }

    // Retrieve conquete questions based on IDs stored in questionIdsC
    if (questionIdsC.length) {
      const placeholders = questionIdsC.map(() => '?').join(',');
      const [conqueteRows] = await connection.execute<RowDataPacket[]>(
         `SELECT ID, question, reponse FROM conquete WHERE ID IN (${placeholders})`,
         questionIdsC
      );
      conqueteQuestions = conqueteRows;
    }

    // Retrieve rebus questions based on IDs stored in questionIdsR
    if (questionIdsR.length) {
      const placeholders = questionIdsR.map(() => '?').join(',');
      const [rebusRows] = await connection.execute<RowDataPacket[]>(
         `SELECT ID, reponse FROM rebus WHERE ID IN (${placeholders})`,
         questionIdsR
      );
      rebusQuestions = rebusRows;
    }

    // For enigmes, here we retrieve all (adjust if needed)
    const [enigmesRows] = await connection.execute<RowDataPacket[]>(
         `SELECT ID, question, reponse FROM enigmes`
    );
    enigmesQuestions = enigmesRows;

    const result = {
      ...sessionData,
      scores: {
        S: sessionData.scoreS || 0,
        C: sessionData.scoreC || 0,
        R: sessionData.scoreR || 0,
        E: sessionData.scoreE || 0,
      },
      questions: {
        conquete: conqueteQuestions,
        structure: structureQuestions,
        rebus: rebusQuestions,
        enigmes: enigmesQuestions,
      },
      answeredQuestionsS: sessionData.answeredQuestionsS || '',
      answeredQuestionsC: sessionData.answeredQuestionsC || '',
      answeredQuestionsR: sessionData.answeredQuestionsR || ''
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in get-session:', error);
    return NextResponse.json(
      { error: 'Database error', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}