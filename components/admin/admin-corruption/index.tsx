// /components/admin/admin-corruption/index.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { ModificationsAdminProps } from './types';
import { ActivityModificationCard } from './ActivityModificationCard';
import { CourseModificationCard } from './CourseModificationCard';
import { ClassModificationCard } from './ClassModificationCard';
import { ProgressionModificationCard } from './ProgressionModificationCard';
import { useProgressionState } from './hooks/useProgressionState';
import { useSnackbarState } from './hooks/useSnackbarState';
import { ProgressionEditDialog } from './ProgressionEditDialog';
import { ProgressionDeleteDialog } from './ProgressionDeleteDialog';
import { SnackbarProvider } from './SnackbarProvider';

/**
 * ModificationsAdmin component for managing courses, classes and activities in an admin interface.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Course[]} props.courses - Array of course objects containing course information
 * @param {Function} props.setCourses - Function to update the courses state
 * @param {Class[]} props.classes - Array of class objects containing class information  
 * @param {Function} props.setClasses - Function to update the classes state
 * 
 * @description
 * This component provides functionality to:
 * - Modify activity titles and files
 * - Modify course details (title, description, associated class)
 * - Delete courses with optional file deletion
 * - Modify class names
 * - Delete classes
 * - Toggle visibility of classes and courses
 * - Reorder activities via drag and drop
 * - Reorder courses via drag and drop
 * 
 * The component is split into three main sections:
 * 1. Activity modification card
 * 2. Course modification card 
 * 3. Class modification card
 * 
 * Each section contains relevant forms and controls for managing the respective entities.
 * The component uses optimistic updates and provides feedback through success/error messages.
 * 
 * @example
 * ```tsx
 * <ModificationsAdmin 
 *   courses={courses}
 *   setCourses={setCourses}
 *   classes={classes} 
 *   setClasses={setClasses}
 * />
 * ```
 */
export function ModificationsAdmin({ courses, setCourses, classes, setClasses }: ModificationsAdminProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const progressionState = useProgressionState();
  const snackbarState = useSnackbarState();

  useEffect(() => {
    const fetchData = async () => {
      const fetchRes = await fetch('/api/courses');
      const freshData = await fetchRes.json();
      console.log('Initial data load - freshData:', freshData);
      console.log('Initial data load - classes:', freshData.classes);
      setCourses(freshData.courses);
      setClasses(freshData.classes);
    };

    fetchData();
  }, [setClasses, setCourses]);

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter}>
        <ActivityModificationCard
          courses={courses}
          setCourses={setCourses}
          classes={classes}
          setClasses={setClasses}
          showSnackbar={snackbarState.showSnackbar}
        />

        <CourseModificationCard
          courses={courses}
          setCourses={setCourses}
          classes={classes}
          setClasses={setClasses}
          showSnackbar={snackbarState.showSnackbar}
        />

        <ClassModificationCard
          courses={courses}
          setCourses={setCourses}
          classes={classes}
          setClasses={setClasses}
          showSnackbar={snackbarState.showSnackbar}
        />

        <ProgressionModificationCard
          courses={courses}
          classes={classes}
          setClasses={setClasses}
          showSnackbar={snackbarState.showSnackbar}
          progressionState={progressionState}
        />
      </DndContext>

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
