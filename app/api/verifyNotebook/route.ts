import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { uniqueId } = await req.json();
    const filePath = path.join('public', 'jupyterServerWork', 'uniqueIds.json');
    
    const data = await fs.readFile(filePath, 'utf8');
    const storedData = JSON.parse(data);
    
    const match = storedData.find((item: { uniqueId: string }) => item.uniqueId === uniqueId);
    
    if (match) {
      return NextResponse.json({ success: true, dirPath: match.dirPath, orginalFileName: match.orginalFileName, userName: match.userName });
    }
    
    return NextResponse.json({ success: false });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}