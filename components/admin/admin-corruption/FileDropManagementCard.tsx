"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Chip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { Course, Classe, Activity, FileDropSubmission } from '@/lib/dataTemplate';
import { FILE_TYPE_GROUPS } from './file-drop-options';
import { SuccessMessage, WarningMessage, ErrorMessage } from '@/components/message-display';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FileDropManagementCardProps {
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

const formatSize = (size: number) => {
  if (size < 1024) return `${size} o`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`;
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
};

export const FileDropManagementCard: React.FC<FileDropManagementCardProps> = ({
  courses,
  setCourses,
  classes,
  setClasses,
  showSnackbar
}) => {
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDropId, setSelectedDropId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [acceptedTypes, setAcceptedTypes] = useState<string[]>([]);
  const [timeRestricted, setTimeRestricted] = useState(false);
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [maxSizeMb, setMaxSizeMb] = useState<number>(50);
  const [warningMessage, setWarningMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState<FileDropSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => !selectedClasse || course.theClasseId === selectedClasse)
      .filter((course) => (course.activities || []).some((activity) => activity.isFileDrop))
      .sort((a, b) => naturalSort(a.title, b.title));
  }, [courses, selectedClasse]);

  const selectedActivity: Activity | undefined = useMemo(() => {
    const course = courses.find((c) => c.id === selectedCourse);
    return course?.activities.find((activity) => activity.id === selectedDropId);
  }, [courses, selectedCourse, selectedDropId]);

  const resetMessages = () => {
    setWarningMessage('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const hydrateFromActivity = (activity: Activity | undefined) => {
    const config = activity?.dropzoneConfig as Record<string, unknown> | undefined;
    setDisplayName(config?.displayName?.toString() || activity?.title || '');
    setEnabled(Boolean(config?.enabled));
    setAcceptedTypes(Array.isArray(config?.acceptedTypes) ? (config?.acceptedTypes as string[]) : []);
    const restricted = Boolean(config?.timeRestricted);
    setTimeRestricted(restricted);
    setStartAt(restricted && config?.startAt ? (config.startAt as string) : '');
    setEndAt(restricted && config?.endAt ? (config.endAt as string) : '');
    setMaxSizeMb(typeof config?.maxSizeMb === 'number' ? (config.maxSizeMb as number) : 50);
  };

  useEffect(() => {
    if (selectedActivity) {
      hydrateFromActivity(selectedActivity);
    } else {
      setDisplayName('');
      setEnabled(false);
      setAcceptedTypes([]);
      setTimeRestricted(false);
      setStartAt('');
      setEndAt('');
      setMaxSizeMb(50);
      setSubmissions([]);
    }
  }, [selectedActivity]);

  const fetchSubmissions = useCallback(async () => {
    if (!selectedDropId) return;
    try {
      setLoadingSubmissions(true);
      setSubmissionError('');
      const response = await fetch(`/api/file-drop/${selectedDropId}/submissions`);
      if (!response.ok) {
        throw new Error('Impossible de récupérer les dépôts.');
      }
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      setSubmissionError(error.message || 'Erreur lors de la récupération des dépôts.');
    } finally {
      setLoadingSubmissions(false);
    }
  }, [selectedDropId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleToggleType = (value: string) => {
    setAcceptedTypes((prev) =>
      prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value]
    );
  };

  const validate = () => {
    if (!selectedDropId) {
      setWarningMessage('Sélectionnez une zone de dépôt.');
      return false;
    }
    if (!displayName.trim()) {
      setWarningMessage('Entrez un nom à afficher.');
      return false;
    }
    if (!acceptedTypes.length) {
      setWarningMessage('Sélectionnez au moins un type de fichier.');
      return false;
    }
    if (timeRestricted) {
      if (!startAt || !endAt) {
        setWarningMessage('Indiquez la période complète.');
        return false;
      }
      if (new Date(startAt) >= new Date(endAt)) {
        setWarningMessage('La date de fin doit être postérieure à la date de début.');
        return false;
      }
    }
    return true;
  };

  const handleUpdate = async () => {
    resetMessages();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/file-drop/${selectedDropId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          displayName: displayName.trim(),
          enabled,
          acceptedTypes,
          timeRestricted,
          startAt: timeRestricted ? startAt : null,
          endAt: timeRestricted ? endAt : null,
          maxSizeMb
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Impossible de mettre à jour le dépôt.');
      }

      const data = await response.json();
      setClasses(data.classes);
      setCourses(data.courses);
      setSuccessMessage('Zone de dépôt mise à jour.');
      showSnackbar('Zone de dépôt mise à jour', 'success');
    } catch (error: any) {
      console.error('Error updating file drop:', error);
      setErrorMessage(error.message || 'Erreur lors de la mise à jour.');
      showSnackbar('Erreur lors de la mise à jour de la zone de dépôt', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/file-drop/${selectedDropId}/submissions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId })
      });
      if (!response.ok) {
        throw new Error('Suppression impossible.');
      }
      setSubmissions((prev) => prev.filter((item) => item.id !== submissionId));
      showSnackbar('Fichier supprimé', 'success');
    } catch (error) {
      console.error('Error deleting submission:', error);
      showSnackbar('Erreur lors de la suppression du fichier', 'error');
    }
  };

  const handleDownloadSubmission = (submissionId: string) => {
    window.open(`/api/file-drop/download/${submissionId}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <FormControl fullWidth>
        <InputLabel sx={{ fontSize: 'small', textTransform: 'uppercase' }}>
          Sélectionner une classe
        </InputLabel>
        <MuiSelect
          value={selectedClasse}
          onChange={(e) => {
            setSelectedClasse(e.target.value);
            setSelectedCourse('');
            setSelectedDropId('');
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

          <FormControl fullWidth disabled={!filteredCourses.length}>
            <InputLabel sx={{ fontSize: 'small', textTransform: 'uppercase' }}>
              Sélectionner un cours
            </InputLabel>
            <MuiSelect
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedDropId('');
              }}
              label="Sélectionner un cours"
            >
              {filteredCourses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.title}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth disabled={!selectedCourse}>
            <InputLabel sx={{ fontSize: 'small', textTransform: 'uppercase' }}>
              Sélectionner un dépôt
            </InputLabel>
            <MuiSelect
              value={selectedDropId}
              onChange={(e) => setSelectedDropId(e.target.value)}
              label="Sélectionner un dépôt"
            >
              {(courses.find((c) => c.id === selectedCourse)?.activities || [])
                .filter((activity) => activity.isFileDrop)
                .map((activity) => (
                  <MenuItem key={activity.id} value={activity.id}>
                    {activity.dropzoneConfig?.displayName || activity.title}
                  </MenuItem>
                ))}
            </MuiSelect>
          </FormControl>

          {selectedDropId ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Nom du dépôt"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />

              <FormControlLabel
                control={<Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
                label="Activer le dépôt"
              />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Types de fichiers acceptés
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
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
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                  type="datetime-local"
                  label="Fin"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  disabled={!timeRestricted}
                  sx={{ flex: 1 }}
                  slotProps={{ inputLabel: { shrink: true } }}
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

              <Button
                variant="outlined"
                sx={{ fontWeight: 700 }}
                onClick={handleUpdate}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enregistrement...' : 'Mettre à jour la zone de dépôt'}
              </Button>

              <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Fichiers déposés ({submissions.length})
                  </Typography>
                  <Box>
                    <IconButton onClick={fetchSubmissions} disabled={!selectedDropId || loadingSubmissions}>
                      <RefreshIcon />
                    </IconButton>
                  </Box>
                </Stack>
                {submissionError && <ErrorMessage message={submissionError} />}
                {!submissionError && !loadingSubmissions && submissions.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Aucun fichier déposé pour le moment.
                  </Typography>
                )}
                <List dense>
                  {submissions.map((item) => (
                    <ListItem
                      key={item.id}
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          <IconButton onClick={() => handleDownloadSubmission(item.id)}>
                            <DownloadIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteSubmission(item.id)}>
                            <DeleteForeverIcon />
                          </IconButton>
                        </Stack>
                      }
                    >
                      <ListItemText
                        primary={item.originalName}
                        secondary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip size="small" label={formatSize(item.fileSize)} />
                            <Chip
                              size="small"
                              color="info"
                              label={format(new Date(item.createdAt), 'dd MMM yyyy HH:mm', { locale: fr })}
                            />
                          </Stack>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Sélectionnez un dépôt pour voir les détails.
            </Typography>
          )}
        </Box>
  );
};
