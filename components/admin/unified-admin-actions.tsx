// /components/admin/unified-admin-actions.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Course, Classe } from '@/lib/data';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, ToggleButtonGroup, ToggleButton, Tooltip, Chip, alpha } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FolderIcon from '@mui/icons-material/Folder';
import TimelineIcon from '@mui/icons-material/Timeline';


// Import des composants de modification
import { ActivityModificationCard } from './admin-corruption/ActivityModificationCard';
import { CourseModificationCard } from './admin-corruption/CourseModificationCard';
import { ClassModificationCard } from './admin-corruption/ClassModificationCard';
import { FileDropManagementCard } from './admin-corruption/FileDropManagementCard';

// Import des composants de génération
import { ActivityGenerationSection } from './admin-generation-sections/ActivityGenerationSection';
import { CourseGenerationSection } from './admin-generation-sections/CourseGenerationSection';
import { ClassGenerationSection } from './admin-generation-sections/ClassGenerationSection';
import { FileDropCreationSection } from './admin-corruption/FileDropCreationSection';
import { ProgressionModificationCard } from './admin-corruption/ProgressionModificationCard';

interface UnifiedAdminActionsProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
  showSnackbar: (message: React.ReactNode, severity?: 'success' | 'error' | 'info' | 'warning') => void;
  progressionState?: any;
}

type ActionMode = 'edit' | 'add';

interface StyledAdminAccordionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  mode: ActionMode;
  setMode: (mode: ActionMode) => void;
  children: React.ReactNode;
  showModeToggle?: boolean;
}

function StyledAdminAccordion({ title, description, icon, color, mode, setMode, children, showModeToggle = true }: StyledAdminAccordionProps) {
  return (
    <Accordion
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: (theme) => theme.shadows[2],
        '&:before': { display: 'none' },
        '&:not(:last-child)': { mb: 0 },
        background: 'background.paper',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[2],
          transform: 'translateY(-1.5px)',
        },
        mb: 0,
      }}
    >
      <AccordionSummary
        component="div"
        expandIcon={<ExpandMoreIcon sx={{ color: `${color}.main` }} />}
        sx={{
          borderRadius: 2,
          minHeight: 64,
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
          },
          background: (theme) => `linear-gradient(135deg, ${theme.palette[color]}15, ${theme.palette[color].main}08)`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              borderColor: (theme) => `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
              borderWidth: 2,
              borderStyle: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: (theme) => alpha(theme.palette[color].dark, 0.4),
              boxShadow: (theme) => theme.shadows[2],
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant='h6' fontWeight="700" sx={{ fontVariant: 'small-caps', color: `text.primary` }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Box>
        {showModeToggle && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 2 }}>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(e, newMode) => {
                if (newMode !== null) {
                  setMode(newMode);
                }
              }}
              size="small"
              onClick={(e) => e.stopPropagation()}
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              <ToggleButton value="edit" aria-label="modifier" sx={{ px: 1.5 }}>
                <Tooltip title="Modifier">
                  <EditIcon fontSize="small" color={mode === 'edit' ? 'warning' : 'inherit'} />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="add" aria-label="ajouter" sx={{ px: 1.5 }}>
                <Tooltip title="Ajouter">
                  <AddCircleIcon fontSize="small" color={mode === 'add' ? 'success' : 'inherit'} />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0, mt: 2, }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
}

export function UnifiedAdminActions({ courses, setCourses, classes, setClasses, showSnackbar, progressionState }: UnifiedAdminActionsProps) {
  const [activityMode, setActivityMode] = useState<ActionMode>('edit');
  const [courseMode, setCourseMode] = useState<ActionMode>('edit');
  const [classMode, setClassMode] = useState<ActionMode>('edit');
  const [depotMode, setDepotMode] = useState<ActionMode>('edit');

  // États partagés pour les sélections d'activité
  const [selectedClassForActivity, setSelectedClassForActivity] = useState<string>('');
  const [selectedCourseForActivity, setSelectedCourseForActivity] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<string>('');

  // États partagés pour les sélections de cours
  const [selectedClassForCourse, setSelectedClassForCourse] = useState<string>('');
  const [selectedCourseForCourse, setSelectedCourseForCourse] = useState<string>('');

  // États partagés pour les sélections de classe
  const [selectedClassForClass, setSelectedClassForClass] = useState<string>('');

  // États partagés pour les sélections de dépôt
  const [selectedClassForDepot, setSelectedClassForDepot] = useState<string>('');
  const [selectedCourseForDepot, setSelectedCourseForDepot] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const fetchRes = await fetch('/api/courses');
      const freshData = await fetchRes.json();
      setCourses(freshData.courses);
      setClasses(freshData.classes);
    };

    fetchData();
  }, [setClasses, setCourses]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      p: 2,
      background: (theme) => `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
      borderRadius: 3,
      minHeight: '100%'
    }}>
      {/* ACTIVITÉ */}
        <StyledAdminAccordion
          title="activité"
          description="Gérer les activités pédagogiques"
          icon={<SchoolIcon />}
          color="primary"
          mode={activityMode}
          setMode={setActivityMode}
        >
          {activityMode === 'edit' ? (
            <ActivityModificationCard
              courses={courses}
              setCourses={setCourses}
              classes={classes}
              setClasses={setClasses}
              showSnackbar={showSnackbar}
              selectedClass={selectedClassForActivity}
              setSelectedClass={setSelectedClassForActivity}
              selectedCourse={selectedCourseForActivity}
              setSelectedCourse={setSelectedCourseForActivity}
              selectedActivity={selectedActivity}
              setSelectedActivity={setSelectedActivity}
            />
          ) : (
            <ActivityGenerationSection
              courses={courses}
              setCourses={setCourses}
              classes={classes}
              setClasses={setClasses}
              showSnackbar={showSnackbar}
              selectedClass={selectedClassForActivity}
              setSelectedClass={setSelectedClassForActivity}
              selectedCourse={selectedCourseForActivity}
              setSelectedCourse={setSelectedCourseForActivity}
            />
          )}
        </StyledAdminAccordion>

        {/* COURS */}
        <StyledAdminAccordion
          title="cours"
          description="Organiser les cours et programmes"
          icon={<MenuBookIcon />}
          color="error"
          mode={courseMode}
          setMode={setCourseMode}
        >
          {courseMode === 'edit' ? (
            <CourseModificationCard
              courses={courses}
              setCourses={setCourses}
              classes={classes}
              setClasses={setClasses}
              showSnackbar={showSnackbar}
              selectedClass={selectedClassForCourse}
              setSelectedClass={setSelectedClassForCourse}
              selectedCourse={selectedCourseForCourse}
              setSelectedCourse={setSelectedCourseForCourse}
            />
          ) : (
            <CourseGenerationSection
              courses={courses}
              setCourses={setCourses}
              classes={classes}
              setClasses={setClasses}
              showSnackbar={showSnackbar}
            />
          )}
        </StyledAdminAccordion>

        {/* CLASSE */}
        <StyledAdminAccordion
          title="classe"
          description="Gérer les cours d'une classe"
          icon={<ClassIcon />}
          color="info"
          mode={classMode}
          setMode={setClassMode}
        >
          {classMode === 'edit' ? (
            <ClassModificationCard
              courses={courses}
              setCourses={setCourses}
              classes={classes}
              setClasses={setClasses}
              showSnackbar={showSnackbar}
              selectedClass={selectedClassForClass}
              setSelectedClass={setSelectedClassForClass}
            />
          ) : (
            <ClassGenerationSection
              classes={classes}
              setClasses={setClasses}
              showSnackbar={showSnackbar}
            />
          )}
        </StyledAdminAccordion>

        {/* DÉPÔT */}
        <StyledAdminAccordion
          title="dépôt"
          description="Gérer les zones de dépôt de fichiers"
          icon={<FolderIcon />}
          color="success"
          mode={depotMode}
          setMode={setDepotMode}
        >
          {depotMode === 'edit' ? (
            <FileDropManagementCard
              courses={courses}
              setCourses={setCourses}
              classes={classes}
              setClasses={setClasses}
              showSnackbar={showSnackbar}
              selectedClass={selectedClassForDepot}
              setSelectedClass={setSelectedClassForDepot}
              selectedCourse={selectedCourseForDepot}
              setSelectedCourse={setSelectedCourseForDepot}
            />
          ) : (
            <FileDropCreationSection
              courses={courses}
              setCourses={setCourses}
              classes={classes}
              setClasses={setClasses}
              showSnackbar={showSnackbar}
              selectedClass={selectedClassForDepot}
              setSelectedClass={setSelectedClassForDepot}
              selectedCourse={selectedCourseForDepot}
              setSelectedCourse={setSelectedCourseForDepot}
            />
          )}
        </StyledAdminAccordion>

        {/* PROGRESSION */}
        {progressionState && (
          <StyledAdminAccordion
            title="progression"
            description="Suivre l'avancement pédagogique"
            icon={<TimelineIcon />}
            color="warning"
            mode="edit"
            setMode={() => {}}
            showModeToggle={false}
          >
            <ProgressionModificationCard
              courses={courses}
              classes={classes}
              setCourses={setCourses}
              setClasses={setClasses}
              showSnackbar={showSnackbar}
              progressionState={progressionState}
            />
          </StyledAdminAccordion>
        )}
    </Box>
  );
}
