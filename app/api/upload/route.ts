import { promises as fs } from 'fs';
import path from 'path';
import { courses, Course, classes } from '@/lib/data';
import { dataTemplate } from "@/lib/data-template";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const courseId = formData.get('courseId') as string;
    const file = formData.get('file') as File;
    const ActivityTitle = formData.get('ActivityTitle') as string;

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

      // Check if the file already exists and add a suffix if necessary
      let newFilePath = filePath;
      let suffix = 1;
      const fileExtension = path.extname(fileName);
      const baseFileName = path.basename(fileName, fileExtension);

      while (await fs.access(newFilePath).then(() => true).catch(() => false)) {
        suffix++;
        newFilePath = path.join(path.dirname(filePath), `${baseFileName}_${suffix}${fileExtension}`);
      }

      // Ensure the directory exists
      await fs.mkdir(path.dirname(newFilePath), { recursive: true });

      // Write the file to the appropriate directory
      const fileBuffer = await file.arrayBuffer();
      await fs.writeFile(newFilePath, Buffer.from(fileBuffer));

      const newActivity = {
        id: `${Date.now()}`,
        name: path.basename(newFilePath),
        title: ActivityTitle,
        fileUrl: `/${courseId}/${file.name.endsWith('.ipynb') ? 'notebook' : file.name.endsWith('.pdf') ? 'pdf' : 'autre'}/${path.basename(newFilePath)}`,
      };
      course.activities.push(newActivity);

      // Write the updated courses data to data.ts
      const updatedData = dataTemplate
          .replace('__CLASSES__', JSON.stringify(classes, null, 2))
          .replace('__COURSES__', JSON.stringify(courses, null, 2));
      const dataPath = path.join(process.cwd(), 'lib', 'data.ts');
      await fs.writeFile(dataPath, updatedData, 'utf8');
      return NextResponse.json({ success: true, activity: newActivity, fileName: path.basename(newFilePath), classes, courses });
    } else {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}