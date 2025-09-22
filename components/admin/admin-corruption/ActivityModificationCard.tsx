// /components/admin/admin-corruption/ActivityModificationCard.tsx

import React, { useState } from 'react';
import { BaseCardProps } from './types';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/ui/file-uploader';
import { SuccessMessage, ErrorMessage, WarningMessage } from '@/components/message-display';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

/**
 * ActivityModificationCard
 * Permet de :
 *  - Sélectionner une classe, un cours, puis une activité
 *  - Renommer une activité (titre)
 *  - Remplacer le fichier associé (suppression + upload)
 *  - Actualiser les listes après modification via les setters parent
 */
export const ActivityModificationCard: React.FC<BaseCardProps> = ({
  courses,
  setCourses,
  classes,
  setClasses,
  showSnackbar
}) => {
  // Sélections
  const [selectedClassForActivity, setSelectedClassForActivity] = useState<string>('');
  const [selectedCourseForActivity, setSelectedCourseForActivity] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<string>('');

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

  const updateActivityTitle = async (courseId: string, activityId: string, newTitle: string) => {
    const res = await fetch('/api/updateactivity', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, activityId, newTitle })
    });
    if (!res.ok) throw new Error('Erreur lors de la mise à jour du titre');
    const data = await res.json();
    setCourses(data.courses);
    setClasses(data.classes);
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
      // Remplacement fichier si demandé
      if (fileChanged && newFile) {
        // Supprimer l'ancien fichier
        const deleteRes = await fetch('/api/deletefile', {
          method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileId: activity.id, courseId: course.id })
        });
        if (!deleteRes.ok) throw new Error('Erreur lors de la suppression du fichier');

        // Upload du nouveau fichier avec éventuellement le nouveau titre (ou ancien si pas de changement titre)
        const formData = new FormData();
        formData.append('file', newFile);
        formData.append('courseId', course.id);
        formData.append('ActivityTitle', (titleChanged ? newActivityTitle : activity.title));
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!uploadRes.ok) throw new Error('Erreur lors de l\'upload');
        const uploadData = await uploadRes.json();
        setSuccessMessageUploadFileName(uploadData.fileName || '');
        await refreshData();
      } else if (titleChanged) {
        // Uniquement titre
        await updateActivityTitle(course.id, activity.id, newActivityTitle.trim());
      }

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
    <Card className="p-4 mt-4" defaultExpanded={false} title="Modifier une activité">
      <div className="space-y-6">
        {/* Classe */}
        <Select value={selectedClassForActivity} onValueChange={(v) => { setSelectedClassForActivity(v); setSelectedCourseForActivity(''); setSelectedActivity(''); }}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une classe" />
          </SelectTrigger>
          <SelectContent>
            {classes.sort((a, b) => naturalSort(a.name, b.name)).map(classe => (
              <SelectItem key={classe.id} value={classe.id}>{classe.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Cours */}
        <Select value={selectedCourseForActivity} onValueChange={(v) => { setSelectedCourseForActivity(v); setSelectedActivity(''); }}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un cours" />
          </SelectTrigger>
          <SelectContent>
            {courses
              .filter(course => !selectedClassForActivity || course.theClasseId === selectedClassForActivity)
              .sort((a, b) => naturalSort(a.title, b.title))
              .map(course => (
          <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Activité */}
        <Select value={selectedActivity} onValueChange={setSelectedActivity}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une activité" />
          </SelectTrigger>
          <SelectContent>
            {(() => {
              const filteredCourses = courses.filter(course => !selectedClassForActivity || course.theClasseId === selectedClassForActivity);
              if (selectedCourseForActivity) {
          const chosenCourse = filteredCourses.find(c => c.id === selectedCourseForActivity);
          return chosenCourse?.activities
            .filter(a => a && a.id && a.id.trim() !== '')
            .sort((a, b) => naturalSort(a.title || '', b.title || ''))
            .map(a => <SelectItem key={a.id} value={a.id}>{a.title || 'Sans titre'}</SelectItem>);
              }
              return filteredCourses
          .flatMap(c => c.activities || [])
          .filter(a => a && a.id && a.id.trim() !== '')
          .sort((a, b) => naturalSort(a.title || '', b.title || ''))
          .map(a => <SelectItem key={a.id} value={a.id}>{a.title || 'Sans titre'}</SelectItem>);
            })()}
          </SelectContent>
        </Select>

        {/* Nouveau titre */}
        <Input
          type="text"
          placeholder="Nouveau titre de l'activité"
          value={newActivityTitle}
          onChange={(e) => setNewActivityTitle(e.target.value)}
        />
        {selectedActivity && !newActivityTitle && currentActivityTitle && (() => {
          const selectedActivityObj = courses.flatMap(c => c.activities || []).find(a => a && a.id === selectedActivity);
          const fileUrl = selectedActivityObj?.fileUrl ? `/api/files${selectedActivityObj.fileUrl}` : null;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Titre actuel : {currentActivityTitle}
              </Typography>
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

        <Button className="w-full" onClick={handleUpdate}>
          Mettre à jour
        </Button>
      </div>
      <Box sx={{ mt: 1 }}>
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
    </Card>
  );
};
 