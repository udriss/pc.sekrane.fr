"use client";

import React, { useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { Container, Typography, Grid, Paper, Box, Button, Chip, Card, CardContent, CardActions } from '@mui/material';
import { Course, Classe } from '@/lib/dataTemplate';

export const dynamic = "force-dynamic";

export default function ClassesPage() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/courses')
      .then(res => res.json())
      .then((data: { courses: Course[]; classes: Classe[] }) => {
        if (!mounted) return;
        const visibleClasses = data.classes.filter(c => c.toggleVisibilityClasse !== false);
        const visibleCourses = data.courses.filter(c => c.toggleVisibilityCourse !== false);
        setClasses(visibleClasses);
        setCourses(visibleCourses);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const courseCountByClasse = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of courses) {
      const key = c.theClasseId;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [courses]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}
      >
        Classes
      </Typography>

      <Grid container spacing={3}>
        {classes.map((classe) => (
          <Grid key={classe.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                    {classe.name}
                  </Typography>
                  {classe.hasProgression && (
                    <Chip size="small" color="secondary" variant="outlined" label="Progression" />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {courseCountByClasse.get(classe.id) || 0} cours
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: 'auto', p: 2, pt: 0 }}>
                <Button
                  component={NextLink}
                  href={`/classes/${classe.id}`}
                  variant="outlined"
                  fullWidth
                  sx = {{
                    fontWeight: 'bold'
                  }}
                >
                  Ouvrir
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {!loading && classes.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper elevation={0} sx={{ p: 6, textAlign: 'center' }}>
              <Typography color="text.secondary">Aucune classe disponible.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
