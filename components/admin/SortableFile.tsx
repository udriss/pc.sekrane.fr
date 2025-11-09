import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  DragIndicator, 
  OpenInNew as OpenInNewIcon,
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Tooltip, IconButton, ListItem, Box, Typography, Button, Stack } from '@mui/material';

interface PropsSortableFile {
  fileId: string;
  fileUrl: string;
  fileName: string;
  onDelete: (fileId: string) => void;
  isHidden?: boolean;
  isDisabled?: boolean;
  onToggleHidden?: (fileId: string) => void;
  onToggleDisabled?: (fileId: string) => void;
}

export function SortableFile({
  fileId, 
  fileUrl, 
  fileName, 
  onDelete,
  isHidden = false,
  isDisabled = false,
  onToggleHidden,
  onToggleDisabled
}: PropsSortableFile) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: fileId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem 
      ref={setNodeRef} 
      style={style} 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1,
        px:0,
        backgroundColor: 'background.paper',
        borderRadius: 1
      }}
    >
      <Stack
        sx= {{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}
      >
      {/* Drag handle section */}
      <Box {...attributes} {...listeners} sx={{ cursor: 'move', userSelect: 'none', marginRight: 1 }}>
        <DragIndicator fontSize='medium' />
      </Box>

      {/* File name and delete logic */}
      <Box sx={{ flex: 1, gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 1 }}>
        <Typography variant="body1" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
          {fileName}
        </Typography>
        {fileUrl && (
          <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', color: 'text.secondary' }}>
            {fileUrl}
          </Typography>
        )}
      </Box>
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 0.5 }}>
        <Stack
        sx= {{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}
        >
        {fileUrl && (
          <Tooltip title="Ouvrir le fichier dans un nouvel onglet">
            <IconButton
              size="small"
              onClick={() => window.open(`/api/files${fileUrl}`, '_blank', 'noopener,noreferrer')}
            >
              <OpenInNewIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        )}
        {onToggleHidden && (
          <Tooltip title={isHidden ? "Afficher l'activité" : "Masquer l'activité"}>
            <IconButton
              size="small"
              onClick={() => onToggleHidden(fileId)}
              sx={{ color: isHidden ? 'error.main' : 'success.main' }}
            >
              {isHidden ? <VisibilityOffIcon fontSize="inherit" /> : <VisibilityIcon fontSize="inherit" />}
            </IconButton>
          </Tooltip>
        )}
        {onToggleDisabled && (
          <Tooltip title={isDisabled ? "Activer l'activité" : "Désactiver l'activité"}>
            <IconButton
              size="small"
              onClick={() => onToggleDisabled(fileId)}
              sx={{ color: isDisabled ? 'error.main' : 'success.main' }}
            >
              {isDisabled ? <BlockIcon fontSize="inherit" /> : <CheckCircleIcon fontSize="inherit" />}
            </IconButton>
          </Tooltip>
        )}
        </Stack>
        {confirmDelete ? (
          <>
            <Tooltip title="Confirmer la suppression">
              <IconButton
                size="small"
                onClick={() => onDelete(fileId)}
                sx={{ color: 'error.main' }}
              >
                <CheckIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Annuler">
              <IconButton
                size="small"
                onClick={() => setConfirmDelete(false)}
                sx={{ color: 'text.secondary' }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Supprimer l'activité">
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setConfirmDelete(true)}
            >
              Supprimer
            </Button>
          </Tooltip>
        )}
      </Box>
    </ListItem>
  );
}