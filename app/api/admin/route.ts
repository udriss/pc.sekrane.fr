import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.SECRET_KEY;
const STORED_HASH = process.env.STORED_HASH;

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined');
}

if (!STORED_HASH) {
  throw new Error('STORED_HASH is not defined');
}

export async function POST(request: Request) {
  const { password } = await request.json();
  const hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  if (hash === STORED_HASH) {
    const token = jwt.sign({ role: 'admin' }, SECRET_KEY as string, { expiresIn: '1h' });

    const response = NextResponse.json({ success: true, message: 'Connexion réussie' });
    response.cookies.set('adminAuth', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      path: '/', 
      sameSite: 'strict' 
    });
    
    return response;
  } else {
    return NextResponse.json({ success: false, message: 'Mot de passe incorrect' }, { status: 401 });
  }
}