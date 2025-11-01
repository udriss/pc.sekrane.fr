import { NextRequest, NextResponse } from 'next/server';
import { PassThrough } from 'stream';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';
import { getActivityById } from '@/lib/data-prisma-utils';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ activityId: string }> }) {
  const { activityId } = await params;
  const idsParam = req.nextUrl.searchParams.get('ids');

  if (!idsParam) {
    return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
  }

  const ids = idsParam.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));

  try {
    const activity = await getActivityById(activityId);
    if (!activity || !activity.isFileDrop) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    const submissions = await prisma.fileDropSubmission.findMany({
      where: {
        activityId,
        id: { in: ids }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (submissions.length === 0) {
      return NextResponse.json({ error: 'No submissions found' }, { status: 404 });
    }

    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = new PassThrough();

    // Set headers for the response
    const response = new Response(stream as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${activity.title.replace(/[^a-zA-Z0-9]/g, '_')}_selected_submissions.zip"`,
      },
    });

    archive.pipe(stream);

    // Add files to the archive
    for (const submission of submissions) {
      const filePath = path.join(process.cwd(), 'public', 'depots', activity.courseId, submission.storedName);
      if (fs.existsSync(filePath)) {
        const uniqueName = `${submission.id}_${submission.originalName}`;
        archive.file(filePath, { name: uniqueName });
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    }

    // Finalize the archive
    archive.finalize();

    return response;
  } catch (error) {
    console.error('Error creating zip:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}