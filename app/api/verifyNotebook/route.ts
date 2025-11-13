// app/api/verifyNotebook/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
 
export async function POST(req: Request) {
  try {
    const { uniqueId } = await req.json();
    
    // Rechercher la session de notebook avec les relations course et activity
    const notebookSession = await prisma.notebookSession.findUnique({
      where: { uniqueId },
      include: {
        course: true,
        activity: true
      }
    });
    
    if (!notebookSession) {
      return NextResponse.json({ success: false, message: 'Session not found' });
    }

    // Vérifier si le course est désactivé ou masqué
    if (notebookSession.course.isDisabled) {
      return NextResponse.json({ 
        success: false, 
        message: 'Ce cours est actuellement désactivé' 
      });
    }

    if (notebookSession.course.isHidden) {
      return NextResponse.json({ 
        success: false, 
        message: 'Ce cours est actuellement masqué' 
      });
    }

    // Vérifier si l'activité est désactivée ou masquée
    if (notebookSession.activity.isDisabled) {
      return NextResponse.json({ 
        success: false, 
        message: 'Cette activité est actuellement désactivée' 
      });
    }

    if (notebookSession.activity.isHidden) {
      return NextResponse.json({ 
        success: false, 
        message: 'Cette activité est actuellement masquée' 
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      dirPath: notebookSession.dirPath, 
      orginalFileName: notebookSession.originalFileName, 
      userName: notebookSession.userName 
    });
  } catch (error) {
    console.error('Error verifying notebook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}