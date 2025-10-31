import { promises as fs } from 'fs';
import path from 'path';
import { createActivity, getCourseById, getAllClasses } from '@/lib/data-prisma-utils';
import { Classe, Course } from '@/lib/dataTemplate';
import { NextResponse } from 'next/server';
import { logConnection } from '@/lib/logConnection';

export async function POST(req: Request) {
  try {
    await logConnection(req, '/api/upload');
    const formData = await req.formData();
    const courseId = formData.get('courseId') as string;
    const file = formData.get('file') as File;
    const ActivityTitle = formData.get('ActivityTitle') as string;

    if (!courseId || !file || !ActivityTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Vérifier si le cours existe
    const course = await getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const sanitizeFileName = (str: string) => {
      return str
        .normalize('NFD')                     // Decompose characters into base + diacritical marks
        .replace(/[\u0300-\u036f]/g, '')     // Remove diacritical marks
        .replace(/[^a-zA-Z0-9.-]/g, '_');    // Replace any remaining special chars with underscore
    };
    
    let fileName = sanitizeFileName(file.name);
    let filePath = '';

    // Determine the directory based on the file type
    if (file.name.endsWith('.ipynb')) {
      filePath = path.join(process.cwd(), 'public', courseId, 'notebook');
    } else if (file.name.endsWith('.pdf')) {
      filePath = path.join(process.cwd(), 'public', courseId, 'pdf');
    } else {
      filePath = path.join(process.cwd(), 'public', courseId, 'autre');
    }

    let fullFilePath = path.join(filePath, fileName);
    let fileExists = true;
    let counter = 0;
    let newFileName = fileName;

    while (fileExists) {
      try {
        await fs.access(fullFilePath);
        counter++;
        const fileNameWithoutExtension = path.basename(fileName, path.extname(fileName));
        newFileName = `${fileNameWithoutExtension}_${counter}${path.extname(fileName)}`;
        fullFilePath = path.join(filePath, newFileName);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          fileExists = false;
        } else {
          throw error;
        }
      }
    }

    fileName = newFileName;
    filePath = path.join(filePath, fileName);

    // Ensure the directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Write the file to the appropriate directory
    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    // Créer la nouvelle activité dans la base de données
    const newActivity = await createActivity({
      id: `${Date.now()}`,
      name: path.basename(filePath),
      title: ActivityTitle,
      fileUrl: `/${courseId}/${file.name.endsWith('.ipynb') ? 'notebook' : file.name.endsWith('.pdf') ? 'pdf' : 'autre'}/${path.basename(filePath)}`,
      courseId: courseId
    });

    // Récupérer les données mises à jour
    const updatedClassesData = await getAllClasses();

    // Transformation vers le format attendu
    const classes: Classe[] = updatedClassesData.map(classe => ({
      id: classe.id,
      name: classe.name,
      associated_courses: classe.courses.map(course => course.id),
      toggleVisibilityClasse: classe.toggleVisibilityClasse || false
    }));

    const courses: Course[] = updatedClassesData.flatMap(classe => 
      classe.courses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        classe: course.classe,
        theClasseId: course.theClasseId,
        activities: course.activities.map(activity => ({
          id: activity.id,
          name: activity.name,
          title: activity.title,
          fileUrl: activity.fileUrl,
          order: activity.order ?? undefined,
          isFileDrop: activity.isFileDrop ?? false,
          dropzoneConfig: activity.dropzoneConfig ? (activity.dropzoneConfig as any) : null
        })),
        toggleVisibilityCourse: course.toggleVisibilityCourse || false,
        themeChoice: course.themeChoice || 0
      }))
    );

    return NextResponse.json({ 
      success: true, 
      activity: {
        id: newActivity.id,
        name: newActivity.name,
        title: newActivity.title,
        fileUrl: newActivity.fileUrl
      }, 
      fileName: path.basename(filePath), 
      classes, 
      courses 
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}