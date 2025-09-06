import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
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
    const body = await request.json();
    const { classeId, date, title, content, icon, iconColor, contentType, resourceUrl } = body;

    // Trouver le prochain ordre disponible
    const lastProgression = await prisma.progression.findFirst({
      where: { classeId },
      orderBy: { order: 'desc' }
    });

    const nextOrder = lastProgression ? lastProgression.order + 1 : 0;

    const progression = await prisma.progression.create({
      data: {
        classeId,
        date: new Date(date),
        title,
        content,
        icon,
        iconColor,
        contentType,
        resourceUrl,
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
    const body = await request.json();
    const { id, title, content, icon, iconColor, contentType, resourceUrl } = body;

    const progression = await prisma.progression.update({
      where: { id },
      data: {
        title,
        content,
        icon,
        iconColor,
        contentType,
        resourceUrl
      }
    });

    return NextResponse.json({ progression, success: true });
  } catch (error) {
    console.error('Error updating progression:', error);
    return NextResponse.json({ error: 'Failed to update progression' }, { status: 500 });
  }
}
