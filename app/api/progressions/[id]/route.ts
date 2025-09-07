import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logConnection } from '@/lib/logConnection';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await logConnection(request, '/api/progressions/[id]');
    const { id: progressionId } = await params;

    await prisma.progression.delete({
      where: { id: progressionId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting progression:', error);
    return NextResponse.json({ error: 'Failed to delete progression' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await logConnection(request, '/api/progressions/[id]');
    const body = await request.json();
    const { id: progressionId } = await params;
    // Ne transmettre que les champs attendus par Prisma
  const { title, content, icon, iconColor, contentType, resourceUrl, imageSize, date, order, activityId } = body as any;
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
  // allow attaching/detaching an existing activity to this progression
  if (typeof activityId !== 'undefined') data.activityId = activityId;

    const progression = await prisma.progression.update({
      where: { id: progressionId },
      data
    });

    return NextResponse.json({ progression, success: true });
  } catch (error) {
    console.error('Error updating progression:', error);
    return NextResponse.json({ error: 'Failed to update progression' }, { status: 500 });
  }
}
