import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protéger la page admin
  if (request.nextUrl.pathname === '/admin') {
    const adminAuth = request.cookies.get('adminAuth')?.value;
    
    if (!adminAuth) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}