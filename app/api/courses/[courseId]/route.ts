import { NextResponse } from 'next/server';
import { logConnection } from '@/lib/logConnection';
import { getCourseById } from '@/lib/data-prisma-utils';
import { Course } from '@/lib/dataTemplate';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await logConnection(request, '/api/courses/[courseId]');
    const url = new URL(request.url);
    const courseId = url.pathname.split('/').pop();

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Récupération directe depuis la base de données
    const courseData = await getCourseById(courseId);
    if (courseData) {
      // Transformation vers le format attendu
      const course: Course = {
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
        classe: courseData.classe,
        theClasseId: courseData.theClasseId,
        activities: courseData.activities.map(activity => ({
          id: activity.id,
          name: activity.name,
          title: activity.title,
          fileUrl: activity.fileUrl,
          order: activity.order,
          isFileDrop: activity.isFileDrop ?? false,
          dropzoneConfig: activity.dropzoneConfig ? (activity.dropzoneConfig as any) : null
        })),
        toggleVisibilityCourse: courseData.toggleVisibilityCourse || false,
        themeChoice: courseData.themeChoice || 0
      };

      return NextResponse.json({ course });
    } else {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}