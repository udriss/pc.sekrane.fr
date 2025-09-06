import { parseData } from './data-utils';
import { getStatistics, getAllClasses } from './data-prisma-utils';

async function testPrismaSetup() {
  console.log('🧪 Test de la configuration Prisma...\n');

  try {
    // Test 1: Lecture des données avec l'ancienne méthode (maintenant via Prisma)
    console.log('📖 Test 1: Lecture des données via data-utils...');
    const data = await parseData();
    console.log(`✅ Classes trouvées: ${data.classes.length}`);
    console.log(`✅ Cours trouvés: ${data.courses.length}`);
    
    // Test 2: Utilisation des nouveaux utilitaires
    console.log('\n📊 Test 2: Statistiques de la base de données...');
    const stats = await getStatistics();
    console.log(`✅ Classes: ${stats.classesCount}`);
    console.log(`✅ Cours: ${stats.coursesCount}`);
    console.log(`✅ Activités: ${stats.activitiesCount}`);

    // Test 3: Récupération des classes avec relations
    console.log('\n🏫 Test 3: Classes avec leurs cours...');
    const classes = await getAllClasses();
    classes.forEach(classe => {
      console.log(`✅ Classe "${classe.name}": ${classe.courses.length} cours`);
    });

    console.log('\n🎉 Tous les tests sont passés avec succès !');
    console.log('\n📝 Migration terminée. La configuration Prisma est opérationnelle.');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    process.exit(1);
  }
}

// Exécution du test si appelé directement
if (require.main === module) {
  testPrismaSetup();
}

export default testPrismaSetup;
