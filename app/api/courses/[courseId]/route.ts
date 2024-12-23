import { NextResponse } from 'next/server';
import { courses } from '@/lib/data';

export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  const course = courses.find((c) => c.id === params.courseId);

  if (course) {
    return NextResponse.json({ course });
  } else {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }
}