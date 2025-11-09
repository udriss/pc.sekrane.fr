import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/activities/toggle-disabled
 * Toggle the isDisabled field of an activity
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
      select: { isDisabled: true }
    });

    if (!activity) {
      return NextResponse.json(
        { error: 'Activité introuvable' },
        { status: 404 }
      );
    }

    // Toggle the isDisabled field
    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: {
        isDisabled: !activity.isDisabled
      }
    });

    return NextResponse.json({
      success: true,
      isDisabled: updatedActivity.isDisabled
    });
  } catch (error: any) {
    console.error('Error toggling activity disabled state:', error);
    return NextResponse.json(
      { error: "Erreur lors du changement d'état" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
