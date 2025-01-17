import { NextRequest, NextResponse } from 'next/server';
import { classes, Classe, courses } from '@/lib/data';
import { writeFileSync } from 'fs';
import path from 'path';
import { dataTemplate } from '@/lib/data-template';

export async function DELETE(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const classeId = pathname.split('/').pop();

  if (!classeId) {
    return NextResponse.json({ error: 'ID de classe non fourni.' }, { status: 400 });
  }

  // Vérifier si la classe "Autre" est protégée
  if (classeId === '0') {
    return NextResponse.json({ error: 'La classe "Autre" ne peut pas être supprimée.' }, { status: 403 });
  }

  // Vérifier si la classe existe
  const classeIndex = classes.findIndex(classe => classe.id === classeId);
  if (classeIndex === -1) {
    return NextResponse.json({ error: 'Classe non trouvée.' }, { status: 404 });
  }

  // Vérifier si des cours sont associés à cette classe
  const associatedCourses = courses.filter(course => course.classe === classes[classeIndex].name);

  // Si des cours sont associés et que la classe "Autre" n'existe pas, la créer
  if (associatedCourses.length > 0) {
    let otherClasse = classes.find(classe => classe.name === 'Autre');
    if (!otherClasse) {
      otherClasse = { id: '0', name: 'Autre', associated_courses: [] };
      classes.push(otherClasse);
    }

    // Transférer les cours associés à la classe "Autre"
    associatedCourses.forEach(course => {
      course.classe = 'Autre';
      course.theClasseId = '0';
      if (otherClasse) {
        otherClasse.associated_courses.push(course.id); // Ajouter l'ID du cours à la liste des cours associés
      }
    });
  }

  // Supprimer la classe
  classes.splice(classeIndex, 1);

  // Write updated data to data.ts
  const updatedData = dataTemplate
    .replace('__CLASSES__', JSON.stringify(classes, null, 2))
    .replace('__COURSES__', JSON.stringify(courses, null, 2));
  const dataPath = path.join(process.cwd(), 'lib', 'data.ts');
  writeFileSync(dataPath, updatedData);

  return NextResponse.json({ classes, courses }, { status: 200 });
}