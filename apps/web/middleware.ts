import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['ua', 'en'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const first = pathname.split('/')[1];
  if (LOCALES.includes(first)) {
    return NextResponse.next();
  }
  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'ua';
  return NextResponse.redirect(new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url));
}

export const config = {
  // Exclude /placeholders/* so /public SVGs are not redirected to /[locale]/...
  matcher: ['/((?!api|_next|favicon|sitemap|robots|placeholders).*)'],
};
