import { NextRequest, NextResponse } from 'next/server';
import { getAllClasses, getCourseById, createActivity } from '@/lib/data-prisma-utils';
import { Classe, Course } from '@/lib/dataTemplate';
import { prisma } from '@/lib/prisma';

interface FileDropRequestBody {
  courseId: string;
  config: {
    displayName: string;
    enabled: boolean;
    acceptedTypes: string[];
    timeRestricted: boolean;
    startAt?: string | null;
    endAt?: string | null;
    maxSizeMb?: number;
  };
}

const DEFAULT_MAX_SIZE_MB = 50;

const isWindowOpen = (startAt?: string | null, endAt?: string | null) => {
  const now = new Date();
  if (startAt) {
    const start = new Date(startAt);
    if (now < start) {
      return false;
    }
  }
  if (endAt) {
    const end = new Date(endAt);
    if (now > end) {
      return false;
    }
  }
  return true;
};

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      where: { isFileDrop: true },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            classe: true,
            theClasseId: true,
            classeRelation: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        submissions: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const drops = activities.map((activity) => {
      const rawConfig =
        typeof activity.dropzoneConfig === 'object' && activity.dropzoneConfig !== null
          ? (activity.dropzoneConfig as Record<string, unknown>)
          : {};

      const enabled = Boolean(rawConfig.enabled);
      const acceptedTypes = Array.isArray(rawConfig.acceptedTypes)
        ? (rawConfig.acceptedTypes as string[])
        : [];
      const timeRestricted = Boolean(rawConfig.timeRestricted);
      const startAt = typeof rawConfig.startAt === 'string' ? (rawConfig.startAt as string) : null;
      const endAt = typeof rawConfig.endAt === 'string' ? (rawConfig.endAt as string) : null;
      const maxSizeMb = typeof rawConfig.maxSizeMb === 'number' ? (rawConfig.maxSizeMb as number) : DEFAULT_MAX_SIZE_MB;
      const displayName = (rawConfig.displayName as string) || activity.title;
      const open = enabled && (!timeRestricted || isWindowOpen(startAt, endAt));

      return {
        activityId: activity.id,
        courseId: activity.courseId,
        courseTitle: activity.course.title,
        classeId: activity.course.theClasseId,
        classeLabel: activity.course.classe,
        classeName: activity.course.classeRelation?.name ?? null,
        displayName,
        enabled,
        isOpen: open,
        acceptedTypes,
        timeRestricted,
        startAt,
        endAt,
        maxSizeMb,
        submissionsCount: activity.submissions.length,
        lastSubmissionAt: activity.submissions[0]?.createdAt?.toISOString() ?? null,
        createdAt: activity.createdAt.toISOString(),
        updatedAt: activity.updatedAt.toISOString(),
        storagePath: `public/depots/${activity.courseId}`
      };
    });

    return NextResponse.json({ drops }, { status: 200 });
  } catch (error) {
    console.error('Error fetching file drops:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FileDropRequestBody;
    const { courseId, config } = body;

    if (!courseId || !config) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!Array.isArray(config.acceptedTypes) || config.acceptedTypes.length === 0) {
      return NextResponse.json({ error: 'At least one file type must be selected' }, { status: 400 });
    }

    const course = await getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const activityId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const title = config.displayName?.trim() || 'Dépôt de fichiers';

    await createActivity({
      id: activityId,
      name: `file-drop-${activityId}`,
      title,
      fileUrl: '',
      courseId,
      isFileDrop: true,
      dropzoneConfig: {
        enabled: config.enabled,
        acceptedTypes: config.acceptedTypes,
        timeRestricted: config.timeRestricted,
        startAt: config.timeRestricted ? config.startAt || null : null,
        endAt: config.timeRestricted ? config.endAt || null : null,
  maxSizeMb: config.maxSizeMb ?? DEFAULT_MAX_SIZE_MB,
        displayName: title
      }
    });

    const updatedClassesData = await getAllClasses();

    const classes: Classe[] = updatedClassesData.map((classe) => ({
      id: classe.id,
      name: classe.name,
      associated_courses: classe.courses.map((course) => course.id),
      toggleVisibilityClasse: classe.toggleVisibilityClasse || false,
      hasProgression: classe.hasProgression || false
    }));

    const courses: Course[] = updatedClassesData.flatMap((classe) =>
      classe.courses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        classe: course.classe,
        theClasseId: course.theClasseId,
        activities: course.activities.map((activity) => ({
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

    return NextResponse.json({ classes, courses, activityId }, { status: 201 });
  } catch (error) {
    console.error('Error creating file drop:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
