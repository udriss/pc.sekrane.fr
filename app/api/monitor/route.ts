import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import process from 'process';

interface NetworkStats {
  interface: string;
  bytesReceived: number;
  bytesSent: number;
}

interface MonitoringData {
  ram: {
    total: number;
    free: number;
    used: number;
    percentUsed: number;
    appUsed: number;
  };
  cpu: {
    model: string;
    speed: number;
    cores: number;
    usage: number;
  };
  uptime: number;
  network: NetworkStats[];
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const token = req.cookies.get('adminAuth')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get RAM info
    const totalRam = os.totalmem();
    const freeRam = os.freemem();
    const usedRam = totalRam - freeRam;
    const percentUsed = (usedRam / totalRam) * 100;
    const appUsedRam = process.memoryUsage().rss;

    // Get CPU info
    const cpus = os.cpus();
    const cpuModel = cpus[0].model;
    const cpuSpeed = cpus[0].speed;
    const cpuCores = cpus.length;
    const cpuUsage = process.cpuUsage().system / 1000000; // Convert from microseconds to milliseconds

    // Get uptime
    const uptime = process.uptime();

    // Get network interfaces info
    const networkInterfaces = os.networkInterfaces();
    const networkStats: NetworkStats[] = [];

    Object.entries(networkInterfaces).forEach(([name, interfaces]) => {
      if (interfaces) {
        interfaces.forEach(interface_ => {
          if (!interface_.internal) {
            networkStats.push({
              interface: name,
              bytesReceived: 0, // Need to implement counter
              bytesSent: 0, // Need to implement counter
            });
          }
        });
      }
    });

    const monitoringData: MonitoringData = {
      ram: {
        total: totalRam,
        free: freeRam,
        used: usedRam,
        percentUsed: Math.round(percentUsed * 100) / 100,
        appUsed: appUsedRam
      },
      cpu: {
        model: cpuModel,
        speed: cpuSpeed,
        cores: cpuCores,
        usage: cpuUsage
      },
      uptime: Math.round(uptime),
      network: networkStats
    };

    return NextResponse.json(monitoringData);

  } catch (error) {
    console.error('Monitoring error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}