import { NextRequest, NextResponse } from 'next/server';
import { getAllClasses, getCourseById } from '@/lib/data-prisma-utils';
import { Classe, Course } from '@/lib/dataTemplate';

export async function PUT(req: NextRequest) {
  try {
    const { courses: updatedCourseOrder, activeCourseId: activeCourseId } = await req.json();

    if (!updatedCourseOrder) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Récupérer les données depuis la base de données
    const classesData = await getAllClasses();
    const allCourses = classesData.flatMap(c => c.courses);

    // Vérifier que tous les cours existent
    for (const courseId of updatedCourseOrder) {
      const course = allCourses.find(c => c.id === courseId);
      if (!course) {
        throw new Error(`Course with id ${courseId} not found`);
      }
    }

    // Note: Dans cette API, l'ordre n'est pas persisté en base de données
    // car il semble être géré côté client. Si vous voulez persister l'ordre,
    // il faudrait ajouter un champ `order` ou `position` au modèle Course.

    // Convertir activeCourseId en entier
    const activeCourseIdInt = typeof activeCourseId === 'string' ? parseInt(activeCourseId, 10) : activeCourseId;

    // Récupérer le titre de la classe du cours actif
    const activeCourse = await getCourseById(activeCourseIdInt);
    const titleOfChosenClass = activeCourse?.classe;

    return NextResponse.json({ titleOfChosenClass: titleOfChosenClass }, { status: 200 });
  } catch (error) {
    console.error('Error updating course order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}