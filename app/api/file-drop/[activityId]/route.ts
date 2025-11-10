import { NextRequest, NextResponse } from 'next/server';
import { getActivityById, updateActivity, getAllClasses, deleteActivity } from '@/lib/data-prisma-utils';
import { Classe, Course } from '@/lib/dataTemplate';
import { Prisma } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

interface UpdateFileDropBody {
  displayName?: string;
  enabled?: boolean;
  acceptedTypes?: string[];
  timeRestricted?: boolean;
  startAt?: string | null;
  endAt?: string | null;
  maxSizeMb?: number;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ activityId: string }> }) {
  try {
    const { activityId } = await params;
    if (!activityId) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }

    const body = (await req.json()) as UpdateFileDropBody;
    const activity = await getActivityById(activityId);

    if (!activity || !activity.isFileDrop) {
      return NextResponse.json({ error: 'File drop activity not found' }, { status: 404 });
    }

    const mergedConfig = {
      ...(typeof activity.dropzoneConfig === 'object' && activity.dropzoneConfig !== null
        ? (activity.dropzoneConfig as Record<string, unknown>)
        : {}),
      ...(body.acceptedTypes ? { acceptedTypes: body.acceptedTypes } : {}),
      ...(body.enabled !== undefined ? { enabled: body.enabled } : {}),
      ...(body.timeRestricted !== undefined ? { timeRestricted: body.timeRestricted } : {}),
      ...(body.timeRestricted ? { startAt: body.startAt || null, endAt: body.endAt || null } : {}),
      ...(body.maxSizeMb !== undefined ? { maxSizeMb: body.maxSizeMb } : {}),
    } as Record<string, unknown>;

    const title = body.displayName?.trim() || activity.title;
    mergedConfig.displayName = title;

    await updateActivity(activityId, {
      title,
      dropzoneConfig: mergedConfig as Prisma.InputJsonValue
    });

    const updatedClassesData = await getAllClasses();

    const classes: Classe[] = updatedClassesData.map((classe) => ({
      id: classe.id,
      name: classe.name,
      associated_courses: classe.courses.map((course) => course.id.toString()),
      toggleVisibilityClasse: classe.toggleVisibilityClasse || false,
      hasProgression: classe.hasProgression || false
    }));

    const courses: Course[] = updatedClassesData.flatMap((classe) =>
      classe.courses.map((course) => ({
        id: course.id.toString(),
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
        isHidden: course.isHidden ?? false,
        isDisabled: course.isDisabled ?? false,
        themeChoice: course.themeChoice || 0
      }))
    );

    return NextResponse.json({ classes, courses }, { status: 200 });
  } catch (error) {
    console.error('Error updating file drop:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ activityId: string }> }) {
  try {
    const { activityId } = await params;
    if (!activityId) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }

    const activity = await getActivityById(activityId);
    if (!activity || !activity.isFileDrop) {
      return NextResponse.json({ error: 'File drop activity not found' }, { status: 404 });
    }

    const courseDir = path.join(process.cwd(), 'public', 'depots', activity.courseId.toString());

    if (Array.isArray(activity.submissions) && activity.submissions.length) {
      for (const submission of activity.submissions) {
        const dropFilePath = path.join(courseDir, submission.storedName);
        try {
          await fs.unlink(dropFilePath);
        } catch (unlinkError: any) {
          if (unlinkError.code !== 'ENOENT') {
            console.warn(`Unable to delete stored file ${dropFilePath}:`, unlinkError);
          }
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
        console.warn(`Error while checking directory ${courseDir}:`, dirError);
      }
    }

    await deleteActivity(activityId);

    const updatedClassesData = await getAllClasses();

    const classes: Classe[] = updatedClassesData.map((classe) => ({
      id: classe.id,
      name: classe.name,
      associated_courses: classe.courses.map((course) => course.id.toString()),
      toggleVisibilityClasse: classe.toggleVisibilityClasse || false,
      hasProgression: classe.hasProgression || false
    }));

    const courses: Course[] = updatedClassesData.flatMap((classe) =>
      classe.courses.map((course) => ({
        id: course.id.toString(),
        title: course.title,
        description: course.description,
        classe: course.classe,
        theClasseId: course.theClasseId,
        activities: course.activities.map((activityItem) => ({
          id: activityItem.id,
          name: activityItem.name,
          title: activityItem.title,
          fileUrl: activityItem.fileUrl,
          order: activityItem.order ?? undefined,
          isFileDrop: activityItem.isFileDrop ?? false,
          dropzoneConfig: activityItem.dropzoneConfig ? (activityItem.dropzoneConfig as any) : null
        })),
        isHidden: course.isHidden ?? false,
        isDisabled: course.isDisabled ?? false,
        themeChoice: course.themeChoice || 0
      }))
    );

    return NextResponse.json({ success: true, classes, courses }, { status: 200 });
  } catch (error) {
    console.error('Error deleting file drop:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
