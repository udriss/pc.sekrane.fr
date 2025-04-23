import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseConnection } from '@/lib/db';

export async function GET(req: NextRequest) {
  let connection;
  try {
    connection = await getDatabaseConnection();

    const [conquete] = await connection.execute('SELECT ID, question, reponse FROM conquete ORDER BY rand() LIMIT 7');
    const [structure] = await connection.execute('SELECT ID, question, reponse FROM structure ORDER BY rand() LIMIT 9');
    const [rebus] = await connection.execute('SELECT ID, reponse FROM rebus ORDER BY rand() LIMIT 10');
    const [enigmes] = await connection.execute('SELECT ID, question, reponse FROM enigmes');

    const questions = {
      conquete,
      structure,
      rebus,
      enigmes,
    };


    return NextResponse.json(questions);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}