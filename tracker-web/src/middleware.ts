import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Korumalı rotalar
const protectedRoutes = ['/tenant-dashboard', '/consumption', '/reports', '/alerts', '/facilities', '/documents', '/super-admin']

// Public rotalar (login gibi)
const publicRoutes = ['/login', '/register', '/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // JWT token'ı kontrol et (cookie veya header'dan)
  const token = request.cookies.get('authToken')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  // Korumalı rotaya erişim kontrolü
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Token yoksa login sayfasına yönlendir
    if (!token) {
      console.log('[Middleware] No token found, redirecting to login:', pathname)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    console.log('[Middleware] Token found, allowing access to:', pathname)
    // Token varsa devam et (detaylı kontrol layout'larda yapılacak)
    return NextResponse.next()
  }

  // Public rotalar için token kontrolü
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    if (token && pathname === '/login') {
      // Zaten giriş yapmışsa login sayfasına yönlendirme yapma
      // Client-side'da role kontrolü yapılacak
      return NextResponse.next()
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