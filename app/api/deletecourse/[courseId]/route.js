import { NextResponse } from 'next/server';
import { courses } from '@/lib/data';
import { writeFileSync, unlinkSync, existsSync, rmdirSync } from 'fs';
import { join } from 'path';
import { dataTemplate } from "@/lib/data-template";

export async function DELETE(request, { params }) {
  try {
    const { courseId } = await params;

    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const course = courses[courseIndex];
    const courseDir = join(process.cwd(), 'public', courseId);

    // Supprimer les fichiers PDF associés
    course.activities.forEach(activity => {
      const filePath = join(process.cwd(), 'public', activity.fileUrl);
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
    const updatedData = dataTemplate.replace('__COURSES__', JSON.stringify(courses, null, 2));
    writeFileSync(join(process.cwd(), 'lib/data.ts'), updatedData);
    console.log("Data written to data.ts");

    return NextResponse.json({ success: true, courses, message: 'Course deleted successfully' });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json(
      { error: `Error deleting course: ${error.message}` },
      { status: 500 }
    );
  }
}