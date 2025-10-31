import React from 'react';
import { UnifiedAdminActions } from '@/components/admin/unified-admin-actions';
import { ProgressionEditDialog } from '@/components/admin/admin-corruption/ProgressionEditDialog';
import { ProgressionDeleteDialog } from '@/components/admin/admin-corruption/ProgressionDeleteDialog';
import { Course, Classe } from '@/lib/data';
import { Stack, Box } from '@mui/material';
import { useProgressionState } from '@/components/admin/admin-corruption/hooks/useProgressionState';
import { useSnackbarState } from '@/components/admin/admin-corruption/hooks/useSnackbarState';
import { SnackbarProvider } from '@/components/admin/admin-corruption/SnackbarProvider';

interface UploadFormProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
}

export function UploadForm({ courses, setCourses, classes, setClasses }: UploadFormProps) {
  const progressionState = useProgressionState();
  const snackbarState = useSnackbarState();

  return (
    <>
      <Stack 
        spacing={2} 
        sx={{ width: '100%' }}
      >
        <UnifiedAdminActions 
          courses={courses} 
          setCourses={setCourses} 
          classes={classes} 
          setClasses={setClasses}
          showSnackbar={snackbarState.showSnackbar}
          progressionState={progressionState}
        />
      </Stack>

      {/* Dialogs - hidden from layout */}
      <Box sx={{ display: 'none' }}>
        <ProgressionEditDialog
          courses={courses}
          progressionState={progressionState}
          showSnackbar={snackbarState.showSnackbar}
        />

        <ProgressionDeleteDialog
          progressionState={progressionState}
          showSnackbar={snackbarState.showSnackbar}
        />
      </Box>

      <SnackbarProvider snackbarState={snackbarState} />
    </>
  );
} 