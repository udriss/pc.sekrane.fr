import React from 'react';
import { ModificationsAdmin } from '@/components/admin/admin-corruption';
import { GenerationsAdmin } from '@/components/admin/admin-generation';
import { Course, Classe } from '@/lib/data';
import { Stack, Box } from '@mui/material';

interface UploadFormProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
}

export function UploadForm({ courses, setCourses, classes, setClasses }: UploadFormProps) {
  return (
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
  );
} 