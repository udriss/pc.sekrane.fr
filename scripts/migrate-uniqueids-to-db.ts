/**
 * Script de migration pour transférer les données de uniqueIds.json vers la table notebook_sessions
 * 
 * Ce script lit le fichier uniqueIds.json et transfère toutes les sessions existantes
 * vers la nouvelle table notebook_sessions dans la base de données.
 * 
 * Usage: npx ts-node scripts/migrate-uniqueids-to-db.ts
 */

import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface UniqueIdEntry {
  uniqueId: string;
  dirPath: string;
  orginalFileName: string;
  userName: string;
  date?: string;
}

async function extractCourseAndActivityFromDirPath(dirPath: string): Promise<{ courseId: number | null; activityId: string | null }> {
  try {
    // Le format du dirPath est généralement: originalFileName_uniqueId_userName
    // On doit chercher dans la base de données pour trouver le cours et l'activité correspondants
    
    // Extraire le nom du fichier original du dirPath
    const parts = dirPath.split('_');
    if (parts.length < 2) {
      console.warn(`Format de dirPath invalide: ${dirPath}`);
      return { courseId: null, activityId: null };
    }
    
    // Le nom du fichier original est la première partie
    const originalFileNameBase = parts[0];
    
    // Chercher une activité qui correspond
    const activities = await prisma.activity.findMany({
      where: {
        name: {
          contains: originalFileNameBase
        }
      },
      include: {
        course: true
      }
    });
    
    if (activities.length > 0) {
      // Prendre la première correspondance
      const activity = activities[0];
      return {
        courseId: activity.courseId,
        activityId: activity.id
      };
    }
    
    console.warn(`Aucune activité trouvée pour: ${originalFileNameBase}`);
    return { courseId: null, activityId: null };
  } catch (error) {
    console.error(`Erreur lors de l'extraction du courseId et activityId:`, error);
    return { courseId: null, activityId: null };
  }
}

async function migrateData() {
  const filePath = path.join(process.cwd(), 'public', 'jupyterServerWork', 'uniqueIds.json');
  
  console.log('🔄 Démarrage de la migration des données...');
  
  try {
    // Vérifier si le fichier existe
    try {
      await fs.access(filePath);
    } catch {
      console.log('⚠️  Le fichier uniqueIds.json n\'existe pas. Aucune migration nécessaire.');
      return;
    }
    
    // Lire le fichier JSON
    const data = await fs.readFile(filePath, 'utf8');
    const entries: UniqueIdEntry[] = JSON.parse(data);
    
    console.log(`📊 ${entries.length} entrées trouvées dans uniqueIds.json`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const entry of entries) {
      try {
        // Vérifier si l'entrée existe déjà dans la base de données
        const existing = await prisma.notebookSession.findUnique({
          where: { uniqueId: entry.uniqueId }
        });
        
        if (existing) {
          console.log(`⏭️  Session déjà migrée: ${entry.uniqueId}`);
          skippedCount++;
          continue;
        }
        
        // Extraire le courseId et activityId du dirPath
        const { courseId, activityId } = await extractCourseAndActivityFromDirPath(entry.dirPath);
        
        if (!courseId || !activityId) {
          console.warn(`⚠️  Impossible de trouver le courseId ou activityId pour: ${entry.uniqueId} (dirPath: ${entry.dirPath})`);
          errorCount++;
          continue;
        }
        
        // Créer l'entrée dans la base de données
        await prisma.notebookSession.create({
          data: {
            uniqueId: entry.uniqueId,
            dirPath: entry.dirPath,
            originalFileName: entry.orginalFileName,
            userName: entry.userName,
            courseId: courseId,
            activityId: activityId
          }
        });
        
        console.log(`✅ Session migrée: ${entry.uniqueId} (${entry.userName})`);
        migratedCount++;
      } catch (error) {
        console.error(`❌ Erreur lors de la migration de ${entry.uniqueId}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n📈 Résumé de la migration:');
    console.log(`  ✅ Migrées: ${migratedCount}`);
    console.log(`  ⏭️  Ignorées (déjà existantes): ${skippedCount}`);
    console.log(`  ❌ Erreurs: ${errorCount}`);
    console.log(`  📊 Total: ${entries.length}`);
    
    if (migratedCount > 0) {
      console.log('\n💡 Conseil: Vous pouvez maintenant supprimer le fichier uniqueIds.json après avoir vérifié que tout fonctionne correctement.');
      console.log(`   Fichier: ${filePath}`);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la migration
migrateData()
  .then(() => {
    console.log('\n✅ Migration terminée avec succès!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale lors de la migration:', error);
    process.exit(1);
  });
