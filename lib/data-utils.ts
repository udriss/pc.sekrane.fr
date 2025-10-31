import { prisma } from './prisma';
import { Prisma } from '@prisma/client';
import { Classe, Course } from '@/lib/dataTemplate';

export async function parseData(): Promise<{ classes: Classe[], courses: Course[] }> {
  try {
    // Récupération des classes avec leurs cours associés
    const classesData = await prisma.classe.findMany({
      include: {
        courses: {
          include: {
            activities: true
          }
        }
      }
    });

    // Récupération de tous les cours avec leurs activités
    const coursesData = await prisma.course.findMany({
      include: {
        activities: true
      }
    });

    // Transformation des données pour correspondre au format attendu
    const classes: Classe[] = classesData.map(classe => ({
      id: classe.id,
      name: classe.name,
      associated_courses: classe.courses.map(course => course.id),
      toggleVisibilityClasse: classe.toggleVisibilityClasse || false
    }));

    const courses: Course[] = coursesData.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      classe: course.classe,
      theClasseId: course.theClasseId,
      activities: course.activities.map(activity => ({
        id: activity.id,
        name: activity.name,
        title: activity.title,
        fileUrl: activity.fileUrl,
        order: activity.order ?? undefined,
        isFileDrop: activity.isFileDrop ?? false,
        dropzoneConfig: activity.dropzoneConfig ? (activity.dropzoneConfig as any) : null
      })),
      toggleVisibilityCourse: course.toggleVisibilityCourse || false,
      themeChoice: course.themeChoice || 0
    }));

    return { classes, courses };
  } catch (error) {
    console.error('Error reading data from database:', error);
    return { classes: [], courses: [] };
  }
}

export async function updateData(classes: Classe[], courses: Course[]): Promise<void> {
  try {
    // Utilisation d'une transaction pour garantir la cohérence
    await prisma.$transaction(async (tx) => {
      // Supprimer toutes les activités existantes
      await tx.activity.deleteMany({});
      
      // Supprimer tous les cours existants
      await tx.course.deleteMany({});
      
      // Supprimer toutes les classes existantes
      await tx.classe.deleteMany({});

      // Créer les nouvelles classes
      for (const classe of classes) {
        await tx.classe.create({
          data: {
            id: classe.id,
            name: classe.name,
            toggleVisibilityClasse: classe.toggleVisibilityClasse || false
          }
        });
      }

      // Créer les nouveaux cours avec leurs activités
      for (const course of courses) {
        await tx.course.create({
          data: {
            id: course.id,
            title: course.title,
            description: course.description,
            classe: course.classe,
            theClasseId: course.theClasseId,
            toggleVisibilityCourse: course.toggleVisibilityCourse || false,
            themeChoice: course.themeChoice || 0,
            activities: {
              create: course.activities.map(activity => ({
                id: activity.id,
                name: activity.name,
                title: activity.title,
                fileUrl: activity.fileUrl,
                isFileDrop: activity.isFileDrop ?? false,
                dropzoneConfig: activity.dropzoneConfig
                  ? (activity.dropzoneConfig as unknown as Prisma.InputJsonValue)
                  : undefined
              }))
            }
          }
        });
      }
    });
  } catch (error) {
    console.error('Error updating data in database:', error);
    throw new Error('Failed to update data');
  }
}