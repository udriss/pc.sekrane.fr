import { getDatabaseConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import StartPageClient from './StartPageClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

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

async function getSessionData(passSession: string) {
  let connection;
  try {
    connection = await getDatabaseConnection();
    const [rows] = await connection.execute<SessionData[]>(
      'SELECT * FROM parties WHERE passSession = ?',
      [passSession]
    );
    return rows[0];
  } finally {
    if (connection) connection.release();
  }
}

async function getSessionQuestions(passSession: string, baseUrl: string) {
  try {
    const response = await fetch(`${baseUrl}/api/get-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ passSession }),
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching session questions:", error);
    throw error;
  }
}

export default async function Page() {
  
  
  const cookieStore = await cookies();
  const passSessionCookie = cookieStore.get('passSession');

  if (!passSessionCookie?.value) {
    
    redirect('/escapenext');
  }
  
  const passSession = passSessionCookie.value;
  

  try {
    const sessionDataDirect = await getSessionData(passSession);
    
    if (sessionDataDirect) {
      
      
      const headersList = await headers();
      const host = headersList.get('host') || 'localhost:8000';
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const baseUrl = `${protocol}://${host}`;
      
      
      
      try {
        const sessionData = await getSessionQuestions(passSession, baseUrl);
        
        if (!sessionData || !sessionData.ID) {
          
          redirect('/escapenext');
        }
        
        
        return <StartPageClient gameId={sessionData.ID} sessionData={sessionData} />;
      } catch (error) {
        console.error("Error loading session questions:", error);
        
        const fallbackSessionData = {
          ID: sessionDataDirect.ID,
          gameId: sessionDataDirect.ID,
          passSession: sessionDataDirect.passSession,
          scores: {
            S: sessionDataDirect.scoreS || 0,
            C: sessionDataDirect.scoreC || 0,
            R: sessionDataDirect.scoreR || 0,
            E: sessionDataDirect.scoreE || 0
          },
          questions: { conquete: [], structure: [], rebus: [], enigmes: [] },
          answeredQuestionsS: sessionDataDirect.answeredQuestionsS || '',
          answeredQuestionsC: sessionDataDirect.answeredQuestionsC || '',
          answeredQuestionsR: sessionDataDirect.answeredQuestionsR || ''
        };
        
        
        return <StartPageClient gameId={fallbackSessionData.ID} sessionData={fallbackSessionData} />;
      }
    } else {
      
      redirect('/escapenext');
    }
  } catch (error) {
    console.error("Error loading session:", error);
    redirect('/escapenext');
  }
}