import { useState } from 'react';
import { Button, Typography, Box, TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useRef, useEffect } from 'react';
import { Course, Classe } from '@/lib/data';
import {SuccessMessage, ErrorMessage, WarningMessage} from '@/components/message-display';
import { FileUploader } from '@/components/ui/file-uploader';

interface GenerationsAdminProps {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
}

export function GenerationsAdmin({ courses, setCourses, classes, setClasses }: GenerationsAdminProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [ActivityTitle, setActivityTitle] = useState<string>('');
  const [newCourseTitle, setNewCourseTitle] = useState<string>('');
  const [newCourseDescription, setNewCourseDescription] = useState<string>('');
  const [newCourseClasse, setNewCourseClasse] = useState<string>('');
  const [newClasse, setNewClasse] = useState<string>('');
  const [errorAddFile, setErrorAddFile] = useState<string>('');
  const [errorAddCourse, setErrorAddCourse] = useState<string>('');
  const [errorAddClasse, setErrorAddClasse] = useState<string>('');
  const [successMessageAddFile, setSuccessMessageAddFile] = useState<React.ReactNode>(null);
  const [successMessageAddCourse, setSuccessMessageAddCourse] = useState<string>('');
  const [successMessageAddClasse, setSuccessMessageAddClasse] = useState<string>('');
  const [warningAddClasse, setWarningAddClasse] = useState<string>('');
  const [warningAddFile, setWarningAddFile] = useState<string>('');
  const [warningAddCourse, setWarningAddCourse] = useState<string>('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
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

  useEffect(() => {
    const fetchData = async () => {
      const fetchRes = await fetch('/api/courses');
      const freshData = await fetchRes.json();
      setCourses(freshData.courses);
      setClasses(freshData.classes);
    };

    fetchData();
  }, [setCourses, setClasses]);

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
      resetForm(); // Reset form after successful upload
    } else {
      setErrorAddFile('Échec du téléchargement du fichier.');
      setWarningAddFile('');
      setSuccessMessageAddFile(''); // Reset success message
    }
  };

  const resetForm = () => {
    setSelectedCourse('');
    setActivityTitle('');
    setFile(null);
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
        theClasseId : selectedClasse.id
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

  const handleAddClasse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClasse) {
      setErrorAddClasse('Entrez le nom de la nouvelle classe !');
      setWarningAddClasse(''); // Reset warning
      setSuccessMessageAddClasse('');
      return;
    }

    const res = await fetch('/api/addclasse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newClasse,
      }),
    });

    const data = await res.json();
    if (res.status === 200) {
      setClasses(data.classes);
      setNewClasse('');
      setErrorAddClasse('');
      setWarningAddClasse(''); // Reset warning
      setSuccessMessageAddClasse(`Classe "${newClasse}" ajoutée avec succès.`);
    } else if (res.status === 400) {
      setErrorAddClasse('');
      setWarningAddClasse(data.warning);
      setSuccessMessageAddClasse(''); // Reset success message
    } else {
      setErrorAddClasse('Échec de l\'ajout de la classe.');
      setWarningAddClasse(''); // Reset warning
      setSuccessMessageAddClasse(''); // Reset success message
    }
  };

  return (
    <>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" fontWeight="bold">Ajouter une nouvelle activité</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box component="form" onSubmit={handleAddFile} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ fontSize: 'small', textTransform: 'uppercase' }}>
              Sélectionner une classe
            </InputLabel>
            <MuiSelect
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
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
                .filter(course => !selectedClassFilter || course.theClasseId === selectedClassFilter)
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

          <Button type="submit" variant="contained" fullWidth>
            Télécharger
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" fontWeight="bold">Ajouter un nouveau cours</Typography>
        </AccordionSummary>
        <AccordionDetails>
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

            <Button type="submit" variant="contained" fullWidth>
              Ajouter le cours
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
            <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" fontWeight="bold">Ajouter une nouvelle classe</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box component="form" onSubmit={handleAddClasse} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              fullWidth
              label="Nom de la classe"
              value={newClasse}
              onChange={(e) => setNewClasse(e.target.value)}
              placeholder="Entrez le nom de la classe"
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

            {warningAddClasse && <WarningMessage message={warningAddClasse} />}
            {errorAddClasse && <ErrorMessage message={errorAddClasse} />}
            {successMessageAddClasse && <SuccessMessage message={successMessageAddClasse} />}

            <Button type="submit" variant="contained" fullWidth>
              Ajouter la classe
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
}