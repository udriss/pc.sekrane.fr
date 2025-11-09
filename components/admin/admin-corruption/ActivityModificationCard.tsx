"use client";

// /components/admin/admin-corruption/ActivityModificationCard.tsx

import React, { useState } from 'react';
import { BaseCardProps } from './types';
import { Typography, Box, Button, TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, IconButton, Tooltip } from '@mui/material';
import { FileUploader } from '@/components/ui/file-uploader';
import { SuccessMessage, ErrorMessage, WarningMessage } from '@/components/message-display';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { 
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

/**
 * ActivityModificationCard
 * Permet de :
 *  - Sélectionner une classe, un cours, puis une activité
 *  - Renommer une activité (titre)
 *  - Remplacer le fichier associé (suppression + upload)
 *  - Actualiser les listes après modification via les setters parent
 */
export const ActivityModificationCard: React.FC<BaseCardProps & {
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  selectedCourse: string;
  setSelectedCourse: (value: string) => void;
  selectedActivity: string;
  setSelectedActivity: (value: string) => void;
}> = ({
  courses,
  setCourses,
  classes,
  setClasses,
  showSnackbar,
  selectedClass,
  setSelectedClass,
  selectedCourse,
  setSelectedCourse,
  selectedActivity,
  setSelectedActivity
}) => {

  // Form inputs
  const [newActivityTitle, setNewActivityTitle] = useState<string>('');
  const [newFile, setNewFile] = useState<File | null>(null);

  // Messages
  const [errorUpdateActivity, setErrorUpdateActivity] = useState<string>('');
  const [warningUpdateActivity, setWarningUpdateActivity] = useState<string>('');
  const [successMessageUpdateActivity, setSuccessMessageUpdateActivity] = useState<string>('');
  const [successMessageUploadFileName, setSuccessMessageUploadFileName] = useState<string>('');
  const [rejectedFile, setRejectedFile] = useState<File | null>(null);
  
  const naturalSort = (a: string, b: string) => {
    const regex = /(\d+|\D+)/g;
    const aParts = a.match(regex) || [];
    const bParts = b.match(regex) || [];
    for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
      const aPart = aParts[i];
      const bPart = bParts[i];
      if (aPart !== bPart) {
        const aNum = parseInt(aPart, 10);
        const bNum = parseInt(bPart, 10);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        return aPart.localeCompare(bPart);
      }
    }
    return aParts.length - bParts.length;
  };
  
  const resetMessages = () => {
    setErrorUpdateActivity('');
    setWarningUpdateActivity('');
    setSuccessMessageUpdateActivity('');
    setSuccessMessageUploadFileName('');
  };

  const refreshData = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses);
        setClasses(data.classes);
      }
    } catch (e) {
      // Silencieux – déjà géré côté actions
    }
  };

  const handleUpdate = async () => {
    resetMessages();

    if (!selectedActivity) {
      setWarningUpdateActivity('Choisissez une activité !');
      return;
    }

    // Trouver cours & activité
    const course = courses.find(c => c.activities.some(a => a.id === selectedActivity));
    const activity = course?.activities.find(a => a.id === selectedActivity);
    if (!course || !activity) {
      setWarningUpdateActivity('Activité introuvable');
      return;
    }

    const titleChanged = !!newActivityTitle && newActivityTitle.trim() !== '' && newActivityTitle !== activity.title;
    const fileChanged = !!newFile;

    if (!titleChanged && !fileChanged) {
      setWarningUpdateActivity('Il faut au moins changer le titre ou le fichier.');
      return;
    }

    try {
      let newFileUrl: string | undefined;
      let fileNotFound = false;

      // Si fichier changé, supprimer l'ancien et uploader le nouveau
      if (fileChanged && newFile) {
        // Supprimer l'ancien fichier si existe
        if (activity.fileUrl) {
          const deleteFileRes = await fetch('/api/deletefile', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileId: activity.id, courseId: course.id, deleteActivity: false })
          });
          if (!deleteFileRes.ok) throw new Error('Erreur lors de la suppression du fichier');
          const deleteFileData = await deleteFileRes.json();
          if (deleteFileData.fileNotFound) {
            fileNotFound = true;
          }
        }

        // Uploader le nouveau fichier
        const formData = new FormData();
        formData.append('file', newFile);
        formData.append('courseId', course.id);
        const uploadRes = await fetch('/api/upload-for-update', { method: 'POST', body: formData });
        if (!uploadRes.ok) throw new Error('Erreur lors de l\'upload');
        const uploadData = await uploadRes.json();
        newFileUrl = uploadData.fileUrl;
        setSuccessMessageUploadFileName(uploadData.fileName || '');
      }

      // Mettre à jour l'activité
      const updateData: any = { courseId: course.id, activityId: activity.id };
      if (titleChanged) {
        updateData.newTitle = newActivityTitle.trim();
      }
      if (newFileUrl) {
        updateData.newFileUrl = newFileUrl;
      }

      if (Object.keys(updateData).length > 2) { // more than courseId and activityId
        const updateRes = await fetch('/api/updateactivity', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        if (!updateRes.ok) throw new Error('Erreur lors de la mise à jour');
      }

      if (fileNotFound) {
        setWarningUpdateActivity('Le fichier ancien était introuvable sur le serveur, mais la mise à jour continue.');
      }

      await refreshData();

      setSuccessMessageUpdateActivity(
        `Mise à jour réussie ${titleChanged ? 'du titre' : ''}${titleChanged && fileChanged ? ' et ' : ''}${fileChanged ? 'du fichier' : ''}`
      );
      showSnackbar('Activité mise à jour', 'success');
      // Reset champs si complet
      setNewFile(null);
      setNewActivityTitle('');
    } catch (err: any) {
      setErrorUpdateActivity(err.message || 'Erreur lors de la mise à jour');
      showSnackbar('Erreur mise à jour activité', 'error');
    }
  };

  // Valeur titre actuelle pour placeholder / binding
  const currentActivityTitle = (
    newActivityTitle ||
    (courses.flatMap(c => c.activities).find(a => a.id === selectedActivity)?.title) ||
    ''
  );

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Classe */}
          <FormControl fullWidth>
            <InputLabel sx={{ fontSize: 'small', textTransform: 'uppercase' }}>
              Sélectionner une classe
            </InputLabel>
            <MuiSelect
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedCourse('');
                setSelectedActivity('');
              }}
              label="Sélectionner une classe"
            >
              {classes.sort((a, b) => naturalSort(a.name, b.name)).map(classe => (
                <MenuItem key={classe.id} value={classe.id}>{classe.name}</MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          {/* Cours */}
          <FormControl fullWidth>
            <InputLabel sx={{ fontSize: 'small', textTransform: 'uppercase' }}>
              Sélectionner un cours
            </InputLabel>
            <MuiSelect
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedActivity('');
              }}
              label="Sélectionner un cours"
            >
              {courses
                .filter(course => !selectedClass || course.theClasseId === selectedClass)
                .sort((a, b) => naturalSort(a.title, b.title))
                .map(course => (
                  <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
                ))}
            </MuiSelect>
          </FormControl>

          {/* Activité */}
          <FormControl fullWidth>
            <InputLabel sx={{ fontSize: 'small', textTransform: 'uppercase' }}>
              Sélectionner une activité
            </InputLabel>
            <MuiSelect
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              label="Sélectionner une activité"
            >
              {(() => {
                const filteredCourses = courses.filter(course => !selectedClass || course.theClasseId === selectedClass);
                if (selectedCourse) {
                  const chosenCourse = filteredCourses.find(c => c.id === selectedCourse);
                  return chosenCourse?.activities
                    .filter(a => a && a.id && a.id.trim() !== '')
                    .sort((a, b) => naturalSort(a.title || '', b.title || ''))
                    .map(a => <MenuItem key={a.id} value={a.id}>{a.title || 'Sans titre'}</MenuItem>);
                }
                return filteredCourses
                  .flatMap(c => c.activities || [])
                  .filter(a => a && a.id && a.id.trim() !== '')
                  .sort((a, b) => naturalSort(a.title || '', b.title || ''))
                  .map(a => <MenuItem key={a.id} value={a.id}>{a.title || 'Sans titre'}</MenuItem>);
              })()}
            </MuiSelect>
          </FormControl>

          {/* Nouveau titre */}
            <TextField
              fullWidth
              label="Nouveau titre de l'activité"
              value={newActivityTitle}
              onChange={(e) => setNewActivityTitle(e.target.value)}
              placeholder="Nouveau titre de l'activité"
              slotProps={{
              inputLabel: {
                sx: {
                fontSize: 'small',
                textTransform: 'uppercase',
                
                },
              },
              input: {
                sx: {
                '&::placeholder': {
                  fontSize: 'small',
                  textTransform: 'uppercase',
                },
                },
              },
              }}
            />
          {selectedActivity && !newActivityTitle && currentActivityTitle && (() => {
            const selectedActivityObj = courses.flatMap(c => c.activities || []).find(a => a && a.id === selectedActivity);
            const fileUrl = selectedActivityObj?.fileUrl ? `/api/files${selectedActivityObj.fileUrl}` : null;
            const isHidden = selectedActivityObj?.isHidden || false;
            const isDisabled = selectedActivityObj?.isDisabled || false;

            const handleToggleHidden = async () => {
              try {
                const res = await fetch('/api/activities/toggle-hidden', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ activityId: selectedActivity })
                });
                if (!res.ok) throw new Error('Erreur lors du changement de visibilité');
                await refreshData();
                showSnackbar(isHidden ? 'Activité affichée' : 'Activité masquée', 'success');
              } catch (err: any) {
                showSnackbar(err.message || 'Erreur', 'error');
              }
            };

            const handleToggleDisabled = async () => {
              try {
                const res = await fetch('/api/activities/toggle-disabled', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ activityId: selectedActivity })
                });
                if (!res.ok) throw new Error('Erreur lors du changement d\'état');
                await refreshData();
                showSnackbar(isDisabled ? 'Activité activée' : 'Activité désactivée', 'success');
              } catch (err: any) {
                showSnackbar(err.message || 'Erreur', 'error');
              }
            };

            return (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Titre actuel : {currentActivityTitle}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title={isHidden ? "Afficher l'activité" : "Masquer l'activité"}>
                    <IconButton
                      size="small"
                      onClick={handleToggleHidden}
                      sx={{ color: isHidden ? 'error.main' : 'success.main' }}
                    >
                      {isHidden ? <VisibilityOffIcon fontSize="inherit" /> : <VisibilityIcon fontSize="inherit" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={isDisabled ? "Activer l'activité" : "Désactiver l'activité"}>
                    <IconButton
                      size="small"
                      onClick={handleToggleDisabled}
                      sx={{ color: isDisabled ? 'error.main' : 'success.main' }}
                    >
                      {isDisabled ? <BlockIcon fontSize="inherit" /> : <CheckCircleIcon fontSize="inherit" />}
                    </IconButton>
                  </Tooltip>
                  {fileUrl && (
                    <Tooltip title="Ouvrir le fichier dans un nouvel onglet">
                      <IconButton
                        size="small"
                        onClick={() => window.open(fileUrl, '_blank', 'noopener,noreferrer')}
                      >
                        <OpenInNewIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            );
          })()}

          {/* Fichier - Drag & Drop */}
          <FileUploader
            fileType="all"
            onFileSelect={(file) => setNewFile(file)}
            onFileRemove={() => setNewFile(null)}
            selectedFile={newFile}
            maxFileSize={50 * 1024 * 1024}
            rejectedFile={rejectedFile}
            onFileReject={(file, errors) => setRejectedFile(file)}
            onRejectedFileRemove={() => setRejectedFile(null)}
          />

          <Button variant="contained" fullWidth onClick={handleUpdate}>
            Mettre à jour
          </Button>

          {errorUpdateActivity && <ErrorMessage message={errorUpdateActivity} />}
          {warningUpdateActivity && <WarningMessage message={warningUpdateActivity} />}
          {successMessageUpdateActivity && (
            <>
              <SuccessMessage message={successMessageUpdateActivity} />{' '}
              {successMessageUploadFileName && (
                <Typography component="span" color="warning.main">{successMessageUploadFileName}</Typography>
              )}
            </>
          )}
      </Box>
    </>
  );
};
 