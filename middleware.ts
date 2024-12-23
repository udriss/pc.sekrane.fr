import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminAuth = request.cookies.get('adminAuth')?.value;

  // Protéger toutes les pages d'administration
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    if (!adminAuth) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Éviter de rediriger si l'utilisateur est déjà sur la page de connexion
  if (request.nextUrl.pathname === '/admin/login' && adminAuth) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}