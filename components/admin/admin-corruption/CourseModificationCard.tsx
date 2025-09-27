// /components/admin/admin-corruption/CourseModificationCard.tsx

import React, { useState, useEffect } from 'react';
import { SuccessMessage, ErrorMessage, WarningMessage } from '@/components/message-display';
import { Course, Classe, THEMES } from '@/lib/dataTemplate';
import { SortableFile } from '@/components/admin/SortableFile';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Typography, FormLabel, Accordion, AccordionSummary, AccordionDetails, Button, TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Checkbox, FormControlLabel, Switch } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';

interface CourseModificationCardProps {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
  showSnackbar: (message: string, type: 'success' | 'error' | 'warning') => void;
}

export const CourseModificationCard: React.FC<CourseModificationCardProps> = ({
  courses,
  setCourses,
  classes,
  setClasses,
  showSnackbar
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [courseToDelete, setCourseToDelete] = useState<string>('');
  const [files, setFiles] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<boolean | null>(null);
  const [errorDeleteFile, setErrorDeleteFile] = useState<string>('');
  const [successMessageDeleteFile, setSuccessMessageDeleteFile] = useState<React.ReactNode>(null);
  const [deleteFiles, setDeleteFiles] = useState<boolean>(false);
  const [errorDeleteCourse, setErrorDeleteCourse] = useState<string>('');
  const [ErrorUpdateCourse, setErrorUpdateCourse] = useState<string>('');
  const [successMessageDeleteCourse, setSuccessMessageDeleteCourse] = useState<string>('');
  const [successMessageUpdateCourse, setSuccessMessageUpdateCourse] = useState<string>('');
  const [courseDetails, setCourseDetails] = useState<{ id: string, title: string; description: string; classe: string; theClasseId: string; themeChoice?: number; }>({
    id: '',
    title: '',
    description: '',
    classe: '',
    theClasseId: '',
    themeChoice: 0,
  });
  const [newClasseId, setNewClasseId] = useState<string>('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
  const [currentCourse, setCurrentCourse] = useState<Course[]>([]);
  const [warningUpdateCourse, setWarningUpdateCourse] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  useEffect(() => {
    if (selectedCourse) {
      const updatedCourse = courses.find((course) => course.id === selectedCourse);
      if (updatedCourse) {
        setFiles(updatedCourse.activities.map((activity) => activity.id));
        setCourseDetails({
          id: updatedCourse.id,
          title: updatedCourse.title,
          description: updatedCourse.description,
          classe: updatedCourse.classe,
          theClasseId: updatedCourse.theClasseId,
          themeChoice: updatedCourse.themeChoice ?? 0,
        });
        setNewClasseId(updatedCourse.theClasseId); // Mettre à jour newClasseId
      }
    }
  }, [selectedCourse, courses]);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setErrorDeleteFile('');
    setSuccessMessageDeleteFile('');
    const course = courses.find(course => course.id === courseId);
    if (course) {
      setNewClasseId(course.theClasseId);
      const courseFiles = course.activities.map(activity => activity.id);
      setFiles(courseFiles);
      setCourseDetails({
        id: course.id || '',
        title: course.title || '',
        description: course.description || '',
        classe: course.classe || '',
        theClasseId: course.theClasseId || '',
        themeChoice: course.themeChoice ?? 0,
      });
    }
  };

  useEffect(() => {
    // Trouver le cours correspondant et mettre à jour le cours actuel
    const course = courses.find(course => course.id === selectedCourse);
    if (course) {
      const courseWithFiles = {
        id: course.id,
        files: course.activities.map(activity => activity.id),
      };
      setCurrentCourse([course]);
    }
  }, [selectedCourse, courses]);

  // Add drag end handler:
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // Update files order
      const oldIndex = files.indexOf(active.id as string);
      const newIndex = files.indexOf(over?.id as string);

      const newFiles = [...files];
      newFiles.splice(oldIndex, 1);
      newFiles.splice(newIndex, 0, active.id as string);
      setFiles(newFiles);

      // Get current course and reorder activities
      const currentCourse = courses.find(course => course.id === selectedCourse);
      if (!currentCourse) return;

      const newActivities = newFiles.map(fileId => 
        currentCourse.activities.find(activity => activity.id === fileId)!
      );

      // Update API
      try {
        const response = await fetch('/api/updateActivitiesOrder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: selectedCourse,
            activities: newActivities
          })
        });

        if (!response.ok) throw new Error('Failed to update order');

        const data = await response.json();

        if (response.ok) {
          showSnackbar(`Ordre mis à jour pour le cours ${data.titleOfChosenCourse}`, 'success');
        }

        // Update courses state with new order
                setCourses(
                  courses.map(course =>
                    course.id === selectedCourse
                      ? { ...course, activities: newActivities }
                      : course
                  )
                );

      } catch (error) {
        console.error('Error updating activities order:', error);
        // Revert files order on error
        setFiles(files);
      }
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    const res = await fetch(`/api/deletefile`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId, courseId: selectedCourse }),
    });

    if (res.ok) {
      const data = await res.json();
      setErrorDeleteFile('');
      setSuccessMessageDeleteFile(
        <>Fichier <Typography component="span" color="error">{data.fileUrl}</Typography> supprimé avec succès.</>
      );
      setCourses(data.courses);
      setConfirmDelete(null);
    } else {
      setErrorDeleteFile('Erreur lors de la suppression du fichier.');
      setSuccessMessageDeleteFile('');
    }
  };

  const handleDeleteCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseToDelete) {
      setErrorDeleteCourse('Sélectionnez un cours à supprimer !');
      setSuccessMessageDeleteCourse('');
      return;
    }
    const formerName = courses.find(course => course.id === courseToDelete)?.title

    const res = await fetch(`/api/deletecourse/${courseToDelete}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId: courseToDelete,
        deleteFiles: deleteFiles,
      }),
    });
    
    if (res.ok) {
      const data = await res.json();
      setErrorDeleteCourse(''); // Reset error message
      setSuccessMessageDeleteCourse(`Cours "${formerName}" supprimé avec succès.`);
      setCourses(data.courses);
      setClasses(data.classes);
    } else {
      setErrorDeleteCourse('Erreur lors de la suppression du cours.'); 
      setSuccessMessageDeleteCourse('');
    }
  };

  const handleCourseDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveCourseDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Récupérer le cours original pour comparaison
    const originalCourse = courses.find(c => c.id === selectedCourse);
    
    if (!originalCourse) {
      setErrorUpdateCourse('Course not found');
      setSuccessMessageUpdateCourse('');
      return;
    }
    
    // Vérifier si des modifications ont été effectuées
    const titleChanged = courseDetails.title !== originalCourse.title;
    const descriptionChanged = courseDetails.description !== originalCourse.description;
    const classeChanged = newClasseId !== originalCourse.theClasseId;
    
    // Si rien n'a changé, afficher un avertissement et ne pas envoyer de requête
    if (!titleChanged && !descriptionChanged && !classeChanged) {
      setErrorUpdateCourse('');
      setSuccessMessageUpdateCourse('');
      // Utiliser le state warningUpdateCourse existant, ou en créer un si nécessaire
      setWarningUpdateCourse("Aucune modification détectée. Rien n'a été mis à jour.");
      return;
    }
    
    // Réinitialiser les messages
    setWarningUpdateCourse('');
    
    const res = await fetch(`/api/updatecourse/${selectedCourse}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId: courseDetails.id,
        title: courseDetails.title,
        description: courseDetails.description,
        newClasseId,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setErrorUpdateCourse(''); // Reset error message
      setSuccessMessageUpdateCourse('Cours mis à jour avec succès.');
      setCourses(data.courses);
      setClasses(data.classes);
    } else {
      const data = await res.json();
      setErrorUpdateCourse('Erreur lors de la mise à jour du cours : '+ data.error); 
      setSuccessMessageUpdateCourse('');
    }
  };

  const handleThemeChange = async (themeId: string) => {
    const numericThemeId = Number(themeId);
    
    // Mettre à jour l'état local
    setCourseDetails(prev => ({
      ...prev,
      themeChoice: numericThemeId
    }));
    
    try {
      // Trouver le cours actuel pour afficher son titre dans le toast
      const currentCourse = courses.find(course => course.id === selectedCourse);
      const courseTitle = currentCourse?.title || "sélectionné";

      const res = await fetch(`/api/updatecourse/${selectedCourse}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          themeChoice: numericThemeId
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses);
        
        showSnackbar(`Thème mis à jour pour le cours ${courseTitle}`, 'success');
      } else {
        setErrorUpdateCourse('Erreur lors de la mise à jour du thème.');
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      setErrorUpdateCourse('Erreur serveur lors de la mise à jour du thème.');
    }
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant='body2' fontWeight="bold" fontSize={23} sx={{ fontVariant: 'small-caps' }}><EditIcon color='warning' /> cours
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ '& > * + *': { mt: 3 } }}>
        <Box>
            <FormControl fullWidth>
              <InputLabel sx={{ fontSize: 'small', textTransform: 'uppercase' }}>Sélectionner une classe</InputLabel>
              <MuiSelect
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                label="Sélectionner une classe"
              >
                {classes && Array.isArray(classes) ? (
                  [...classes].sort((a, b) => naturalSort(a.name, b.name)).map((classe) => (
                    <MenuItem key={classe.id} value={classe.id}>
                      {classe.name}
                    </MenuItem>
                  ))
                ) : null}
              </MuiSelect>
            </FormControl>
        </Box>
        <Box>
            <FormControl fullWidth>
              <InputLabel sx={{ fontSize: 'small', textTransform: 'uppercase' }}>Sélectionner un cours</InputLabel>
              <MuiSelect
                value={selectedCourse}
                onChange={(e) => {
                  handleCourseChange(e.target.value);
                  setCourseToDelete(e.target.value);
                }}
                label="Sélectionner un cours"
              >
                {courses && courses
                  .filter(course => !selectedClassFilter || course.theClasseId === selectedClassFilter)
                  .sort((a, b) => naturalSort(a.title, b.title))
                  .map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.title}
                    </MenuItem>
                  ))}
              </MuiSelect>
            </FormControl>
        </Box>
        {selectedCourse && (
        <form onSubmit={handleSaveCourseDetails} style={{ marginTop: '2rem' }}>
          <Box sx={{ '& > * + *': { mt: 3 } }}>
            <Box>
              <FormLabel component="legend">Titre du cours</FormLabel>
              <TextField
                fullWidth
                type="text"
                name="title"
                value={courseDetails.title}
                onChange={handleCourseDetailsChange}
                required
              />
            </Box>
            <Box>
              <FormLabel component="legend">Description du cours</FormLabel>
              <TextField
                fullWidth
                type="text"
                name="description"
                value={courseDetails.description}
                onChange={handleCourseDetailsChange}
              />
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel sx={{ textTransform: 'uppercase' }}>Classe</InputLabel>
                <MuiSelect
                  name="classe"
                  value={newClasseId}
                  onChange={(e) => setNewClasseId(e.target.value)}
                  label="Classe"
                >
                  {classes.map((classe) => (
                    <MenuItem key={classe.id} value={classe.id}>
                      {classe.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel sx={{ textTransform: 'uppercase' }}>Thème</InputLabel>
                <MuiSelect
                  name="theme"
                  value={courseDetails.themeChoice?.toString() || '0'}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  label="Thème"
                >
                  {THEMES.map((theme) => (
                    <MenuItem key={theme.id} value={theme.id.toString()}>
                      {theme.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </Box>
            {ErrorUpdateCourse && <ErrorMessage message={ErrorUpdateCourse} />}
            {warningUpdateCourse && <WarningMessage message={warningUpdateCourse} />}
            {successMessageUpdateCourse && <SuccessMessage message={successMessageUpdateCourse} />}
            <Button type="submit" className="w-full">
              Enregistrer les modifications
            </Button>
          </Box>
        </form>
        )}
        {files.length > 0 && (
          <Box sx={{ '& > * + *': { mt: 1 } }}>
            <Typography variant="body2" fontWeight={600}>Fichiers associés</Typography>
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={files}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-2">
                  {currentCourse[0]?.activities?.map((activity) => (
                    <SortableFile
                      fileId={activity.id}
                      key={activity.id}
                      fileName={activity.title}
                      fileUrl={activity.fileUrl}
                      onDelete={handleDeleteFile}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </Box>
        )}
        {errorDeleteFile && <ErrorMessage message={errorDeleteFile} />}
        {successMessageDeleteFile && <SuccessMessage message={successMessageDeleteFile} />}
      </Box>

      <form onSubmit={handleDeleteCourse} style={{ marginTop: '2rem' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', my: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch
              checked={deleteFiles}
              onChange={(e) => setDeleteFiles(e.target.checked)}
              disabled={!courseToDelete}
            />
            <Typography
              sx={{
                fontSize: 'small',
                textTransform: 'uppercase',
              }}
            >
              Supprimer les fichiers associés
            </Typography>
          </Box>
        </Box>
        <Button color='error' type="submit" disabled={!courseToDelete} className="w-full">
          Supprimer le cours
        </Button>
        <div className='mt-2'>
          {errorDeleteCourse && <ErrorMessage message={errorDeleteCourse} />}
          {successMessageDeleteCourse && <SuccessMessage message={successMessageDeleteCourse} />}
        </div>
      </form>
    </AccordionDetails>
    </Accordion>
  );
};
