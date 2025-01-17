export const dataTemplate = `
// ICI

  export interface Activity {
    id: string;
    name: string;
    title: string;
    fileUrl: string;
  }

  export interface Course {
    id: string;
    title: string;
    description: string;
    classe: string;
    theClasseId: string;
    activities: Activity[];
  }

  export interface Classe {
    id: string;
    name: string;
    associated_courses: string[];
  }

  export const classes: Classe[] = __CLASSES__;

  export const courses: Course[] = __COURSES__;
`;