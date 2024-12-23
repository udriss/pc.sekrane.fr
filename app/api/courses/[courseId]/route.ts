import { NextResponse } from 'next/server';
import { courses } from '@/lib/data';

export const dynamic = "force-static";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const courseId = url.pathname.split('/').pop();
  
  const course = courses.find((c) => c.id === courseId);

  if (course) {
    return NextResponse.json({ course });
  } else {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }
}