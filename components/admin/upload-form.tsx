import React from 'react';
import { ModificationsAdmin } from '@/components/admin/admin-corruption';
import { GenerationsAdmin } from '@/components/admin/admin-generation';
import { ProgressionModificationCard } from '@/components/admin/admin-corruption/ProgressionModificationCard';
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
        direction={{ xs: 'column', xl: 'row' }} 
        spacing={2} 
        sx={{ width: '100%' }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ModificationsAdmin courses={courses} setCourses={setCourses} classes={classes} setClasses={setClasses} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <GenerationsAdmin courses={courses} setCourses={setCourses} classes={classes} setClasses={setClasses} />
        </Box>
      </Stack>
      <Stack 
        spacing={2} 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        mt:.5,
       }}
      >
      <ProgressionModificationCard
        courses={courses}
        classes={classes}
        setClasses={setClasses}
        showSnackbar={snackbarState.showSnackbar}
        progressionState={progressionState}
      />
      </Stack>

      <ProgressionEditDialog
        courses={courses}
        progressionState={progressionState}
        showSnackbar={snackbarState.showSnackbar}
      />

      <ProgressionDeleteDialog
        progressionState={progressionState}
        showSnackbar={snackbarState.showSnackbar}
      />

      <SnackbarProvider snackbarState={snackbarState} />
    </>
  );
} 