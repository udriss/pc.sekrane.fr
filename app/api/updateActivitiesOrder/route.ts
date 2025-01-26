import { NextRequest, NextResponse } from 'next/server';
import { parseData, updateData } from '@/lib/data-utils';

export async function PUT(req: NextRequest) {
  try {
    const { courseId, activities } = await req.json();

    if (!courseId || !activities) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { classes, courses } = await parseData();

    // Vérifier si le cours existe
    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Mettre à jour l'ordre des activités du cours
    courses[courseIndex].activities = activities;

    // Write updated data to file
    await updateData(classes, courses);
    const titleOfChosenCourse = courses.find(course => course.id === courseId.toString())?.title;
    

    return NextResponse.json({ titleOfChosenCourse: titleOfChosenCourse }, { status: 200 });
  } catch (error) {
    console.error('Error updating activities order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}