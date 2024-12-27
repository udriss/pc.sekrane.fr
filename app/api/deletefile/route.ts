import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { courses, classes } from '@/lib/data';
import { dataTemplate } from '@/lib/data-template';

export async function DELETE(req: Request) {
  try {
    const { fileUrl, courseId } = await req.json();

    // Find the course by ID
    const course = courses.find(course => course.id === courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Find the activity by fileUrl
    const activityIndex = course.activities.findIndex(activity => activity.fileUrl === fileUrl);
    if (activityIndex === -1) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Remove the activity from the course
    course.activities.splice(activityIndex, 1);

    // Delete the file from the filesystem
    const filePath = path.join(process.cwd(), 'public', fileUrl);
    await fs.unlink(filePath);

    // Write the updated courses data to data.ts
    const updatedData = dataTemplate
      .replace('__CLASSES__', JSON.stringify(classes, null, 2))
      .replace('__COURSES__', JSON.stringify(courses, null, 2));
    const dataPath = path.join(process.cwd(), 'lib', 'data.ts');
    await fs.writeFile(dataPath, updatedData, 'utf8');

    // Return the updated list of files and courses
    const updatedFiles = course.activities.map(activity => activity.fileUrl);
    return NextResponse.json({ success: true, files: updatedFiles, courses });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}