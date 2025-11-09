import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/activities/toggle-hidden
 * Toggle the isHidden field of an activity
 */
export async function POST(req: NextRequest) {
  try {
    const { activityId } = await req.json();

    if (!activityId || typeof activityId !== 'string') {
      return NextResponse.json(
        { error: 'activityId requis' },
        { status: 400 }
      );
    }

    // Get current activity state
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      select: { isHidden: true }
    });

    if (!activity) {
      return NextResponse.json(
        { error: 'Activité introuvable' },
        { status: 404 }
      );
    }

    // Toggle the isHidden field
    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: {
        isHidden: !activity.isHidden
      }
    });

    return NextResponse.json({
      success: true,
      isHidden: updatedActivity.isHidden
    });
  } catch (error: any) {
    console.error('Error toggling activity visibility:', error);
    return NextResponse.json(
      { error: 'Erreur lors du changement de visibilité' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
