import { NextResponse } from 'next/server';
import { courses, classes } from '@/lib/data';

export async function GET() {
  try {
    return NextResponse.json({ courses, classes });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}