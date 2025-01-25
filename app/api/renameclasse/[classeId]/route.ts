import { NextRequest, NextResponse } from 'next/server';
import { parseData, updateData } from '@/lib/data-utils';

export async function PUT(req: NextRequest) {
  try {
    const { classeId, name: newName, toggleVisibilityClasse } = await req.json();

    if (!classeId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { classes, courses } = await parseData();

    // Get and validate target class
    const targetClass = classes.find((classe) => classe.id === classeId);
    if (!targetClass) {
      return NextResponse.json({ error: 'Classe introuvable (API)' }, { status: 404 });
    }

    // Find and update the class directly in classes array
    const classIndex = classes.findIndex((c) => c.id === classeId);
    if (classIndex !== -1) {
      // Update name if provided
      if (newName) {
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

      // Update visibility if provided
      if (toggleVisibilityClasse !== undefined) {
        classes[classIndex].toggleVisibilityClasse = toggleVisibilityClasse;
      }
    }

    // Write updated data to file
    await updateData(classes, courses);

    return NextResponse.json({ courses, classes });
  } catch (error: any) {
    console.error('Error updating class:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}