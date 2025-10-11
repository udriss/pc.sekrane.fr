import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const classeId = formData.get('classeId') as string;
    const fileType = formData.get('fileType') as string;

    if (!file || !classeId || !fileType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate file type
    if (fileType === 'image' && !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid image file type' }, { status: 400 });
    }

    if (fileType === 'pdf' && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid PDF file type' }, { status: 400 });
    }

    const sanitizeFileName = (str: string) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9.-]/g, '_');
    };

    let fileName = sanitizeFileName(file.name);
    const timestamp = Date.now();
    const fileExt = path.extname(fileName);
    const nameWithoutExt = path.basename(fileName, fileExt);
    fileName = `${nameWithoutExt}_${timestamp}${fileExt}`;

    // Create directory structure: public/progressions/{classeId}/{fileType}/
    const uploadDir = path.join(process.cwd(), 'public', 'progressions', classeId, fileType);
    const filePath = path.join(uploadDir, fileName);

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Write file
    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    // Return the URL for accessing the file
    const fileUrl = `/api/files/progressions/${classeId}/${fileType}/${fileName}`;

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: fileName,
      originalName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
