import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { courses, classes } from '@/lib/data';
import { dataTemplate } from '@/lib/data-template';

export async function PUT(req: Request) {
  try {
    const { courseId, activityId, newTitle } = await req.json();

    // Find the course
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Find the activity
    const activity = course.activities.find(a => a.id === activityId);
    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }

    // Update the title
    activity.title = newTitle;

    // Write changes to data.ts
    const updatedData = dataTemplate
      .replace('__CLASSES__', JSON.stringify(classes, null, 2))
      .replace('__COURSES__', JSON.stringify(courses, null, 2));

    await fs.writeFile(
      path.join(process.cwd(), 'lib', 'data.ts'),
      updatedData,
      'utf-8'
    );

    return NextResponse.json({ courses });

  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}