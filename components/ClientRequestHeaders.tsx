'use client';

import { useEffect } from 'react';

/**
 * Injects page, screen, and timezone info into all client-side fetch requests to /api/*.
 * This enables server-side logConnection to attribute requests to the originating page.
 */
export default function ClientRequestHeaders() {
  useEffect(() => {
    // Avoid double-patching in Fast Refresh
    if ((window as any).__fetchPatchedForConnectionLog) return;
    (window as any).__fetchPatchedForConnectionLog = true;

    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const url = typeof input === 'string' || input instanceof URL ? String(input) : input.url;
        // Only add headers for same-origin API routes
        const target = new URL(url, window.location.origin);
        const sameOrigin = target.origin === window.location.origin;
        const isApi = target.pathname.startsWith('/api/');

        if (sameOrigin && isApi) {
          const headers = new Headers((init && init.headers) || (typeof input !== 'string' && !(input instanceof URL) ? (input as Request).headers : undefined));

          // Page path from where the request originates
          headers.set('x-page', window.location.pathname || '/');

          // Screen info and timezone
          const dpr = window.devicePixelRatio || 1;
          const screen = window.screen;
          headers.set('x-screen', `${screen.width}x${screen.height}@${dpr}`);
          try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            headers.set('x-timezone', tz);
          } catch {
            // no-op
          }

          const nextInit: RequestInit = { ...(init || {}), headers };

          if (typeof input === 'string' || input instanceof URL) {
            return originalFetch(input, nextInit);
          } else {
            // Recreate Request to ensure headers override apply
            const req = new Request(input, nextInit);
            return originalFetch(req);
          }
        }
      } catch {
        // fall through to original fetch if anything goes wrong
      }
      return originalFetch(input as any, init as any);
    };
  }, []);

  return null;
}
