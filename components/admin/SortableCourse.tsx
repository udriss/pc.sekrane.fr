import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import { Tooltip, IconButton, Box, Typography, Stack, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface PropsSortableCourse {
  courseId: string;
  courseTitle: string;
  isHidden?: boolean;
  isDisabled?: boolean;
  onDelete: (courseId: string) => void;
  onToggleHidden: (courseId: string, hidden: boolean) => void;
  onToggleDisabled: (courseId: string, disabled: boolean) => void;
}

export function SortableCourse({ 
  courseId, 
  courseTitle, 
  isHidden = false,
  isDisabled = false,
  onDelete,
  onToggleHidden,
  onToggleDisabled
}: PropsSortableCourse) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: courseId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isVisible = !isHidden;
  const isActive = !isDisabled;

  return (
    <Box
      component="li"
      ref={setNodeRef}
      style={style}
      sx={{
        p: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 1,

      }}
    >
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}
      >
        {/* Drag handle section */}
        <Box {...attributes} {...listeners} sx={{ cursor: 'move', userSelect: 'none', marginRight: 1 }}>
          <DragIndicatorIcon fontSize='medium' />
        </Box>

        {/* Course title */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {courseTitle}
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 0.5 }}>
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <Tooltip title="Ouvrir la page du cours">
            <IconButton
              size="small"
              onClick={() => window.open(`/courses/${courseId}`, '_blank', 'noopener,noreferrer')}
            >
              <OpenInNewIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title={isVisible ? "Masquer le cours" : "Afficher le cours"}>
            <IconButton
              size="small"
              onClick={() => onToggleHidden(courseId, !isVisible)}
              sx={{ color: isVisible ? 'success.main' : 'error.main' }}
            >
              {isVisible ? <VisibilityIcon fontSize="inherit" /> : <VisibilityOffIcon fontSize="inherit" />}
            </IconButton>
          </Tooltip>
          <Tooltip title={isActive ? "Désactiver le cours" : "Activer le cours"}>
            <IconButton
              size="small"
              onClick={() => onToggleDisabled(courseId, !isActive)}
              sx={{ color: isActive ? 'primary.main' : 'warning.main' }}
            >
              {isActive ? <CheckCircleIcon fontSize="inherit" /> : <BlockIcon fontSize="inherit" />}
            </IconButton>
          </Tooltip>
        </Stack>
        <Box sx={{ minWidth: 140, minHeight: 36, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {confirmDelete ? (
            <>
              <IconButton
                size="small"
                onFocus={(event) => event.currentTarget.blur()}
                onClick={() => onDelete(courseId)}
                sx={{ color: 'error.main' }}
                title="Confirmer la suppression"
              >
                <CheckIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                size="small"
                onFocus={(event) => event.currentTarget.blur()}
                onClick={() => setConfirmDelete(false)}
                sx={{ color: 'text.secondary' }}
                title="Annuler"
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </>
          ) : (
            <>
            <Tooltip title="Supprimer le cours">
              <span>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setConfirmDelete(true)}
              >
                Supprimer
              </Button>
              </span>
            </Tooltip>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}