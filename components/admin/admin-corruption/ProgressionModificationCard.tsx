// /components/admin/admin-corruption/ProgressionModificationCard.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { SuccessMessage, ErrorMessage } from '@/components/message-display';
import { Course, Classe } from '@/lib/dataTemplate';
import { SortableProgression } from '@/components/admin/SortableProgression';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Switch from '@mui/material/Switch';
import { Box, Typography, FormLabel, List, ListItem, IconButton, Tooltip } from '@mui/material';
import { Calendar } from '@/components/ui/calendar';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { IconPicker } from '@/components/ui/icon-picker';
import { ColorPicker } from '@/components/ui/color-picker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Description, PictureAsPdf, VideoLibrary, PhotoCamera } from '@mui/icons-material';
import { SmartFileUploader } from '@/components/ui/smart-file-uploader';
import { ImagePreview } from '@/components/ui/image-preview';
import { PDFViewer } from '@/components/ui/pdf-viewer';
import { ProgressionContent } from './types';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';


interface Progression {
  id: string;
  date: string;
  title: string;
  content: string;
  icon?: string;
  iconColor?: string;
  contentType: string;
  resourceUrl?: string;
  imageSize?: number;
  activityId?: string;
}

interface ProgressionModificationCardProps {
  courses: Course[];
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
  showSnackbar: (message: React.ReactNode, severity?: 'success' | 'error' | 'info' | 'warning') => void;
  progressionState: {
    selectedClasseForProgression: string;
    setSelectedClasseForProgression: React.Dispatch<React.SetStateAction<string>>;
    selectedDate: Date | undefined;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    showAllProgressions: boolean;
    setShowAllProgressions: React.Dispatch<React.SetStateAction<boolean>>;
    progressionContent: ProgressionContent;
    setProgressionContent: React.Dispatch<React.SetStateAction<ProgressionContent>>;
    selectedCourseForProgression: string;
    setSelectedCourseForProgression: React.Dispatch<React.SetStateAction<string>>;
    selectedActivityForProgression: string;
    setSelectedActivityForProgression: React.Dispatch<React.SetStateAction<string>>;
    contentPreset: string;
    setContentPreset: React.Dispatch<React.SetStateAction<string>>;
    progressions: Progression[];
    setProgressions: React.Dispatch<React.SetStateAction<Progression[]>>;
    successMessageProgression: string;
    setSuccessMessageProgression: React.Dispatch<React.SetStateAction<string>>;
    errorProgression: string;
    setErrorProgression: React.Dispatch<React.SetStateAction<string>>;
    setIsDeleteAllModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setProgressionsToDelete: React.Dispatch<React.SetStateAction<Progression[]>>;
    setEditingProgression: React.Dispatch<React.SetStateAction<Progression | null>>;
    setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setEditProgressionContent: React.Dispatch<React.SetStateAction<ProgressionContent>>;
    setEditContentPreset: (value: string) => void;
    setEditSelectedCourseForProgression: React.Dispatch<React.SetStateAction<string>>;
    setEditSelectedActivityForProgression: React.Dispatch<React.SetStateAction<string>>;
    setEditPresetCache: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    filePreview: string | null;
    setFilePreview: React.Dispatch<React.SetStateAction<string | null>>;
    uploadingFile: boolean;
    setUploadingFile: React.Dispatch<React.SetStateAction<boolean>>;
    uploadProgress: number;
    setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
    rejectedFile: File | null;
    setRejectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  };
}

export const ProgressionModificationCard: React.FC<ProgressionModificationCardProps> = ({
  courses,
  classes,
  setClasses,
  showSnackbar,
  progressionState
}) => {
  const {
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
    setIsDeleteAllModalOpen,
    setProgressionsToDelete,
    setEditingProgression,
    setIsEditDialogOpen,
    setEditProgressionContent,
    setEditContentPreset,
    setEditSelectedCourseForProgression,
    setEditSelectedActivityForProgression,
    setEditPresetCache,
    selectedFile,
    setSelectedFile,
    filePreview,
    setFilePreview,
    uploadingFile,
    setUploadingFile,
    rejectedFile,
    setRejectedFile,
    uploadProgress,
    setUploadProgress
  } = progressionState;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fonctions pour la gestion des progressions
  const loadProgressions = async (classeId: string) => {
    try {
      const response = await fetch(`/api/progressions?classeId=${classeId}`);
      if (response.ok) {
        const data = await response.json();
        setProgressions(data.progressions);
      }
    } catch (error) {
      console.error('Error loading progressions:', error);
    }
  };

  const handleSaveProgression = async () => {
    if (!selectedClasseForProgression || !selectedDate || !progressionContent.title) {
      setErrorProgression('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const response = await fetch('/api/progressions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classeId: selectedClasseForProgression,
          date: selectedDate.toISOString(),
          ...progressionContent,
          ...(contentPreset === 'existing-activity' && selectedActivityForProgression !== 'none'
            ? { activityId: selectedActivityForProgression }
            : {})
        }),
      });

      if (response.ok) {
        setSuccessMessageProgression('Progression ajoutée avec succès');
        setErrorProgression('');
        // Recharger les progressions
        loadProgressions(selectedClasseForProgression);
        // Réinitialiser le formulaire
        setProgressionContent({
          title: '',
          content: '',
          icon: 'calendar',
          iconColor: '#3f51b5',
          contentType: 'text',
          resourceUrl: '',
          imageSize: 60,
          linkedActivityId: '',
          linkedCourseId: ''
        });
        setSelectedFile(null);
        setFilePreview(null);
        setContentPreset('text');
        setSelectedCourseForProgression('all');
        setSelectedActivityForProgression('none');
      } else {
        setErrorProgression('Erreur lors de l\'ajout de la progression');
      }
    } catch (error) {
      setErrorProgression('Erreur serveur');
    }
  };

  // Fonctions pour gérer le drag & drop des progressions
  const handleDragEndProgression = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = progressions.findIndex(p => p.id === active.id);
      const newIndex = progressions.findIndex(p => p.id === over?.id);

      const newProgressions = [...progressions];
      const [movedItem] = newProgressions.splice(oldIndex, 1);
      newProgressions.splice(newIndex, 0, movedItem);
      setProgressions(newProgressions);

      // Mise à jour de l'ordre en base de données
      try {
        const response = await fetch('/api/progressions/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            progressions: newProgressions.map((p, index) => ({ 
              id: p.id, 
              order: index 
            })) 
          })
        });

        if (response.ok) {
          showSnackbar('Ordre des progressions mis à jour', 'success');
        }
      } catch (error) {
        console.error('Error reordering progressions:', error);
        // Revenir à l'ordre précédent en cas d'erreur
        loadProgressions(selectedClasseForProgression);
      }
    }
  };

  // Fonction pour éditer une progression
  const handleEditProgression = (progression: any) => {
    setEditingProgression(progression);
    // Isoler l'état du dialog
    // Try to preselect the course containing this activity (for linkedCourseId)
    const foundCourse = courses.find((c) => (c.activities || []).some((a) => a && a.id === progression.activityId));
    setEditProgressionContent({
      title: progression.title,
      content: progression.content,
      icon: progression.icon, // Keep null if no icon
      iconColor: progression.iconColor || '#3f51b5',
      contentType: progression.contentType,
      resourceUrl: progression.resourceUrl || '',
      imageSize: progression.imageSize || 60,
      linkedActivityId: progression.activityId || '',
      linkedCourseId: foundCourse?.id || ''
    });
    // If this progression is linked to an activity, switch edit preset accordingly
    if (progression.activityId) {
      setEditContentPreset('existing-activity');
      setEditSelectedActivityForProgression(progression.activityId);
      // Try to preselect the course containing this activity
      setEditSelectedCourseForProgression(foundCourse?.id || 'all');
    } else {
      setEditContentPreset(progression.contentType);
      setEditSelectedActivityForProgression('none');
      setEditSelectedCourseForProgression('all');
    }
    setIsEditDialogOpen(true);

    // Initialize cache for current progression types
    setEditPresetCache(prev => ({
      ...prev,
      [progression.contentType as 'text'|'video'|'image'|'pdf']:
        { resourceUrl: progression.resourceUrl || '', title: progression.title, content: progression.content }
    }));
  };

  // Fonctions de gestion des fichiers
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setRejectedFile(null); // Réinitialiser le fichier rejeté
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleFileReject = (file: File) => {
    setRejectedFile(file);
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleRejectedFileRemove = () => {
    setRejectedFile(null);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setRejectedFile(null);
    setProgressionContent(prev => ({ ...prev, resourceUrl: '' }));
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedClasseForProgression) return;

    setUploadingFile(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('classeId', selectedClasseForProgression);
      formData.append('fileType', contentPreset);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/progressions/upload');
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percent);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              setProgressionContent(prev => ({ ...prev, resourceUrl: data.fileUrl }));
              setSuccessMessageProgression('Fichier uploadé avec succès');
              // Nettoyage
              setSelectedFile(null);
              setFilePreview(null);
              setUploadProgress(0);
              resolve();
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error(`HTTP ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
      });
    } catch (error) {
      setErrorProgression('Erreur serveur lors de l\'upload');
    } finally {
      setUploadingFile(false);
    }
  };

  // Fonction pour réinitialiser le dialog
  const resetDialog = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setRejectedFile(null);
    setContentPreset('text');
    setProgressionContent({
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
  };

  return (
    <Card className="p-4 mt-4" defaultExpanded={false} title="Modifier une progression">
    <Box sx={{ '& > * + *': { mt: 3 }, position: 'relative' }}>

      {/* Sélection de la classe */}
      <Select 
        value={selectedClasseForProgression} 
        onValueChange={(value) => {
        setSelectedClasseForProgression(value);
        loadProgressions(value);
        }}
      >
        <SelectTrigger>
        <SelectValue placeholder="Sélectionner une classe" />
        </SelectTrigger>
        <SelectContent>
        {classes && Array.isArray(classes) ? (
          classes.map((classe) => (
            <SelectItem key={classe.id} value={classe.id}>
            {classe.name}
            </SelectItem>
          ))
        ) : null}
        </SelectContent>
      </Select>

      {/* Activer/Désactiver la progression pour cette classe */}
      {selectedClasseForProgression && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }}>
        <Switch
          checked={classes.find(c => c.id === selectedClasseForProgression)?.hasProgression || false}
          onChange={async (e) => {
            console.log('Switch clicked, new value:', e.target.checked);
            console.log('Selected class:', selectedClasseForProgression);
            console.log('Current classes:', classes);
            console.log('Current class hasProgression:', classes.find(c => c.id === selectedClasseForProgression)?.hasProgression);
            
            try {
            const response = await fetch(`/api/classes/${selectedClasseForProgression}/progression`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ hasProgression: e.target.checked })
            });
            
            if (response.ok) {
              const data = await response.json();
              console.log('API response data:', data);
              setClasses(data.classes);
              
              // Force refresh des données
              const fetchRes = await fetch('/api/courses');
              const freshData = await fetchRes.json();
              console.log('Fresh data from /api/courses:', freshData);
              setClasses(freshData.classes);
              
              showSnackbar('Statut de progression mis à jour', 'success');
            } else {
              console.error('API response error:', response.status, response.statusText);
              showSnackbar('Erreur lors de la mise à jour', 'error');
            }
            } catch (error) {
            console.error('Error:', error);
            showSnackbar('Erreur serveur', 'error');
            }
          }}
        />
        <FormLabel>Activer la progression pour cette classe</FormLabel>
      {/* Icon button for redirect */}
    <Tooltip title="Page de la classe">
      <IconButton
        sx={{ position: 'absolute', top: 0, right: 0 }}
        onClick={() => {
        if (selectedClasseForProgression) {
        window.open(`/classes/${selectedClasseForProgression}`, '_blank');
        }
        }}
        disabled={!selectedClasseForProgression}
      >
        <OpenInNewIcon color='primary' />
      </IconButton>
    </Tooltip>
        </Box>
      )}

      {/* Calendrier */}
      {selectedClasseForProgression && (
        <Box sx={{ border: 1, borderRadius: 2, p: 2 }}>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            // Activer automatiquement le filtrage par date si une date est sélectionnée
            if (date) {
            setShowAllProgressions(false);
            }
          }}
          locale={fr}
          className="rounded-md border"
        />
        </Box>
      )}

      {/* Formulaire de contenu si une date est sélectionnée */}
      {selectedDate && (
        <Box sx={{ '& > * + *': { mt: 2 }, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Ajouter du contenu pour le {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
        </Typography>

        {/* Presets de type de contenu */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            type="button"
            variant={contentPreset === 'text' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
            setContentPreset('text');
            setProgressionContent(prev => ({
              ...prev,
              contentType: 'text',
              title: '📝 Note du jour'
            }));
            handleFileRemove();
            }}
          >
            <Description className="mr-2 h-4 w-4" />
            Texte
          </Button>
          <Button
            type="button"
            variant={contentPreset === 'video' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
            setContentPreset('video');
            setProgressionContent(prev => ({
              ...prev,
              contentType: 'video',
              title: 'Vidéo du jour'
            }));
            handleFileRemove();
            }}
          >
            <VideoLibrary className="mr-2 h-4 w-4" />
            Vidéo
          </Button>
          <Button
            type="button"
            variant={contentPreset === 'image' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
            setContentPreset('image');
            setProgressionContent(prev => ({
              ...prev,
              contentType: 'image',
              title: 'Image du jour',
              resourceUrl: ''
            }));
            setSelectedFile(null);
            setFilePreview(null);
            }}
          >
            <PhotoCamera className="mr-2 h-4 w-4" />
            Image
          </Button>
          <Button
            type="button"
            variant={contentPreset === 'pdf' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
            setContentPreset('pdf');
            setProgressionContent(prev => ({
              ...prev,
              contentType: 'pdf',
              title: 'Document PDF',
              resourceUrl: ''
            }));
            setSelectedFile(null);
            setFilePreview(null);
            }}
          >
            <PictureAsPdf className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button
            type="button"
            variant={contentPreset === 'existing-activity' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
            setContentPreset('existing-activity' as any);
            setSelectedActivityForProgression('none');
            setSelectedCourseForProgression('all');
            // Clear file/url fields when switching to existing activity
            setSelectedFile(null);
            setFilePreview(null);
            setProgressionContent(prev => ({
              ...prev,
              contentType: 'activity',
              resourceUrl: ''
            }));
            }}
          >
            Activité existante
          </Button>
        </Box>

        {/* Titre */}
        <Input
          type="text"
          placeholder="Titre"
          value={progressionContent.title}
          onChange={(e) => setProgressionContent(prev => ({ ...prev, title: e.target.value }))}
        />

        {/* Gestion des fichiers pour image et PDF */}
        {contentPreset === 'image' && (
          <Box sx={{ '& > * + *': { mt: 2 } }}>
            <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Image</FormLabel>
            {selectedFile && filePreview ? (
            <ImagePreview
              src={filePreview}
              alt="Preview"
              filename={selectedFile.name}
              onRemove={handleFileRemove}
              initialImageSize={progressionContent.imageSize}
              onImageSizeChange={(size) => setProgressionContent(prev => ({ ...prev, imageSize: size }))}
            />
            ) : progressionContent.resourceUrl ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <ImagePreview
                src={progressionContent.resourceUrl}
                alt="Current image"
                onRemove={() => setProgressionContent(prev => ({ ...prev, resourceUrl: '' }))}
                initialImageSize={progressionContent.imageSize}
                onImageSizeChange={(size) => setProgressionContent(prev => ({ ...prev, imageSize: size }))}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Ou ajoutez une nouvelle image :</Typography>
              <SmartFileUploader
                onFileSelect={handleFileSelect}
                onFileReject={handleFileReject}
                fileType="image"
                className="border-blue-200 bg-blue-50"
                existingFileUrl={progressionContent.resourceUrl}
              />
            </Box>
            ) : (
            <SmartFileUploader
              onFileSelect={handleFileSelect}
              onFileReject={handleFileReject}
              fileType="image"
              className="border-blue-200 bg-blue-50"
              existingFileUrl={progressionContent.resourceUrl}
            />
            )}
            {uploadingFile && <Progress value={uploadProgress} />}
            {selectedFile && (
            <Button onClick={handleFileUpload} disabled={uploadingFile} className="w-full">
              {uploadingFile ? 'Upload en cours...' : 'Uploader l\'image'}
            </Button>
            )}
          </Box>
        )}

        {contentPreset === 'pdf' && (
          <Box sx={{ '& > * + *': { mt: 2 } }}>
            <FormLabel component="legend">Document PDF</FormLabel>
            {selectedFile ? (
            <PDFViewer
              src={URL.createObjectURL(selectedFile)}
              filename={selectedFile.name}
              onRemove={handleFileRemove}
              showControls={false}
            />
            ) : progressionContent.resourceUrl ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <PDFViewer
                src={progressionContent.resourceUrl}
                filename="Document actuel"
                onRemove={() => setProgressionContent(prev => ({ ...prev, resourceUrl: '' }))}
                isEmbedded={true}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Ou ajoutez un nouveau PDF :</Typography>
              <SmartFileUploader
                onFileSelect={handleFileSelect}
                onFileReject={handleFileReject}
                fileType="pdf"
                className="border-red-200 bg-red-50"
                existingFileUrl={progressionContent.resourceUrl}
              />
            </Box>
            ) : (
            <SmartFileUploader
              onFileSelect={handleFileSelect}
              onFileReject={handleFileReject}
              fileType="pdf"
              className="border-red-200 bg-red-50"
              existingFileUrl={progressionContent.resourceUrl}
            />
            )}
            {uploadingFile && <Progress value={uploadProgress} />}
            {selectedFile && (
            <Button onClick={handleFileUpload} disabled={uploadingFile} className="w-full">
              {uploadingFile ? 'Upload en cours...' : 'Uploader le PDF'}
            </Button>
            )}
          </Box>
        )}

        {/* URL de ressource pour vidéo ou comme alternative pour image/PDF */}
        {(contentPreset === 'video' || 
          ((contentPreset === 'image' || contentPreset === 'pdf') && !selectedFile)
        ) && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {contentPreset !== 'video' && (
            <FormLabel sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              Ou utilisez une URL externe :
            </FormLabel>
            )}
            <Input
            type="url"
            placeholder={`URL ${contentPreset === 'video' ? 'de la vidéo' : contentPreset === 'image' ? 'de l\'image' : 'du PDF'}`}
            value={progressionContent.resourceUrl}
            onChange={(e) => setProgressionContent(prev => ({ ...prev, resourceUrl: e.target.value }))}
            />
          </Box>
        )}

        {/* Éditeur de texte enrichi */}
        <Box sx={{ border: 1, borderRadius: 1, p: 1 }}>
          <RichTextEditor
            value={progressionContent.content}
            onChange={(value) => setProgressionContent(prev => ({ ...prev, content: value }))}
            placeholder="Contenu de la progression..."
          />
        </Box>

        {/* Activité existante - crée une progression dédiée */}
        {contentPreset === 'existing-activity' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, borderTop: 1, borderColor: 'divider', pt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>Associer une activité existante</Typography>
          
            {/* Sélection du cours */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Cours</FormLabel>
            <Select
              value={selectedCourseForProgression}
              onValueChange={(value) => {
                setSelectedCourseForProgression(value);
                setSelectedActivityForProgression('none');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un cours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les cours</SelectItem>
                {courses
                .filter(course => course.theClasseId === selectedClasseForProgression)
                .map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </Box>

            {/* Sélection de l'activité */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Activité</FormLabel>
            <Select
              value={selectedActivityForProgression}
              onValueChange={(value) => {
                setSelectedActivityForProgression(value);
                if (value === 'none') {
                setProgressionContent(prev => ({
                  ...prev,
                  title: prev.title,
                }));
                return;
                }
                const filteredCourses = (selectedCourseForProgression && selectedCourseForProgression !== 'all')
                ? courses.filter(c => c.id === selectedCourseForProgression)
                : courses.filter(c => c.theClasseId === selectedClasseForProgression);
                const withCourse = filteredCourses.flatMap(course => (course.activities || []).map(a => ({ a, course })));
                const found = withCourse.find(x => x.a && x.a.id === value);
                if (found) {
                setProgressionContent(prev => ({
                  ...prev,
                  title: (prev.title && prev.title.trim().length > 0) ? prev.title : (found.a.title || prev.title)
                }));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une activité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune activité</SelectItem>
                {(() => {
                const filteredCourses = (selectedCourseForProgression && selectedCourseForProgression !== 'all')
                  ? courses.filter(c => c.id === selectedCourseForProgression)
                  : courses.filter(c => c.theClasseId === selectedClasseForProgression);
                return filteredCourses
                  .flatMap(course => (course.activities || []).map(activity => ({
                    ...activity,
                    courseName: course.title
                  })))
                  .filter(activity => activity && activity.id && activity.id.trim() !== '')
                  .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
                  .map((activity) => (
                    <SelectItem key={activity.id} value={activity.id}>
                    {activity.title} {(selectedCourseForProgression === 'all') && `(${activity.courseName})`}
                    </SelectItem>
                  ));
                })()}
              </SelectContent>
            </Select>
            </Box>

            <Button
            onClick={handleSaveProgression}
            className="w-full"
            disabled={selectedActivityForProgression === 'none'}
            >
            Ajouter la progression avec l&apos;activité sélectionnée
            </Button>
          </Box>
        )}

        {/* Sélection d'icône et couleur */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Icône</FormLabel>
            <IconPicker
            value={progressionContent.icon}
            onChange={(icon) => {
              setProgressionContent(prev => ({ ...prev, icon }));
            }}
            />
          </Box>
          <Box>
            <FormLabel sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Couleur de l&apos;icône</FormLabel>
            <ColorPicker
            value={progressionContent.iconColor}
            onChange={(color) => setProgressionContent(prev => ({ ...prev, iconColor: color }))}
            />
          </Box>
        </Box>

        <Button onClick={handleSaveProgression} className="w-full">
          Ajouter la progression
        </Button>
        </Box>
      )}

      {/* Liste des progressions existantes */}
      {progressions.length > 0 && (
        <Box sx={{ '& > * + *': { mt: 1 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        {/* <Typography variant="h5" sx={{ fontWeight: 600 }}>Progressions existantes</Typography> */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, width: '100%' }}>
            {selectedDate && !showAllProgressions && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Filtré par : {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
            </Typography>
            )}
            {selectedDate && !showAllProgressions && (() => {
            const filteredProgressions = progressions.filter(p => {
              const progressionDate = new Date(p.date);
              const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
              const progressionDateOnly = new Date(progressionDate.getFullYear(), progressionDate.getMonth(), progressionDate.getDate());
              return selectedDateOnly.getTime() === progressionDateOnly.getTime();
            });
            return filteredProgressions.length > 0 ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                setProgressionsToDelete(filteredProgressions);
                setIsDeleteAllModalOpen(true);
                }}
              >
                Supprimer tout ({filteredProgressions.length})
              </Button>
            ) : null;
            })()}
            <Button
            size="sm"
            variant={showAllProgressions ? 'default' : 'outline'}
            onClick={() => setShowAllProgressions(!showAllProgressions)}
            >
            {showAllProgressions ? 'Filtrer par date' : 'Tout afficher'}
            </Button>
          </Box>
        </Box>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndProgression}
        >
          <SortableContext
            items={
            (showAllProgressions || !selectedDate
              ? progressions
              : progressions.filter(p => {
                const progressionDate = new Date(p.date);
                const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                const progressionDateOnly = new Date(progressionDate.getFullYear(), progressionDate.getMonth(), progressionDate.getDate());
                return selectedDateOnly.getTime() === progressionDateOnly.getTime();
                })
            ).map(p => p.id)
            }
            strategy={verticalListSortingStrategy}
          >
            <List sx={{ maxHeight: 384, overflowY: 'auto', gap: 1 }}>
            {(() => {
              const filteredProgressions = showAllProgressions || !selectedDate
                ? progressions
                : progressions.filter(p => {
                  const progressionDate = new Date(p.date);
                  const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                  const progressionDateOnly = new Date(progressionDate.getFullYear(), progressionDate.getMonth(), progressionDate.getDate());
                  return selectedDateOnly.getTime() === progressionDateOnly.getTime();
                });

              if (filteredProgressions.length === 0 && !showAllProgressions && selectedDate) {
                return (
                <ListItem sx={{ justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    Aucune progression trouvée pour le {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
                  </Typography>
                </ListItem>
                );
              }

              return filteredProgressions.map((progression) => (
              <SortableProgression
                key={progression.id}
                progression={progression}
                onEdit={handleEditProgression}
                onDelete={async (id) => {
                const response = await fetch(`/api/progressions/${id}`, {
                  method: 'DELETE'
                });
                if (response.ok) {
                  loadProgressions(selectedClasseForProgression);
                  showSnackbar('Progression supprimée', 'success');
                }
                }}
              />
              ));
            })()}
            </List>
          </SortableContext>
        </DndContext>
        </Box>
      )}

      {errorProgression && <ErrorMessage message={errorProgression} />}
      {successMessageProgression && <SuccessMessage message={successMessageProgression} />}
    </Box>
    </Card>
  );
};
