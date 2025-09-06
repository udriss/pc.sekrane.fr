import { NextRequest, NextResponse } from 'next/server';
import { updateCourse, getAllClasses, getCourseById, getClasseById } from '@/lib/data-prisma-utils';
import { Classe, Course } from '@/lib/dataTemplate';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Vérifier si le cours existe
    const existingCourse = await getCourseById(courseId);
    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Préparer les données de mise à jour
    const updateData: {
      title?: string;
      description?: string;
      classe?: string;
      theClasseId?: string;
      toggleVisibilityCourse?: boolean;
      themeChoice?: number;
    } = {};

    // Si c'est une mise à jour du thème
    if ('themeChoice' in body) {
      updateData.themeChoice = body.themeChoice;
    }
    // Si c'est une mise à jour de visibilité
    else if ('toggleVisibilityCourse' in body) {
      updateData.toggleVisibilityCourse = body.toggleVisibilityCourse;
    }
    // Si c'est une mise à jour complète du cours
    else if (body.title || body.description || body.newClasseId) {
      if (body.title) updateData.title = body.title;
      if (body.description) updateData.description = body.description;
      
      if (body.newClasseId) {
        // Vérifier que la nouvelle classe existe
        const newClasse = await getClasseById(body.newClasseId);
        if (!newClasse) {
          return NextResponse.json({ error: 'New classe not found' }, { status: 404 });
        }
        updateData.theClasseId = body.newClasseId;
        updateData.classe = newClasse.name;
      }
    } else {
      return NextResponse.json({ error: 'Invalid update parameters' }, { status: 400 });
    }

    // Mettre à jour le cours dans la base de données
    await updateCourse(courseId, updateData);

    // Récupérer les données mises à jour
    const updatedClassesData = await getAllClasses();

    // Transformation vers le format attendu
    const classes: Classe[] = updatedClassesData.map(classe => ({
      id: classe.id,
      name: classe.name,
      associated_courses: classe.courses.map(course => course.id),
      toggleVisibilityClasse: classe.toggleVisibilityClasse || false,
      hasProgression: classe.hasProgression || false
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
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}