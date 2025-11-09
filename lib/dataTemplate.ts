export interface FileDropConfig {
  enabled: boolean;
  acceptedTypes: string[];
  timeRestricted: boolean;
  startAt?: string | null;
  endAt?: string | null;
  maxSizeMb?: number;
  displayName?: string;
}

export interface FileDropSubmission {
  id: string;
  originalName: string;
  storedName: string;
  fileSize: number;
  mimeType: string;
  uploaderIp?: string | null;
  createdAt: string;
}

export interface Activity {
  id: string;
  name: string;
  title: string;
  fileUrl: string;
  order?: number;
  isFileDrop?: boolean;
  dropzoneConfig?: FileDropConfig | null;
  submissions?: FileDropSubmission[];
  isHidden?: boolean;
  isDisabled?: boolean;
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