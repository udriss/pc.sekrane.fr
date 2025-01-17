import { NextResponse } from 'next/server';
import { courses, classes } from '@/lib/data';

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ courses, classes });
}

