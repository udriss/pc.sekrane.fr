// filepath: /app/api/jupyter-list/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function GET() {
  return new Promise((resolve) => {
    exec('sudo -u idr env PYTHONWARNINGS=ignore /home/idr/miniconda3/envs/envOne/bin/jupyter-server list', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        resolve(NextResponse.json({ error: error.message }, { status: 500 }));
      } else if (stderr) {
        console.error(`Command stderr: ${stderr}`);
        resolve(NextResponse.json({ error: stderr }, { status: 500 }));
      } else {
        const tokenMatch = stdout.match(/token=([^\s]+)/);
        
        if (tokenMatch) {
          const token = tokenMatch[1];
          resolve(NextResponse.json({ token }, { status: 200 }));
          
        } else {
          resolve(NextResponse.json({ error: 'No token found' }, { status: 500 }));
        }
      }
    });
  }).then(response => response as Response);
}