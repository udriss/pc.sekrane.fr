import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs/promises';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ activityId: string }> }) {
  try {
    const { activityId } = await params;
    if (!activityId) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }

    const submissions = await prisma.fileDropSubmission.findMany({
      where: { activityId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching drop submissions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ activityId: string }> }) {
  try {
    const { activityId } = await params;
    if (!activityId) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }

    const { submissionId } = await req.json();
    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    const submission = await prisma.fileDropSubmission.findUnique({
      where: { id: submissionId },
      include: {
        activity: {
          select: { courseId: true }
        }
      }
    });
    if (!submission || submission.activityId !== activityId) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const courseId = submission.activity?.courseId;
    if (!courseId) {
      return NextResponse.json({ error: 'Course non trouvé pour ce dépôt' }, { status: 500 });
    }

    const filePath = path.join(process.cwd(), 'public', 'depots', courseId, submission.storedName);
    try {
      await fs.unlink(filePath);
    } catch (unlinkError: any) {
      if (unlinkError.code !== 'ENOENT') {
        console.error('Error deleting submission file:', unlinkError);
        return NextResponse.json({ error: 'Unable to delete stored file' }, { status: 500 });
      }
    }

    await prisma.fileDropSubmission.delete({ where: { id: submissionId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting drop submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
