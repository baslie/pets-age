import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Named export "proxy" вместо default export (Next.js 16+)
export const proxy = createMiddleware(routing);

export const config = {
  matcher: ['/', '/(en|ru|de|es|it|fr|pt)/:path*'],
};
