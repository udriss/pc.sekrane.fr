import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import mime from 'mime-types';
import { logConnection } from '@/lib/logConnection';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { pathname } = new URL(request.url);
    const filePath = pathname.replace('/api/files/', '');
    const fileLocation = path.join(process.cwd(), 'public', filePath);

    try {
        // Vérifier si le fichier appartient à une activité désactivée
        const activity = await prisma.activity.findFirst({
            where: {
                fileUrl: '/' + filePath,
                isDisabled: true
            }
        });

        if (activity) {
            // L'activité est désactivée, rediriger vers la page 404
            const baseUrl = process.env.NODE_ENV === 'production' 
                ? 'https://pc.sekrane.fr' 
                : process.env.NEXT_PUBLIC_BASE_URL || '';
            return NextResponse.redirect(`${baseUrl}/not-found`);
        }

        await logConnection(request, '/api/files');
        const stat = await fs.stat(fileLocation);
        const fileStream = require('fs').createReadStream(fileLocation);

        const headers = new Headers({
            'Content-Type': mime.lookup(fileLocation) || 'application/octet-stream',
            'Content-Length': stat.size.toString(),
        });

        return new Response(fileStream as any, { headers });
    } catch (error) {
        // En cas d'erreur (fichier non trouvé), rediriger vers la page 404
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? 'https://pc.sekrane.fr' 
            : process.env.NEXT_PUBLIC_BASE_URL || '';
        return NextResponse.redirect(`${baseUrl}/not-found`);
    }
}