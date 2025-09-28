import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const courseId = formData.get('courseId') as string;
    const file = formData.get('file') as File;

    if (!courseId || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sanitizeFileName = (str: string) => {
      return str
        .normalize('NFD')                     // Decompose characters into base + diacritical marks
        .replace(/[\u0300-\u036f]/g, '')     // Remove diacritical marks
        .replace(/[^a-zA-Z0-9.-]/g, '_');    // Replace any remaining special chars with underscore
    };

    let fileName = sanitizeFileName(file.name);
    let filePath = '';

    // Determine the directory based on the file type
    if (file.name.endsWith('.ipynb')) {
      filePath = path.join(process.cwd(), 'public', courseId, 'notebook');
    } else if (file.name.endsWith('.pdf')) {
      filePath = path.join(process.cwd(), 'public', courseId, 'pdf');
    } else {
      filePath = path.join(process.cwd(), 'public', courseId, 'autre');
    }

    let fullFilePath = path.join(filePath, fileName);
    let fileExists = true;
    let counter = 0;
    let newFileName = fileName;

    while (fileExists) {
      try {
        await fs.access(fullFilePath);
        counter++;
        const fileNameWithoutExtension = path.basename(fileName, path.extname(fileName));
        newFileName = `${fileNameWithoutExtension}_${counter}${path.extname(fileName)}`;
        fullFilePath = path.join(filePath, newFileName);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          fileExists = false;
        } else {
          throw error;
        }
      }
    }

    fileName = newFileName;
    filePath = path.join(filePath, fileName);

    // Ensure the directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Write the file to the appropriate directory
    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    const fileUrl = `/${courseId}/${file.name.endsWith('.ipynb') ? 'notebook' : file.name.endsWith('.pdf') ? 'pdf' : 'autre'}/${fileName}`;

    return NextResponse.json({
      success: true,
      fileUrl: fileUrl,
      fileName: fileName
    });
  } catch (error) {
    console.error("Upload file error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}