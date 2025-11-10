import { NextRequest, NextResponse } from 'next/server';
import { updateCourse, getAllClasses, getCourseById, getClasseById } from '@/lib/data-prisma-utils';
import { Classe, Course } from '@/lib/dataTemplate';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Vérifier si le cours existe
    const existingCourse = await getCourseById(courseId);
    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Préparer les données de mise à jour
    const updateData: {
      title?: string;
      description?: string;
      classe?: string;
      theClasseId?: string;
      themeChoice?: number;
      isHidden?: boolean;
      isDisabled?: boolean;
    } = {};

    let hasUpdate = false;

    if (typeof body.themeChoice !== 'undefined') {
      updateData.themeChoice = body.themeChoice;
      hasUpdate = true;
    }

    if (typeof body.isHidden !== 'undefined') {
      updateData.isHidden = body.isHidden;
      hasUpdate = true;
    }

    if (typeof body.isDisabled !== 'undefined') {
      updateData.isDisabled = body.isDisabled;
      hasUpdate = true;
    }

    if (typeof body.title === 'string' && body.title.trim().length > 0) {
      updateData.title = body.title;
      hasUpdate = true;
    }

    if (typeof body.description === 'string') {
      updateData.description = body.description;
      hasUpdate = true;
    }

    if (typeof body.newClasseId === 'string' && body.newClasseId.trim().length > 0) {
      const newClasse = await getClasseById(body.newClasseId);
      if (!newClasse) {
        return NextResponse.json({ error: 'New classe not found' }, { status: 404 });
      }
      updateData.theClasseId = body.newClasseId;
      updateData.classe = newClasse.name;
      hasUpdate = true;
    }

    if (!hasUpdate) {
      return NextResponse.json({ error: 'Invalid update parameters' }, { status: 400 });
    }

    // Mettre à jour le cours dans la base de données
    await updateCourse(courseId, updateData);

    // Récupérer les données mises à jour
    const updatedClassesData = await getAllClasses();

    // Transformation vers le format attendu
    const classes: Classe[] = updatedClassesData.map(classe => ({
      id: classe.id,
      name: classe.name,
      associated_courses: classe.courses.map(course => course.id.toString()),
      toggleVisibilityClasse: classe.toggleVisibilityClasse || false,
      hasProgression: classe.hasProgression || false
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

    return NextResponse.json({ courses, classes }, { status: 200 });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}