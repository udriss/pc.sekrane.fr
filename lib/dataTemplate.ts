export interface Activity {
  id: string;
  name: string;
  title: string;
  fileUrl: string;
  order?: number;
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
  hasProgression?: boolean;
}

export interface ThemeDescription {
  id: number;
  name: string;
  description: string;
}

export const THEMES: ThemeDescription[] = [
  { id: 0, name: "Standard", description: "Affichage horizontal des activités" },
  { id: 1, name: "Colonnes", description: "Affichage en colonnes par type de fichier" },
  { id: 2, name: "Accordéon", description: "Affichage en accordéon des activités" }
];