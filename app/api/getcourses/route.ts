import { NextResponse } from 'next/server';
import { logConnection } from '@/lib/logConnection';
import { getAllClasses, getAllCourses } from '@/lib/data-prisma-utils';
import { Classe, Course } from '@/lib/dataTemplate';

export async function GET(request: Request) {
  try {
    await logConnection(request, '/api/getcourses');
    // Récupération directe depuis la base de données
    const [classesData, coursesData] = await Promise.all([
      getAllClasses(),
      getAllCourses()
    ]);

    // Transformation vers le format attendu
    const classes: Classe[] = classesData.map(classe => ({
      id: classe.id,
      name: classe.name,
      associated_courses: classe.courses.map(course => course.id.toString()),
      toggleVisibilityClasse: classe.toggleVisibilityClasse || false,
      hasProgression: classe.hasProgression || false
    }));

    const courses: Course[] = coursesData.map(course => ({
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
      toggleVisibilityCourse: course.toggleVisibilityCourse || false,
      themeChoice: course.themeChoice || 0
    }));

    return NextResponse.json({ courses, classes });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}