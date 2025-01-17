import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Course, courses, classes } from '@/lib/data';
import { dataTemplate } from '@/lib/data-template';

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const courseId = url.pathname.split('/').pop();
  const dataFilePath = path.join(process.cwd(), 'lib', 'data.ts');

  try {
    // Trouver le cours à mettre à jour
    const courseIndex = courses.findIndex((course: Course) => course.id === courseId);
    if (courseIndex === -1) {
      console.error('Course not found:', courseId);
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Mettre à jour les détails du cours
    const updatedCourseDetails = await request.json();

    // Extraire newClasseId
    const { newClasseId, ...otherDetails } = updatedCourseDetails;

    // Supprimer le cours de la classe actuelle
    const currentClasse = classes.find(classe => classe.id === courses[courseIndex].theClasseId);
    if (currentClasse) {
      currentClasse.associated_courses = currentClasse.associated_courses.filter(id => id !== courseId);
    }

    // Ajouter le cours à la nouvelle classe
    const newClasse = classes.find(classe => classe.id === newClasseId);
    if (newClasse) {
      if (courseId) {
        newClasse.associated_courses.push(courseId);
      } else {
        return NextResponse.json({ error: 'Course ID is undefined' }, { status: 400 });
      }
      courses[courseIndex].classe = newClasse.name;
      courses[courseIndex].theClasseId = newClasse.id;
      courses[courseIndex].title = otherDetails.title;
      courses[courseIndex].description = otherDetails.description;
    } else {
      return NextResponse.json({ error: 'Nouvelle classe non trouvée.' }, { status: 404 });
    }


    // Écrire les modifications dans le fichier de données en utilisant dataTemplate
    const updatedData = dataTemplate
      .replace('__CLASSES__', JSON.stringify(classes, null, 2))
      .replace('__COURSES__', JSON.stringify(courses, null, 2));
    await fs.writeFile(dataFilePath, updatedData, 'utf-8');

    return NextResponse.json({ courses, classes });
  } catch (error) {
    console.error('Failed to update course:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}