import { NextRequest, NextResponse } from 'next/server';
import { classes, Classe, courses } from '@/lib/data';
import { writeFileSync } from 'fs';
import path from 'path';
import { dataTemplate } from '@/lib/data-template';

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  // Vérifier si une classe avec le même nom existe déjà
  const existingClasse = classes.find(classe => classe.name.toLowerCase() === name.toLowerCase());
  if (existingClasse) {
    return NextResponse.json({ warning: 'Cette classe existe déjà.' }, { status: 400 });
  }

  // Trouver l'ID le plus grand et ajouter 1
  const maxId = classes.reduce((max, classe) => Math.max(max, parseInt(classe.id, 10)), 0);
  const newId = (maxId + 1).toString();

  const newClasse: Classe = { id: newId, name };
  classes.push(newClasse);

  // Write updated classes data to data.ts
  const updatedData = dataTemplate
    .replace('__CLASSES__', JSON.stringify(classes, null, 2))
    .replace('__COURSES__', JSON.stringify(courses, null, 2));
  const dataPath = path.join(process.cwd(), 'lib', 'data.ts');
  writeFileSync(dataPath, updatedData);

  return NextResponse.json({ classes }, { status: 200 });
}