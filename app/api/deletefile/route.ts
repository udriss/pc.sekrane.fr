import { NextRequest, NextResponse } from 'next/server';
import { parseData, updateData } from '@/lib/data-utils';

export async function DELETE(req: NextRequest) {
  try {
    const { fileUrl, courseId } = await req.json();

    if (!courseId || !fileUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { classes, courses } = await parseData();

    // Vérifier si le cours existe
    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Supprimer le fichier du cours
    const course = courses[courseIndex];
    const activityIndex = course.activities.findIndex(activity => activity.fileUrl === fileUrl);
    if (activityIndex === -1) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    course.activities.splice(activityIndex, 1);

    // Write updated data to data.json
    await updateData(classes, courses);

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}