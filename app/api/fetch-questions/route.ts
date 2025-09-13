import { NextRequest, NextResponse } from 'next/server';
import { escapeGamePrisma } from '@/lib/escape-game-db';

export async function GET(req: NextRequest) {
  try {
    // Helper: shuffle array and take n items
    const sample = <T,>(arr: T[], n: number): T[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a.slice(0, n);
    };

    // Fetch all IDs for each table
    const [conqueteIds, structureIds, rebusIds, enigmesRows] = await Promise.all([
      escapeGamePrisma.conquete.findMany({ select: { id: true } }),
      escapeGamePrisma.structure.findMany({ select: { id: true } }),
      escapeGamePrisma.rebus.findMany({ select: { id: true } }),
      escapeGamePrisma.enigmes.findMany({ select: { id: true, question: true, reponse: true } })
    ]);

    const sampleConqueteIds = sample(conqueteIds.map(r => r.id), 7);
    const sampleStructureIds = sample(structureIds.map(r => r.id), 9);
    const sampleRebusIds = sample(rebusIds.map(r => r.id), 10);

    // Fetch details for sampled IDs and map to expected shapes
    const [conqueteRows, structureRows, rebusRows] = await Promise.all([
      sampleConqueteIds.length
        ? escapeGamePrisma.conquete.findMany({
            where: { id: { in: sampleConqueteIds } },
            select: { id: true, question: true, reponse: true }
          })
        : Promise.resolve([]),
      sampleStructureIds.length
        ? escapeGamePrisma.structure.findMany({
            where: { id: { in: sampleStructureIds } },
            select: { id: true, question: true, reponse: true }
          })
        : Promise.resolve([]),
      sampleRebusIds.length
        ? escapeGamePrisma.rebus.findMany({
            where: { id: { in: sampleRebusIds } },
            select: { id: true, reponse: true }
          })
        : Promise.resolve([])
    ]);

    // Order rows according to sampled ID order
    const orderByIds = <T extends { id: number }>(rows: T[], ids: number[]) => {
      const map = new Map(rows.map(r => [r.id, r]));
      const ordered: T[] = [];
      for (const id of ids) {
        const r = map.get(id);
        if (r) ordered.push(r);
      }
      return ordered;
    };

    const conquete = orderByIds(conqueteRows, sampleConqueteIds).map(r => ({ ID: r.id, question: r.question, reponse: r.reponse }));
    const structure = orderByIds(structureRows, sampleStructureIds).map(r => ({ ID: r.id, question: r.question, reponse: r.reponse }));
    const rebus = orderByIds(rebusRows, sampleRebusIds).map(r => ({ ID: r.id, reponse: r.reponse }));
    const enigmes = enigmesRows.map(r => ({ ID: r.id, question: r.question, reponse: r.reponse }));

    return NextResponse.json({ conquete, structure, rebus, enigmes });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await escapeGamePrisma.$disconnect();
  }
}