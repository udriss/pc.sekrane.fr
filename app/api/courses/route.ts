import { NextResponse } from 'next/server';
import { courses } from '@/lib/data';

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ courses });
}