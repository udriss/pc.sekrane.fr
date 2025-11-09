import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs/promises';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ submissionId: string }> }) {
  try {
    const { submissionId } = await params;
    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    const submission = await prisma.fileDropSubmission.findUnique({
      where: { id: parseInt(submissionId) },
      include: {
        activity: {
          select: { courseId: true }
        }
      }
    });
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const courseId = submission.activity?.courseId;
    if (!courseId) {
      return NextResponse.json({ error: 'Course non trouvé pour ce dépôt' }, { status: 500 });
    }

    const filePath = path.join(process.cwd(), 'public', 'depots', courseId.toString(), submission.storedName);
    try {
      const fileBuffer = await fs.readFile(filePath);
      return new NextResponse(fileBuffer as unknown as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': submission.mimeType || 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(submission.originalName)}"`
        }
      });
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error downloading submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
