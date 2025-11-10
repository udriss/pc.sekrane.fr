import { NextRequest, NextResponse } from 'next/server';
import { deleteActivity, getCourseById, getActivityById, getAllClasses } from '@/lib/data-prisma-utils';
import { Classe, Course } from '@/lib/dataTemplate';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(req: NextRequest) {
  try {
    const { fileId, courseId, deleteActivity = true } = await req.json();

    if (!courseId || !fileId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Vérifier si le cours existe
    const course = await getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Vérifier si l'activité existe
    const activity = await getActivityById(fileId);
    if (!activity || activity.courseId !== courseId) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Extract deleted file's name
    const fileName = activity.fileUrl.split('/').pop();

    let fileNotFound = false;

    // Supprimer le fichier physique du disque (ou le dossier de dépôt)
    if (activity.isFileDrop) {
      const courseDir = path.join(process.cwd(), 'public', 'depots', activity.courseId.toString());
      try {
        const submissions = await prisma.fileDropSubmission.findMany({
          where: { activityId: activity.id }
        });

        for (const submission of submissions) {
          const dropFilePath = path.join(courseDir, submission.storedName);
          try {
            await fs.unlink(dropFilePath);
          } catch (unlinkError: any) {
            if (unlinkError.code !== 'ENOENT') {
              console.warn(`Error deleting drop submission file ${dropFilePath}:`, unlinkError);
            }
          }
        }

        try {
          const remainingEntries = await fs.readdir(courseDir);
          if (!remainingEntries.length) {
            await fs.rmdir(courseDir).catch(() => undefined);
          }
        } catch (dirError: any) {
          if (dirError.code !== 'ENOENT') {
            console.warn(`Error checking drop directory ${courseDir}:`, dirError);
          }
        }
      } catch (dropError) {
        console.warn(`Error cleaning drop submissions for activity ${activity.id}:`, dropError);
      }
    } else if (activity.fileUrl) {
      const filePath = path.join(process.cwd(), 'public', activity.fileUrl);
      try {
        await fs.unlink(filePath);
      } catch (unlinkError: any) {
        if (unlinkError.code === 'ENOENT') {
          console.warn(`File ${fileName} not found on disk, proceeding with deletion from database.`);
          fileNotFound = true;
        } else {
          console.error(`Error deleting file ${fileName}:`, unlinkError);
          return NextResponse.json({ error: `Error deleting file ${fileName} from disk` }, { status: 500 });
        }
      }
    }

    if (deleteActivity) {
      // Supprimer l'activité de la base de données
      await deleteActivity(fileId);

      // Récupérer les données mises à jour
      const updatedClassesData = await getAllClasses();

      // Transformation vers le format attendu
      const classes: Classe[] = updatedClassesData.map(classe => ({
        id: classe.id,
        name: classe.name,
        associated_courses: classe.courses.map(course => course.id.toString()),
        toggleVisibilityClasse: classe.toggleVisibilityClasse || false
      }));

      const courses: Course[] = updatedClassesData.flatMap(classe => 
        classe.courses.map(course => ({
          id: course.id.toString(),
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
            dropzoneConfig: activity.dropzoneConfig ? (activity.dropzoneConfig as any) : null,
            isHidden: activity.isHidden ?? false,
            isDisabled: activity.isDisabled ?? false
          })),
          isHidden: course.isHidden ?? false,
          isDisabled: course.isDisabled ?? false,
          themeChoice: course.themeChoice || 0
        }))
      );

      return NextResponse.json({ courses, classes, fileId, fileNotFound, fileName }, { status: 200 });
    } else {
      return NextResponse.json({ success: true, fileNotFound, fileName }, { status: 200 });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}