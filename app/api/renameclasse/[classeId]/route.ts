// filepath: /api/renameclasse/[classeId]/route.ts
// ...existing code...
import { NextRequest, NextResponse } from 'next/server';
import { classes, courses } from '@/lib/data';
import { dataTemplate } from '@/lib/data-template';
import fs from 'fs/promises'
import path from 'path'

export async function PUT(req: Request) {
  try {
    const { classeId, name: newName } = await req.json();
    
    // Validate data exists
    if (!classes || !Array.isArray(classes)) {
      return NextResponse.json({ error: 'Classes data unavailable' }, { status: 500 });
    }

    // Get and validate target class
    const targetClass = classes.find((classe) => classe.id === classeId);
    if (!targetClass) {
      return NextResponse.json({ error: 'Classe introuvable (API)' }, { status: 404 });
    }

    // Find and update the class directly in classes array
    const classIndex = classes.findIndex((c) => c.id === classeId);
    if (classIndex !== -1) {
      classes[classIndex].name = newName;

      // Update associated courses if they exist
      if (Array.isArray(classes[classIndex].associated_courses)) {
        classes[classIndex].associated_courses.forEach(courseId => {
          const course = courses?.find(c => c.id === courseId);
          if (course) {
            course.classe = newName;
          }
        });
      }
    }

    // Write updated data to file
    const updatedData = dataTemplate
      .replace('__CLASSES__', JSON.stringify(classes, null, 2))
      .replace('__COURSES__', JSON.stringify(courses, null, 2))

    await fs.writeFile(
      path.join(process.cwd(), 'lib', 'data.ts'),
      updatedData,
      'utf-8'
    )

    return NextResponse.json({ courses, classes });
  } catch (error: any) {
    console.error('Error renaming class:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

