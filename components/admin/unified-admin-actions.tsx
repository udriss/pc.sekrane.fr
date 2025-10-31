// /components/admin/unified-admin-actions.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Course, Classe } from '@/lib/data';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';


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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter}>
        {/* ACTIVITÉ */}
        <Accordion>
          <AccordionSummary component="div" expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
              <Typography variant='body2' fontWeight="bold" fontSize={23} sx={{ fontVariant: 'small-caps' }}>
                activité
              </Typography>
              <ToggleButtonGroup
                value={activityMode}
                exclusive
                onChange={(e, newMode) => {
                  if (newMode !== null) {
                    setActivityMode(newMode);
                  }
                }}
                size="small"
                onClick={(e) => e.stopPropagation()}
              >
                <ToggleButton value="edit" aria-label="modifier">
                  <Tooltip title="Modifier">
                    <EditIcon fontSize="small" color={activityMode === 'edit' ? 'warning' : 'inherit'} />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="add" aria-label="ajouter">
                  <Tooltip title="Ajouter">
                    <AddCircleIcon fontSize="small" color={activityMode === 'add' ? 'success' : 'inherit'} />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
        </Accordion>

        {/* COURS */}
        <Accordion>
          <AccordionSummary component="div" expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
              <Typography variant='body2' fontWeight="bold" fontSize={23} sx={{ fontVariant: 'small-caps' }}>
                cours
              </Typography>
              <ToggleButtonGroup
                value={courseMode}
                exclusive
                onChange={(e, newMode) => {
                  if (newMode !== null) {
                    setCourseMode(newMode);
                  }
                }}
                size="small"
                onClick={(e) => e.stopPropagation()}
              >
                <ToggleButton value="edit" aria-label="modifier">
                  <Tooltip title="Modifier">
                    <EditIcon fontSize="small" color={courseMode === 'edit' ? 'warning' : 'inherit'} />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="add" aria-label="ajouter">
                  <Tooltip title="Ajouter">
                    <AddCircleIcon fontSize="small" color={courseMode === 'add' ? 'success' : 'inherit'} />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
        </Accordion>

        {/* CLASSE */}
        <Accordion>
          <AccordionSummary component="div" expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
              <Typography variant='body2' fontWeight="bold" fontSize={23} sx={{ fontVariant: 'small-caps' }}>
                classe
              </Typography>
              <ToggleButtonGroup
                value={classMode}
                exclusive
                onChange={(e, newMode) => {
                  if (newMode !== null) {
                    setClassMode(newMode);
                  }
                }}
                size="small"
                onClick={(e) => e.stopPropagation()}
              >
                <ToggleButton value="edit" aria-label="modifier">
                  <Tooltip title="Modifier">
                    <EditIcon fontSize="small" color={classMode === 'edit' ? 'warning' : 'inherit'} />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="add" aria-label="ajouter">
                  <Tooltip title="Ajouter">
                    <AddCircleIcon fontSize="small" color={classMode === 'add' ? 'success' : 'inherit'} />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
        </Accordion>

        {/* DÉPÔT */}
        <Accordion>
          <AccordionSummary component="div" expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
              <Typography variant='body2' fontWeight="bold" fontSize={23} sx={{ fontVariant: 'small-caps' }}>
                dépôt
              </Typography>
              <ToggleButtonGroup
                value={depotMode}
                exclusive
                onChange={(e, newMode) => {
                  if (newMode !== null) {
                    setDepotMode(newMode);
                  }
                }}
                size="small"
                onClick={(e) => e.stopPropagation()}
              >
                <ToggleButton value="edit" aria-label="modifier">
                  <Tooltip title="Modifier">
                    <EditIcon fontSize="small" color={depotMode === 'edit' ? 'warning' : 'inherit'} />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="add" aria-label="ajouter">
                  <Tooltip title="Ajouter">
                    <AddCircleIcon fontSize="small" color={depotMode === 'add' ? 'success' : 'inherit'} />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
        </Accordion>

        {/* PROGRESSION */}
        {progressionState && (
          <Accordion>
            <AccordionSummary component="div" expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                <Typography variant='body2' fontWeight="bold" fontSize={23} sx={{ fontVariant: 'small-caps' }}>
                  progression
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <ProgressionModificationCard
                courses={courses}
                classes={classes}
                setCourses={setCourses}
                setClasses={setClasses}
                showSnackbar={showSnackbar}
                progressionState={progressionState}
              />
            </AccordionDetails>
          </Accordion>
        )}
      </DndContext>
    </Box>
  );
}
