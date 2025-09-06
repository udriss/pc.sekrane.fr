import { NextRequest, NextResponse } from 'next/server';
import { createClasse, getAllClasses } from '@/lib/data-prisma-utils';
import { Classe } from '@/lib/dataTemplate';

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Le nom de la classe est requis.' }, { status: 400 });
    }

    // Vérifier si une classe avec le même nom existe déjà
    const existingClasses = await getAllClasses();
    const existingClasse = existingClasses.find(classe => classe.name.toLowerCase() === name.toLowerCase());
    
    if (existingClasse) {
      return NextResponse.json({ warning: 'Cette classe existe déjà.' }, { status: 400 });
    }

    // Trouver l'ID le plus grand et ajouter 1
    const maxId = existingClasses.reduce((max, classe) => Math.max(max, parseInt(classe.id, 10)), 0);
    const newId = (maxId + 1).toString();

    // Créer la nouvelle classe directement dans la base de données
    const newClasseData = await createClasse({
      id: newId,
      name,
      toggleVisibilityClasse: false
    });

    // Récupérer toutes les classes pour retourner la liste mise à jour
    const allClassesData = await getAllClasses();
    const classes: Classe[] = allClassesData.map(classe => ({
      id: classe.id,
      name: classe.name,
      associated_courses: classe.courses.map(course => course.id),
      toggleVisibilityClasse: classe.toggleVisibilityClasse || false
    }));

    return NextResponse.json({ classes }, { status: 200 });
  } catch (error) {
    console.error('Error adding classe:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}