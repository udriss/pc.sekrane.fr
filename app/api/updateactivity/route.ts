import { NextRequest, NextResponse } from 'next/server';
import { parseData, updateData } from '@/lib/data-utils';

export async function PUT(req: NextRequest) {
  try {
    const { courseId, activityId, newTitle } = await req.json();

    if (!courseId || !activityId || !newTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { classes, courses } = await parseData();

    // Vérifier si le cours existe
    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Vérifier si l'activité existe
    const activityIndex = courses[courseIndex].activities.findIndex(activity => activity.id === activityId);
    if (activityIndex === -1) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    // Mettre à jour l'activité
    courses[courseIndex].activities[activityIndex] = {
      ...courses[courseIndex].activities[activityIndex],
      title: newTitle,
    };

    // Write updated data to file
    await updateData(classes, courses);

    return NextResponse.json({ courses, classes }, { status: 200 });
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}