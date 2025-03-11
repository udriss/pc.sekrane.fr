'use server'

import { createClient } from 'redis';

export async function storeSessionData(sessionData: any) {
  const client = createClient();
  await client.connect();
  
  const key = `session:${sessionData.gameId}`;
  await client.set(key, JSON.stringify(sessionData), {
    EX: 3600 // Expire in 1 hour
  });
  
  await client.quit();
  return sessionData.gameId;
}