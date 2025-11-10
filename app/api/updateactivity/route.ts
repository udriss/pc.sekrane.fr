import { NextRequest, NextResponse } from 'next/server';
import { updateActivity, getCourseById, getActivityById, getAllClasses } from '@/lib/data-prisma-utils';
import { Classe, Course } from '@/lib/dataTemplate';

export async function PUT(req: NextRequest) {
  try {
    const { courseId, activityId, newTitle, newFileUrl } = await req.json();

    if (!courseId || !activityId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Vérifier si le cours existe
    const course = await getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Vérifier si l'activité existe
    const activity = await getActivityById(activityId);
    if (!activity || activity.courseId !== courseId) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    // Préparer les mises à jour
    const updates: any = {};
    if (newTitle !== undefined) {
      updates.title = newTitle;
    }
    if (newFileUrl !== undefined) {
      updates.fileUrl = newFileUrl;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    // Mettre à jour l'activité dans la base de données
    await updateActivity(activityId, updates);

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
          dropzoneConfig: activity.dropzoneConfig ? (activity.dropzoneConfig as any) : null
        })),
        isHidden: course.isHidden ?? false,
        isDisabled: course.isDisabled ?? false,
        themeChoice: course.themeChoice || 0
      }))
    );

    return NextResponse.json({ courses, classes }, { status: 200 });
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}