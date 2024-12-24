import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { courses, Course } from '@/lib/data';
import { writeFileSync } from 'fs';
import { dataTemplate } from "@/lib/data-template";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const courseId = formData.get('courseId') as string;
    const file = formData.get('file') as File;
    const ActivityTitle = formData.get('ActivityTitle') as string;

    if (!courseId || !file) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const courseDir = join(process.cwd(), 'public/pdfs', courseId);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(courseDir, fileName);

    // Create directory if it doesn't exist
    await mkdir(courseDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    await writeFile(filePath, uint8Array);
    console.log("File written to disk:", filePath);

    // Update the course data
    const course = courses.find((c: Course) => c.id === courseId);
    if (course) {
      const newActivity = {
        id: `${Date.now()}`,
        name: file.name,
        title: ActivityTitle,
        pdfUrl: `/pdfs/${courseId}/${fileName}`,
      };
      course.activities.push(newActivity);

      

      // Write updated courses data to data.ts
      const updatedData = dataTemplate.replace('__COURSES__', JSON.stringify(courses, null, 2));
      writeFileSync(join(process.cwd(), 'lib/data.ts'), updatedData);
      console.log("Data written to data.ts");

      return NextResponse.json({ success: true, activity: newActivity });
    } else {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: `Error uploading file: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}