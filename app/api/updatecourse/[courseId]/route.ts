import { NextRequest, NextResponse } from 'next/server';
import { parseData, updateData } from '@/lib/data-utils';
import { cp } from 'fs';

export async function PUT(req: NextRequest) {
  try {
    const { courseId, title, description, newClasseId } = await req.json();
    
    if (!courseId || !title || !description || !newClasseId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { classes, courses } = await parseData();

    // Vérifier si le cours existe
    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Mettre à jour le cours
    courses[courseIndex] = {
      ...courses[courseIndex],
      title,
      description,
      theClasseId: newClasseId,
      classe: classes.find(classe => classe.id === newClasseId)?.name || courses[courseIndex].classe,
    };

    // Write updated data to file
    await updateData(classes, courses);

    return NextResponse.json({ courses, classes }, { status: 200 });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}