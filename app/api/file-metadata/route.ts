import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('filePath');
    
    if (!filePath) {
      return NextResponse.json({ error: 'Chemin de fichier non spécifié' }, { status: 400 });
    }
    
    // Construire le chemin complet du fichier
    // Attention: assurez-vous de valider correctement le chemin pour éviter les attaques de traversée de répertoire
    const publicDir = path.join(process.cwd(), 'public');
    const fullPath = path.join(publicDir, filePath);
    
    // Vérifier si le fichier existe
    try {
      const stats = await fs.stat(fullPath);
      
      return NextResponse.json({
        size: stats.size,
        lastModified: stats.mtime.toISOString()
      });
    } catch (err) {
      return NextResponse.json({ error: 'Fichier introuvable' }, { status: 404 });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des métadonnées du fichier:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}