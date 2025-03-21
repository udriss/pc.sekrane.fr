import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { SuccessMessage, ErrorMessage, WarningMessage } from '@/components/message-display';
import { Course, Classe, THEMES } from '@/lib/dataTemplate';
import { SortableFile } from '@/components/admin/SortableFile';
import { SortableCourse } from '@/components/admin/SortableCourse';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DragEndEvent } from '@dnd-kit/core';
import Switch from '@mui/material/Switch';
import { toast } from 'react-toastify';

// Update ModificationsAdminProps interface
interface ModificationsAdminProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
}

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
export function ModificationsAdmin({ courses, setCourses, classes, setClasses, }: ModificationsAdminProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [courseToDelete, setCourseToDelete] = useState<string>('');
  const [files, setFiles] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<boolean | null>(null);
  const [errorDeleteFile, setErrorDeleteFile] = useState<string>('');
  const [successMessageDeleteFile, setSuccessMessageDeleteFile] = useState<React.ReactNode>(null);
  const [deleteFiles, setDeleteFiles] = useState<boolean>(false);
  const [errorDeleteCourse, setErrorDeleteCourse] = useState<string>('');
  const [errorDeleteCourseRapide, setErrorDeleteCourseRapide] = useState<string>('');
  const [ErrorUpdateCourse, setErrorUpdateCourse] = useState<string>('');
  const [successMessageDeleteCourse, setSuccessMessageDeleteCourse] = useState<string>('');
  const [successMessageDeleteCourseRapide, setSuccessMessageDeleteCourseRapide] = useState<string>('');
  const [successMessageUpdateCourse, setSuccessMessageUpdateCourse] = useState<string>('');
  const [selectedClasseToDelete, setSelectedClasseToDelete] = useState<string>('');
  const [errorDeleteClasse, setErrorDeleteClasse] = useState<string>('');
  const [successMessageDeleteClasse, setSuccessMessageDeleteClasse] = useState<string>('');
  const [warningDeleteClasse, setWarningDeleteClasse] = useState<string>('');
  const [courseDetails, setCourseDetails] = useState<{ id : string, title: string; description: string; classe: string; theClasseId: string; themeChoice?: number; }>({
    id : '',
    title: '',
    description: '',
    classe: '',
    theClasseId: '',
    themeChoice: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const fetchRes = await fetch('/api/courses');
      const freshData = await fetchRes.json();
      setCourses(freshData.courses);
      setClasses(freshData.classes);
    };

    fetchData();
  }, []);

  const [selectedClasse, setSelectedClasse] = useState<string>('');
  const [associatedCourses, setAssociatedCourses] = useState<Course[]>([]);
  const [newClasseId, setNewClasseId] = useState<string>('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('');

  // Ajout des states pour gérer la sélection des classes, cours, activités, etc.
  const [selectedClassForActivity, setSelectedClassForActivity] = useState('');
  const [selectedCourseForActivity, setSelectedCourseForActivity] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [updateFormerActivity, setupdateFormerActivity] = useState(false);
  const [errorUpdateActivity, setErrorUpdateActivity] = useState<string>('');
  const [successMessageUpdateActivity, setSuccessMessageUpdateActivity] = useState<string>('');
  const [warningUpdateActivity, setWarningUpdateActivity] = useState<string>('');
  const [editedClasseName, setEditedClasseName] = useState<string>('');
  const [warningRenameClasse, setWarningRenameClasse] = useState<string>('');
  const [refreshDataClass, setRefreshDataClass] = useState(false);
  const [successMessageUploadFileName, setSuccessMessageUploadFileName] = useState<string>('');
  const [currentCourse, setCurrentCourse] = useState<Course[]>([]);
  const [warningUpdateCourse, setWarningUpdateCourse] = useState<string>('');
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  useEffect(() => {
    // Mettre à jour les cours associés à la classe sélectionnée
    if (selectedClasse) {
      const filteredCourses = courses.filter(course => course.theClasseId === selectedClasse);
      setAssociatedCourses(filteredCourses);
    } else {
      setAssociatedCourses([]);
    }
  }, [selectedClasse, courses]);

  useEffect(() => {
    if (selectedCourse) {
      const updatedCourse = courses.find((course) => course.id === selectedCourse);
      if (updatedCourse) {
        setFiles(updatedCourse.activities.map((activity) => activity.id));
        setCourseDetails({
          id: updatedCourse.id,
          title: updatedCourse.title,
          description: updatedCourse.description,
          classe: updatedCourse.classe,
          theClasseId: updatedCourse.theClasseId,
          themeChoice: updatedCourse.themeChoice ?? 0,
        });
        setNewClasseId(updatedCourse.theClasseId); // Mettre à jour newClasseId
      }
    }
  }, [selectedCourse, courses]);

  
  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setErrorDeleteFile('');
    setSuccessMessageDeleteFile('');
    const course = courses.find(course => course.id === courseId);
    if (course) {
      setNewClasseId(course.theClasseId);
      const courseFiles = course.activities.map(activity => activity.id);
      setFiles(courseFiles);
      setCourseDetails({
        id: course.id || '',
        title: course.title || '',
        description: course.description || '',
        classe: course.classe || '',
        theClasseId: course.theClasseId || '',
        themeChoice: course.themeChoice ?? 0,
      });
    }
  };

  useEffect(() => {
    // Trouver le cours correspondant et mettre à jour le cours actuel
    const course = courses.find(course => course.id === selectedCourse);
    if (course) {
      const courseWithFiles = {
        id: course.id,
        files: course.activities.map(activity => activity.id),
      };
      setCurrentCourse([course]);
    }
  }, [selectedCourse, courses]);

  // Add drag end handler:
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
  
    if (active.id !== over?.id) {
      // Update files order
      const oldIndex = files.indexOf(active.id as string);
      const newIndex = files.indexOf(over?.id as string);
  
      const newFiles = [...files];
      newFiles.splice(oldIndex, 1);
      newFiles.splice(newIndex, 0, active.id as string);
      setFiles(newFiles);
  
      // Get current course and reorder activities
      const currentCourse = courses.find(course => course.id === selectedCourse);
      if (!currentCourse) return;
  
      const newActivities = newFiles.map(fileId => 
        currentCourse.activities.find(activity => activity.id === fileId)!
      );
  

  
      // Update API
      try {
        const response = await fetch('/api/updateActivitiesOrder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: selectedCourse,
            activities: newActivities
          })
        });
  
        if (!response.ok) throw new Error('Failed to update order');
  
        const data = await response.json();
  
        if (response.ok) {
          toast.dismiss();
          toast.clearWaitingQueue();
          toast.success(
            <div className="text-center">
              Ordre mis à jour pour le cours{" "}
              <span className="font-bold">
                {data.titleOfChosenCourse}
              </span>
            </div>,
            {
              position: "top-center",
              autoClose: 500,
              hideProgressBar: false,
              theme: "dark",
              style: {
                width: '500px',
                textAlign: 'center',
                justifyContent: 'center',
              },
            }
          );
        }
  
        // Update courses state with new order
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.id === selectedCourse 
              ? { ...course, activities: newActivities }
              : course
          )
        );
  
      } catch (error) {
        console.error('Error updating activities order:', error);
        // Revert files order on error
        setFiles(files);
      }
    }
  };
  

  const handleDragEndCourse = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // Update courses order
      const oldIndex = courses.findIndex(course => course.id === active.id);
      const newIndex = courses.findIndex(course => course.id === over?.id);

      const newCourses = [...courses];
      newCourses.splice(oldIndex, 1);
      newCourses.splice(newIndex, 0, courses[oldIndex]);
      setCourses(newCourses);

      // Update API
      try {
        const response = await fetch('/api/updateCourseOrder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ courses: newCourses.map(course => course.id), activeCourseId: active.id }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.dismiss();
          toast.clearWaitingQueue();
          toast.success(
            <div className="text-center">
            Ordre mis à jour pour la classe{" "}
            <span className="font-bold">
              {data.titleOfChosenClass}
            </span>
          </div>,
            {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: false,
            theme: "dark",
            style: {
              width: '500px',
              textAlign: 'center',
              justifyContent: 'center',
            },
          });
        } else {
          setErrorDeleteCourse(data.error);
        }
      } catch (error) {
        setErrorDeleteCourse('Internal server error');
      }
    }
  };
  
  const handleDeleteFile = async (fileId: string) => {
    const res = await fetch(`/api/deletefile`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId, courseId: selectedCourse }),
    });
  
    if (res.ok) {
      const data = await res.json();
      setErrorDeleteFile('');
      setSuccessMessageDeleteFile(
        <>Fichier <span style={{ color: "red" }}>{data.fileUrl}</span> supprimé avec succès.</>
      );
      setCourses(data.courses);
      setConfirmDelete(null);
    } else {
      setErrorDeleteFile('Erreur lors de la suppression du fichier.');
      setSuccessMessageDeleteFile('');
    }
  };
  

  const handleDeleteCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseToDelete) {
      setErrorDeleteCourse('Sélectionnez un cours à supprimer !');
      setSuccessMessageDeleteCourse('');
      return;
    }
    const formerName = courses.find(course => course.id === courseToDelete)?.title

    const res = await fetch(`/api/deletecourse/${courseToDelete}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId: courseToDelete,
        deleteFiles: deleteFiles,
      }),
    });
    
    if (res.ok) {
      const data = await res.json();
      setErrorDeleteCourse(''); // Reset error message
      setSuccessMessageDeleteCourse(`Cours "${formerName}" supprimé avec succès.`);
      setCourses(data.courses);
      setClasses(data.classes);

          // Mettre à jour la liste des cours associés
    const updatedClasse = classes && Array.isArray(classes) 
  ? classes.find(classe => classe.id === selectedClasse) 
  : null
    if (updatedClasse) {
      const updatedAssociatedCourses: Course[] = data.courses.filter((course: Course) => updatedClasse.associated_courses.includes(course.id));
      setAssociatedCourses(updatedAssociatedCourses);
    }
    
    } else {
      setErrorDeleteCourse('Erreur lors de la suppression du cours.'); 
      setSuccessMessageDeleteCourse('');
    }
  };

  const handleRenameClasse = async (classeId: string, newClasseName: string) => {
    if (!newClasseName || newClasseName.trim() === '') {
      setWarningRenameClasse('Le nom de la classe ne peut pas être vide.');
      return;
    }
    setWarningRenameClasse('');

    if (!classeId) {
      setErrorDeleteClasse('');
      setWarningDeleteClasse('Sélectionnez une classe !');
      setWarningRenameClasse('');
      setSuccessMessageDeleteClasse('');
      return;
    }
    if (!newClasseName.trim()) {
      setErrorDeleteClasse('');
      setWarningDeleteClasse('Saisissez un nouveau nom !');
      setWarningRenameClasse('');
      setSuccessMessageDeleteClasse('');
      return;
    }
    try {
      const response = await fetch(`/api/renameclasse/${classeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classeId: classeId, name: newClasseName }),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la modification du nom de la classe');
      }
      setErrorDeleteClasse('');
      setWarningDeleteClasse('');
      setWarningRenameClasse('');
      setSuccessMessageDeleteClasse('Classe renommée avec succès');

      const data = await response.json();
      setClasses(data.classes);
      setCourses(data.courses);

      // Mettez à jour la liste des classes localement si nécessaire
    } catch (error: any) {
      setErrorDeleteClasse(error.message);
      setWarningRenameClasse('');
      setWarningDeleteClasse('');
      setSuccessMessageDeleteClasse('');
    }
  };

  


  const handleDeleteClasse = async (classeId: string) => {
    if (!classeId) {
      setErrorDeleteClasse('');
      setWarningRenameClasse('');
      setWarningDeleteClasse('Sélectionnez une classe à supprimer !');
      setSuccessMessageDeleteClasse('');
      return;
    }
    if (classeId === '0') {
      setErrorDeleteClasse('');
      setWarningRenameClasse('');
      setWarningDeleteClasse('La classe "Autre" ne peut pas être supprimée.');
      setSuccessMessageDeleteClasse('');
      return;
    }
  
    try {
      const res = await fetch(`/api/deleteclasse/${classeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classeId: classeId,
        deleteFiles: true
      }),
      });

      if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Erreur lors de la suppression de la classe.');
      }

      const data = await res.json();
      setErrorDeleteClasse('');
      setWarningDeleteClasse('');
      setWarningRenameClasse('');
      setSuccessMessageDeleteClasse('Classe supprimée avec succès.');

      setClasses(data.classes);
      setCourses(data.courses);

      // Mettre à jour courseDetails et newClasseId pour afficher correctement les informations
      const updatedCourse: Course | undefined = data.courses.find((course: Course) => course.id === selectedCourse);
      if (updatedCourse) {
      setCourseDetails({
        id: updatedCourse.id,
        title: updatedCourse.title,
        description: updatedCourse.description,
        classe: updatedCourse.classe,
        theClasseId: updatedCourse.theClasseId,
      });
      setNewClasseId(updatedCourse.theClasseId);
      }
    } catch (error: any) {
      setErrorDeleteClasse(error.message);
      setWarningDeleteClasse('');
      setWarningRenameClasse('');
      setSuccessMessageDeleteClasse('');
    }
  };

  const handleCourseDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    handleClasseChange(selectedClasse);
  }, [classes]);
  
  const handleSaveCourseDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Récupérer le cours original pour comparaison
    const originalCourse = courses.find(c => c.id === selectedCourse);
    
    if (!originalCourse) {
      setErrorUpdateCourse('Course not found');
      setSuccessMessageUpdateCourse('');
      return;
    }
    
    // Vérifier si des modifications ont été effectuées
    const titleChanged = courseDetails.title !== originalCourse.title;
    const descriptionChanged = courseDetails.description !== originalCourse.description;
    const classeChanged = newClasseId !== originalCourse.theClasseId;
    
    // Si rien n'a changé, afficher un avertissement et ne pas envoyer de requête
    if (!titleChanged && !descriptionChanged && !classeChanged) {
      setErrorUpdateCourse('');
      setSuccessMessageUpdateCourse('');
      // Utiliser le state warningUpdateCourse existant, ou en créer un si nécessaire
      setWarningUpdateCourse("Aucune modification détectée. Rien n'a été mis à jour.");
      return;
    }
    
    // Réinitialiser les messages
    setWarningUpdateCourse('');
    
    const res = await fetch(`/api/updatecourse/${selectedCourse}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId: courseDetails.id,
        title: courseDetails.title,
        description: courseDetails.description,
        newClasseId,
      }),
    });
  
    if (res.ok) {
      const data = await res.json();
      setErrorUpdateCourse(''); // Reset error message
      setSuccessMessageUpdateCourse('Cours mis à jour avec succès.');
      setCourses(data.courses);
      setClasses(data.classes);
    } else {
      const data = await res.json();
      setErrorUpdateCourse('Erreur lors de la mise à jour du cours : '+ data.error); 
      setSuccessMessageUpdateCourse('');
    }
  };

  const handleClasseChange = (classeId: string) => {
    setSelectedClasse(classeId);
    const classe = classes && Array.isArray(classes)
      ? classes.find(classe => classe.id === classeId)
      : null;
    if (classe) {
      const associatedCourses = courses.filter(course => classe.associated_courses.includes(course.id));
      setAssociatedCourses(associatedCourses);
    }
  };
  
  
  // RAPIDE ICI 
  const [confirmDeleteRapide, setConfirmDeleteRapide] = useState<string | null>(null);
  
  const handleDeleteClickRapide = (courseId: string) => {
    setConfirmDeleteRapide(courseId);
  };

  const handleSelectChange = (classeId: string) => {
    setErrorDeleteCourseRapide(''); // Reset error message
    setSuccessMessageDeleteCourseRapide(''); // Reset success message
    handleClasseChange(classeId);
  };
  

  const updateActivityTitle = async (courseId: string, activityId: string, newTitle: string) => {
    try {
      const res = await fetch('/api/updateactivity', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          activityId,
          newTitle
        }),
      });
  
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses);
        setClasses(data.classes);
        setErrorUpdateActivity('');
        setWarningUpdateActivity('');
        setSuccessMessageUpdateActivity('Titre mis à jour avec succès');
        setNewActivityTitle('');
        // Optional: Add success message
      }
      else {
        setErrorUpdateActivity('Erreur lors de la mise à jour du titre via l\'API');
        setSuccessMessageUpdateActivity('');
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      // Optional: Add error handling
    }
  };

  useEffect(() => {
    if (updateFormerActivity) {
      const updateCourseData = async () => {
        const res = await fetch('/api/getcourses');
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses);
          setClasses(data.classes);
        }
      };
      updateCourseData();
      setupdateFormerActivity(false);
    }
  }, [updateFormerActivity]);


  // Ajouter cette fonction avec les autres handlers
const handleToggleVisibilityCourse = async (courseId: string, visibility: boolean) => {
  try {
    const response = await fetch(`/api/updatecourse/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId,
        toggleVisibilityCourse: visibility
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update course visibility');
    }

    const data = await response.json();
    setCourses(data.courses);
    setClasses(data.classes);
  } catch (error) {
    console.error('Error updating course visibility:', error);
  }
};

  const handleToggleVisibility = async (classeId: string, visibility: boolean) => {
    try {
      const response = await fetch(`/api/renameclasse/${classeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classeId,
          toggleVisibilityClasse: visibility
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update class visibility');
      }
  
      const data = await response.json();
      setClasses(data.classes);
      setCourses(data.courses);
    } catch (error) {
      console.error('Error updating class visibility:', error);
    }
  };

  const handleThemeChange = async (themeId: string) => {
    const numericThemeId = Number(themeId);
    
    // Mettre à jour l'état local
    setCourseDetails(prev => ({
      ...prev,
      themeChoice: numericThemeId
    }));
    
    try {
      
      // Trouver le cours actuel pour afficher son titre dans le toast
      const currentCourse = courses.find(course => course.id === selectedCourse);
      const courseTitle = currentCourse?.title || "sélectionné";

      const res = await fetch(`/api/updatecourse/${selectedCourse}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          themeChoice: numericThemeId
        }),
      });
  
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses);
        
        toast.dismiss();
        toast.clearWaitingQueue();
      toast.success(
        <div className="text-center">
          Thème mis à jour pour le cours{" "}
          <span className="font-bold">{courseTitle}</span>
        </div>,
        {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: false,
          theme: "dark",
          style: {
            width: '500px',
            textAlign: 'center',
            justifyContent: 'center',
          },
        }
      );
      } else {
        setErrorUpdateCourse('Erreur lors de la mise à jour du thème.');
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      setErrorUpdateCourse('Erreur serveur lors de la mise à jour du thème.');
    }
  };

  return (
    <>

      <Card className="p-4" defaultExpanded={false} title="Modifier une activité" >
        <div className="space-y-6">

          {/* Sélection de la classe */}
          <Select value={selectedClassForActivity} onValueChange={setSelectedClassForActivity}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une classe" />
            </SelectTrigger>
            <SelectContent>
              {classes && Array.isArray(classes) ? (
                classes.map((classe) => (
                  <SelectItem key={classe.id} value={classe.id}>
                    {classe.name}
                  </SelectItem>
                ))
              ) : null}
            </SelectContent>
          </Select>

          {/* Sélection du cours, filtré si une classe est choisie */}
          <Select
            value={selectedCourseForActivity}
            onValueChange={setSelectedCourseForActivity}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un cours" />
            </SelectTrigger>
            <SelectContent>
              {courses
                .filter((course) =>
                  !selectedClassForActivity ||
                  course.theClasseId === selectedClassForActivity
                )
                .map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Sélection de l'activité, si aucun cours n'est choisi, on affiche toutes les activités */}
          <Select
            value={selectedActivity}
            onValueChange={setSelectedActivity}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une activité" />
            </SelectTrigger>
            <SelectContent>
                {(() => {
                  const filteredCourses = courses.filter((course) =>
                    !selectedClassForActivity ||
                    course.theClasseId === selectedClassForActivity
                  );
                  if (selectedCourseForActivity) {
                    const chosenCourse = filteredCourses.find(
                      (c) => c.id === selectedCourseForActivity
                    );
                    return chosenCourse?.activities
                      ?.filter(activity => activity && activity?.id)
                      ?.sort((a, b) => (a?.title || '').localeCompare(b?.title || ''))
                      .map((activity) => (
                        activity ? <SelectItem key={activity.id} value={activity.id}>
                          {activity.title || 'Untitled'}
                        </SelectItem> : null
                      ));
                  } else {
                    return filteredCourses
                      .flatMap((course) => course?.activities || [])
                      .filter(activity => activity && activity?.id)
                      .sort((a, b) => (a?.title || '').localeCompare(b?.title || ''))
                      .map((activity) => (
                        activity ? <SelectItem key={activity.id} value={activity.id}>
                          {activity.title || 'Untitled'}
                        </SelectItem> : null
                      ));
                  }
                })()}
              </SelectContent>
          </Select>

          {/* Formulaire pour changer le titre et uploader un nouveau fichier */}
          <Input
              type="text"
              placeholder="Nouveau titre de l'activité"
              value={newActivityTitle || courses
                .flatMap(course => course.activities)
                .find(activity => activity?.id === selectedActivity)
                ?.title || ''}
              onChange={(e) => setNewActivityTitle(e.target.value)}
            />

          <Input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setNewFile(e.target.files[0]);
              }
            }}
          />

          <Button className="w-full"
            onClick={async () => {
              // Recherche du cours et de l'activité
              const course = courses.find(c => 
                c.activities.some(a => a.id === selectedActivity)
              );
              // if (!course) return;  
              
              const activity = course?.activities.find((a) => a.id === selectedActivity);
              if (!activity) { 
                setErrorUpdateActivity('');
                setWarningUpdateActivity('Choisissez une activité !');
                setSuccessMessageUpdateActivity('');
                setSuccessMessageUploadFileName('');
                return;
              }
              
              if ((!newActivityTitle?.trim() && !newFile) || (newActivityTitle === activity.title && !newFile)) {
                setErrorUpdateActivity('')
                setWarningUpdateActivity('Il faut au moins changer le titre !');
                setSuccessMessageUpdateActivity('');
                setSuccessMessageUploadFileName('');
                return;
              }


                try {
                if (!course) {
                  throw new Error('Cours non trouvé');
                }

                // Combine title and file update in a single operation
                if (newActivityTitle || newFile) {

                  // Then handle file update if needed
                  if (newFile) {
                  // Delete existing file
                  const deleteRes = await fetch('/api/deletefile', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                    fileId: activity.id,
                    courseId: course.id,
                    }),
                  });

                  if (!deleteRes.ok) {
                    throw new Error('Erreur lors de la suppression du fichier');
                  }

                  // Upload new file
                  const formData = new FormData();
                  formData.append('file', newFile);
                  formData.append('courseId', course.id);
                  formData.append('ActivityTitle', newActivityTitle || activity.title);
                  
                  const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  });

                  if (!uploadRes.ok) {
                    throw new Error('Erreur lors du téléchargement du fichier');
                  }

                  const dataModifyFile = await uploadRes.json();
                  await new Promise(resolve => {
                    setRefreshDataClass(true);
                    resolve(true);
                  });
                  setupdateFormerActivity(true);
                  setSuccessMessageUploadFileName(dataModifyFile.fileName);
                  }

                  // First update title if needed
                  else if (newActivityTitle) {
                    await updateActivityTitle(course.id, activity.id, newActivityTitle);
                    }

                  // Set success messages
                  setErrorUpdateActivity('');
                  setWarningUpdateActivity('');
                  setSuccessMessageUpdateActivity(
                  `Mise à jour réussie ${newActivityTitle ? 'du titre' : ''} ${newActivityTitle && newFile ? 'et' : ''} ${newFile ? 'du fichier' : ''}`
                  );
                }

                // Reset form state
                setNewFile(null);
                setNewActivityTitle('');

                } catch (error) {
                setErrorUpdateActivity(`Erreur lors de la mise à jour: ${error}`);
                setWarningUpdateActivity('');
                setSuccessMessageUpdateActivity('');
                setSuccessMessageUploadFileName('');
                }
              // Optionnel
              setNewFile(null);
              setNewActivityTitle('');
            }}
          >
            Mettre à jour
          </Button>
        </div>
        <div className='mt-2'>
        {errorUpdateActivity && <ErrorMessage message={errorUpdateActivity} />}
        {warningUpdateActivity && <WarningMessage message={warningUpdateActivity} />}
        {successMessageUpdateActivity && <> 
          <SuccessMessage message={successMessageUpdateActivity} /> <span className="text-orange-500">{successMessageUploadFileName}</span>          
          </> }
        </div>
      </Card>


      <Card className="p-4 mt-4" defaultExpanded={true} title="Modifier un cours" >
  <div className="space-y-6">
    <div className="space-y-2">
      <Select value={selectedClassFilter} onValueChange={setSelectedClassFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une classe" />
        </SelectTrigger>
        <SelectContent>
          {classes && Array.isArray(classes) ? (
            classes.map((classe) => (
              <SelectItem key={classe.id} value={classe.id}>
                {classe.name}
              </SelectItem>
            ))
          ) : null}
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Select value={selectedCourse} onValueChange={(value) => {
        handleCourseChange(value);
        setCourseToDelete(value);
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un cours" />
        </SelectTrigger>
        <SelectContent>
          {courses && courses
          .filter(course => !selectedClassFilter || course.theClasseId === selectedClassFilter)
          .map((course) => (
            <SelectItem key={course.id} value={course.id}>
              {course.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    {selectedCourse && (
    <form onSubmit={handleSaveCourseDetails} className="space-y-6 mt-8">
      <div className="space-y-2">
        <label className="text-sm font-medium">Titre du cours</label>
        <Input
          type="text"
          name="title"
          value={courseDetails.title}
          onChange={handleCourseDetailsChange}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description du cours</label>
        <Input
          type="text"
          name="description"
          value={courseDetails.description}
          onChange={handleCourseDetailsChange}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Classe</label>
        <Select name="classe" value={newClasseId} onValueChange={(value) => setNewClasseId(value)}>
          <SelectTrigger>
            <SelectValue placeholder={courseDetails.classe || "Sélectionner une classe"} />
          </SelectTrigger>
          <SelectContent>
            {classes.map((classe) => (
              <SelectItem key={classe.id} value={classe.id}>
                {classe.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Thème</label>
        <Select name="theme" value={courseDetails.themeChoice?.toString() || '0'} onValueChange={handleThemeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un thème" />
          </SelectTrigger>
          <SelectContent>
            {THEMES.map((theme) => (
              <SelectItem key={theme.id} value={theme.id.toString()}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {ErrorUpdateCourse && <ErrorMessage message={ErrorUpdateCourse} />}
      {warningUpdateCourse && <WarningMessage message={warningUpdateCourse} />}
      {successMessageUpdateCourse && <SuccessMessage message={successMessageUpdateCourse} />}
      <Button type="submit" className="w-full">
        Enregistrer les modifications
      </Button>
    </form>
  )}
    {files.length > 0 && (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Fichiers associés</h3>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={files}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2">
              {currentCourse[0]?.activities?.map((activity) => (
                <SortableFile
                  fileId={activity.id}
                  key={activity.id}
                  fileName={activity.title}
                  fileUrl={activity.fileUrl}
                  onDelete={handleDeleteFile}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    )}
    {errorDeleteFile && <ErrorMessage message={errorDeleteFile} />}
    {successMessageDeleteFile && <SuccessMessage message={successMessageDeleteFile} />}
  </div>

  <form onSubmit={handleDeleteCourse} className="space-y-6 mt-8">
    <div className="flex flex-row col-span-1 justify-center items-center">
      <label className="checkboxSwitch">
        <Input
          className="col-span-1"
          type="checkbox"
          checked={deleteFiles}
          onChange={(e) => setDeleteFiles(e.target.checked)}
        />
        <span className="checkboxSlider checkboxSliderAdmin"></span>
      </label>
      <p className='ml-4'>Supprimer les fichiers associés</p>
    </div>
    <Button variant='destructive' type="submit" disabled={!courseToDelete} className="w-full">
      Supprimer le cours
    </Button>
    <div className='mt-2'>
      {errorDeleteCourse && <ErrorMessage message={errorDeleteCourse} />}
      {successMessageDeleteCourse && <SuccessMessage message={successMessageDeleteCourse} />}
    </div>
  </form>
</Card>

    <Card className="p-4 mt-4" defaultExpanded={false} title="Modifier une classe">
    <div className="space-y-6">
      <div className="space-y-2">
        <Select 
          value={selectedClasseToDelete} 
          onValueChange={(value) => {
            setSelectedClasseToDelete(value);
            handleSelectChange(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une classe" />
          </SelectTrigger>
          <SelectContent>
            {classes && Array.isArray(classes) ? (
              classes.map((classe) => (
                <SelectItem key={classe.id} value={classe.id}>
                  {classe.name}
                </SelectItem>
              ))
            ) : null}
          </SelectContent>
        </Select>
      </div>
      <Input
        type="text"
        placeholder="Nouveau nom de la classe"
        value={editedClasseName}
        onChange={(e) => setEditedClasseName(e.target.value)}
      />

    <div className="flex flex-row justify-around">
        <Button onClick={() => handleRenameClasse(selectedClasseToDelete, editedClasseName)}>
          Modifier la classe
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleDeleteClasse(selectedClasseToDelete)}
        >
          Supprimer la classe
        </Button>
        <div className="flex flex-row items-center">
          <h4 className="text-sm font-medium text-gray-500">Visible</h4>
          <Switch
            checked={classes.find(classe => classe.id === selectedClasseToDelete)?.toggleVisibilityClasse || false}
            onChange={(e) => handleToggleVisibility(selectedClasseToDelete, e.target.checked)}
            disabled={!selectedClasseToDelete || classes.length === 0}
          />
        </div>
      </div>
      {associatedCourses.length > 0 && (
        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEndCourse}
          >
            <SortableContext
              items={associatedCourses.map(course => course.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-2">
              {associatedCourses.map((course) => (
                <SortableCourse
                  key={course.id}
                  courseId={course.id}
                  courseTitle={course.title}
                  toggleVisibilityCourse={course.toggleVisibilityCourse}
                  onDelete={handleDeleteClickRapide}
                  onToggleVisibility={handleToggleVisibilityCourse}
                />
              ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      )}




      <div className="mt-2">
        {errorDeleteClasse && <ErrorMessage message={errorDeleteClasse} />}
        {warningDeleteClasse && <WarningMessage message={warningDeleteClasse} />}
        {successMessageDeleteClasse && <SuccessMessage message={successMessageDeleteClasse} />}
        {warningRenameClasse && <WarningMessage message={warningRenameClasse} />}
      </div>
    </div>

      
      </Card>

    </>
    
);
}

