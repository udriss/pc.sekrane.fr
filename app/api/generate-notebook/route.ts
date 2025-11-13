import { NextResponse } from 'next/server';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { join } from 'path';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { getCourseById } from '@/lib/data-prisma-utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
 
async function generateUniqueId() {
  let uniqueId;
  let exists = true;

  do {
    uniqueId = uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase();
    // Vérifier si l'uniqueId existe déjà dans la base de données
    const existingSession = await prisma.notebookSession.findUnique({
      where: { uniqueId }
    });
    exists = !!existingSession;
  } while (exists);

  return uniqueId;
}

async function storeNotebookSession(
  uniqueId: string, 
  dirPath: string, 
  originalFileName: string, 
  userName: string,
  courseId: number,
  activityId: string
) {
  try {
    await prisma.notebookSession.create({
      data: {
        uniqueId,
        dirPath,
        originalFileName,
        userName,
        courseId,
        activityId
      }
    });
  } catch (error) {
    console.error('Error storing notebook session:', error);
    throw error;
  }
}


export async function POST(req: Request) {
  try {
    const { courseId, userName, sendFileUrl } = await req.json();
    
    // Convertir courseId en entier
    const courseIdInt = typeof courseId === 'string' ? parseInt(courseId, 10) : courseId;
    
    const jupyterServerWork = join(process.cwd(), 'jupyterServerWork');

    // Récupérer le cours depuis la base de données
    const course = await getCourseById(courseIdInt);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Trouver l'activité correspondante
    const activity = course.activities.find(activity => activity.fileUrl === sendFileUrl);
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    if (!existsSync(jupyterServerWork)) {
      mkdirSync(jupyterServerWork, { recursive: true });
      exec(`chown -R www-data:idr ${jupyterServerWork}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error changing ownership for ${jupyterServerWork}: ${error.message}`);
          return NextResponse.json({ error: 'Error changing ownership for ${jupyterServerWork}' }, { status: 500 });
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
      });
    }

    const uniqueId = await generateUniqueId();
    const originalFileName = path.basename(activity.fileUrl, '.ipynb');
    
    // Create new directory path
    const sanitizedUserName = userName.replace(/[^a-z0-9]/gi, '_');
    const newDirName = `${originalFileName}_${uniqueId}_${sanitizedUserName}`;
    const jupyterWorkDir = path.join(process.cwd(), 'public', 'jupyterServerWork');
    const newDirPath = path.join(jupyterWorkDir, newDirName);

    // Create directory if it doesn't exist
    await fs.mkdir(newDirPath, { recursive: true });

    // Read the reference notebook file
    const referenceFilePath = path.join(process.cwd(), 'public', activity.fileUrl);
    const fileContent = await fs.readFile(referenceFilePath, 'utf-8');

    // Save the new notebook file in the new directory
    const newFilePath = path.join(newDirPath, `${originalFileName}.ipynb`);
    await fs.writeFile(newFilePath, fileContent);

    // Change ownership of the new directory and files to 'ubuntu' user and group
    exec(`chown -R www-data:idr ${newDirPath} && chmod -R 0770 ${newDirPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error changing ownership: ${error.message}`);
        return NextResponse.json({ error: 'Error changing ownership' }, { status: 500 });
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
    });
    
    // Stocker la session dans la base de données
    await storeNotebookSession(
      uniqueId, 
      newDirName, 
      originalFileName+".ipynb", 
      userName,
      courseIdInt,
      activity.id
    );

    // Return the directory path for Jupyter server
    return NextResponse.json({ 
      dirPath: newDirName,
      fileName: `${originalFileName}.ipynb`,
      uniqueId: uniqueId
    });
  } catch (error) {
    console.error('Error generating notebook:', error);
    return NextResponse.json({ error: 'Error generating notebook' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}