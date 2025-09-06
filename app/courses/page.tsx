// app/courses/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { CourseCard } from "@/components/courses/course-card";
import { ProgressionCard } from "@/components/courses/progression-card";
import { Course, Classe } from "@/lib/dataTemplate";
import { 
  Select, 
  MenuItem, 
  Chip, 
  Box, 
  FormControl,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
  Grid,
  Container,
  useTheme
} from "@mui/material";
import Cookies from 'js-cookie';

export const dynamic = "force-dynamic";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export default function CoursesPage() {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const theme = useTheme();

  useEffect(() => {
    // Load saved classes from cookie
    const savedClasses = Cookies.get('selectedClasses');
    if (savedClasses) {
      try {
        setSelectedClasses(JSON.parse(savedClasses));
      } catch (e) {
        // If parsing fails, reset the cookie
        Cookies.remove('selectedClasses');
      }
    }

    fetch("/api/courses")
      .then((res) => res.json())
      .then((data: { courses: Course[], classes: Classe[] }) => {
        setCourses(data.courses);
        const visibleClasses = data.classes.filter(classe => classe.toggleVisibilityClasse !== false);
        setClasses(visibleClasses);
      });
  }, []);

  const handleClassesChange = (event: any) => {
    const { value } = event.target;
    setSelectedClasses(typeof value === 'string' ? value.split(',') : value);
    Cookies.set('selectedClasses', JSON.stringify(typeof value === 'string' ? value.split(',') : value), { expires: 365 });
  };

  const filteredCourses = selectedClasses.length > 0
    ? courses.filter((course) => 
        selectedClasses.includes(course.classe) && 
        (course.toggleVisibilityCourse !== false)
      )
    : courses.filter((course) => course.toggleVisibilityCourse !== false);

  // Sort courses by class name then by course title
  filteredCourses.sort((a, b) => {
    if (a.classe !== b.classe) {
      return a.classe.localeCompare(b.classe);
    }
    return a.title.localeCompare(b.title);
  });

  // Get classes with progression enabled
  const classesWithProgression = classes.filter(classe => 
    classe.hasProgression && selectedClasses.includes(classe.name)
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ 
          mb: 4, 
          textAlign: 'center', 
          fontWeight: 'bold',
          color: '#1a237e',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            backgroundColor: '#303f9f',
            borderRadius: '2px'
          }
        }}
      >
        Cours disponibles
      </Typography>

      <Box 
        sx={{ 
          position: 'relative',
          // top: 20,
          zIndex: 10,
          mb: 5, 
          display: 'flex', 
          justifyContent: 'center'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            padding: 2, 
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            width: { xs: '100%', sm: 500 },
            maxWidth: '100%'
          }}
        >
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mb: 1, 
              fontWeight: 'medium', 
              color: '#3f51b5',
              textAlign: 'center'
            }}
          >
            Sélectionnez vos classes
          </Typography>

          <Box 
            sx={{ 
              maxHeight: '200px', 
              overflowY: 'auto',
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
              p: 1,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#bdbdbd',
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: '#9e9e9e',
                },
              },
            }}
          >
            {classes.map((classe) => (
              <Box
                key={classe.id}
                onClick={() => {
                  const newSelected = selectedClasses.includes(classe.name)
                    ? selectedClasses.filter(c => c !== classe.name)
                    : [...selectedClasses, classe.name];
                  
                  setSelectedClasses(newSelected);
                  Cookies.set('selectedClasses', JSON.stringify(newSelected), { expires: 365 });
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 1,
                  margin: '4px 0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: selectedClasses.includes(classe.name) 
                    ? 'rgba(63, 81, 181, 0.15)' 
                    : 'white',
                  border: '1px solid',
                  borderColor: selectedClasses.includes(classe.name) 
                    ? '#3f51b5' 
                    : 'rgba(0, 0, 0, 0.12)',
                  '&:hover': {
                    backgroundColor: selectedClasses.includes(classe.name)
                      ? 'rgba(63, 81, 181, 0.25)'
                      : 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <Box 
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '4px',
                    border: '2px solid',
                    borderColor: selectedClasses.includes(classe.name) ? '#3f51b5' : '#9e9e9e',
                    mr: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: selectedClasses.includes(classe.name) ? '#3f51b5' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {selectedClasses.includes(classe.name) && (
                    <Box 
                      component="span"
                      sx={{
                        color: 'white',
                        fontSize: '0.8rem',
                        lineHeight: 1,
                      }}
                    >
                      ✓
                    </Box>
                  )}
                </Box>
                <Typography 
                  sx={{ 
                    fontWeight: selectedClasses.includes(classe.name) ? 'bold' : 'normal',
                    color: selectedClasses.includes(classe.name) ? '#3f51b5' : 'text.primary',
                  }}
                >
                  {classe.name}
                </Typography>
              </Box>
            ))}
          </Box>

          {selectedClasses.length > 0 && (
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 0.5, 
                mt: 2,
                justifyContent: 'center'
              }}
            >
              {selectedClasses.map((value) => (
                <Chip 
                  key={value} 
                  label={value}
                  onDelete={() => {
                    const newSelected = selectedClasses.filter(c => c !== value);
                    setSelectedClasses(newSelected);
                    Cookies.set('selectedClasses', JSON.stringify(newSelected), { expires: 365 });
                  }}
                  sx={{ 
                    bgcolor: '#3f51b5', 
                    color: 'white',
                    fontWeight: 'medium',
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        color: 'white'
                      }
                    }
                  }} 
                />
              ))}
              {selectedClasses.length > 1 && (
                <Chip 
                  label="Tout effacer"
                  onClick={() => {
                    setSelectedClasses([]);
                    Cookies.remove('selectedClasses');
                  }}
                  sx={{ 
                    bgcolor: '#f44336', 
                    color: 'white',
                    fontWeight: 'medium',
                  }} 
                />
              )}
            </Box>
          )}
        </Paper>
      </Box>

      {/* Progression Cards Section */}
      {classesWithProgression.length > 0 && (
        <>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              mb: 3, 
              mt: 6,
              textAlign: 'center', 
              fontWeight: 'bold',
              color: '#6b21a8'
            }}
          >
            Progressions
          </Typography>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {classesWithProgression.map((classe) => (
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }} key={`prog-${classe.id}`}>
                <ProgressionCard classeId={classe.id} classeName={classe.name} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Courses Section */}
      {filteredCourses.length > 0 ? (
        <Grid container spacing={3}>
          {filteredCourses.map((course) => (
            <Grid size={{ xs:12, sm:12, md:6, lg:6 }} key={course.id}>
              <Paper
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <CourseCard course={course} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {selectedClasses.length > 0 
              ? "Aucun cours disponible pour les classes sélectionnées" 
              : "Sélectionnez une classe pour voir les cours disponibles"}
          </Typography>
        </Box>
      )}
    </Container>
  );
}