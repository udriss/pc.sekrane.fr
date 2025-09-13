import { NextRequest, NextResponse } from 'next/server';
import { escapeGamePrisma } from '@/lib/escape-game-db';
import { Prisma } from '@/lib/generated/escape-game-client';
import { logConnection } from '@/lib/logConnection';

export async function POST(req: NextRequest) {
  try {
    await logConnection(req, '/api/get-session');
    const { passSession } = await req.json();

    if (!passSession) {
      return NextResponse.json({ error: 'passSession is required' }, { status: 400 });
    }

    // Find the session using Prisma
    const sessionData = await escapeGamePrisma.partie.findFirst({
      where: { passSession }
    });

    if (!sessionData) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Extract question IDs from session
    const questionIdsS: number[] = sessionData.questionIdsS ? sessionData.questionIdsS.split(',').map(Number) : [];
    const questionIdsC: number[] = sessionData.questionIdsC ? sessionData.questionIdsC.split(',').map(Number) : [];
    const questionIdsR: number[] = sessionData.questionIdsR ? sessionData.questionIdsR.split(',').map(Number) : [];

    let structureQuestions: any[] = [];
    let conqueteQuestions: any[] = [];
    let rebusQuestions: any[] = [];
    let enigmesQuestions: any[] = [];

    // Helper to map Prisma records to expected shape with ID key and preserve order
    const orderByIds = <T extends { id: number }>(records: T[], ids: number[]) => {
      const map = new Map(records.map((r) => [r.id, r]));
      const ordered: T[] = [];
      for (const id of ids) {
        const r = map.get(id);
        if (r) ordered.push(r);
      }
      return ordered;
    };

    // Retrieve structure questions based on IDs stored in questionIdsS
    if (questionIdsS.length) {
      const rows = await escapeGamePrisma.structure.findMany({
        where: { id: { in: questionIdsS } },
        select: { id: true, question: true, reponse: true }
      });
      const ordered = orderByIds(rows, questionIdsS);
      structureQuestions = ordered.map((r) => ({ ID: r.id, question: r.question, reponse: r.reponse }));
    }

    // Retrieve conquete questions based on IDs stored in questionIdsC
    if (questionIdsC.length) {
      const rows = await escapeGamePrisma.conquete.findMany({
        where: { id: { in: questionIdsC } },
        select: { id: true, question: true, reponse: true }
      });
      const ordered = orderByIds(rows, questionIdsC);
      conqueteQuestions = ordered.map((r) => ({ ID: r.id, question: r.question, reponse: r.reponse }));
    }

    // Retrieve rebus questions based on IDs stored in questionIdsR
    if (questionIdsR.length) {
      const rows = await escapeGamePrisma.rebus.findMany({
        where: { id: { in: questionIdsR } },
        select: { id: true, reponse: true }
      });
      const ordered = orderByIds(rows, questionIdsR);
      rebusQuestions = ordered.map((r) => ({ ID: r.id, reponse: r.reponse }));
    }

    // For enigmes, retrieve all
    const enigmesRows = await escapeGamePrisma.enigmes.findMany({
      select: { id: true, question: true, reponse: true }
    });
    enigmesQuestions = enigmesRows.map((r) => ({ ID: r.id, question: r.question, reponse: r.reponse }));

    // Process answered questions from database strings
    const answeredQuestionsS = sessionData.answeredQuestionsS ? sessionData.answeredQuestionsS.split(',').map(Number) : [];
    const answeredQuestionsC = sessionData.answeredQuestionsC ? sessionData.answeredQuestionsC.split(',').map(Number) : [];
    const answeredQuestionsR = sessionData.answeredQuestionsR ? sessionData.answeredQuestionsR.split(',').map(Number) : [];

    // Format result to match what the client expects
    const result = {
      ID: sessionData.id,
      gameId: sessionData.id, // Ensure gameId is properly set for client
      passSession: sessionData.passSession,
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
      // Pass answered questions in proper format
      answeredQuestionsS: sessionData.answeredQuestionsS || '',
      answeredQuestionsC: sessionData.answeredQuestionsC || '',
      answeredQuestionsR: sessionData.answeredQuestionsR || '',
      // Include a synthetic updated_at timestamp (DB has no updatedAt column)
      updated_at: new Date().toISOString()
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in get-session:', error);
    return NextResponse.json(
      { error: 'Database error', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  } finally {
    await escapeGamePrisma.$disconnect();
  }
}