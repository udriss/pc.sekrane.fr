import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY);

export async function middleware(request: NextRequest) {
  // Note: do not use Prisma in middleware (edge/browser context)

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

  // Bloquer l'accès direct aux fichiers d'activités et rediriger vers l'API sécurisée
  // Pattern: /{courseId}/{type}/{filename} où type est 'pdf', 'notebook', ou 'autre'
  const filePattern = /^\/(\d+)\/(pdf|notebook|autre)\/(.+)$/;
  if (filePattern.test(url.pathname)) {
    // Rediriger vers l'API sécurisée qui fait les vérifications de permissions
    const apiUrl = new URL(`/api/files${url.pathname}`, request.url);
    return NextResponse.redirect(apiUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/:path*']
};