import { NextRequest, NextResponse } from 'next/server';
import { deleteCourse, getAllClasses, getCourseById } from '@/lib/data-prisma-utils';
import { Classe, Course } from '@/lib/dataTemplate';
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(req: NextRequest) {
    try {
    const { deleteFiles, courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Vérifier si le cours existe
    const existingCourse = await getCourseById(courseId);
    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Supprimer le dossier associé si deleteFiles est vrai
    if (deleteFiles) {
      const courseDir = path.join(process.cwd(), 'public', courseId);
      await fs.rm(courseDir, { recursive: true, force: true }).catch(err => 
        console.error(`Error deleting directory ${courseDir}:`, err)
      );
    }

    // Supprimer le cours de la base de données (cela supprimera aussi les activités grâce au cascade)
    await deleteCourse(courseId);

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
          dropzoneConfig: activity.dropzoneConfig ? (activity.dropzoneConfig as any) : null
        })),
        isHidden: course.isHidden ?? false,
        isDisabled: course.isDisabled ?? false,
        themeChoice: course.themeChoice || 0
      }))
    );

    return NextResponse.json({ courses, classes }, { status: 200 });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}