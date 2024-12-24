import { NextResponse } from 'next/server';
import crypto from 'crypto';

const STORED_HASH = '4f47b88398cd61d116ca3d13172a631999c6ab2798136f465f19fee7b2359974'; // SHA-256 de "Va058pt!"

export async function POST(request: Request) {
  const { password } = await request.json();
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  if (hash === STORED_HASH) {
    const response = NextResponse.json({ success: true, message: 'Connexion réussie (route page)' });
    response.cookies.set('adminAuth', 'true', { httpOnly: true, path: '/' });
    return response;
  } else {
    return NextResponse.json({ success: false, message: 'Mot de passe incorrect' }, { status: 401 });
  }
}