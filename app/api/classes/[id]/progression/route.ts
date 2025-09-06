import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { hasProgression } = body;
    const { id: classeId } = await params;

    await prisma.classe.update({
      where: { id: classeId },
      data: { hasProgression }
    });

    const classes = await prisma.classe.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        toggleVisibilityClasse: true,
        hasProgression: true,
        courses: {
          select: {
            id: true
          }
        }
      }
    });

    const formattedClasses = classes.map(classe => ({
      id: classe.id,
      name: classe.name,
      toggleVisibilityClasse: classe.toggleVisibilityClasse || false,
      hasProgression: classe.hasProgression || false,
      associated_courses: classe.courses.map(course => course.id)
    }));

    return NextResponse.json({ classes: formattedClasses, success: true });
  } catch (error) {
    console.error('Error updating class progression status:', error);
    return NextResponse.json({ error: 'Failed to update progression status' }, { status: 500 });
  }
}
