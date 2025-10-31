import { NextRequest, NextResponse } from 'next/server';
import { deleteClasse, getAllClasses, getCoursesByClasseId, deleteCourse } from '@/lib/data-prisma-utils';
import { Classe, Course } from '@/lib/dataTemplate';
import { rm } from 'fs/promises';
import path from 'path';

export async function DELETE(req: NextRequest) {
  try {
    const { classeId, deleteFiles = true } = await req.json();

    if (!classeId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Vérifier si la classe existe
    const classeExists = await getAllClasses();
    const classe = classeExists.find(c => c.id === classeId);
    
    if (!classe) {
      return NextResponse.json({ error: 'Classe not found' }, { status: 404 });
    }

    if (deleteFiles) {
      // Récupérer les cours associés à cette classe pour supprimer les fichiers
      const classeCourses = await getCoursesByClasseId(classeId);
      
      // Supprimer chaque dossier de cours
      for (const course of classeCourses) {
        const courseFolder = path.join(process.cwd(), 'public', course.id);
        try {
          await rm(courseFolder, { recursive: true, force: true });
        } catch (error) {
          console.error(`Error deleting course folder ${course.id}:`, error);
          // Continue même si la suppression échoue
        }
      }
    
      // Supprimer le dossier de la classe
      const classFolder = path.join(process.cwd(), 'public', classeId);
      try {
        await rm(classFolder, { recursive: true, force: true });
      } catch (error) {
        console.error('Error deleting class folder:', error);
      }
    }

    // Supprimer la classe (cela supprimera automatiquement les cours associés grâce au cascade)
    await deleteClasse(classeId);

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
          fileUrl: activity.fileUrl,
          order: activity.order ?? undefined,
          isFileDrop: activity.isFileDrop ?? false,
          dropzoneConfig: activity.dropzoneConfig ? (activity.dropzoneConfig as any) : null
        })),
        toggleVisibilityCourse: course.toggleVisibilityCourse || false,
        themeChoice: course.themeChoice || 0
      }))
    );

    return NextResponse.json({ classes, courses }, { status: 200 });
  } catch (error) {
    console.error('Error deleting classe:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}