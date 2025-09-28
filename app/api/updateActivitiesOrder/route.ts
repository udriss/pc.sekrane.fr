import { NextRequest, NextResponse } from 'next/server';
import { getCourseById, updateActivity } from '@/lib/data-prisma-utils';
import { Activity } from '@/lib/dataTemplate';

export async function PUT(req: NextRequest) {
  try {
    const { courseId, activities } = await req.json();

    if (!courseId || !activities) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Vérifier si le cours existe
    const course = await getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Validation des activités reçues
    const validActivities = activities.every((activity: Activity) => 
      activity.id && activity.name && activity.title && activity.fileUrl
    );

    if (!validActivities) {
      return NextResponse.json({ error: 'Invalid activities data' }, { status: 400 });
    }

    // Mettre à jour l'ordre de chaque activité
    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      await updateActivity(activity.id, { order: i });
    }

    const titleOfChosenCourse = course.title;

    return NextResponse.json({ titleOfChosenCourse: titleOfChosenCourse }, { status: 200 });
  } catch (error) {
    console.error('Error updating activities order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}