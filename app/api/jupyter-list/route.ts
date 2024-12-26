// filepath: /var/www/physnet.sekrane.fr/app/api/jupyter-list/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function GET() {
  return new Promise((resolve) => {
    exec('sudo -u idr env PYTHONWARNINGS=ignore /var/www/physnet.sekrane.fr/scripts/run_jupyter_list.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        resolve(NextResponse.json({ error: error.message }, { status: 500 }));
      } else if (stderr) {
        console.error(`Command stderr: ${stderr}`);
        resolve(NextResponse.json({ error: stderr }, { status: 500 }));
      } else {
        console.log(`Command stdout: ${stdout}`);
        const tokenMatch = stdout.match(/token=([^\s]+)/);
        if (tokenMatch) {
          const token = tokenMatch[1];
          console.log(`Extracted token: ${token}`);
          resolve(NextResponse.json({ token }, { status: 200 }));
        } else {
          console.log('No token found in stdout');
          resolve(NextResponse.json({ error: 'No token found' }, { status: 500 }));
        }
      }
    });
  }).then(response => response as Response);
}