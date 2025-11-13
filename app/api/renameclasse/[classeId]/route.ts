import { NextRequest, NextResponse } from 'next/server';
import { getAllClasses, updateClasse, getCoursesByClasseId, updateCourse } from '@/lib/data-prisma-utils';
import { Classe, Course } from '@/lib/dataTemplate';

export async function PUT(req: NextRequest) {
  try {
    const { classeId, name: newName, toggleVisibilityClasse } = await req.json();

    if (!classeId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Vérifier si la classe existe
    const allClasses = await getAllClasses();
    const targetClass = allClasses.find((classe) => classe.id === classeId);
    
    if (!targetClass) {
      return NextResponse.json({ error: 'Classe introuvable (API)' }, { status: 404 });
    }

    // Mettre à jour la classe
    const updateData: { name?: string; toggleVisibilityClasse?: boolean } = {};
    if (newName) updateData.name = newName;
    if (toggleVisibilityClasse !== undefined) updateData.toggleVisibilityClasse = toggleVisibilityClasse;

    await updateClasse(classeId, updateData);

    // Si le nom a changé, mettre à jour tous les cours associés
    if (newName) {
      const associatedCourses = await getCoursesByClasseId(classeId);
      for (const course of associatedCourses) {
        await updateCourse(course.id, { classe: newName });
      }
    }

    // Récupérer les données mises à jour
    const updatedClassesData = await getAllClasses();

    // Transformation vers le format attendu
    const classes: Classe[] = updatedClassesData.map(classe => ({
      id: classe.id,
      name: classe.name,
      associated_courses: classe.courses.map(course => course.id.toString()),
      toggleVisibilityClasse: classe.toggleVisibilityClasse || false,
      hasProgression: classe.hasProgression || false
    }));

    const courses: Course[] = updatedClassesData.flatMap(classe => 
      classe.courses.map(course => ({
        id: course.id.toString(),
        title: course.title,
        description: course.description,
        classe: course.classe,
        theClasseId: course.theClasseId,
        activities: course.activities.map(activity => ({
          id: activity.id,
          name: activity.name,
          title: activity.title,
          fileUrl: activity.fileUrl,
          order: activity.order ?? undefined,
          isFileDrop: activity.isFileDrop ?? false,
          dropzoneConfig: activity.dropzoneConfig ? (activity.dropzoneConfig as any) : null,
          isHidden: activity.isHidden ?? false,
          isDisabled: activity.isDisabled ?? false
        })),
        isHidden: course.isHidden ?? false,
        isDisabled: course.isDisabled ?? false,
        themeChoice: course.themeChoice || 0
      }))
    );

    return NextResponse.json({ courses, classes });
  } catch (error: any) {
    console.error('Error updating class:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}