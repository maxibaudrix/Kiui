import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/signup');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') ||
                          request.nextUrl.pathname.startsWith('/onboarding') ||
                          request.nextUrl.pathname.startsWith('/scanner');

  // Redirigir a dashboard si ya está autenticado e intenta acceder a login/signup
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirigir a login si no está autenticado e intenta acceder a rutas protegidas
  if (isProtectedPage && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rate limiting básico (mejorar con Upstash Redis en producción)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // TODO: Implementar rate limiting real con Upstash
    const ip = request.ip ?? '127.0.0.1';
    console.log(`API call from: ${ip}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/scanner/:path*',
    '/login',
    '/signup',
    '/api/:path*',
  ],
};
