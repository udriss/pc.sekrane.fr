import { NextResponse } from 'next/server';
import { parseData } from '@/lib/data-utils';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { classes, courses } = await parseData();
    return NextResponse.json({ courses, classes });
  } catch (error) {
    console.error('Error fetching courses and classes:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}