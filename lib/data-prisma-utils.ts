import { prisma } from './prisma';
import { Activity } from '@/lib/dataTemplate';

// Utilitaires spécifiques pour les classes
export async function getAllClasses() {
  return await prisma.classe.findMany({
    select: {
      id: true,
      name: true,
      toggleVisibilityClasse: true,
      hasProgression: true,
      courses: {
        select: {
          id: true,
          title: true,
          description: true,
          classe: true,
          theClasseId: true,
          toggleVisibilityCourse: true,
          themeChoice: true,
          activities: {
            select: {
              id: true,
              name: true,
              title: true,
              fileUrl: true
            }
          }
        }
      }
    }
  });
}

export async function getClasseById(id: string) {
  return await prisma.classe.findUnique({
    where: { id },
    include: {
      courses: {
        include: {
          activities: true
        }
      }
    }
  });
}

export async function createClasse(data: {
  id: string;
  name: string;
  toggleVisibilityClasse?: boolean;
}) {
  return await prisma.classe.create({
    data
  });
}

export async function updateClasse(id: string, data: {
  name?: string;
  toggleVisibilityClasse?: boolean;
}) {
  return await prisma.classe.update({
    where: { id },
    data
  });
}

export async function deleteClasse(id: string) {
  return await prisma.classe.delete({
    where: { id }
  });
}

// Utilitaires spécifiques pour les cours
export async function getAllCourses() {
  return await prisma.course.findMany({
    include: {
      activities: true,
      classeRelation: true
    }
  });
}

export async function getCourseById(id: string) {
  return await prisma.course.findUnique({
    where: { id },
    include: {
      activities: true,
      classeRelation: true
    }
  });
}

export async function getCoursesByClasseId(classeId: string) {
  return await prisma.course.findMany({
    where: { theClasseId: classeId },
    include: {
      activities: true
    }
  });
}

export async function createCourse(data: {
  id: string;
  title: string;
  description: string;
  classe: string;
  theClasseId: string;
  toggleVisibilityCourse?: boolean;
  themeChoice?: number;
  activities?: {
    id: string;
    name: string;
    title: string;
    fileUrl: string;
  }[];
}) {
  const { activities, ...courseData } = data;
  
  return await prisma.course.create({
    data: {
      ...courseData,
      activities: activities ? {
        create: activities
      } : undefined
    },
    include: {
      activities: true
    }
  });
}

export async function updateCourse(id: string, data: {
  title?: string;
  description?: string;
  classe?: string;
  theClasseId?: string;
  toggleVisibilityCourse?: boolean;
  themeChoice?: number;
}) {
  return await prisma.course.update({
    where: { id },
    data,
    include: {
      activities: true
    }
  });
}

export async function deleteCourse(id: string) {
  return await prisma.course.delete({
    where: { id }
  });
}

// Utilitaires spécifiques pour les activités
export async function getAllActivities() {
  return await prisma.activity.findMany({
    include: {
      course: true
    }
  });
}

export async function getActivityById(id: string) {
  return await prisma.activity.findUnique({
    where: { id },
    include: {
      course: true
    }
  });
}

export async function getActivitiesByCourseId(courseId: string) {
  return await prisma.activity.findMany({
    where: { courseId },
    include: {
      course: true
    }
  });
}

export async function createActivity(data: {
  id: string;
  name: string;
  title: string;
  fileUrl: string;
  courseId: string;
}) {
  return await prisma.activity.create({
    data,
    include: {
      course: true
    }
  });
}

export async function updateActivity(id: string, data: {
  name?: string;
  title?: string;
  fileUrl?: string;
  courseId?: string;
}) {
  return await prisma.activity.update({
    where: { id },
    data,
    include: {
      course: true
    }
  });
}

export async function deleteActivity(id: string) {
  return await prisma.activity.delete({
    where: { id }
  });
}

// Utilitaires de recherche et de statistiques
export async function searchCourses(query: string) {
  return await prisma.course.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { classe: { contains: query } }
      ]
    },
    include: {
      activities: true,
      classeRelation: true
    }
  });
}

export async function getStatistics() {
  const [classesCount, coursesCount, activitiesCount] = await Promise.all([
    prisma.classe.count(),
    prisma.course.count(),
    prisma.activity.count()
  ]);

  return {
    classesCount,
    coursesCount,
    activitiesCount
  };
}
