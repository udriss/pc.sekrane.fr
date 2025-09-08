// /components/admin/admin-corruption/types.ts

import { Course, Classe } from '@/lib/dataTemplate';
import { Dispatch, SetStateAction } from 'react';

export interface ModificationsAdminProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
}

export interface ProgressionContent {
  title: string;
  content: string;
  icon: string;
  iconColor: string;
  contentType: string;
  resourceUrl: string;
  imageSize: number;
  linkedActivityId: string;
  linkedCourseId: string;
}

export interface EditProgressionContent {
  title: string;
  content: string;
  icon: string;
  iconColor: string;
  contentType: string;
  resourceUrl: string;
  imageSize: number;
  linkedActivityId: string;
  linkedCourseId: string;
}

export type PresetCache = {
  [key: string]: {
    resourceUrl: string;
    title: string;
    content: string;
  };
};

// Ajout du type 'url' pour permettre l'ajout de liens externes dans les progressions
export type ContentPresetType = 'text' | 'video' | 'image' | 'pdf' | 'url' | 'existing-activity';

export interface SnackbarState {
  snackbarOpen: boolean;
  snackbarMessage: React.ReactNode;
  snackbarSeverity: 'success' | 'error' | 'info' | 'warning';
  showSnackbar: (message: React.ReactNode, severity?: 'success' | 'error' | 'info' | 'warning') => void;
  handleCloseSnackbar: (_?: React.SyntheticEvent | Event, reason?: string) => void;
  setSnackbarOpen: (value: boolean) => void;
}

export interface BaseCardProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
  showSnackbar: (message: React.ReactNode, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

export interface ProgressionState {
  selectedClasseForProgression: string;
  setSelectedClasseForProgression: Dispatch<SetStateAction<string>>;
  selectedDate: Date | undefined;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
  showAllProgressions: boolean;
  setShowAllProgressions: Dispatch<SetStateAction<boolean>>;
  progressionContent: ProgressionContent;
  setProgressionContent: Dispatch<SetStateAction<ProgressionContent>>;
  selectedCourseForProgression: string;
  setSelectedCourseForProgression: Dispatch<SetStateAction<string>>;
  selectedActivityForProgression: string;
  setSelectedActivityForProgression: Dispatch<SetStateAction<string>>;
  contentPreset: string;
  setContentPreset: Dispatch<SetStateAction<string>>;
  progressions: any[];
  setProgressions: Dispatch<SetStateAction<any[]>>;
  successMessageProgression: string;
  setSuccessMessageProgression: Dispatch<SetStateAction<string>>;
  errorProgression: string;
  setErrorProgression: Dispatch<SetStateAction<string>>;
  isDeleteAllModalOpen: boolean;
  setIsDeleteAllModalOpen: Dispatch<SetStateAction<boolean>>;
  progressionsToDelete: any[];
  setProgressionsToDelete: Dispatch<SetStateAction<any[]>>;
  isDeletingAll: boolean;
  setIsDeletingAll: Dispatch<SetStateAction<boolean>>;
  editingProgression: any;
  setEditingProgression: Dispatch<SetStateAction<any>>;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: Dispatch<SetStateAction<boolean>>;
  selectedFile: File | null;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
  filePreview: string | null;
  setFilePreview: Dispatch<SetStateAction<string | null>>;
  uploadingFile: boolean;
  setUploadingFile: Dispatch<SetStateAction<boolean>>;
  rejectedFile: File | null;
  setRejectedFile: Dispatch<SetStateAction<File | null>>;
  uploadProgress: number;
  setUploadProgress: Dispatch<SetStateAction<number>>;
  editContentPreset: string;
  setEditContentPreset: (value: string) => void;
  editProgressionContent: EditProgressionContent;
  setEditProgressionContent: Dispatch<SetStateAction<EditProgressionContent>>;
  editSelectedFile: File | null;
  setEditSelectedFile: Dispatch<SetStateAction<File | null>>;
  editFilePreview: string | null;
  setEditFilePreview: Dispatch<SetStateAction<string | null>>;
  editRejectedFile: File | null;
  setEditRejectedFile: Dispatch<SetStateAction<File | null>>;
  editUploadingFile: boolean;
  setEditUploadingFile: Dispatch<SetStateAction<boolean>>;
  editUploadProgress: number;
  setEditUploadProgress: Dispatch<SetStateAction<number>>;
  editSelectedCourseForProgression: string;
  setEditSelectedCourseForProgression: Dispatch<SetStateAction<string>>;
  editSelectedActivityForProgression: string;
  setEditSelectedActivityForProgression: Dispatch<SetStateAction<string>>;
  editPresetCache: PresetCache;
  setEditPresetCache: Dispatch<SetStateAction<PresetCache>>;
}
