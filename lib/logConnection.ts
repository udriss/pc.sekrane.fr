import { prisma } from '@/lib/prisma';

export async function logConnection(request: Request, endpoint?: string) {
  try {
  const fwd = request.headers.get('x-forwarded-for');
  const ip = (fwd ? fwd.split(',')[0].trim() : '') ||
         request.headers.get('x-real-ip') ||
         'unknown';

    const userAgent = request.headers.get('user-agent') || '';
    const language = request.headers.get('accept-language')?.split(',')[0] || '';
    const screen = request.headers.get('x-screen') || '';
    const timezone = request.headers.get('x-timezone') || '';
  const path = endpoint || new URL(request.url).pathname;

    await prisma.connectionLog.create({
      data: {
        ip,
    endpoint: path,
        method: request.method,
        userAgent,
        language,
        screen,
        timezone,
      },
    });
  } catch (error) {
    console.error('Error logging connection:', error);
  }
}
