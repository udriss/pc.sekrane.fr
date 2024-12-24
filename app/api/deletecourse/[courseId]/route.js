import { NextResponse } from 'next/server';
import { courses } from '@/lib/data';
import { writeFileSync, unlinkSync, existsSync, rmdirSync } from 'fs';
import { join } from 'path';

export async function DELETE(request, { params }) {
  try {
    const { courseId } = params;

    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const course = courses[courseIndex];
    const courseDir = join(process.cwd(), 'public/pdfs', courseId);

    // Supprimer les fichiers PDF associés
    course.activities.forEach(activity => {
      const filePath = join(process.cwd(), 'public', activity.pdfUrl);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    });

    // Supprimer le dossier du cours
    if (existsSync(courseDir)) {
      rmdirSync(courseDir, { recursive: true });
    }

    // Supprimer le cours de la liste
    courses.splice(courseIndex, 1);

    // Écrire les données mises à jour dans data.ts
    const updatedData = `export const courses = ${JSON.stringify(courses, null, 2)};`;
    writeFileSync(join(process.cwd(), 'lib/data.ts'), updatedData);
    console.log("Data written to data.ts");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: `Error deleting course: ${error.message}` },
      { status: 500 }
    );
  }
}