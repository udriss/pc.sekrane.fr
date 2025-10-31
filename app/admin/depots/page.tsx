"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DownloadIcon from '@mui/icons-material/Download';
import type { FileDropSubmission } from '@/lib/dataTemplate';

interface FileDropSummary {
  activityId: string;
  courseId: string;
  courseTitle: string;
  classeId: string;
  classeLabel: string;
  classeName: string | null;
  displayName: string;
  enabled: boolean;
  isOpen: boolean;
  acceptedTypes: string[];
  timeRestricted: boolean;
  startAt: string | null;
  endAt: string | null;
  maxSizeMb: number;
  submissionsCount: number;
  lastSubmissionAt: string | null;
  createdAt: string;
  updatedAt: string;
  storagePath: string;
}

type FeedbackState = {
  kind: 'success' | 'error' | 'info';
  message: string;
} | null;

const formatDate = (value?: string | null) => {
  if (!value) {
    return '—';
  }
  try {
    return new Date(value).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return value;
  }
};

const formatSize = (size: number) => {
  if (size < 1024) return `${size} o`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`;
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
};

export default function FileDropDashboardPage() {
  const router = useRouter();
  const [drops, setDrops] = useState<FileDropSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<FileDropSubmission[]>([]);
  const [loadingDrops, setLoadingDrops] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [dropsError, setDropsError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  useEffect(() => {
    // Authentication is handled by the server-side middleware which reads the
    // HttpOnly `adminAuth` cookie. Remove the client-side cookie check because
    // HttpOnly cookies are not visible to `document.cookie` and that causes a
    // wrong client-side redirect to `/admin/login` followed by a server-side
    // redirect to `/admin`. Rely on middleware for auth.
  }, [router]);

  // Note: Authentication is handled by middleware, no need for client-side check

  const loadDrops = useCallback(async () => {
    try {
      setLoadingDrops(true);
      setDropsError(null);
      const response = await fetch('/api/file-drop');
      if (!response.ok) {
        throw new Error('Impossible de charger les dépôts.');
      }
      const data = await response.json();
      const fetchedDrops: FileDropSummary[] = data.drops || [];
      setDrops(fetchedDrops);
      if (!fetchedDrops.length) {
        setSelectedId(null);
        setSubmissions([]);
      } else {
        setSelectedId((prev) => (prev && fetchedDrops.some((drop) => drop.activityId === prev) ? prev : fetchedDrops[0].activityId));
      }
    } catch (error: any) {
      console.error('Error loading drops:', error);
      setDropsError(error.message || 'Erreur inattendue lors du chargement des dépôts.');
    } finally {
      setLoadingDrops(false);
    }
  }, []);

  useEffect(() => {
    loadDrops();
  }, [loadDrops]);

  const selectedDrop = useMemo(() => drops.find((drop) => drop.activityId === selectedId) || null, [drops, selectedId]);

  const loadSubmissions = useCallback(async (activityId: string) => {
    try {
      setLoadingSubmissions(true);
      setSubmissionError(null);
      const response = await fetch(`/api/file-drop/${activityId}/submissions`);
      if (!response.ok) {
        throw new Error('Impossible de charger les fichiers déposés.');
      }
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error: any) {
      console.error('Error loading submissions:', error);
      setSubmissionError(error.message || 'Erreur lors du chargement des fichiers.');
      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadSubmissions(selectedId);
    } else {
      setSubmissions([]);
    }
  }, [selectedId, loadSubmissions]);

  const handleSelectDrop = (activityId: string) => {
    setSelectedId(activityId);
    setFeedback(null);
  };

  const handleRefreshSubmissions = () => {
    if (selectedId) {
      loadSubmissions(selectedId);
    }
  };

  const handleDownloadSubmission = (submissionId: string) => {
    window.open(`/api/file-drop/download/${submissionId}`);
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!selectedId) return;
    try {
      const response = await fetch(`/api/file-drop/${selectedId}/submissions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId })
      });
      if (!response.ok) {
        throw new Error('Suppression impossible.');
      }
      setSubmissions((prev) => {
        const updated = prev.filter((item) => item.id !== submissionId);
        setDrops((current) =>
          current.map((drop) =>
            drop.activityId === selectedId
              ? {
                  ...drop,
                  submissionsCount: updated.length,
                  lastSubmissionAt: updated[0]?.createdAt ?? null
                }
              : drop
          )
        );
        return updated;
      });
      setFeedback({ kind: 'success', message: 'Fichier supprimé.' });
    } catch (error: any) {
      console.error('Error deleting submission:', error);
      setFeedback({ kind: 'error', message: error.message || 'Erreur lors de la suppression du fichier.' });
    }
  };

  const handleDeleteDrop = async (activityId: string) => {
    if (!window.confirm('Supprimer ce dépôt et tous les fichiers associés ?')) {
      return;
    }
    try {
      const response = await fetch(`/api/file-drop/${activityId}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Suppression du dépôt impossible.');
      }
      setFeedback({ kind: 'success', message: 'Dépôt supprimé.' });
      await loadDrops();
    } catch (error: any) {
      console.error('Error deleting drop:', error);
      setFeedback({ kind: 'error', message: error.message || 'Erreur lors de la suppression du dépôt.' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6, px: { xs: 2, md: 6 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
            Suivi des dépôts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visualisez l&apos;état de chaque zone de dépôt de fichiers, téléchargez ou supprimez les remises.
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadDrops} disabled={loadingDrops}>
          Actualiser
        </Button>
      </Stack>

      {feedback && (
        <Alert severity={feedback.kind} sx={{ mb: 3 }} onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      {dropsError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {dropsError}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Paper sx={{ width: { xs: '100%', md: 320 }, p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ textTransform: 'uppercase', mb: 1 }}>
            Dépôts disponibles
          </Typography>
          <Divider />
          {loadingDrops ? (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : drops.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              Aucun dépôt configuré pour le moment.
            </Typography>
          ) : (
            <List dense disablePadding>
              {drops.map((drop) => (
                <ListItemButton
                  key={drop.activityId}
                  selected={drop.activityId === selectedId}
                  onClick={() => handleSelectDrop(drop.activityId)}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemText
                    primary={drop.displayName}
                    secondary={drop.courseTitle}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                  <Stack direction="column" alignItems="flex-end" spacing={0.5}>
                    <Chip
                      label={drop.isOpen ? 'Ouvert' : 'Fermé'}
                      color={drop.isOpen ? 'success' : 'error'}
                      size="small"
                      sx={{ minWidth: 64, textTransform: 'uppercase' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {drop.submissionsCount} fichier{drop.submissionsCount > 1 ? 's' : ''}
                    </Typography>
                  </Stack>
                </ListItemButton>
              ))}
            </List>
          )}
        </Paper>

        <Paper sx={{ flex: 1, p: 3, minHeight: 480 }}>
          {!selectedDrop ? (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Sélectionnez un dépôt pour afficher les détails.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={3} sx={{ height: '100%' }}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
                <Box>
                  <Typography variant="h5" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                    {selectedDrop.displayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cours : {selectedDrop.courseTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Classe : {selectedDrop.classeName || selectedDrop.classeLabel || '—'}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={selectedDrop.isOpen ? 'Ouvert' : 'Fermé'}
                    color={selectedDrop.isOpen ? 'success' : 'error'}
                    sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                  />
                  <Chip
                    label={selectedDrop.enabled ? 'Activé' : 'Désactivé'}
                    color={selectedDrop.enabled ? 'primary' : 'default'}
                    sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                  />
                </Stack>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Types acceptés
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                    {selectedDrop.acceptedTypes.length === 0 ? (
                      <Chip label="Tous formats" color="primary" size="small" />
                    ) : (
                      selectedDrop.acceptedTypes.map((type) => (
                        <Chip key={type} label={type.toUpperCase()} variant="outlined" size="small" />
                      ))
                    )}
                  </Stack>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fenêtre de dépôt
                  </Typography>
                  <Stack spacing={0.5} mt={1}>
                    <Typography variant="body2">Début : {formatDate(selectedDrop.startAt)}</Typography>
                    <Typography variant="body2">Fin : {formatDate(selectedDrop.endAt)}</Typography>
                  </Stack>
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Taille max.
                  </Typography>
                  <Typography variant="body2" fontWeight={600} mt={1}>
                    {selectedDrop.maxSizeMb} Mo
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Dépôts reçus : {selectedDrop.submissionsCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dernier dépôt : {formatDate(selectedDrop.lastSubmissionAt)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stockage : <code>{selectedDrop.storagePath}</code>
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteForeverIcon />}
                  onClick={() => handleDeleteDrop(selectedDrop.activityId)}
                >
                  Supprimer le dépôt
                </Button>
              </Stack>

              <Divider />

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight={600}>
                  Fichiers déposés
                </Typography>
                <IconButton onClick={handleRefreshSubmissions} disabled={loadingSubmissions}>
                  <RefreshIcon />
                </IconButton>
              </Stack>

              {submissionError && (
                <Alert severity="error">{submissionError}</Alert>
              )}

              {loadingSubmissions ? (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : submissions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Aucun fichier n&apos;a encore été déposé.
                </Typography>
              ) : (
                <List dense sx={{ maxHeight: 280, overflowY: 'auto' }}>
                  {submissions.map((submission) => (
                    <ListItem
                      key={submission.id}
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          <IconButton onClick={() => handleDownloadSubmission(submission.id)}>
                            <DownloadIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteSubmission(submission.id)}>
                            <DeleteForeverIcon />
                          </IconButton>
                        </Stack>
                      }
                    >
                      <ListItemText
                        primary={submission.originalName}
                        secondary={
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                            <Typography variant="caption" color="text.secondary">
                              {formatSize(submission.fileSize)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(submission.createdAt)}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Stack>
          )}
        </Paper>
      </Stack>
    </Box>
  );
}
