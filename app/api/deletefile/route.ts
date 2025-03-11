import { NextRequest, NextResponse } from 'next/server';
import { parseData, updateData } from '@/lib/data-utils';
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(req: NextRequest) {
  try {
    const { fileId, courseId } = await req.json();

    if (!courseId || !fileId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { classes, courses } = await parseData();

    // Vérifier si le cours existe
    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Supprimer le fichier du cours
    const course = courses[courseIndex];
    const activityIndex = course.activities.findIndex(activity => activity.id === fileId);
    if (activityIndex === -1) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Extract deleted file's name
    const deletedActivity = course.activities[activityIndex];
    const fileName = deletedActivity.fileUrl.split('/').pop();

    course.activities.splice(activityIndex, 1);

    // Write updated data to data.json
    await updateData(classes, courses);

    // Delete the file from the disk
    if (deletedActivity.fileUrl) {
      const filePath = path.join(process.cwd(), 'public',deletedActivity.fileUrl);
      try {
        await fs.unlink(filePath);
        console.log(`File ${fileName} deleted successfully`);
      } catch (unlinkError: any) {
        console.error(`Error deleting file ${fileName}:`, unlinkError);
        return NextResponse.json({ error: `Error deleting file ${fileName} from disk` }, { status: 500 });
      }
    }

    return NextResponse.json({ courses, classes, fileId }, { status: 200 });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}