import { getDatabaseConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import StartPageClient from './StartPageClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface SessionData extends RowDataPacket {
  ID: number;
  passSession: string;
  scoreS: number;
  scoreC: number;
  scoreR: number;
  scoreE: number;
  answeredQuestionsS: string;
  answeredQuestionsC: string;
  answeredQuestionsR: string;
}

async function getSessionData(gameId: number) {
  let connection;
  try {
    connection = await getDatabaseConnection();
    const [rows] = await connection.execute<SessionData[]>(
      'SELECT * FROM parties WHERE ID = ?',
      [gameId]
    );
    return rows[0];
  } finally {
    if (connection) connection.release();
  }
}

export default async function Page() {
  const cookieStore = await cookies();
  const passSessionCookie = cookieStore.get('passSession');

  if (!passSessionCookie?.value) {
    redirect('/escapenext');
  }
  const passSession = passSessionCookie.value;

  // Construct the absolute URL using an environment variable or fallback to localhost.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8000';
  const getSessionRes = await fetch(`${baseUrl}/api/get-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ passSession })
  });

  console.log('getSessionRes:', getSessionRes);

  if (!getSessionRes.ok) {
    redirect('/escapenext');
  }

  const sessionData = await getSessionRes.json();
  if (!sessionData || !sessionData.ID) {
    redirect('/escapenext');
  }

  return <StartPageClient gameId={sessionData.ID} sessionData={sessionData} />;
}