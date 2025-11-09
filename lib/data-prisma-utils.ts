import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

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
              fileUrl: true,
              order: true,
              isFileDrop: true,
              dropzoneConfig: true,
              isHidden: true,
              isDisabled: true
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
      activities: {
        orderBy: { order: 'asc' }
      },
      classeRelation: true
    }
  });
}

export async function getCourseById(id: string) {
  const courseId = parseInt(id, 10);
  if (isNaN(courseId)) {
    return null;
  }

  return await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      activities: {
        orderBy: { order: 'asc' }
      },
      classeRelation: true
    }
  });
}

export async function getCoursesByClasseId(classeId: string) {
  return await prisma.course.findMany({
    where: { theClasseId: classeId },
    include: {
      activities: {
        orderBy: { order: 'asc' }
      }
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
    isFileDrop?: boolean;
    dropzoneConfig?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  }[];
}) {
  const courseId = parseInt(data.id, 10);
  if (isNaN(courseId)) {
    throw new Error('Invalid course ID');
  }

  const { activities, ...courseData } = data;
  
  return await prisma.course.create({
    data: {
      ...courseData,
      id: courseId,
      activities: activities ? {
        create: activities.map((activity) => ({
          ...activity,
          dropzoneConfig: activity.dropzoneConfig ?? undefined
        }))
      } : undefined
    },
    include: {
      activities: {
        orderBy: { order: 'asc' }
      }
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
  const courseId = parseInt(id, 10);
  if (isNaN(courseId)) {
    throw new Error('Invalid course ID');
  }

  return await prisma.course.update({
    where: { id: courseId },
    data,
    include: {
      activities: {
        orderBy: { order: 'asc' }
      }
    }
  });
}

export async function deleteCourse(id: string) {
  const courseId = parseInt(id, 10);
  if (isNaN(courseId)) {
    throw new Error('Invalid course ID');
  }

  return await prisma.course.delete({
    where: { id: courseId }
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
      course: true,
      submissions: true
    }
  });
}

export async function getActivitiesByCourseId(courseId: string) {
  const courseIdNum = parseInt(courseId, 10);
  if (isNaN(courseIdNum)) {
    return [];
  }

  return await prisma.activity.findMany({
    where: { courseId: courseIdNum },
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
  isFileDrop?: boolean;
  dropzoneConfig?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
}) {
  const courseIdNum = parseInt(data.courseId, 10);
  if (isNaN(courseIdNum)) {
    throw new Error('Invalid course ID');
  }

  // Get the current max order for the course
  const maxOrder = await prisma.activity.aggregate({
    where: { courseId: courseIdNum },
    _max: { order: true }
  });
  const order = (maxOrder._max?.order ?? -1) + 1;

  const { dropzoneConfig, ...rest } = data;

  return await prisma.activity.create({
    data: {
      ...rest,
      courseId: courseIdNum,
      order,
      ...(dropzoneConfig !== undefined ? { dropzoneConfig } : {})
    },
    include: {
      course: true
    }
  });
}

export async function updateActivity(id: string, data: {
  name?: string;
  title?: string;
  fileUrl?: string;
  order?: number;
  isFileDrop?: boolean;
  dropzoneConfig?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
}) {
  const { dropzoneConfig, ...rest } = data;
  return await prisma.activity.update({
    where: { id },
    data: {
      ...rest,
      ...(dropzoneConfig !== undefined ? { dropzoneConfig } : {})
    },
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
      activities: {
        orderBy: { order: 'asc' }
      },
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
