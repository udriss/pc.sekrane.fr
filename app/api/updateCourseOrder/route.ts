import { NextRequest, NextResponse } from 'next/server';
import { parseData, updateData } from '@/lib/data-utils';

export async function PUT(req: NextRequest) {
  try {
    const { courses: updatedCourseOrder, activeCourseId: activeCourseId } = await req.json();

    if (!updatedCourseOrder) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { classes, courses } = await parseData();

    // Réorganiser les cours selon l'ordre fourni
    const reorderedCourses = updatedCourseOrder.map((courseId: string) => {
      const course = courses.find(course => course.id === courseId);
      if (!course) {
        throw new Error(`Course with id ${courseId} not found`);
      }
      return course;
    });

    // Write updated data to file
    await updateData(classes, reorderedCourses);
    
    // Replace the direct ID return with this:
    const titleOfChosenClass = courses.find(course => course.id === activeCourseId)?.classe;


    return NextResponse.json({ titleOfChosenClass: titleOfChosenClass }, { status: 200 });
  } catch (error) {
    console.error('Error updating course order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}