// /components/admin/admin-generation-sections/CourseGenerationSection.tsx

import { useState } from 'react';
import { Button, Box, TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import React from 'react';
import { Course, Classe } from '@/lib/data';
import { SuccessMessage, ErrorMessage, WarningMessage } from '@/components/message-display';

interface CourseGenerationSectionProps {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
  showSnackbar: (message: React.ReactNode, severity?: "success" | "error" | "info" | "warning") => void;
}

export function CourseGenerationSection({ courses, setCourses, classes, setClasses, showSnackbar }: CourseGenerationSectionProps) {
  const [newCourseTitle, setNewCourseTitle] = useState<string>('');
  const [newCourseDescription, setNewCourseDescription] = useState<string>('');
  const [newCourseClasse, setNewCourseClasse] = useState<string>('');
  const [errorAddCourse, setErrorAddCourse] = useState<string>('');
  const [successMessageAddCourse, setSuccessMessageAddCourse] = useState<string>('');
  const [warningAddCourse, setWarningAddCourse] = useState<string>('');

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

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseClasse) {
      setErrorAddCourse('');
      setWarningAddCourse('Entrez un titre de cours et sélectionnez une classe !');
      setSuccessMessageAddCourse('');
      return;
    }

    const selectedClasse = classes.find((classe: Classe) => classe.name === newCourseClasse);
    if (!selectedClasse) {
      setErrorAddCourse('Classe sélectionnée non valide.');
      setWarningAddCourse('');
      setSuccessMessageAddCourse('');
      return;
    }
    
    const res = await fetch('/api/addcourse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newCourseTitle,
        description: newCourseDescription,
        classe: newCourseClasse,
        theClasseId: selectedClasse.id
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setErrorAddCourse('');
      setWarningAddCourse('');
      setSuccessMessageAddCourse(`Cours "${newCourseTitle}" ajouté avec succès.`);

      setCourses(data.courses);
      setClasses(data.classes);
      setNewCourseTitle('');
      setNewCourseDescription('');
      setNewCourseClasse('');
    } else {
      setErrorAddCourse('Échec de l\'ajout du cours.');
      setWarningAddCourse('');
      setSuccessMessageAddCourse('');
    }
  };

  return (
    <Box component="form" onSubmit={handleAddCourse} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
      <TextField
        fullWidth
        label="Titre du cours"
        value={newCourseTitle}
        onChange={(e) => setNewCourseTitle(e.target.value)}
        placeholder="Entrez le titre du cours"
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

      <TextField
        fullWidth
        label="Description du cours"
        value={newCourseDescription}
        onChange={(e) => setNewCourseDescription(e.target.value)}
        placeholder="Entrez la description du cours"
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

      <FormControl fullWidth>
        <InputLabel sx={{ fontSize: 'small', textTransform: 'uppercase' }}>
          Sélectionner une classe
        </InputLabel>
        <MuiSelect
          value={newCourseClasse}
          onChange={(e) => setNewCourseClasse(e.target.value)}
          label="Sélectionner une classe"
        >
          {classes && Array.isArray(classes) ? (
            [...classes]
              .sort((a, b) => naturalSort(a.name, b.name))
              .map((classe) => (
                <MenuItem key={classe.id} value={classe.name}>
                  {classe.name}
                </MenuItem>
              ))
          ) : (
            <MenuItem value="loading" disabled>
              Chargement des classes...
            </MenuItem>
          )}
        </MuiSelect>
      </FormControl>

      {warningAddCourse && <WarningMessage message={warningAddCourse} />}
      {errorAddCourse && <ErrorMessage message={errorAddCourse} />}
      {successMessageAddCourse && <SuccessMessage message={successMessageAddCourse} />}

      <Button type="submit" variant="outlined" fullWidth sx={{ fontWeight: 700 }}>
        Ajouter le cours
      </Button>
    </Box>
  );
}
