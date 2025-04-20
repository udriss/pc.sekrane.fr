import { NextResponse } from 'next/server';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { join } from 'path';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { parseData, updateData } from '@/lib/data-utils';

const filePath = path.join('public', 'jupyterServerWork', 'uniqueIds.json');

async function generateUniqueId() {
  let uniqueId;
  let uniqueIds = [];

  try {
    const data = await fs.readFile(filePath, 'utf8');
    uniqueIds = JSON.parse(data);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code !== 'ENOENT') throw error;
  }

  do {
    uniqueId = uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase();
  } while (uniqueIds.includes(uniqueId));

  return uniqueId;
}

const getFrenchDayAbbrev = (date: Date): string => {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const months = ['JANV', 'FÉVR', 'MARS', 'AVRI', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCTO', 'NOVE', 'DÉCE'];
  return `${days[date.getDay()]}-${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
};

async function storeUniqueId(uniqueId: string, dirPath: string, orginalFileName: string, userName: string) {
  try {
    let storedData = [];
    try {
      const data = await fs.readFile(filePath, 'utf8');
      storedData = JSON.parse(data);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code !== 'ENOENT') throw error;
    }

    const currentDate = new Date();
    const formattedDate = getFrenchDayAbbrev(currentDate);


    storedData.push({
      uniqueId: uniqueId,
      dirPath: dirPath,
      orginalFileName: orginalFileName,
      userName: userName,
      date: formattedDate
    });

    await fs.writeFile(filePath, JSON.stringify(storedData, null, 2), 'utf8');
    
  } catch (error) {
    console.error('Error storing data:', error);
  }
}


export async function POST(req: Request) {
  const { classes, courses } = await parseData();

  try {
    const { courseId, userName, sendFileUrl } = await req.json();
    const jupyterServerWork = join(process.cwd(), 'jupyterServerWork');

    const course = courses.find(course => course.id === courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const notebookFile = courses
      .flatMap(course => course.activities)
      .find(activity => activity.fileUrl === sendFileUrl);

    if (!notebookFile) {
      return NextResponse.json({ error: 'Notebook file not found' }, { status: 404 });
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
    const originalFileName = path.basename(notebookFile.fileUrl, '.ipynb');
    
    // Create new directory path
    const sanitizedUserName = userName.replace(/[^a-z0-9]/gi, '_');
    const newDirName = `${originalFileName}_${uniqueId}_${sanitizedUserName}`;
    const jupyterWorkDir = path.join(process.cwd(), 'public', 'jupyterServerWork');
    const newDirPath = path.join(jupyterWorkDir, newDirName);

    // Create directory if it doesn't exist
    await fs.mkdir(newDirPath, { recursive: true });

    // Read the reference notebook file
    const referenceFilePath = path.join(process.cwd(), 'public', notebookFile.fileUrl);
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
    await storeUniqueId(uniqueId, newDirName, originalFileName+".ipynb", userName);

    // Return the directory path for Jupyter server
    return NextResponse.json({ 
      dirPath: newDirName,
      fileName: `${originalFileName}.ipynb`,
      uniqueId: uniqueId
    });
  } catch (error) {
    console.error('Error generating notebook:', error);
    return NextResponse.json({ error: 'Error generating notebook' }, { status: 500 });
  }
}