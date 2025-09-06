import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    const body = await request.json();
    const { id: progressionId } = await params;
    
    const progression = await prisma.progression.update({
      where: { id: progressionId },
      data: body
    });

    return NextResponse.json({ progression, success: true });
  } catch (error) {
    console.error('Error updating progression:', error);
    return NextResponse.json({ error: 'Failed to update progression' }, { status: 500 });
  }
}
