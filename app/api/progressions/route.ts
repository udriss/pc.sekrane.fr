import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logConnection } from '@/lib/logConnection';

export async function GET(request: NextRequest) {
  await logConnection(request, '/api/progressions');
  const searchParams = request.nextUrl.searchParams;
  const classeId = searchParams.get('classeId');

  if (!classeId) {
    return NextResponse.json({ error: 'classeId is required' }, { status: 400 });
  }

  try {
    const progressions = await prisma.progression.findMany({
      where: { classeId },
      orderBy: [
        { order: 'asc' },
        { date: 'desc' }
      ]
    });

    return NextResponse.json({ progressions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progressions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await logConnection(request, '/api/progressions');
    const body = await request.json();
  const { classeId, date, title, content, icon, iconColor, contentType, resourceUrl, imageSize, activityId } = body;

    // Trouver le prochain ordre disponible
    const lastProgression = await prisma.progression.findFirst({
      where: { classeId },
      orderBy: { order: 'desc' }
    });

    const nextOrder = lastProgression ? lastProgression.order + 1 : 0;

    let computedTitle = title;
    let computedType = contentType;
    let computedUrl = resourceUrl;
    if (activityId) {
      const activity = await prisma.activity.findUnique({ where: { id: activityId } });
      if (!activity) {
        return NextResponse.json({ error: 'Activité introuvable' }, { status: 400 });
      }
      // Use activity data if not explicitly provided
      computedTitle = computedTitle || activity.title || 'Activité';
      // Best-effort guess of type from fileUrl
      if (!computedType) {
        const url = activity.fileUrl || '';
        if (url.match(/\.(png|jpe?g|gif|webp|svg)$/i)) computedType = 'image';
        else if (url.match(/\.(mp4|webm|ogg)$/i)) computedType = 'video';
        else if (url.match(/\.(pdf)$/i)) computedType = 'pdf';
        else computedType = 'text';
      }
      if (!computedUrl) computedUrl = activity.fileUrl || '';
    }

    const progression = await prisma.progression.create({
      data: {
        classeId,
        date: new Date(date),
        title: computedTitle,
        content,
        icon,
        iconColor,
        contentType: computedType,
        resourceUrl: computedUrl,
        imageSize,
        activityId: activityId || undefined,
        order: nextOrder
      }
    });

    return NextResponse.json({ progression, success: true });
  } catch (error) {
    console.error('Error creating progression:', error);
    return NextResponse.json({ error: 'Failed to create progression' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
  await logConnection(request, '/api/progressions');
    const body = await request.json();
    const { id, title, content, icon, iconColor, contentType, resourceUrl, imageSize, date, order } = body;

    const data: any = {};
    if (typeof title !== 'undefined') data.title = title;
    if (typeof content !== 'undefined') data.content = content;
    if (typeof icon !== 'undefined') data.icon = icon;
    if (typeof iconColor !== 'undefined') data.iconColor = iconColor;
    if (typeof contentType !== 'undefined') data.contentType = contentType;
    if (typeof resourceUrl !== 'undefined') data.resourceUrl = resourceUrl;
    if (typeof imageSize !== 'undefined') data.imageSize = imageSize;
    if (typeof order !== 'undefined') data.order = order;
    if (typeof date !== 'undefined') data.date = new Date(date);

    const progression = await prisma.progression.update({
      where: { id },
      data
    });

    return NextResponse.json({ progression, success: true });
  } catch (error) {
    console.error('Error updating progression:', error);
    return NextResponse.json({ error: 'Failed to update progression' }, { status: 500 });
  }
}
