import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { courses } from '@/lib/data';

export async function POST(req: Request) {
  try {
    const { courseId, userName } = await req.json();

    // Find the course by ID
    const course = courses.find(course => course.id === courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get the notebook file information from the course
    const notebookFile = course.activities.find(activity => activity.fileUrl.endsWith('.ipynb'));
    if (!notebookFile) {
      return NextResponse.json({ error: 'Notebook file not found' }, { status: 404 });
    }

    const originalFileName = path.basename(notebookFile.fileUrl, '.ipynb');
    const uniqueId = uuidv4().replace(/-/g, '').substring(0, 5);
    
    // Create new directory path
    const sanitizedUserName = userName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const newDirName = `${originalFileName}-${sanitizedUserName}-${uniqueId}`;
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
    exec(`chown -R idr:idr ${newDirPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error changing ownership: ${error.message}`);
        return NextResponse.json({ error: 'Error changing ownership' }, { status: 500 });
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
    });

    // Return the directory path for Jupyter server
    return NextResponse.json({ 
      dirPath: newDirName,
      fileName: `${originalFileName}.ipynb`
    });
  } catch (error) {
    console.error('Error generating notebook:', error);
    return NextResponse.json({ error: 'Error generating notebook' }, { status: 500 });
  }
}