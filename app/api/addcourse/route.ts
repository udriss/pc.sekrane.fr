// path: /app/api/addcourse/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { parseData, updateData } from '@/lib/data-utils';

export async function POST(req: NextRequest) {
  try {
    const { title, description, classe, theClasseId } = await req.json();

    if (!title || !theClasseId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }


    const { classes, courses } = await parseData();

    // Vérifier si une classe avec l'ID fourni existe
    const existingClasse = classes.find(classe => classe.id === theClasseId);
    if (!existingClasse) {
      return NextResponse.json({ error: 'Classe not found' }, { status: 404 });
    }

    // Trouver l'ID le plus grand et ajouter 1
    const maxId = courses.reduce((max, course) => Math.max(max, parseInt(course.id, 10)), 0);
    const newId = (maxId + 1).toString();

    const newCourse = { id: newId, title, description, classe: existingClasse.name, theClasseId: theClasseId, activities: [] };
    courses.push(newCourse);

    // Ajouter le course.id à la liste associated_courses de la classe concernée
    if (!existingClasse.associated_courses.includes(newId)) {
      existingClasse.associated_courses.push(newId);
    }

    // Write updated data to data.json
    await updateData(classes, courses);

    return NextResponse.json({ courses, classes }, { status: 200 });
  } catch (error) {
    console.error('Error adding course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}