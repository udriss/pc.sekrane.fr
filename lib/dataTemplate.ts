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
    toggleVisibilityCourse?: boolean;
    themeChoice?: number;
  }

  export interface Classe {
    id: string;
    name: string;
    associated_courses: string[];
    toggleVisibilityClasse?: boolean;
  }