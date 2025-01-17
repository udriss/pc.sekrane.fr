import { NextResponse, NextRequest } from 'next/server';
import { courses, classes } from '@/lib/data';
import { writeFileSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import { dataTemplate } from "@/lib/data-template";

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const courseId = url.pathname.split('/').pop();
    const { deleteFiles }: { deleteFiles: boolean } = await request.json();

    console.log('########## Deleting course: ', courseId, 'deleteFiles:', deleteFiles);
    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const course = courses[courseIndex];
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is missing' }, { status: 400 });
    }
    const courseDir = join(process.cwd(), 'public', courseId);

    // Supprimer les fichiers PDF associés si deleteFiles est vrai
    if (deleteFiles) {
      // Supprimer le dossier du cours
      console.log('Deleting course directory: ', courseDir);
      if (existsSync(courseDir)) {
        rmSync(courseDir, { recursive: true, force: true });
      }
    }

    // Supprimer le cours de la classe actuelle
    const currentClasse = classes.find(classe => classe.id === course.theClasseId);
    if (currentClasse) {
      currentClasse.associated_courses = currentClasse.associated_courses.filter(id => id !== courseId);
    }

    // Supprimer le cours de la liste
    courses.splice(courseIndex, 1);

    // Écrire les données mises à jour dans data.ts
    const updatedData = dataTemplate
      .replace('__CLASSES__', JSON.stringify(classes, null, 2))
      .replace('__COURSES__', JSON.stringify(courses, null, 2));
    writeFileSync(join(process.cwd(), 'lib/data.ts'), updatedData);

    return NextResponse.json({ success: true, courses, classes, message: 'Course deleted successfully' });
  } catch (error: any) {
    console.error("Delete course error:", error);
    return NextResponse.json(
      { error: `Error deleting course: ${error.message}` },
      { status: 500 }
    );
  }
}