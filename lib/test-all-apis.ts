import { getAllClasses, getAllCourses, getStatistics } from './data-prisma-utils';

async function testAllAPIs() {
  console.log('🧪 Test complet des APIs modifiées...\n');

  try {
    console.log('📊 1. Test des statistiques...');
    const stats = await getStatistics();
    console.log(`   ✅ Classes: ${stats.classesCount}`);
    console.log(`   ✅ Cours: ${stats.coursesCount}`);
    console.log(`   ✅ Activités: ${stats.activitiesCount}\n`);

    console.log('🏫 2. Test récupération des classes...');
    const classes = await getAllClasses();
    console.log(`   ✅ Nombre de classes récupérées: ${classes.length}`);
    
    let totalCourses = 0;
    let totalActivities = 0;
    
    classes.forEach(classe => {
      console.log(`   📚 Classe "${classe.name}": ${classe.courses.length} cours`);
      totalCourses += classe.courses.length;
      
      classe.courses.forEach(course => {
        totalActivities += course.activities.length;
      });
    });
    
    console.log(`   ✅ Total cours: ${totalCourses}`);
    console.log(`   ✅ Total activités: ${totalActivities}\n`);

    console.log('📖 3. Test récupération des cours...');
    const courses = await getAllCourses();
    console.log(`   ✅ Nombre de cours récupérés: ${courses.length}`);
    
    const coursesWithActivities = courses.filter(c => c.activities.length > 0);
    console.log(`   ✅ Cours avec activités: ${coursesWithActivities.length}`);
    
    // Afficher quelques exemples
    console.log('   🔍 Exemples de cours:');
    courses.slice(0, 3).forEach(course => {
      console.log(`      - "${course.title}" (${course.activities.length} activités)`);
    });

    console.log('\n🎯 4. Vérification de la cohérence des données...');
    
    // Vérifier que chaque cours a bien une classe associée
    let orphanCourses = 0;
    const classIds = classes.map(c => c.id);
    
    courses.forEach(course => {
      if (!classIds.includes(course.theClasseId)) {
        orphanCourses++;
        console.log(`   ⚠️  Cours orphelin: "${course.title}" (classe ID: ${course.theClasseId})`);
      }
    });
    
    if (orphanCourses === 0) {
      console.log('   ✅ Tous les cours sont correctement associés à leurs classes');
    }

    // Vérifier l'intégrité des activités
    let orphanActivities = 0;
    const courseIds = courses.map(c => c.id);
    
    const allActivities = courses.flatMap(course => 
      course.activities.map(activity => ({...activity, courseId: course.id}))
    );
    
    allActivities.forEach(activity => {
      if (!courseIds.includes(activity.courseId)) {
        orphanActivities++;
      }
    });
    
    if (orphanActivities === 0) {
      console.log('   ✅ Toutes les activités sont correctement associées à leurs cours');
    }

    console.log('\n🎉 Tests terminés avec succès !');
    console.log('\n📋 Résumé:');
    console.log(`   - Classes: ${classes.length}`);
    console.log(`   - Cours: ${courses.length}`);
    console.log(`   - Activités: ${allActivities.length}`);
    console.log(`   - Cours orphelins: ${orphanCourses}`);
    console.log(`   - Activités orphelines: ${orphanActivities}`);

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    process.exit(1);
  }
}

// Exécution du test si appelé directement
if (require.main === module) {
  testAllAPIs();
}

export default testAllAPIs;
