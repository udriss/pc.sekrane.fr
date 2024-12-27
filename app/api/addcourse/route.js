import { promises as fs } from 'fs';
import path, { join } from 'path';
import { NextResponse } from 'next/server';
import { courses, classes } from '@/lib/data';
import { dataTemplate } from '@/lib/data-template';

export async function POST(req) {
  try {
    const { title, description, classe } = await req.json();

    // Generate a new course ID
    const timestamp = Date.now().toString().substring(5); // Supprime les 5 premiers caractères
    const newCourseId = `${Date.now()}`;
    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_');
    let courseDir = join(process.cwd(), 'public', sanitizedTitle);

    // Check if the directory already exists and add a suffix if necessary
    let suffix = 2;
    while (await fs.access(courseDir).then(() => true).catch(() => false)) {
      courseDir = join(process.cwd(), 'public', `${sanitizedTitle}_(${suffix})`);
      suffix++;
    }

    // Create the new course directory
    await fs.mkdir(courseDir, { recursive: true });

    // Create the new course object
    const newCourse = {
      id: newCourseId,
      title,
      description,
      classe,
      activities: [],
    };

    // Add the new course to the courses array
    courses.push(newCourse);

    // Write the updated courses data to data.ts
    const updatedData = dataTemplate
      .replace('__CLASSES__', JSON.stringify(classes, null, 2))
      .replace('__COURSES__', JSON.stringify(courses, null, 2));
    const dataPath = path.join(process.cwd(), 'lib', 'data.ts');
    await fs.writeFile(dataPath, updatedData, 'utf8');

    return NextResponse.json({ success: true, course: newCourse });
  } catch (error) {
    console.error('Error adding course:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}