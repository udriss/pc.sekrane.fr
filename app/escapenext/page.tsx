'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OtpInput from 'react-otp-input';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const EscapePage: React.FC = () => {
  const [sessionData, setSessionData] = useState<any>({});
  const [questions, setQuestions] = useState<any>({
    conquete: [],
    structure: [],
    rebus: [],
    enigmes: [],
  });
  const [otp, setOtp] = useState('');
  const [gameId, setGameId] = useState<number | null>(null);
  const router = useRouter();

  const handleStartGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/init-session');
      const data = response.data as {
        gameId: number;
        passSession: string;
        scores: { S: number; C: number; R: number; E: number };
        questions: any;
      };
      setSessionData(data);
      setQuestions(data.questions);
      setGameId(data.gameId);
      
      // Store only passSession in cookie as the rest is retrieved from the database
      Cookies.set('passSession', data.passSession, { expires: 1 }); // Expires in 1 day
      
      // Navigate to game start page
      router.push('/escapenext/start');
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };

  const handleRestoreSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/get-session', { passSession: otp });
      const data = response.data as {
        gameId: number;
        passSession: string;
        scores: { S: number; C: number; R: number; E: number };
        questions: any;
      };
      setSessionData(data);
      setQuestions(data.questions);
      setGameId(data.gameId);
      
      // Store restored session data in cookie
      Cookies.set('sessionData', JSON.stringify(data), { expires: 1 });
      // Navigate to game start page
      router.push('/escapenext/start');
    } catch (error) {
      console.error('Failed to restore session:', error);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "150px auto", padding: "20px" }}>
      <Card>
        <div style={{ padding: "20px" }}>
          <h3>Initialisation</h3>
          <p>Bienvenue dans cet escape game !</p>
          <p>Les thèmes traités dans ce jeu sont les suivants :</p>
          <ul style={{ textAlign: 'left', margin: '0 auto', display: 'inline-block' }}>
            <li>structures célestes</li>
            <li>découvertes spatiales majeures</li>
            <li>rébus</li>
            <li>énigmes</li>
          </ul>
          <Button type='button' onClick={handleStartGame}>
            Lancer le jeu
          </Button>
        </div>

        <form onSubmit={handleRestoreSession} name='login'>
          <div style={{ padding: "20px" }}>
            <h3>Restaurer session</h3>
            <p>Rentrer un code session pour restaurer :</p>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={7}
                renderSeparator={''}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  width: '3rem',
                  height: '3rem',
                  margin: '0 0.5rem',
                  fontSize: '2rem',
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.3)',
                }}
              />
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Button type='submit'>
                Restaurer la session
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EscapePage;