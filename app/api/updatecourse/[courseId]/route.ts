import { NextRequest, NextResponse } from 'next/server';
import { parseData, updateData } from '@/lib/data-utils';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const { classes, courses } = await parseData();

    // Vérifier si le cours existe
    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Si c'est une mise à jour du thème
    if ('themeChoice' in body) {
      courses[courseIndex] = {
        ...courses[courseIndex],
        themeChoice: body.themeChoice
      };
    }
    // Si c'est une mise à jour de visibilité
    else if ('toggleVisibilityCourse' in body) {
      courses[courseIndex] = {
        ...courses[courseIndex],
        toggleVisibilityCourse: body.toggleVisibilityCourse
      };
    }
    // Si c'est une mise à jour complète du cours
    else if (body.title || body.description || body.newClasseId) {
      // Update only the fields that are provided in the request
      const updatedCourse = {
        ...courses[courseIndex],
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.newClasseId && { 
          theClasseId: body.newClasseId,
          classe: classes.find(classe => classe.id === body.newClasseId)?.name || courses[courseIndex].classe
        })
      };
          
      courses[courseIndex] = updatedCourse;
    } else {
      return NextResponse.json({ error: 'Invalid update parameters' }, { status: 400 });
    }

    // Write updated data to file
    await updateData(classes, courses);

    return NextResponse.json({ courses, classes }, { status: 200 });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}