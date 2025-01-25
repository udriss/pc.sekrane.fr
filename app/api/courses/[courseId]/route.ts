import { NextResponse } from 'next/server';
import { parseData } from '@/lib/data-utils';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const courseId = url.pathname.split('/').pop();

    const { courses } = await parseData();

    const course = courses.find((c) => c.id === courseId);

    if (course) {
      return NextResponse.json({ course });
    } else {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}