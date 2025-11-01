import { NextRequest, NextResponse } from 'next/server';
import { getActivityById } from '@/lib/data-prisma-utils';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs/promises';

const MAX_DEFAULT_SIZE_MB = 50;

const sanitizeFileName = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[^a-zA-Z0-9.\-]/g, '_')
    .replace(/_{2,}/g, '_');

const isWithinWindow = (startAt?: string | null, endAt?: string | null) => {
  const now = new Date();
  if (startAt) {
    const start = new Date(startAt);
    if (now < start) return false;
  }
  if (endAt) {
    const end = new Date(endAt);
    if (now > end) return false;
  }
  return true;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const activityId = formData.get('activityId') as string;
    const rawFileEntries = formData.getAll('file');
    const file = rawFileEntries.find((entry): entry is File => entry instanceof File) ?? null;

    const debugEntries: Array<{ key: string; type: string; isBlob: boolean; constructorName: string | undefined }> = [];
    formData.forEach((value, key) => {
      debugEntries.push({
        key,
        type: typeof value,
        isBlob: value instanceof Blob,
        constructorName: (value as any)?.constructor?.name
      });
    });


    if (!activityId || !file) {
      console.log('Missing activityId or file:', { activityId, hasFile: !!file });
      return NextResponse.json({ error: 'Activity ID and file are required' }, { status: 400 });
    }

    // Vérifier le type de l'objet file
    if (!(file instanceof File)) {
      console.log('File is not a File instance:', file);
      return NextResponse.json({ error: 'Le fichier n\'est pas valide' }, { status: 400 });
    }

    // Vérifier que file.name existe
    if (!file.name || typeof file.name !== 'string') {
      console.log('Invalid file name:', file.name);
      return NextResponse.json({ error: 'Nom de fichier invalide' }, { status: 400 });
    }

    const activity = await getActivityById(activityId);
    if (!activity || !activity.isFileDrop) {
      return NextResponse.json({ error: 'File drop activity not found' }, { status: 404 });
    }

    const config = typeof activity.dropzoneConfig === 'object' && activity.dropzoneConfig !== null
      ? (activity.dropzoneConfig as Record<string, unknown>)
      : {};

    if (!config.enabled) {
      return NextResponse.json({ error: 'Ce dépôt est actuellement fermé.' }, { status: 403 });
    }

    const acceptedTypes = Array.isArray(config.acceptedTypes)
      ? (config.acceptedTypes as string[])
      : [];

    const fileExtension = path.extname(file.name).toLowerCase();
    if (acceptedTypes.length && !acceptedTypes.includes(fileExtension)) {
      return NextResponse.json({ error: 'Type de fichier non autorisé' }, { status: 415 });
    }

    const maxSizeMb = typeof config.maxSizeMb === 'number' ? (config.maxSizeMb as number) : MAX_DEFAULT_SIZE_MB;
    if (file.size > maxSizeMb * 1024 * 1024) {
      return NextResponse.json({ error: `La taille maximale est de ${maxSizeMb} Mo` }, { status: 413 });
    }

    if (config.timeRestricted) {
      const startAt = (config.startAt as string | null) ?? null;
      const endAt = (config.endAt as string | null) ?? null;
      if (!isWithinWindow(startAt, endAt)) {
        return NextResponse.json({ error: 'Ce dépôt est fermé en dehors de la période autorisée.' }, { status: 403 });
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = sanitizeFileName(file.name);
  const storedName = `${activityId}_${Date.now()}_${safeName}`;
  const uploadDir = path.join(process.cwd(), 'public', 'depots', activity.courseId);
    await fs.mkdir(uploadDir, { recursive: true });

    await fs.writeFile(path.join(uploadDir, storedName), buffer);

    const submission = await prisma.fileDropSubmission.create({
      data: {
        activityId,
        originalName: file.name,
        storedName,
        fileSize: buffer.length,
        mimeType: file.type || 'application/octet-stream',
        uploaderIp: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
      }
    });

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        originalName: submission.originalName,
        fileSize: submission.fileSize,
        mimeType: submission.mimeType,
        createdAt: submission.createdAt
      }
    });
  } catch (error) {
    console.error('Error saving file drop submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
