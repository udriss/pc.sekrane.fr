import { promises as fs } from 'fs';
import path from 'path';
import { Classe, Course } from '@/lib/dataTemplate';

const DATA_FILE_PATH = path.join(process.cwd(), 'lib', 'data.json');

export async function parseData(): Promise<{ classes: Classe[], courses: Course[] }> {
  try {
    const jsonData = await fs.readFile(DATA_FILE_PATH, 'utf8');
    const data = JSON.parse(jsonData);
    return data;
  } catch (error) {
    console.error('Error reading data:', error);
    return { classes: [], courses: [] };
  }
}

export async function updateData(classes: Classe[], courses: Course[]): Promise<void> {
  try {
    const jsonData = JSON.stringify({ classes, courses }, null, 2);
    await fs.writeFile(DATA_FILE_PATH, jsonData, 'utf8');
  } catch (error) {
    console.error('Error updating data:', error);
    throw new Error('Failed to update data');
  }
}