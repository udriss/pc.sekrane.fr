"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, notFound } from 'next/navigation';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import { Course, Classe } from '@/lib/dataTemplate';
import { CourseCard } from '@/components/courses/course-card';
import { ProgressionCard } from '@/components/courses/progression-card';

function parseJJMMYYYY(input?: string | null): Date | undefined {
  if (!input) return undefined;
  if (!/^\d{8}$/.test(input)) return undefined;
  const jj = Number(input.slice(0, 2));
  const mm = Number(input.slice(2, 4)) - 1; // 0-indexed
  const yyyy = Number(input.slice(4, 8));
  const d = new Date(yyyy, mm, jj);
  // Validate date correctness (e.g. 31/02 -> invalid)
  return d.getFullYear() === yyyy && d.getMonth() === mm && d.getDate() === jj ? d : undefined;
}

export default function ClassePage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [loading, setLoading] = useState(true);

  const classeId = params?.id;
  const dateParam = search?.get('date'); // JJMMYYYY
  const initialDate = useMemo(() => parseJJMMYYYY(dateParam), [dateParam]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/courses')
      .then(res => res.json())
      .then((data: { courses: Course[]; classes: Classe[] }) => {
        if (!mounted) return;
        const visibleCourses = data.courses.filter(c => c.toggleVisibilityCourse !== false);
        const visibleClasses = data.classes.filter(cl => cl.toggleVisibilityClasse !== false);
        setCourses(visibleCourses);
        setClasses(visibleClasses);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const classe = classes.find(c => c.id === classeId);
  const classeName = classe?.name ?? 'Classe';

  const classeCourses = useMemo(() =>
    courses.filter(c => c.theClasseId === classeId),
  [courses, classeId]);

  // If finished loading and class not found => 404
  if (!loading && !classe) {
    notFound();
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
        {classeName}
      </Typography>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Chip label={`ID: ${classeId}`} variant="outlined" />
        {initialDate && (
          <Chip label={`Date: ${initialDate.toLocaleDateString('fr-FR')}`} sx={{ ml: 1 }} />
        )}
      </Box>

      {classe?.hasProgression ? (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
            Progression
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <ProgressionCard
                  classeId={classeId as string}
                  classeName={classeName}
                  initialDate={initialDate}
                  onDateChange={(d) => {
                    const current = new URLSearchParams(Array.from(search?.entries?.() || []));
                    if (d) {
                      const dd = String(d.getDate()).padStart(2, '0');
                      const mm = String(d.getMonth() + 1).padStart(2, '0');
                      const yyyy = d.getFullYear();
                      current.set('date', `${dd}${mm}${yyyy}`);
                    } else {
                      current.delete('date');
                    }
                    const qs = current.toString();
                    // Shallow replace without reload
                    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Alert severity="info" sx={{ mb: 6 }}>
          La progression n&apos;est pas activée pour cette classe.
        </Alert>
      )}

      <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
        Cours
      </Typography>
  <Grid container spacing={3}>
        {classeCourses.length > 0 ? (
          classeCourses.map(course => (
    <Grid key={course.id} size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
              <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CourseCard course={course} />
              </Paper>
            </Grid>
          ))
        ) : (
      <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography color="text.secondary">
                Aucun cours disponible pour cette classe.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
