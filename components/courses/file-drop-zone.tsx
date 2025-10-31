"use client";

import { useMemo, useRef, useState } from 'react';
import { Box, Typography, Stack, Chip, Alert } from '@mui/material';
import type { Activity, FileDropConfig } from '@/lib/dataTemplate';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond/dist/filepond.min.css';

let filePondPluginsRegistered = false;
if (typeof window !== 'undefined' && !filePondPluginsRegistered) {
  registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);
  filePondPluginsRegistered = true;
}

const isWithinWindow = (start?: string | null, end?: string | null) => {
  const now = new Date();
  if (start) {
    const startDate = new Date(start);
    if (now < startDate) {
      return false;
    }
  }
  if (end) {
    const endDate = new Date(end);
    if (now > endDate) {
      return false;
    }
  }
  return true;
};

interface FileDropZoneProps {
  activity: Activity;
  courseId: string;
}

type StatusKind = 'success' | 'error' | 'info';

export function FileDropZone({ activity, courseId }: FileDropZoneProps) {
  const pondRef = useRef<any>(null);
  const [status, setStatus] = useState<{ kind: StatusKind; message: string } | null>(null);

  const config: FileDropConfig = useMemo(() => {
    if (activity.dropzoneConfig && typeof activity.dropzoneConfig === 'object') {
      return activity.dropzoneConfig;
    }
    return {
      enabled: true,
      acceptedTypes: ['.pdf'],
      timeRestricted: false,
      maxSizeMb: 50,
      displayName: activity.title
    };
  }, [activity.dropzoneConfig, activity.title]);

  const withinWindow = !config.timeRestricted || isWithinWindow(config.startAt ?? undefined, config.endAt ?? undefined);
  const isActive = Boolean(config.enabled && withinWindow);
  const configuredTypes = Array.isArray(config.acceptedTypes) ? config.acceptedTypes : [];
  const acceptsAll = configuredTypes.length === 0;
  const maxSizeMb = config.maxSizeMb ?? 50;

  const handleProcess = (error: any, file: any) => {
    if (error) {
      setStatus({ kind: 'error', message: error.body?.error || 'Échec de l\'envoi du fichier.' });
      return;
    }
    setStatus({ kind: 'success', message: `"${file.filename}" a été déposé avec succès.` });
  pondRef.current?.removeFile(file.id);
  };

  const serverConfig = {
    process: {
      url: '/api/file-drop/upload',
      method: 'POST',
      withCredentials: false,
      ondata: (formData: FormData) => {
        formData.append('activityId', activity.id);
        return formData;
      },
      onload: (response: string) => {
        try {
          const data = JSON.parse(response);
          if (!data.success) {
            throw new Error(data.error || 'Envoi refusé');
          }
        } catch {
          /* noop: FilePond already handles errors */
        }
        return response;
      },
      onerror: (response: string) => {
        try {
          const data = JSON.parse(response);
          setStatus({ kind: 'error', message: data.error || 'Le serveur a refusé ce fichier.' });
        } catch {
          setStatus({ kind: 'error', message: 'Erreur inattendue lors de l\'envoi.' });
        }
      }
    }
  } as const;

  const renderSchedule = () => {
    if (!config.timeRestricted) {
      return 'Disponible en continu';
    }
    const start = config.startAt ? new Date(config.startAt).toLocaleString('fr-FR') : '—';
    const end = config.endAt ? new Date(config.endAt).toLocaleString('fr-FR') : '—';
    return `Ouvert du ${start} au ${end}`;
  };

  const statusIndicatorLabel = isActive ? 'Ouvert' : 'Fermé';

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 3,
        mb: 3,
        boxShadow: (theme) => theme.shadows[1]
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Box
          component="span"
          sx={({ palette }) => {
            const color = isActive ? palette.success.main : palette.error.main;
            return {
              width: 14,
              height: 14,
              borderRadius: '50%',
              bgcolor: color,
              boxShadow: `0 0 6px ${color}`
            };
          }}
        />
        <Typography variant="h6" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
          {config.displayName || activity.title}
        </Typography>
        <Chip
          label={statusIndicatorLabel}
          color={isActive ? 'success' : 'error'}
          size="small"
          sx={{ textTransform: 'uppercase', fontWeight: 600 }}
        />
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Stockage : <code>public/depots/{courseId}</code>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Taille max : {maxSizeMb} Mo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {renderSchedule()}
        </Typography>
      </Stack>

      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
        {acceptsAll ? (
          <Chip label="Tous formats" color="primary" size="small" />
        ) : (
          configuredTypes.map((type) => (
            <Chip key={type} label={type.toUpperCase()} variant="outlined" size="small" />
          ))
        )}
      </Stack>

      {!config.enabled && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Ce dépôt est désactivé. Contactez votre enseignant pour plus d&apos;informations.
        </Alert>
      )}

      {config.enabled && !withinWindow && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Ce dépôt est en dehors de la période d&apos;ouverture.
        </Alert>
      )}

      {status && (
        <Alert severity={status.kind === 'info' ? 'info' : status.kind} sx={{ mb: 2 }}>
          {status.message}
        </Alert>
      )}

      <FilePond
        ref={pondRef}
        name="file"
        allowMultiple
        maxFiles={10}
        server={serverConfig}
        disabled={!isActive}
  acceptedFileTypes={acceptsAll ? undefined : configuredTypes}
        maxFileSize={`${maxSizeMb}MB`}
        labelIdle='Déposez vos fichiers ici ou <span class="filepond--label-action">parcourez</span>'
        credits={false}
        onprocessfile={handleProcess}
        onprocessfileabort={() => setStatus({ kind: 'info', message: 'Envoi annulé.' })}
      />
    </Box>
  );
}
