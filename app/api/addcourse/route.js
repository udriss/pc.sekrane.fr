import { NextResponse } from 'next/server';
import { courses } from '@/lib/data';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { dataTemplate } from "@/lib/data-template";

export async function POST(request) {
  try {
    const { title, description } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newCourse = {
      id: `${Date.now()}`,
      title,
      description: description || "",
      activities: []
    };

    courses.push(newCourse);

    // Create a new directory for the course
    const courseDir = join(process.cwd(), 'public/pdfs', newCourse.id);
    if (!existsSync(courseDir)) {
      mkdirSync(courseDir, { recursive: true });
      console.log(`Directory created: ${courseDir}`);
    }

    // Write updated courses data to data.ts
    const updatedData = dataTemplate.replace('__COURSES__', JSON.stringify(courses, null, 2));
    const dataPath = path.join(process.cwd(), 'lib', 'data.ts');
    writeFileSync(join(process.cwd(), 'lib/data.ts'), updatedData);
    console.log("Data written to data.ts");

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json(
      { error: `Error adding course: ${error.message}` },
      { status: 500 }
    );
  }
}