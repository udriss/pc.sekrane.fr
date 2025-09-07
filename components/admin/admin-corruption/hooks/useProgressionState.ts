// /components/admin/admin-corruption/hooks/useProgressionState.ts

import { useState } from 'react';
import { ProgressionContent, EditProgressionContent, PresetCache } from '../types';

export const useProgressionState = () => {
  // États pour la gestion des progressions
  const [selectedClasseForProgression, setSelectedClasseForProgression] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showAllProgressions, setShowAllProgressions] = useState<boolean>(true);
  const [progressionContent, setProgressionContent] = useState<ProgressionContent>({
    title: '',
    content: '',
    icon: 'edit',
    iconColor: '#3f51b5',
    contentType: 'text',
    resourceUrl: '',
    imageSize: 60,
    linkedActivityId: '',
    linkedCourseId: ''
  });

  // States pour l'association d'activités aux progressions
  const [selectedCourseForProgression, setSelectedCourseForProgression] = useState<string>('all');
  const [selectedActivityForProgression, setSelectedActivityForProgression] = useState<string>('none');
  const [contentPreset, setContentPreset] = useState<string>('text');
  const [progressions, setProgressions] = useState<any[]>([]);
  const [successMessageProgression, setSuccessMessageProgression] = useState<string>('');
  const [errorProgression, setErrorProgression] = useState<string>('');

  // States pour le modal de suppression en masse
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState<boolean>(false);
  const [progressionsToDelete, setProgressionsToDelete] = useState<any[]>([]);
  const [isDeletingAll, setIsDeletingAll] = useState<boolean>(false);

  // Nouveaux states pour l'édition
  const [editingProgression, setEditingProgression] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // States pour la gestion des fichiers
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [rejectedFile, setRejectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Etats séparés pour le dialog d'édition afin d'éviter les mélanges
  const [editContentPreset, setEditContentPreset] = useState<string>('text');
  const [editProgressionContent, setEditProgressionContent] = useState<EditProgressionContent>({
    title: '',
    content: '',
    icon: 'edit',
    iconColor: '#3f51b5',
    contentType: 'text',
    resourceUrl: '',
    imageSize: 60,
    linkedActivityId: '',
    linkedCourseId: ''
  });
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
  const [editFilePreview, setEditFilePreview] = useState<string | null>(null);
  const [editRejectedFile, setEditRejectedFile] = useState<File | null>(null);
  const [editUploadingFile, setEditUploadingFile] = useState<boolean>(false);
  const [editUploadProgress, setEditUploadProgress] = useState<number>(0);
  
  // Edit dialog specific selectors for attaching an existing activity
  const [editSelectedCourseForProgression, setEditSelectedCourseForProgression] = useState<string>('all');
  const [editSelectedActivityForProgression, setEditSelectedActivityForProgression] = useState<string>('none');

  // Cache per preset to restore original content when toggling presets in the edit dialog
  const [editPresetCache, setEditPresetCache] = useState<PresetCache>({
    text: { resourceUrl: '', title: '', content: '' },
    video: { resourceUrl: '', title: '', content: '' },
    image: { resourceUrl: '', title: '', content: '' },
    pdf: { resourceUrl: '', title: '', content: '' },
    'existing-activity': { resourceUrl: '', title: '', content: '' }
  });

  return {
    selectedClasseForProgression,
    setSelectedClasseForProgression,
    selectedDate,
    setSelectedDate,
    showAllProgressions,
    setShowAllProgressions,
    progressionContent,
    setProgressionContent,
    selectedCourseForProgression,
    setSelectedCourseForProgression,
    selectedActivityForProgression,
    setSelectedActivityForProgression,
    contentPreset,
    setContentPreset,
    progressions,
    setProgressions,
    successMessageProgression,
    setSuccessMessageProgression,
    errorProgression,
    setErrorProgression,
    isDeleteAllModalOpen,
    setIsDeleteAllModalOpen,
    progressionsToDelete,
    setProgressionsToDelete,
    isDeletingAll,
    setIsDeletingAll,
    editingProgression,
    setEditingProgression,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedFile,
    setSelectedFile,
    filePreview,
    setFilePreview,
    uploadingFile,
    setUploadingFile,
    rejectedFile,
    setRejectedFile,
    uploadProgress,
    setUploadProgress,
    editContentPreset,
    setEditContentPreset: (value: string) => setEditContentPreset(value),
    editProgressionContent,
    setEditProgressionContent,
    editSelectedFile,
    setEditSelectedFile,
    editFilePreview,
    setEditFilePreview,
    editRejectedFile,
    setEditRejectedFile,
    editUploadingFile,
    setEditUploadingFile,
    editUploadProgress,
    setEditUploadProgress,
    editSelectedCourseForProgression,
    setEditSelectedCourseForProgression,
    editSelectedActivityForProgression,
    setEditSelectedActivityForProgression,
    editPresetCache,
    setEditPresetCache
  };
};