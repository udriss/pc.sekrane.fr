// /components/admin/admin-corruption/ClassModificationCard.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { SuccessMessage, ErrorMessage, WarningMessage } from '@/components/message-display';
import { Course, Classe } from '@/lib/dataTemplate';
import { SortableCourse } from '@/components/admin/SortableCourse';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Switch from '@mui/material/Switch';
import { Typography, Accordion, AccordionSummary, AccordionDetails, Button, TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ClassModificationCardProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
  showSnackbar: (message: React.ReactNode, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const ClassModificationCard: React.FC<ClassModificationCardProps> = ({
  courses,
  setCourses,
  classes,
  setClasses,
  showSnackbar
}) => {
  const [selectedClasse, setSelectedClasse] = useState<string>('');
  const [associatedCourses, setAssociatedCourses] = useState<Course[]>([]);
  const [selectedClasseToDelete, setSelectedClasseToDelete] = useState<string>('');
  const [errorDeleteClasse, setErrorDeleteClasse] = useState<string>('');
  const [successMessageDeleteClasse, setSuccessMessageDeleteClasse] = useState<string>('');
  const [warningDeleteClasse, setWarningDeleteClasse] = useState<string>('');
  const [editedClasseName, setEditedClasseName] = useState<string>('');
  const [warningRenameClasse, setWarningRenameClasse] = useState<string>('');
  const [confirmDeleteRapide, setConfirmDeleteRapide] = useState<string | null>(null);
  const [errorDeleteCourseRapide, setErrorDeleteCourseRapide] = useState<string>('');
  const [successMessageDeleteCourseRapide, setSuccessMessageDeleteCourseRapide] = useState<string>('');

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Mettre à jour les cours associés à la classe sélectionnée
    if (selectedClasse) {
      const filteredCourses = courses.filter(course => course.theClasseId === selectedClasse);
      setAssociatedCourses(filteredCourses);
    } else {
      setAssociatedCourses([]);
    }
  }, [selectedClasse, courses]);

  const handleClasseChange = useCallback((classeId: string) => {
    setSelectedClasse(classeId);
    const classe = classes && Array.isArray(classes)
      ? classes.find(classe => classe.id === classeId)
      : null;
    if (classe) {
      const associatedCourses = courses.filter(course => classe.associated_courses.includes(course.id));
      setAssociatedCourses(associatedCourses);
    }
  }, [classes, courses]);

  useEffect(() => {
    handleClasseChange(selectedClasse);
  }, [classes, handleClasseChange, selectedClasse]);

  const handleSelectChange = (classeId: string) => {
    setErrorDeleteCourseRapide(''); // Reset error message
    setSuccessMessageDeleteCourseRapide(''); // Reset success message
    handleClasseChange(classeId);
  };

  const handleDragEndCourse = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // Update courses order
      const oldIndex = courses.findIndex(course => course.id === active.id);
      const newIndex = courses.findIndex(course => course.id === over?.id);

      const newCourses = [...courses];
      newCourses.splice(oldIndex, 1);
      newCourses.splice(newIndex, 0, courses[oldIndex]);
      setCourses(newCourses);

      // Update API
      try {
        const response = await fetch('/api/updateCourseOrder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ courses: newCourses.map(course => course.id), activeCourseId: active.id }),
        });
        const data = await response.json();
        if (response.ok) {
          showSnackbar(`Ordre mis à jour pour la classe ${data.titleOfChosenClass}`, 'success');
        } else {
          setErrorDeleteCourseRapide(data.error);
        }
      } catch (error) {
        setErrorDeleteCourseRapide('Internal server error');
      }
    }
  };

  const handleRenameClasse = async (classeId: string, newClasseName: string) => {
    if (!newClasseName || newClasseName.trim() === '') {
      setWarningRenameClasse('Le nom de la classe ne peut pas être vide.');
      return;
    }
    setWarningRenameClasse('');

    if (!classeId) {
      setErrorDeleteClasse('');
      setWarningDeleteClasse('Sélectionnez une classe !');
      setWarningRenameClasse('');
      setSuccessMessageDeleteClasse('');
      return;
    }
    if (!newClasseName.trim()) {
      setErrorDeleteClasse('');
      setWarningDeleteClasse('Saisissez un nouveau nom !');
      setWarningRenameClasse('');
      setSuccessMessageDeleteClasse('');
      return;
    }
    try {
      const response = await fetch(`/api/renameclasse/${classeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classeId: classeId, name: newClasseName }),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la modification du nom de la classe');
      }
      setErrorDeleteClasse('');
      setWarningDeleteClasse('');
      setWarningRenameClasse('');
      setSuccessMessageDeleteClasse('Classe renommée avec succès');

      const data = await response.json();
      setClasses(data.classes);
      setCourses(data.courses);

      // Mettez à jour la liste des classes localement si nécessaire
    } catch (error: any) {
      setErrorDeleteClasse(error.message);
      setWarningRenameClasse('');
      setWarningDeleteClasse('');
      setSuccessMessageDeleteClasse('');
    }
  };

  const handleDeleteClasse = async (classeId: string) => {
    if (!classeId) {
      setErrorDeleteClasse('');
      setWarningRenameClasse('');
      setWarningDeleteClasse('Sélectionnez une classe à supprimer !');
      setSuccessMessageDeleteClasse('');
      return;
    }
    if (classeId === '0') {
      setErrorDeleteClasse('');
      setWarningRenameClasse('');
      setWarningDeleteClasse('La classe "Autre" ne peut pas être supprimée.');
      setSuccessMessageDeleteClasse('');
      return;
    }

    try {
      const res = await fetch(`/api/deleteclasse/${classeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classeId: classeId,
          deleteFiles: true
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression de la classe.');
      }

      const data = await res.json();
      setErrorDeleteClasse('');
      setWarningDeleteClasse('');
      setWarningRenameClasse('');
      setSuccessMessageDeleteClasse('Classe supprimée avec succès.');

      setClasses(data.classes);
      setCourses(data.courses);

    } catch (error: any) {
      setErrorDeleteClasse(error.message);
      setWarningDeleteClasse('');
      setWarningRenameClasse('');
      setSuccessMessageDeleteClasse('');
    }
  };

  // Ajouter cette fonction avec les autres handlers
  const handleToggleVisibilityCourse = async (courseId: string, visibility: boolean) => {
    try {
      const response = await fetch(`/api/updatecourse/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          toggleVisibilityCourse: visibility
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update course visibility');
      }

      const data = await response.json();
      setCourses(data.courses);
      setClasses(data.classes);
    } catch (error) {
      console.error('Error updating course visibility:', error);
    }
  };

  const handleToggleVisibility = async (classeId: string, visibility: boolean) => {
    try {
      const response = await fetch(`/api/renameclasse/${classeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classeId,
          toggleVisibilityClasse: visibility
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update class visibility');
      }

      const data = await response.json();
      setClasses(data.classes);
      setCourses(data.courses);
    } catch (error) {
      console.error('Error updating class visibility:', error);
    }
  };

  const handleDeleteClickRapide = (courseId: string) => {
    setConfirmDeleteRapide(courseId);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" fontWeight="bold">
          Modifier une classe
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="space-y-6">
          <div className="space-y-2">
            <FormControl fullWidth>
              <InputLabel sx={{ fontSize: 'small', textTransform: 'uppercase', transform: 'translate(14px, 20px) scale(1)' }}>
                Sélectionner une classe
              </InputLabel>
              <MuiSelect
                value={selectedClasseToDelete}
                onChange={(e) => {
                  setSelectedClasseToDelete(e.target.value);
                  handleSelectChange(e.target.value);
                }}
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
          </div>
          <TextField
            fullWidth
            type="text"
            label="Nouveau nom de la classe"
            placeholder="Nouveau nom de la classe"
            value={editedClasseName}
            onChange={(e) => setEditedClasseName(e.target.value)}
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
          <div className="flex flex-row justify-around">
            <Button onClick={() => handleRenameClasse(selectedClasseToDelete, editedClasseName)}>
              Modifier la classe
            </Button>
            <Button color="error" onClick={() => handleDeleteClasse(selectedClasseToDelete)}>
              Supprimer la classe
            </Button>
            <div className="flex flex-row items-center">
              <h4 className="text-sm font-medium text-gray-500">Visible</h4>
              <Switch
                checked={classes.find(classe => classe.id === selectedClasseToDelete)?.toggleVisibilityClasse || false}
                onChange={(e) => handleToggleVisibility(selectedClasseToDelete, e.target.checked)}
                disabled={!selectedClasseToDelete || classes.length === 0}
              />
            </div>
          </div>
          {associatedCourses.length > 0 && (
            <div className="space-y-2">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndCourse}
              >
                  <SortableContext
                  items={associatedCourses.sort((a, b) => naturalSort(a.title, b.title)).map(course => course.id)}
                  strategy={verticalListSortingStrategy}
                  >
                  <ul className="space-y-2">
                  {associatedCourses.map((course) => (
                    <SortableCourse
                    key={course.id}
                    courseId={course.id}
                    courseTitle={course.title}
                    toggleVisibilityCourse={course.toggleVisibilityCourse}
                    onDelete={handleDeleteClickRapide}
                    onToggleVisibility={handleToggleVisibilityCourse}
                    />
                  ))}
                  </ul>
                  </SortableContext>
              </DndContext>
            </div>
          )}

          <div className="mt-2">
            {errorDeleteClasse && <ErrorMessage message={errorDeleteClasse} />}
            {warningDeleteClasse && <WarningMessage message={warningDeleteClasse} />}
            {successMessageDeleteClasse && <SuccessMessage message={successMessageDeleteClasse} />}
            {warningRenameClasse && <WarningMessage message={warningRenameClasse} />}
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
