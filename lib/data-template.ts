export const dataTemplate = `
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
    activities: Activity[];
  }

  export interface Classe {
    id: string;
    name: string;
  }

  export const classes: Classe[] = __CLASSES__;

  export const courses: Course[] = __COURSES__;
`;