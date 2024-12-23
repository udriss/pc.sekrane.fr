import { NextResponse } from 'next/server';
import { courses } from '@/lib/data';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

export async function POST(request) {
  try {
    const { courseId, deleteFiles } = await request.json();

    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (deleteFiles) {
      const course = courses[courseIndex];
      course.activities.forEach(activity => {
        const filePath = join(process.cwd(), 'public', activity.pdfUrl);
        if (existsSync(filePath)) {
          unlinkSync(filePath);
        }
      });
    }

    courses.splice(courseIndex, 1);

    // Write updated courses data to data.ts
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