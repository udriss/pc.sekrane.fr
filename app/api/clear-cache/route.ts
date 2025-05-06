import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const token = req.cookies.get('adminAuth')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Clear RAM cache
    exec('sync; echo 3 > /proc/sys/vm/drop_caches', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error clearing cache: ${stderr}`);
        return NextResponse.json(
          { error: 'Failed to clear cache' },
          { status: 500 }
        );
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}