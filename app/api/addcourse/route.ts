// path: /app/api/addcourse/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createCourse, getAllClasses, getClasseById } from '@/lib/data-prisma-utils';
import { Classe, Course } from '@/lib/dataTemplate';

export async function POST(req: NextRequest) {
  try {
    const { title, description, classe, theClasseId } = await req.json();

    if (!title || !theClasseId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Vérifier si une classe avec l'ID fourni existe
    const existingClasse = await getClasseById(theClasseId);
    if (!existingClasse) {
      return NextResponse.json({ error: 'Classe not found' }, { status: 404 });
    }

    // Récupérer tous les cours pour trouver le prochain ID
    const allClasses = await getAllClasses();
    const allCourses = allClasses.flatMap(c => c.courses);
    
    // Trouver l'ID le plus grand et ajouter 1
    const maxId = allCourses.reduce((max, course) => Math.max(max, parseInt(course.id, 10)), 0);
    const newId = (maxId + 1).toString();

    // Créer le nouveau cours directement dans la base de données
    await createCourse({
      id: newId,
      title,
      description: description || '',
      classe: existingClasse.name,
      theClasseId: theClasseId,
      toggleVisibilityCourse: false,
      themeChoice: 0,
      activities: []
    });

    // Récupérer les données mises à jour
    const updatedClassesData = await getAllClasses();

    // Transformation vers le format attendu
    const classes: Classe[] = updatedClassesData.map(classe => ({
      id: classe.id,
      name: classe.name,
      associated_courses: classe.courses.map(course => course.id),
      toggleVisibilityClasse: classe.toggleVisibilityClasse || false
    }));

    const courses: Course[] = updatedClassesData.flatMap(classe => 
      classe.courses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        classe: course.classe,
        theClasseId: course.theClasseId,
        activities: course.activities.map(activity => ({
          id: activity.id,
          name: activity.name,
          title: activity.title,
          fileUrl: activity.fileUrl
        })),
        toggleVisibilityCourse: course.toggleVisibilityCourse || false,
        themeChoice: course.themeChoice || 0
      }))
    );

    return NextResponse.json({ courses, classes }, { status: 200 });
  } catch (error) {
    console.error('Error adding course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}