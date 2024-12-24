import { join } from 'path';
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { courses, Course } from '@/lib/data'; // Importer les données de data.ts
import { writeFileSync } from 'fs';


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const courseId = formData.get('courseId') as string;
    const title = formData.get('title') as string;
    const file = formData.get('file') as File;

    if (!courseId || !title || !file) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const courseDir = join(process.cwd(), 'public/pdfs', courseId);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(courseDir, fileName);

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    await writeFile(filePath, uint8Array);
    console.log("File written to disk:", filePath);

    // Update course data
    const course = courses.find((c: Course) => c.id === courseId);
    if (!course) {
      console.error("Course not found:", courseId);
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    const newActivity = {
      id: `${courseId}-${Date.now()}`,
      title,
      pdfUrl: `/pdfs/${courseId}/${fileName}`
    };
    
    course.activities.push(newActivity);
    console.log("Course updated with new activity:", newActivity);

    // Write updated courses data to data.ts
    const updatedData = `export const courses = ${JSON.stringify(courses, null, 2)};`;
    writeFileSync(join(process.cwd(), 'lib/data.ts'), updatedData);
    console.log("Data written to data.ts");

    return NextResponse.json({ 
      success: true,
      activity: newActivity 
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: `Error uploading file: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}