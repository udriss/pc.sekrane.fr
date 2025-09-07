import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY);

async function logConnection(request: NextRequest, endpoint: string) {
  try {
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const userAgent = request.headers.get('user-agent') || '';
    const language = request.headers.get('accept-language')?.split(',')[0] || '';
    const screen = request.headers.get('x-screen') || ''; // Custom header if needed
    const timezone = request.headers.get('x-timezone') || ''; // Custom header if needed

    await prisma.connectionLog.create({
      data: {
        ip,
        endpoint,
        method: request.method,
        userAgent,
        language,
        screen,
        timezone,
      },
    });
  } catch (error) {
    console.error('Error logging connection:', error);
  }
}

export async function middleware(request: NextRequest) {
  // Log API requests
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Log asynchronously without blocking the response
    logConnection(request, request.nextUrl.pathname);
  }

  const token = request.cookies.get('adminAuth')?.value;
  const url = request.nextUrl.clone();
  
  // Si on est sur /admin/login et qu'on a un token valide
  if (url.pathname === '/admin/login' && token) {
    try {
      await jwtVerify(token, SECRET_KEY);
      // Rediriger vers /admin si déjà connecté
      return NextResponse.redirect(new URL('/admin', request.url));
    } catch {
      // Token invalide sur la page login, on continue
      return NextResponse.next();
    }
  }

  // Protection des routes /admin/* (sauf /admin/login)
  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(token, SECRET_KEY);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*']
};