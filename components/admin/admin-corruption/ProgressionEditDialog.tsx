// /components/admin/admin-corruption/ProgressionEditDialog.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Course } from '@/lib/dataTemplate';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { IconPicker } from '@/components/ui/icon-picker';
import { ColorPicker } from '@/components/ui/color-picker';
import { Description, PictureAsPdf, VideoLibrary, PhotoCamera } from '@mui/icons-material';
import { SmartFileUploader } from '@/components/ui/smart-file-uploader';
import { ImagePreview } from '@/components/ui/image-preview';
import { PDFViewer } from '@/components/ui/pdf-viewer';

// Define types for state objects to resolve implicit 'any' types
type EditProgressionContent = {
  title: string;
  content: string;
  icon: string;
  iconColor: string;
  contentType: string;
  resourceUrl: string;
  imageSize: number;
  linkedActivityId: string;
  linkedCourseId: string;
};

type PresetCache = {
  [key: string]: {
    resourceUrl: string;
    title: string;
    content: string;
  };
};

interface ProgressionState {
  selectedClasseForProgression: string;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (value: boolean) => void;
  editingProgression: any; // Replace with proper type if available
  setEditingProgression: (value: any) => void;
  editContentPreset: string;
  setEditContentPreset: (value: string) => void;
  editProgressionContent: EditProgressionContent;
  setEditProgressionContent: React.Dispatch<React.SetStateAction<EditProgressionContent>>;
  editSelectedFile: File | null;
  setEditSelectedFile: (value: File | null) => void;
  editFilePreview: string | null;
  setEditFilePreview: (value: string | null) => void;
  editRejectedFile: File | null;
  setEditRejectedFile: (value: File | null) => void;
  editUploadingFile: boolean;
  setEditUploadingFile: (value: boolean) => void;
  editUploadProgress: number;
  setEditUploadProgress: (value: number) => void;
  editSelectedCourseForProgression: string;
  setEditSelectedCourseForProgression: (value: string) => void;
  editSelectedActivityForProgression: string;
  setEditSelectedActivityForProgression: (value: string) => void;
  editPresetCache: PresetCache;
  setEditPresetCache: React.Dispatch<React.SetStateAction<PresetCache>>;
  setProgressions: (value: any) => void;
  setSuccessMessageProgression: (value: string) => void;
  setErrorProgression: (value: string) => void;
  setProgressionContent: (value: EditProgressionContent) => void;
}

interface ProgressionEditDialogProps {
  courses: Course[];
  progressionState: ProgressionState;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

export const ProgressionEditDialog: React.FC<ProgressionEditDialogProps> = ({
  courses,
  progressionState,
  showSnackbar,
}) => {
  const {
    selectedClasseForProgression,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingProgression,
    setEditingProgression,
    editContentPreset,
    setEditContentPreset,
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
    setEditPresetCache,
    setProgressions,
    setSuccessMessageProgression,
    setErrorProgression,
    setProgressionContent
  } = progressionState;
 
  // Fonction pour sauvegarder les modifications
  const handleUpdateProgression = async () => {
    if (!editingProgression || !editProgressionContent.title) {
      setErrorProgression('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const payload: any = { ...editProgressionContent };
      if (editContentPreset === 'existing-activity') {
        // include activityId to attach or null to detach
        payload.activityId = editSelectedActivityForProgression && editSelectedActivityForProgression !== 'none'
          ? editSelectedActivityForProgression
          : null;
      }
      const response = await fetch(`/api/progressions/${editingProgression.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccessMessageProgression('Progression mise à jour avec succès');
        setErrorProgression('');
        loadProgressions(selectedClasseForProgression);
        setIsEditDialogOpen(false);
        setEditingProgression(null);
        // Réinitialiser le formulaire
        setProgressionContent({
          title: '',
          content: '',
          icon: 'none',
          iconColor: '#3f51b5',
          contentType: 'text',
          resourceUrl: '',
          imageSize: 60,
          linkedActivityId: '',
          linkedCourseId: ''
        });
      } else {
        setErrorProgression('Erreur lors de la mise à jour de la progression');
      }
    } catch (error) {
      setErrorProgression('Erreur serveur');
    }
  };

  // Load progressions function
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

  // Handlers séparés pour le dialog d'édition
  const handleEditFileSelect = (file: File) => {
    setEditSelectedFile(file);
    setEditRejectedFile(null);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setEditFilePreview(null);
    }
  };

  const handleEditFileReject = (file: File) => {
    setEditRejectedFile(file);
    setEditSelectedFile(null);
    setEditFilePreview(null);
  };

  const handleEditFileRemove = () => {
    setEditSelectedFile(null);
    setEditFilePreview(null);
    setEditRejectedFile(null);
    setEditProgressionContent(prev => ({ ...prev, resourceUrl: '' }));
  };

  const handleEditFileUpload = async () => {
    if (!editSelectedFile || !editingProgression) return;

    setEditUploadingFile(true);
    setEditUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('file', editSelectedFile);
      formData.append('classeId', editingProgression.classeId);
      formData.append('fileType', editContentPreset);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/progressions/upload');
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setEditUploadProgress(percent);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              setEditProgressionContent(prev => ({ ...prev, resourceUrl: data.fileUrl }));
              setSuccessMessageProgression('Fichier uploadé avec succès');
              setEditSelectedFile(null);
              setEditFilePreview(null);
              setEditUploadProgress(0);
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
      setEditUploadingFile(false);
    }
  };

  // Fonction pour réinitialiser le dialog
  const resetDialog = () => {
    setProgressionContent({
      title: '',
      content: '',
      icon: 'none',
      iconColor: '#3f51b5',
      contentType: 'text',
      resourceUrl: '',
      imageSize: 60,
      linkedActivityId: '',
      linkedCourseId: ''
    });
  };

  return (
    <Dialog modal={false} open={isEditDialogOpen} onOpenChange={(open) => {
      setIsEditDialogOpen(open);
      if (!open) {
        resetDialog();
      }
    }}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la progression</DialogTitle>
          <DialogDescription>
            Modifiez les détails de votre progression de cours
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {/* Presets de type de contenu */}
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={editContentPreset === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                // cache current preset values
                setEditPresetCache(prev => ({
                  ...prev,
                  [editContentPreset]: { resourceUrl: editProgressionContent.resourceUrl, title: editProgressionContent.title, content: editProgressionContent.content }
                }));
                setEditContentPreset('text');
                setEditProgressionContent(prev => ({
                  ...prev,
                  contentType: 'text',
                  // restore cached values if any
                  resourceUrl: editPresetCache.text.resourceUrl || '',
                  title: editPresetCache.text.title || prev.title,
                  content: editPresetCache.text.content || prev.content
                }));
                handleEditFileRemove();
              }}
            >
              <Description className="mr-2 h-4 w-4" />
              Texte
            </Button>
            <Button
              type="button"
              variant={editContentPreset === 'video' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setEditPresetCache(prev => ({
                  ...prev,
                  [editContentPreset]: { 
                    resourceUrl: editProgressionContent.resourceUrl, 
                    title: editProgressionContent.title, 
                    content: editProgressionContent.content }
                }));
                setEditContentPreset('video');
                setEditProgressionContent(prev => ({
                  ...prev,
                  contentType: 'video',
                  resourceUrl: editPresetCache.video.resourceUrl || '',
                  title: editPresetCache.video.title || prev.title,
                  content: editPresetCache.video.content || prev.content
                }));
                handleEditFileRemove();
              }}
            >
              <VideoLibrary className="mr-2 h-4 w-4" />
              Vidéo
            </Button>
            <Button
              type="button"
              variant={editContentPreset === 'image' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setEditPresetCache(prev => ({
                  ...prev,
                  [editContentPreset]: { 
                    resourceUrl: editProgressionContent.resourceUrl, 
                    title: editProgressionContent.title, 
                    content: editProgressionContent.content }
                }));
                setEditContentPreset('image');
                setEditProgressionContent(prev => ({
                  ...prev,
                  contentType: 'image',
                  resourceUrl: editPresetCache.image.resourceUrl || ''
                }));
                setEditSelectedFile(null);
                setEditFilePreview(null);
              }}
            >
              <PhotoCamera className="mr-2 h-4 w-4" />
              Image
            </Button>
            <Button
              type="button"
              variant={editContentPreset === 'pdf' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setEditPresetCache(prev => ({
                  ...prev,
                  [editContentPreset]: { resourceUrl: editProgressionContent.resourceUrl, title: editProgressionContent.title, content: editProgressionContent.content }
                }));
                setEditContentPreset('pdf');
                setEditProgressionContent(prev => ({
                  ...prev,
                  contentType: 'pdf',
                  resourceUrl: editPresetCache.pdf.resourceUrl || ''
                }));
                setEditSelectedFile(null);
                setEditFilePreview(null);
              }}
            >
              <PictureAsPdf className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button
              type="button"
              variant={editContentPreset === 'existing-activity' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setEditPresetCache(prev => ({
                  ...prev,
                  [editContentPreset]: { resourceUrl: editProgressionContent.resourceUrl, title: editProgressionContent.title, content: editProgressionContent.content }
                }));
                setEditContentPreset('existing-activity');
                setEditSelectedCourseForProgression('all');
                setEditSelectedActivityForProgression('none');
                setEditProgressionContent(prev => ({
                  ...prev,
                  contentType: 'activity' as any,
                  resourceUrl: ''
                }));
                handleEditFileRemove();
              }}
            >
              Activité existante
            </Button>
          </div>

          {/* Titre */}
          <Input
            type="text"
            placeholder="Titre"
            value={editProgressionContent.title}
            onChange={(e) => setEditProgressionContent(prev => ({ ...prev, title: e.target.value }))}
          />

          {/* Gestion des fichiers pour image et PDF */}
          {editContentPreset === 'image' && (
            <div className="space-y-4">
              <label className="text-sm font-medium">Image</label>
              {editSelectedFile && editFilePreview ? (
                <ImagePreview
                  src={editFilePreview}
                  alt="Preview"
                  filename={editSelectedFile.name}
                  onRemove={handleEditFileRemove}
                  initialImageSize={editProgressionContent.imageSize}
                  onImageSizeChange={(size) => setEditProgressionContent(prev => ({ ...prev, imageSize: size }))}
                />
              ) : editProgressionContent.resourceUrl ? (
                <ImagePreview
                  src={editProgressionContent.resourceUrl}
                  alt="Current image"
                  onRemove={() => setEditProgressionContent(prev => ({ ...prev, resourceUrl: '' }))}
                  initialImageSize={editProgressionContent.imageSize}
                  onImageSizeChange={(size) => setEditProgressionContent(prev => ({ ...prev, imageSize: size }))}
                />
              ) : (
                <SmartFileUploader
                  onFileSelect={handleEditFileSelect}
                  onFileReject={handleEditFileReject}
                  fileType="image"
                  className="border-blue-200 bg-blue-50"
                  existingFileUrl={editProgressionContent.resourceUrl}
                />
              )}
              {editUploadingFile && <Progress value={editUploadProgress} />}
              {editSelectedFile && !editProgressionContent.resourceUrl && (
                <Button 
                  onClick={handleEditFileUpload} 
                  disabled={editUploadingFile || !!editProgressionContent.resourceUrl}
                  className={editProgressionContent.resourceUrl ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {editUploadingFile ? 'Upload en cours...' : 'Uploader l\'image'}
                </Button>
              )}
            </div>
          )}

          {editContentPreset === 'pdf' && (
            <div className="space-y-4">
              <label className="text-sm font-medium">Document PDF</label>
              {editSelectedFile ? (
                <PDFViewer
                  src={URL.createObjectURL(editSelectedFile)}
                  filename={editSelectedFile.name}
                  onRemove={handleEditFileRemove}
                  showControls={false}
                />
              ) : editProgressionContent.resourceUrl ? (
                <PDFViewer
                  src={editProgressionContent.resourceUrl}
                  filename="Document actuel"
                  onRemove={() => setEditProgressionContent(prev => ({ ...prev, resourceUrl: '' }))}
                  isEmbedded={true}
                />
              ) : (
                <SmartFileUploader
                  onFileSelect={handleEditFileSelect}
                  onFileReject={handleEditFileReject}
                  fileType="pdf"
                  className="border-red-200 bg-red-50"
                  existingFileUrl={editProgressionContent.resourceUrl}
                />
              )}
              {editUploadingFile && <Progress value={editUploadProgress} />}
              {editSelectedFile && !editProgressionContent.resourceUrl && (
                <Button 
                  onClick={handleEditFileUpload} 
                  disabled={editUploadingFile || !!editProgressionContent.resourceUrl}
                  className={editProgressionContent.resourceUrl ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {editUploadingFile ? 'Upload en cours...' : 'Uploader le PDF'}
                </Button>
              )}
            </div>
          )}

          {/* URL de ressource pour vidéo ou si pas de fichier uploadé */}
          {(editContentPreset === 'video' || 
            ((editContentPreset === 'image' || editContentPreset === 'pdf') && !editSelectedFile && !editProgressionContent.resourceUrl)
          ) && (
            <Input
              type="url"
              placeholder={`URL ${editContentPreset === 'video' ? 'de la vidéo' : editContentPreset === 'image' ? 'de l\'image' : 'du PDF'}`}
              value={editProgressionContent.resourceUrl}
              onChange={(e) => setEditProgressionContent(prev => ({ ...prev, resourceUrl: e.target.value }))}
            />
          )}

          {/* Activité existante - attacher/détacher une activité à cette progression */}
          {editContentPreset === 'existing-activity' && (
            <div className="space-y-4 border-t pt-4">
              <h5 className="text-sm font-medium">Associer une activité existante</h5>

              {/* Sélection du cours */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Cours</label>
                <Select
                  value={editSelectedCourseForProgression}
                  onValueChange={(value) => {
                    setEditSelectedCourseForProgression(value);
                    setEditSelectedActivityForProgression('none');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un cours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les cours</SelectItem>
                    {courses
                      .filter(course => course.theClasseId === (editingProgression?.classeId || selectedClasseForProgression))
                      .map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sélection de l'activité */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Activité</label>
                <Select
                  value={editSelectedActivityForProgression}
                  onValueChange={(value) => {
                    setEditSelectedActivityForProgression(value);
                    if (value === 'none') return;
                    const filteredCourses = (editSelectedCourseForProgression && editSelectedCourseForProgression !== 'all')
                      ? courses.filter(c => c.id === editSelectedCourseForProgression)
                      : courses.filter(c => c.theClasseId === (editingProgression?.classeId || selectedClasseForProgression));
                    const withCourse = filteredCourses.flatMap(course => (course.activities || []).map(a => ({ a, course })));
                    const found = withCourse.find(x => x.a && x.a.id === value);
                    if (found) {
                      setEditProgressionContent(prev => ({
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
                      const filteredCourses = (editSelectedCourseForProgression && editSelectedCourseForProgression !== 'all')
                        ? courses.filter(c => c.id === editSelectedCourseForProgression)
                        : courses.filter(c => c.theClasseId === (editingProgression?.classeId || selectedClasseForProgression));
                      return filteredCourses
                        .flatMap(course => (course.activities || []).map(activity => ({
                          ...activity,
                          courseName: course.title
                        })))
                        .filter(activity => activity && activity.id && activity.id.trim() !== '')
                        .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
                        .map((activity) => (
                          <SelectItem key={activity.id} value={activity.id}>
                            {activity.title}
                          </SelectItem>
                        ));
                    })()}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Éditeur de texte enrichi */}
          <div className="border rounded-lg p-2">
            <RichTextEditor
              value={editProgressionContent.content}
              onChange={(value) => setEditProgressionContent(prev => ({ ...prev, content: value }))}
              placeholder="Contenu de la progression..."
            />
          </div>

          {/* Sélection d'icône et couleur */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Icône</label>
              <IconPicker
                value={editProgressionContent.icon}
                onChange={(icon) => {
                  setEditProgressionContent(prev => ({ ...prev, icon }));
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Couleur de l&apos;icône</label>
              <ColorPicker
                value={editProgressionContent.iconColor}
                onChange={(color) => setEditProgressionContent(prev => ({ ...prev, iconColor: color }))}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleUpdateProgression} className="flex-1">
              Mettre à jour la progression
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
