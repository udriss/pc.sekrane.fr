import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { progressions } = body;

    // Mettre à jour l'ordre de chaque progression
    const updatePromises = progressions.map(({ id, order }: { id: string, order: number }) =>
      prisma.progression.update({
        where: { id },
        data: { order }
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering progressions:', error);
    return NextResponse.json({ error: 'Failed to reorder progressions' }, { status: 500 });
  }
}
