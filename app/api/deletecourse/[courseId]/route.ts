import { NextRequest, NextResponse } from 'next/server';
import { parseData, updateData } from '@/lib/data-utils';
import fs from 'fs/promises';
import path from 'path';


export async function DELETE(req: NextRequest) {
    try {
    const { deleteFiles, courseId } = await req.json();
    console.log('courseId:', courseId);

    if (!courseId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { classes, courses } = await parseData();

    // Vérifier si le cours existe
    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Extract deleteFiles from request body
    

    // Supprimer le dossier associé si deleteFiles est vrai
    if (deleteFiles) {
      const courseDir = path.join(process.cwd(), 'public', courseId);
      await fs.rm(courseDir, { recursive: true, force: true }).catch(err => console.error(`Error deleting directory ${courseDir}:`, err));
    }

    // Supprimer le cours
    courses.splice(courseIndex, 1);

    // Write updated data to data.json
    await updateData(classes, courses);

    return NextResponse.json({ courses, classes }, { status: 200 });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}