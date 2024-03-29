// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const isAPIRoute = req.url.includes('/api/');
  if (isAPIRoute) {
    response.headers.set('Access-Control-Allow-Origin', '*');
  } else {
    const ContentSecurityPolicy = `
      block-all-mixed-content;
    `;

    response.headers.set(
      'Content-Security-Policy',
      ContentSecurityPolicy.replace(/\n/g, ''),
    );
    response.headers.set(
      'Referrer-Policy',
      'origin-when-cross-origin, strict-origin-when-cross-origin',
    );
    response.headers.set('Permissions-Policy', 'interest-cohort=()');
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload',
    );
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-DNS-Prefetch-Control', 'on');
  }

  return response;
}
