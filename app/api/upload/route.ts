import { promises as fs } from 'fs';
import path from 'path';
import { parseData, updateData } from '@/lib/data-utils';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const courseId = formData.get('courseId') as string;
    const file = formData.get('file') as File;
    const ActivityTitle = formData.get('ActivityTitle') as string;

    if (!courseId || !file || !ActivityTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { classes, courses } = await parseData();

    const course = courses.find(course => course.id === courseId);
    if (course) {
      const sanitizeFileName = (str: string) => {
        return str
          .normalize('NFD')                     // Decompose characters into base + diacritical marks
          .replace(/[\u0300-\u036f]/g, '')     // Remove diacritical marks
          .replace(/[^a-zA-Z0-9.-]/g, '_');    // Replace any remaining special chars with underscore
      };
      
      const fileName = sanitizeFileName(file.name);
      let filePath = '';

      // Determine the directory based on the file type
      if (file.name.endsWith('.ipynb')) {
        filePath = path.join(process.cwd(), 'public', courseId, 'notebook', fileName);
      } else if (file.name.endsWith('.pdf')) {
        filePath = path.join(process.cwd(), 'public', courseId, 'pdf', fileName);
      } else {
        filePath = path.join(process.cwd(), 'public', courseId, 'autre', fileName);
      }


      // Ensure the directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      // Write the file to the appropriate directory
      const fileBuffer = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(fileBuffer));

      const newActivity = {
        id: `${Date.now()}`,
        name: path.basename(filePath),
        title: ActivityTitle,
        fileUrl: `/${courseId}/${file.name.endsWith('.ipynb') ? 'notebook' : file.name.endsWith('.pdf') ? 'pdf' : 'autre'}/${path.basename(filePath)}`,
      };
      course.activities.push(newActivity);

      // Write the updated data to file
      await updateData(classes, courses);

      return NextResponse.json({ success: true, activity: newActivity, fileName: path.basename(filePath), classes, courses });
    } else {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}