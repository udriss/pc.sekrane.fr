import { promises as fs } from 'fs';
import path from 'path';
import { prisma } from './prisma';

interface ActivityData {
  id: string;
  name: string;
  title: string;
  fileUrl: string;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  classe: string;
  theClasseId: string;
  activities: ActivityData[];
  isHidden?: boolean;
  isDisabled?: boolean;
  themeChoice?: number;
}

interface ClasseData {
  id: string;
  name: string;
  associated_courses: string[];
  toggleVisibilityClasse?: boolean;
}

interface JsonData {
  classes: ClasseData[];
  courses: CourseData[];
}

async function migrateDataFromJson() {
  try {
    console.log('🚀 Début de la migration des données...');
    
    // Lecture du fichier JSON existant
    const DATA_FILE_PATH = path.join(process.cwd(), 'lib', 'data.json');
    const jsonData = await fs.readFile(DATA_FILE_PATH, 'utf8');
    const data: JsonData = JSON.parse(jsonData);
    
    console.log(`📊 Données trouvées: ${data.classes.length} classes et ${data.courses.length} cours`);

    // Migration dans une transaction pour garantir la cohérence
    await prisma.$transaction(async (tx) => {
      console.log('🗑️  Nettoyage des données existantes...');
      
      // Supprimer toutes les données existantes dans l'ordre
      await tx.activity.deleteMany({});
      await tx.course.deleteMany({});
      await tx.classe.deleteMany({});

      console.log('📝 Création des classes...');
      
      // Créer les classes
      for (const classe of data.classes) {
        await tx.classe.create({
          data: {
            id: classe.id,
            name: classe.name,
            toggleVisibilityClasse: classe.toggleVisibilityClasse || false
          }
        });
        console.log(`✅ Classe créée: ${classe.name} (ID: ${classe.id})`);
      }

      console.log('📚 Création des cours et activités...');
      
      // Créer les cours avec leurs activités
      for (const course of data.courses) {
        const isHidden = course.isHidden ?? false;
        const isDisabled = course.isDisabled ?? false;
        await tx.course.create({
          data: {
            id: parseInt(course.id, 10),
            title: course.title,
            description: course.description,
            classe: course.classe,
            theClasseId: course.theClasseId,
            isHidden,
            isDisabled,
            themeChoice: course.themeChoice || 0,
            activities: {
              create: course.activities.map(activity => ({
                id: activity.id,
                name: activity.name,
                title: activity.title,
                fileUrl: activity.fileUrl
              }))
            }
          }
        });
        console.log(`✅ Cours créé: ${course.title} (${course.activities.length} activités)`);
      }
    });

    console.log('🎉 Migration terminée avec succès !');
    
    // Vérification des données migrées
    const classesCount = await prisma.classe.count();
    const coursesCount = await prisma.course.count();
    const activitiesCount = await prisma.activity.count();
    
    console.log(`📈 Résumé de la migration:`);
    console.log(`   - Classes: ${classesCount}`);
    console.log(`   - Cours: ${coursesCount}`);
    console.log(`   - Activités: ${activitiesCount}`);

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution du script si appelé directement
if (require.main === module) {
  migrateDataFromJson();
}

export default migrateDataFromJson;
