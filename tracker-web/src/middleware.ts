import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Korumalı rotalar
const protectedRoutes = ['/dashboard', '/consumption', '/reports', '/alerts', '/facilities', '/documents']

// Public rotalar (login gibi)
const publicRoutes = ['/login', '/register', '/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // JWT token'ı kontrol et
  const token = request.cookies.get('authToken')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  // Korumalı rotaya erişim kontrolü
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      // Token yoksa login sayfasına yönlendir
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Token varsa devam et
    return NextResponse.next()
  }

  // Public rotalar için token kontrolü
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    if (token && pathname === '/login') {
      // Zaten giriş yapmışsa dashboard'a yönlendir
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 