import { NextRequest, NextResponse } from 'next/server';
import { parseData, updateData } from '@/lib/data-utils';
import { rm } from 'fs/promises';
import path from 'path';

export async function DELETE(req: NextRequest) {
  try {
    const { classeId, deleteFiles = true } = await req.json();

    if (!classeId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { classes, courses } = await parseData();

    // Vérifier si la classe existe
    const classeIndex = classes.findIndex(classe => classe.id === classeId);
    if (classeIndex === -1) {
      return NextResponse.json({ error: 'Classe not found' }, { status: 404 });
    }

    // Supprimer la classe
    classes.splice(classeIndex, 1);

    // Supprimer les cours associés à la classe
    const updatedCourses = courses.filter(course => course.theClasseId !== classeId);

    if (deleteFiles) {
      // Get courses for this class
      const classeCourses = courses.filter(course => course.theClasseId === classeId);
      
      // Delete each course folder
      for (const course of classeCourses) {
        const courseFolder = path.join(process.cwd(), 'public', course.id);
        try {
          await rm(courseFolder, { recursive: true, force: true });
        } catch (error) {
          console.error(`Error deleting course folder ${course.id}:`, error);
          // Continue to next folder even if deletion fails
        }
      }
    
      // Delete class folder
      const classFolder = path.join(process.cwd(), 'public', classeId);
      try {
        await rm(classFolder, { recursive: true, force: true });
      } catch (error) {
        console.error('Error deleting class folder:', error);
      }
    }

    // Write updated data to data.json
    await updateData(classes, updatedCourses);

    return NextResponse.json({ classes, courses: updatedCourses }, { status: 200 });
  } catch (error) {
    console.error('Error deleting classe:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}