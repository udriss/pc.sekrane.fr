import { NextRequest, NextResponse } from 'next/server';
import { getCourseById } from '@/lib/data-prisma-utils';
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

    // Note: Cette API semble gérer l'ordre des activités côté client.
    // Si vous voulez persister l'ordre en base, il faudrait ajouter un champ `order`
    // au modèle Activity et mettre à jour chaque activité ici.
    
    // Validation des activités reçues
    const validActivities = activities.every((activity: Activity) => 
      activity.id && activity.name && activity.title && activity.fileUrl
    );

    if (!validActivities) {
      return NextResponse.json({ error: 'Invalid activities data' }, { status: 400 });
    }

    // Pour le moment, on ne persist pas l'ordre mais on retourne le titre du cours
    const titleOfChosenCourse = course.title;

    return NextResponse.json({ titleOfChosenCourse: titleOfChosenCourse }, { status: 200 });
  } catch (error) {
    console.error('Error updating activities order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}