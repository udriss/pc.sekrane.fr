// path: /app/api/addcourse/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path, { join } from 'path';
import { courses, classes } from '@/lib/data';
import { dataTemplate } from '@/lib/data-template';

export const POST = async (req: NextRequest) => {
  const { title, description, classe, theClasseId } = await req.json();

  // Generate a new course ID
  const newCourseId = `${Date.now()}`;
  let courseDir = join(process.cwd(), 'public', newCourseId);

  //const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_');
  // Check if the directory already exists and add a suffix if necessary
  // let suffix = 2;
  // while (await fs.access(courseDir).then(() => true).catch(() => false)) {
  //  courseDir = join(process.cwd(), 'public', `${sanitizedTitle}_(${suffix})`);
  //  suffix++;
  //}

  // Create the new course directory
  await fs.mkdir(courseDir, { recursive: true });

  // Create new course object
  const newCourse = {
    id: newCourseId,
    title,
    description,
    classe,
    theClasseId,
    activities: [],
  };

  // Add new course to courses array
  courses.push(newCourse);

  // Find the class and add the course ID to associated_courses
  const selectedClasse = classes.find(classe => classe.id === theClasseId);
  if (selectedClasse) {
    selectedClasse.associated_courses.push(newCourse.id);
  } else {
    return NextResponse.json({ error: 'Classe non trouvée.' }, { status: 404 });
  }


  // Update data file
  const dataFilePath = path.join(process.cwd(), 'lib', 'data.ts');
  try {
    const updatedData = dataTemplate
      .replace('__CLASSES__', JSON.stringify(classes, null, 2))
      .replace('__COURSES__', JSON.stringify(courses, null, 2));
    await fs.writeFile(dataFilePath, updatedData, 'utf-8');
  } catch (error) {
    console.error('Failed to update data file:', error);
    return NextResponse.json({ error: 'Failed to update data file' }, { status: 500 });
  }

  // Return updated data
  return NextResponse.json({ courses, classes }, { status: 200 });
};