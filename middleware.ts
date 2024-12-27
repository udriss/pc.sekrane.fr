import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('adminAuth')?.value;
  const url = request.nextUrl.clone();

  // Exclure la page de login du contrôle
  if (url.pathname === '/admin/login') {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    // Vérifier le token via “jose”
    const { payload } = await jwtVerify(token, SECRET_KEY);
    // Si la vérification réussit, laisser passer
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};