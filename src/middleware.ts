import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth.config';

const protectedRoutes = ['/mypage', '/dashboard'];
const authRoutes = ['/login', '/signup'];

const { auth } = NextAuth(authConfig);

export default auth(req => {
  const isLoggedIn = !!req.auth;
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !isLoggedIn) {
    const url = req.nextUrl.pathname;
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(url)}`, req.url));
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

// This line configures which routes the middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
