import { NextRequest, NextResponse } from 'next/server';
import { parseData, updateData } from '@/lib/data-utils';

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  const { classes, courses } = await parseData();

  // Vérifier si une classe avec le même nom existe déjà
  const existingClasse = classes.find(classe => classe.name.toLowerCase() === name.toLowerCase());
  if (existingClasse) {
    return NextResponse.json({ warning: 'Cette classe existe déjà.' }, { status: 400 });
  }

  // Trouver l'ID le plus grand et ajouter 1
  const maxId = classes.reduce((max, classe) => Math.max(max, parseInt(classe.id, 10)), 0);
  const newId = (maxId + 1).toString();

  const newClasse = { id: newId, name, associated_courses: [] };
  classes.push(newClasse);

  // Write updated classes data to data.json
  await updateData(classes, courses);

  return NextResponse.json({ classes }, { status: 200 });
}