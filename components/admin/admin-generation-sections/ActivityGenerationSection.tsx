// /components/admin/admin-generation-sections/ActivityGenerationSection.tsx

import { useState, useEffect } from 'react';
import { Button, Typography, Box, TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import React from 'react';
import { Course, Classe } from '@/lib/data';
import { SuccessMessage, ErrorMessage, WarningMessage } from '@/components/message-display';
import { FileUploader } from '@/components/ui/file-uploader';

interface ActivityGenerationSectionProps {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
  showSnackbar: (message: React.ReactNode, severity?: "success" | "error" | "info" | "warning") => void;
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  selectedCourse: string;
  setSelectedCourse: (value: string) => void;
}

export function ActivityGenerationSection({ courses, setCourses, classes, setClasses, showSnackbar, selectedClass, setSelectedClass, selectedCourse, setSelectedCourse }: ActivityGenerationSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [ActivityTitle, setActivityTitle] = useState<string>('');
  const [errorAddFile, setErrorAddFile] = useState<string>('');
  const [successMessageAddFile, setSuccessMessageAddFile] = useState<React.ReactNode>(null);
  const [warningAddFile, setWarningAddFile] = useState<string>('');
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

  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !file || !ActivityTitle) {
      setErrorAddFile('');
      setWarningAddFile('Sélectionnez un cours, un fichier et entrez le nom de l\'activité !');
      setSuccessMessageAddFile('');
      return;
    }

    const formData = new FormData();
    formData.append('courseId', selectedCourse);
    formData.append('file', file);
    formData.append('ActivityTitle', ActivityTitle);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setErrorAddFile('');
      setWarningAddFile('');
      setSuccessMessageAddFile(
        <>Fichier <span style={{ color: "red" }}>{data.fileName}</span> téléchargé avec succès.</>
      );
      
      const updatedCourses = courses.map(course =>
        course.id === selectedCourse ? { ...course, activities: [...course.activities, data.activity] } : course
      ) as Course[];
      setCourses(updatedCourses);
      resetForm();
    } else {
      setErrorAddFile('Échec du téléchargement du fichier.');
      setWarningAddFile('');
      setSuccessMessageAddFile('');
    }
  };

  const resetForm = () => {
    setActivityTitle('');
    setFile(null);
  };

  return (
    <Box component="form" onSubmit={handleAddFile} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <FormControl fullWidth>
        <InputLabel sx={{ fontSize: 'small', textTransform: 'uppercase' }}>
          Sélectionner une classe
        </InputLabel>
        <MuiSelect
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          label="Sélectionner une classe"
        >
          {classes && classes.sort((a, b) => naturalSort(a.name, b.name)).map((classe) => (
            <MenuItem key={classe.id} value={classe.id}>
              {classe.name}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel sx={{ fontSize: 'small', textTransform: 'uppercase' }}>
          Sélectionner un cours
        </InputLabel>
        <MuiSelect
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          label="Sélectionner un cours"
        >
          {courses && courses
            .filter(course => !selectedClass || course.theClasseId === selectedClass)
            .sort((a, b) => naturalSort(a.title, b.title))
            .map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.title}
              </MenuItem>
            ))}
        </MuiSelect>
      </FormControl>

      <TextField
        fullWidth
        label="Nom de l'activité"
        value={ActivityTitle}
        onChange={(e) => setActivityTitle(e.target.value)}
        placeholder="Entrez le nom de l'activité"
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

      <FileUploader
        fileType="all"
        onFileSelect={(selectedFile) => setFile(selectedFile)}
        onFileRemove={() => setFile(null)}
        selectedFile={file}
        maxFileSize={50 * 1024 * 1024} // 50MB
        rejectedFile={rejectedFile}
        onFileReject={(file, errors) => setRejectedFile(file)}
        onRejectedFileRemove={() => setRejectedFile(null)}
      />

      {warningAddFile && <WarningMessage message={warningAddFile} />}
      {errorAddFile && <ErrorMessage message={errorAddFile} />}
      {successMessageAddFile && <SuccessMessage message={successMessageAddFile} />}

      <Button type="submit" variant="outlined" fullWidth sx={{ fontWeight: 700 }}>
        Télécharger
      </Button>
    </Box>
  );
}
