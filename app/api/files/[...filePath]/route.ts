import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import mime from 'mime-types';
import { logConnection } from '@/lib/logConnection';

export async function GET(request: Request) {
    const { pathname } = new URL(request.url);
    const filePath = pathname.replace('/api/files/', '');
    const fileLocation = path.join(process.cwd(), 'public', filePath);

    try {
        await logConnection(request, '/api/files');
        const stat = await fs.stat(fileLocation);
        const fileStream = require('fs').createReadStream(fileLocation);

        const headers = new Headers({
            'Content-Type': mime.lookup(fileLocation) || 'application/octet-stream',
            'Content-Length': stat.size.toString(),
        });

        return new Response(fileStream as any, { headers });
    } catch (error) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
}