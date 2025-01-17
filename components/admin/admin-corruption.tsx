import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { SuccessMessage, ErrorMessage, WarningMessage } from '@/components/message-display';
import { Course, Classe } from '@/lib/data';
import { classes, courses } from '@/lib/data';

interface ModificationsAdminProps {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
}

export function ModificationsAdmin({ courses, setCourses, classes, setClasses, }: ModificationsAdminProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [courseToDelete, setCourseToDelete] = useState<string>('');
  const [files, setFiles] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [errorDeleteFile, setErrorDeleteFile] = useState<string>('');
  const [successMessageDeleteFile, setSuccessMessageDeleteFile] = useState<string>('');
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
  const [courseDetails, setCourseDetails] = useState<{ title: string; description: string; classe: string; theClasseId: string; }>({
    title: '',
    description: '',
    classe: '',
    theClasseId: '',
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


  useEffect(() => {
    if (selectedCourse) {
      const updatedCourse = courses.find((course) => course.id === selectedCourse);
      if (updatedCourse) {
        setFiles(updatedCourse.activities.map((activity) => activity.fileUrl));
        setCourseDetails({
          title: updatedCourse.title,
          description: updatedCourse.description,
          classe: updatedCourse.classe,
          theClasseId: updatedCourse.theClasseId,
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
      const courseFiles = course.activities.map(activity => activity.fileUrl);
      setFiles(courseFiles);
      setCourseDetails({
        title: course.title || '',
        description: course.description || '',
        classe: course.classe || '',
        theClasseId: course.theClasseId || '',
      });
    }
  };

  const handleDeleteFile = async (fileUrl: string) => {
    const res = await fetch(`/api/deletefile`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileUrl, courseId: selectedCourse }),
    });

    if (res.ok) {
      const data = await res.json();
      setErrorDeleteFile('');
      setSuccessMessageDeleteFile('Fichier supprimé avec succès.');
      setFiles(data.files);
      setCourses(data.courses);
      setConfirmDelete(null);
    } else {
      setErrorDeleteFile('Erreur lors de la suppression du fichier.');
      setSuccessMessageDeleteFile('');
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
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
        deleteFiles,
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
        deleteFiles,
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
    const res = await fetch(`/api/updatecourse/${selectedCourse}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...courseDetails,
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
      setErrorUpdateCourse('Erreur lors de la mise à jour du cours.'); 
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
  
  const handleConfirmDeleteRapide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmDeleteRapide) {
      setErrorDeleteCourse('Sélectionnez un cours à supprimer !');
      setSuccessMessageDeleteCourseRapide('');
      return;
    }
    
    const formerName = courses.find(course => course.id === confirmDeleteRapide)?.title

    const res = await fetch(`/api/deletecourse/${confirmDeleteRapide}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deleteFiles: true,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setErrorDeleteCourseRapide(''); // Reset error message
      setSuccessMessageDeleteCourseRapide(`Cours "${formerName}" supprimé avec succès.`);
      setCourses(data.courses);
      setClasses(data.classes);
    } else {
      setErrorDeleteCourseRapide('Erreur lors de la suppression du cours.'); 
      setSuccessMessageDeleteCourseRapide('');
    }
    setConfirmDeleteRapide(null);
  };
  
  const handleCancelDeleteRapide = () => {
    setConfirmDeleteRapide(null);
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

  useEffect(() => {
    if (refreshDataClass) {
      const updateCourseData = async () => {
        const res = await fetch('/api/getcourses');
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses);
          setClasses(data.classes);
        }
      };
      updateCourseData();
      setRefreshDataClass(false);
    }
  }, [refreshDataClass]);

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
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((activity) => (
                      <SelectItem key={activity.id} value={activity.id}>
                        {activity.title}
                      </SelectItem>
                    ));
                } else {
                  return filteredCourses
                    .flatMap((course) => course.activities)
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((activity) => (
                      <SelectItem key={activity.id} value={activity.id}>
                        {activity.title}
                      </SelectItem>
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
                .find(activity => activity.id === selectedActivity)
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


              // Mise à jour du titre
              if (newActivityTitle) {
                try {
                  if (course) {
                    await updateActivityTitle(course.id, activity.id, newActivityTitle);
                  }
                } catch (error) {
                  setErrorUpdateActivity('Erreur lors de la mise à jour du titre: ' + error);
                  setWarningUpdateActivity('');
                  setSuccessMessageUpdateActivity('');
                  setSuccessMessageUploadFileName('');
                  return;
                }
              }
              


              // S’il y a un nouveau fichier, on supprime l'ancien et on upload le nouveau
              if (newFile) {
                try {
                  // Suppression
                  const deleteRes = await fetch('/api/deletefile', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      fileUrl: activity.fileUrl,
                      courseId: course?.id || '',
                    }),
                  });
              
                  if (!deleteRes.ok) throw new Error('Erreur lors de la suppression du fichier');
              
                  // Upload
                  const formData = new FormData();
                  formData.append('file', newFile);
                  if (course) {
                    formData.append('courseId', course.id);
                  }
                  formData.append('ActivityTitle', activity.title);
                  const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  });

              
                  if (!uploadRes.ok) throw new Error('Erreur lors du téléchargement du fichier');

                  if (uploadRes.ok) {
                    const dataModifyFile = await uploadRes.json();
                    setRefreshDataClass(true);
                    setupdateFormerActivity(true);
                    setErrorUpdateActivity('');
                    setWarningUpdateActivity('');
                    setSuccessMessageUploadFileName(`${dataModifyFile.fileName}`);
                    setSuccessMessageUpdateActivity(`Fichier mis à jour avec succès avec : `);
                    
                    setNewFile(null);
                  }
                  
                } catch (error) {
                  setErrorUpdateActivity('Erreur lors de la mise à jour du fichier');
                  setWarningUpdateActivity('');
                  setSuccessMessageUpdateActivity('');
                  setSuccessMessageUploadFileName('');
                  return;
                }
              }
              const activity2 = course?.activities.find((a) => a.id === selectedActivity);
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
          <Select value={selectedCourse} onValueChange={handleCourseChange}>
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
        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Fichiers associés</h3>
            <ul className="space-y-2">
              {files
              .sort((a, b) => a.localeCompare(b))
              .map((fileUrl) => (
                <li key={fileUrl} className="flex items-center justify-between">
                  <span>{fileUrl}</span>
                  <div className="flex items-center justify-between space-x-2 w-[100px]">
                    {confirmDelete === fileUrl ? (
                      <>
                        <Button className="bg-green-500 text-white hover:bg-green-700" onClick={() => handleDeleteFile(fileUrl)}>
                          ✓
                        </Button>
                        <Button className="bg-gray-500 text-white" onClick={handleCancelDelete}>
                          ✕
                        </Button>
                      </>
                    ) : (
                      <Button className="bg-red-500 text-white w-[100px] hover:bg-red-700" onClick={() => setConfirmDelete(fileUrl)}>
                        Supprimer
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {errorDeleteFile && <ErrorMessage message={errorDeleteFile} />}
        {successMessageDeleteFile && <SuccessMessage message={successMessageDeleteFile} />}
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
        {ErrorUpdateCourse && <ErrorMessage message={ErrorUpdateCourse} />}
        {successMessageUpdateCourse && <SuccessMessage message={successMessageUpdateCourse} />}
        <Button type="submit" className="w-full">
          Enregistrer les modifications
        </Button>
      </form>
      )}
    </Card>

    <Card className="p-4 mt-4" defaultExpanded={false} title="Modifier une classe">
        <div className="space-y-6">
          <div className="space-y-2">
            <Select value={selectedClasseToDelete} onValueChange={setSelectedClasseToDelete}>
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
          </div>
          <div className="mt-2">
            {errorDeleteClasse && <ErrorMessage message={errorDeleteClasse} />}
            {warningDeleteClasse && <WarningMessage message={warningDeleteClasse} />}
            {successMessageDeleteClasse && <SuccessMessage message={successMessageDeleteClasse} />}
            {warningRenameClasse && <WarningMessage message={warningRenameClasse} />}
          </div>
        </div>
      </Card>

      
    <Card className="p-4 mt-4" defaultExpanded={false} title="Supprimer un cours" >
      <form onSubmit={handleDeleteCourse} className="space-y-6">
        <div className="space-y-2">
          <Select value={courseToDelete} onValueChange={setCourseToDelete}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un cours à supprimer" />
            </SelectTrigger>
            <SelectContent>
              {courses && courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
        
        <Button type="submit" disabled={!courseToDelete} className="w-full">
          Supprimer le cours
        </Button>
        <div className='mt-2'>
        {errorDeleteCourse && <ErrorMessage message={errorDeleteCourse} />}
        {successMessageDeleteCourse && <SuccessMessage message={successMessageDeleteCourse} />}
        </div>
      </form>

      </Card>
    <Card className="p-4 mt-4" defaultExpanded={false} title="Supprimer un cours rapidement" >
      <div>
        <div className="space-y-2">
          <Select name="classe" value={selectedClasse} onValueChange={(value) => handleSelectChange(value)}>
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
        {associatedCourses.length > 0 && (
          <div className="space-y-2 mt-4">
            <ul className="space-y-2">
              {associatedCourses.map((course) => (
                <li key={course.id} className="flex items-center justify-between">
                  <span>{course.title}</span>
                  <div className="flex items-center justify-between space-x-2 w-[150px]">
                    {confirmDeleteRapide === course.id ? (
                      <>
                        <Button className="bg-green-500 text-white hover:bg-green-700" onClick={handleConfirmDeleteRapide}>
                          ✓
                        </Button>
                        <Button className="bg-gray-500 text-white" onClick={handleCancelDeleteRapide}>
                          ✕
                        </Button>
                      </>
                    ) : (
                      <Button className="bg-red-500 text-white w-[150px] hover:bg-red-700" onClick={() => handleDeleteClickRapide(course.id)}>
                        Supprimer le cours
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4">
            {errorDeleteCourseRapide && <ErrorMessage message={errorDeleteCourseRapide} />}
            {successMessageDeleteCourseRapide && <SuccessMessage message={successMessageDeleteCourseRapide} />}
        </div>
      </div>
      </Card>
    




    </>
    
);
}

