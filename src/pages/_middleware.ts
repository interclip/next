import { NextResponse } from 'next/server';

export function middleware() {
  const ContentSecurityPolicy = `
    block-all-mixed-content;
  `;

  const response = NextResponse.next();

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

  return response;
}
