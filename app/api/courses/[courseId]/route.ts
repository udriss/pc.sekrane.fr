import { NextResponse } from 'next/server';
import { logConnection } from '@/lib/logConnection';
import { getCourseById } from '@/lib/data-prisma-utils';
import { Course } from '@/lib/dataTemplate';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await logConnection(request, '/api/courses/[courseId]');
    const url = new URL(request.url);
    const courseIdStr = url.pathname.split('/').pop();

    if (!courseIdStr) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const courseId = parseInt(courseIdStr, 10);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

    // Récupération directe depuis la base de données
    const courseData = await getCourseById(courseId);
    if (courseData) {
      // Transformation vers le format attendu
      const course: Course = {
        id: courseData.id.toString(),
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
          dropzoneConfig: activity.dropzoneConfig ? (activity.dropzoneConfig as any) : null,
          isHidden: activity.isHidden ?? false,
          isDisabled: activity.isDisabled ?? false
        })),
        isHidden: courseData.isHidden ?? false,
        isDisabled: courseData.isDisabled ?? false,
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