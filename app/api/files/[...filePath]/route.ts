import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import mime from 'mime-types';

export async function GET(request: Request) {
    const { pathname } = new URL(request.url);
    const filePath = pathname.replace('/api/files/', '');
    const fileLocation = path.join(process.cwd(), 'public', filePath);

    try {
        const fileContent = await fs.readFile(fileLocation);
        const mimeType = mime.lookup(fileLocation) || 'application/octet-stream';
        return new NextResponse(fileContent, {
            headers: {
                'Content-Type': mimeType,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
}