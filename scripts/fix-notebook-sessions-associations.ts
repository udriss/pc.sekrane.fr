/**
 * Script de correction des associations courseId et activityId dans notebook_sessions
 * 
 * Ce script vérifie et corrige les associations entre les sessions de notebooks
 * et les activités/cours en utilisant le originalFileName comme référence.
 * 
 * Usage: npx ts-node scripts/fix-notebook-sessions-associations.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FixResult {
  sessionId: string;
  uniqueId: string;
  originalFileName: string;
  oldCourseId: number | null;
  newCourseId: number | null;
  oldActivityId: string | null;
  newActivityId: string | null;
  status: 'fixed' | 'already_correct' | 'not_found' | 'error';
  message?: string;
}

async function findCorrectActivityAndCourse(originalFileName: string): Promise<{ courseId: number; activityId: string } | null> {
  try {
    // Nettoyer le nom du fichier pour la recherche
    const cleanFileName = originalFileName.replace('.ipynb', '').toLowerCase();
    
    console.log(`🔍 Recherche de l'activité pour: "${originalFileName}" (nettoyé: "${cleanFileName}")`);
    
    // Rechercher les activités dont le fileUrl ou name contient le nom du fichier
    const activities = await prisma.activity.findMany({
      where: {
        OR: [
          {
            fileUrl: {
              contains: originalFileName
            }
          },
          {
            name: {
              contains: originalFileName
            }
          },
          {
            fileUrl: {
              endsWith: originalFileName
            }
          }
        ]
      },
      include: {
        course: true
      }
    });
    
    if (activities.length === 0) {
      console.log(`   ⚠️  Aucune activité trouvée pour "${originalFileName}"`);
      return null;
    }
    
    if (activities.length > 1) {
      console.log(`   ⚠️  Plusieurs activités trouvées (${activities.length}), utilisation de la première:`);
      activities.forEach((act, idx) => {
        console.log(`      ${idx + 1}. ${act.title} (ID: ${act.id}, Course: ${act.course.title})`);
      });
    } else {
      console.log(`   ✅ Activité trouvée: ${activities[0].title} (Course: ${activities[0].course.title})`);
    }
    
    const activity = activities[0];
    return {
      courseId: activity.courseId,
      activityId: activity.id
    };
  } catch (error) {
    console.error(`   ❌ Erreur lors de la recherche:`, error);
    return null;
  }
}

async function verifyAndFixSessions() {
  console.log('🔄 Démarrage de la vérification et correction des sessions...\n');
  
  try {
    // Récupérer toutes les sessions
    const sessions = await prisma.notebookSession.findMany({
      include: {
        course: true,
        activity: true
      }
    });
    
    console.log(`📊 ${sessions.length} sessions trouvées dans la base de données\n`);
    
    const results: FixResult[] = [];
    let fixedCount = 0;
    let alreadyCorrectCount = 0;
    let notFoundCount = 0;
    let errorCount = 0;
    
    for (const session of sessions) {
      console.log(`\n📝 Session: ${session.uniqueId} (${session.userName})`);
      console.log(`   Fichier: ${session.originalFileName}`);
      console.log(`   Actuel - Course: ${session.course.title} (ID: ${session.courseId})`);
      console.log(`   Actuel - Activity: ${session.activity.title} (ID: ${session.activityId})`);
      
      // Trouver les bons IDs
      const correctIds = await findCorrectActivityAndCourse(session.originalFileName);
      
      if (!correctIds) {
        console.log(`   ❌ Impossible de trouver l'activité correspondante`);
        results.push({
          sessionId: session.id,
          uniqueId: session.uniqueId,
          originalFileName: session.originalFileName,
          oldCourseId: session.courseId,
          newCourseId: null,
          oldActivityId: session.activityId,
          newActivityId: null,
          status: 'not_found',
          message: 'Activité non trouvée'
        });
        notFoundCount++;
        continue;
      }
      
      // Vérifier si les IDs sont corrects
      if (session.courseId === correctIds.courseId && session.activityId === correctIds.activityId) {
        console.log(`   ✅ Les associations sont déjà correctes`);
        results.push({
          sessionId: session.id,
          uniqueId: session.uniqueId,
          originalFileName: session.originalFileName,
          oldCourseId: session.courseId,
          newCourseId: correctIds.courseId,
          oldActivityId: session.activityId,
          newActivityId: correctIds.activityId,
          status: 'already_correct'
        });
        alreadyCorrectCount++;
        continue;
      }
      
      // Corriger les IDs
      try {
        console.log(`   🔧 Correction des associations...`);
        console.log(`      Course: ${session.courseId} → ${correctIds.courseId}`);
        console.log(`      Activity: ${session.activityId} → ${correctIds.activityId}`);
        
        await prisma.notebookSession.update({
          where: { id: session.id },
          data: {
            courseId: correctIds.courseId,
            activityId: correctIds.activityId
          }
        });
        
        console.log(`   ✅ Session corrigée avec succès`);
        results.push({
          sessionId: session.id,
          uniqueId: session.uniqueId,
          originalFileName: session.originalFileName,
          oldCourseId: session.courseId,
          newCourseId: correctIds.courseId,
          oldActivityId: session.activityId,
          newActivityId: correctIds.activityId,
          status: 'fixed'
        });
        fixedCount++;
      } catch (error) {
        console.log(`   ❌ Erreur lors de la correction:`, error);
        results.push({
          sessionId: session.id,
          uniqueId: session.uniqueId,
          originalFileName: session.originalFileName,
          oldCourseId: session.courseId,
          newCourseId: correctIds.courseId,
          oldActivityId: session.activityId,
          newActivityId: correctIds.activityId,
          status: 'error',
          message: String(error)
        });
        errorCount++;
      }
    }
    
    // Afficher le résumé
    console.log('\n' + '='.repeat(60));
    console.log('📈 RÉSUMÉ DE LA VÉRIFICATION/CORRECTION');
    console.log('='.repeat(60));
    console.log(`  ✅ Sessions déjà correctes: ${alreadyCorrectCount}`);
    console.log(`  🔧 Sessions corrigées: ${fixedCount}`);
    console.log(`  ❌ Activités non trouvées: ${notFoundCount}`);
    console.log(`  ⚠️  Erreurs: ${errorCount}`);
    console.log(`  📊 Total: ${sessions.length}`);
    console.log('='.repeat(60));
    
    // Afficher les sessions problématiques
    if (notFoundCount > 0 || errorCount > 0) {
      console.log('\n⚠️  SESSIONS PROBLÉMATIQUES:');
      results
        .filter(r => r.status === 'not_found' || r.status === 'error')
        .forEach(r => {
          console.log(`  - ${r.uniqueId} (${r.originalFileName}): ${r.message || r.status}`);
        });
    }
    
    // Afficher les corrections effectuées
    if (fixedCount > 0) {
      console.log('\n🔧 CORRECTIONS EFFECTUÉES:');
      results
        .filter(r => r.status === 'fixed')
        .forEach(r => {
          console.log(`  - ${r.uniqueId} (${r.originalFileName})`);
          console.log(`    Course: ${r.oldCourseId} → ${r.newCourseId}`);
          console.log(`    Activity: ${r.oldActivityId} → ${r.newActivityId}`);
        });
    }
    
  } catch (error) {
    console.error('\n❌ Erreur fatale lors de la vérification:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la vérification et correction
verifyAndFixSessions()
  .then(() => {
    console.log('\n✅ Vérification et correction terminées avec succès!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  });
