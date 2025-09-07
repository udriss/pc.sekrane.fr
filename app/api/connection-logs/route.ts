import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const logs = await prisma.connectionLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 1000, // Limit to last 1000 logs for performance
    });

    // Group by IP
    const grouped = logs.reduce((acc, log) => {
      if (!acc[log.ip]) {
        acc[log.ip] = {
          ip: log.ip,
          count: 0,
          logs: [],
        };
      }
      acc[log.ip].count += 1;
      acc[log.ip].logs.push(log);
      return acc;
    }, {} as Record<string, { ip: string; count: number; logs: typeof logs }>);

    const groupedConnections = Object.values(grouped);

    return NextResponse.json({ groupedConnections });
  } catch (error) {
    console.error('Error fetching connection logs:', error);
    return NextResponse.json({ error: 'Failed to fetch connection logs' }, { status: 500 });
  }
}
