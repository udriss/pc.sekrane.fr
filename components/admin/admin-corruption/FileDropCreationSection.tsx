"use client";

import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField,
  Switch,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Button,
  Stack
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import type { Course, Classe } from '@/lib/dataTemplate';
import { FILE_TYPE_GROUPS } from './file-drop-options';
import { SuccessMessage, WarningMessage, ErrorMessage } from '@/components/message-display';

interface FileDropCreationSectionProps {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
  showSnackbar: (message: React.ReactNode, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

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
      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        return aNum - bNum;
      }
      return aPart.localeCompare(bPart);
    }
  }
  return aParts.length - bParts.length;
};

export const FileDropCreationSection: React.FC<FileDropCreationSectionProps> = ({
  courses,
  setCourses,
  classes,
  setClasses,
  showSnackbar
}) => {
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [acceptedTypes, setAcceptedTypes] = useState<string[]>(['.pdf']);
  const [timeRestricted, setTimeRestricted] = useState(false);
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [maxSizeMb, setMaxSizeMb] = useState<number>(50);
  const [warningMessage, setWarningMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => !selectedClasse || course.theClasseId === selectedClasse)
      .sort((a, b) => naturalSort(a.title, b.title));
  }, [courses, selectedClasse]);

  const resetMessages = () => {
    setWarningMessage('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const resetForm = () => {
    setSelectedClasse('');
    setSelectedCourse('');
    setDisplayName('');
    setEnabled(true);
    setAcceptedTypes(['.pdf']);
    setTimeRestricted(false);
    setStartAt('');
    setEndAt('');
    setMaxSizeMb(50);
  };

  const validate = () => {
    if (!selectedCourse) {
      setWarningMessage('Sélectionnez un cours.');
      return false;
    }
    if (!displayName.trim()) {
      setWarningMessage('Entrez un nom pour le dépôt.');
      return false;
    }
    if (!acceptedTypes.length) {
      setWarningMessage('Sélectionnez au moins un type de fichier accepté.');
      return false;
    }
    if (timeRestricted) {
      if (!startAt || !endAt) {
        setWarningMessage('Renseignez les dates de début et de fin.');
        return false;
      }
      if (new Date(startAt) >= new Date(endAt)) {
        setWarningMessage('La date de fin doit être postérieure à la date de début.');
        return false;
      }
    }
    return true;
  };

  const handleToggleType = (value: string) => {
    setAcceptedTypes((prev) =>
      prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    resetMessages();

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/file-drop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          config: {
            displayName: displayName.trim(),
            enabled,
            acceptedTypes,
            timeRestricted,
            startAt: timeRestricted ? startAt : null,
            endAt: timeRestricted ? endAt : null,
            maxSizeMb
          }
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Impossible de créer la zone de dépôt.');
      }

      const data = await res.json();
      setClasses(data.classes);
      setCourses(data.courses);

      setSuccessMessage('Zone de dépôt créée avec succès.');
      showSnackbar('Zone de dépôt créée', 'success');
      resetForm();
    } catch (error: any) {
      console.error('Error creating file drop:', error);
      setErrorMessage(error.message || 'Erreur lors de la création du dépôt.');
      showSnackbar('Erreur lors de la création du dépôt', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant='body2' fontWeight="bold" fontSize={23} sx={{ fontVariant: 'small-caps', display: 'flex', alignItems: 'center', gap: 1 }}>
        <AddCircleIcon color='success' /> dépôt de fichiers
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <FormControl fullWidth>
          <InputLabel sx={{ fontSize: 'small', textTransform: 'uppercase' }}>
            Sélectionner une classe
          </InputLabel>
          <MuiSelect
            value={selectedClasse}
            onChange={(e) => {
              setSelectedClasse(e.target.value);
              setSelectedCourse('');
            }}
            label="Sélectionner une classe"
          >
            {classes
              .slice()
              .sort((a, b) => naturalSort(a.name, b.name))
              .map((classe) => (
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
            {filteredCourses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.title}
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>

        <TextField
          fullWidth
          label="Nom du dépôt"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Entrez le nom du dépôt"
          slotProps={{
            inputLabel: {
              sx: {
                fontSize: 'small',
                textTransform: 'uppercase'
              }
            },
            input: {
              sx: {
                '&::placeholder': {
                  fontSize: 'small',
                  textTransform: 'uppercase'
                }
              }
            }
          }}
        />

        <FormControlLabel
          control={<Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
          label="Activer le dépôt"
        />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Types de fichiers acceptés
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {FILE_TYPE_GROUPS.map((group) => (
              <Box key={group.name}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary' }}>
                  {group.name}
                </Typography>
                <FormGroup row sx={{ mt: 0.5 }}>
                  {group.options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Checkbox
                          checked={acceptedTypes.includes(option.value)}
                          onChange={() => handleToggleType(option.value)}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ fontWeight: 'normal' }}>
                          {option.label}
                        </Typography>
                      }
                    />
                  ))}
                </FormGroup>
              </Box>
            ))}
          </Box>
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <FormControlLabel
            control={
              <Checkbox
                checked={timeRestricted}
                onChange={(e) => {
                  setTimeRestricted(e.target.checked);
                  if (!e.target.checked) {
                    setStartAt('');
                    setEndAt('');
                  }
                }}
              />
            }
            label="Limiter par dates"
          />
          <TextField
            type="datetime-local"
            label="Début"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            disabled={!timeRestricted}
            sx={{ flex: 1 }}
            slotProps={{
              inputLabel: { shrink: true }
            }}
          />
          <TextField
            type="datetime-local"
            label="Fin"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            disabled={!timeRestricted}
            sx={{ flex: 1 }}
            slotProps={{
              inputLabel: { shrink: true }
            }}
          />
        </Stack>

        <TextField
          type="number"
          label="Taille maximale (Mo)"
          value={maxSizeMb}
          onChange={(e) => setMaxSizeMb(Number(e.target.value) || 0)}
          slotProps={{
            htmlInput: { min: 1, max: 200 }
          }}
        />

        {warningMessage && <WarningMessage message={warningMessage} />}
        {errorMessage && <ErrorMessage message={errorMessage} />}
        {successMessage && <SuccessMessage message={successMessage} />}

        <Button type="submit" variant="outlined" fullWidth sx={{ fontWeight: 700 }} disabled={isSubmitting}>
          {isSubmitting ? 'Ajout...' : 'Ajouter la zone de dépôt'}
        </Button>
      </Box>
    </Box>
  );
};
