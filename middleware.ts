import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs',
};

export function middleware(request: NextRequest) {
  // Allow access to login and register pages without authentication
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');

  if (isAuthPage) {
    return NextResponse.next();
  }

  // For now, allow all other pages (auth will be handled client-side)
  return NextResponse.next();
}
