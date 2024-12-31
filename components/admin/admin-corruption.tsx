import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { SuccessMessage, ErrorMessage, WarningMessage } from '@/components/message-display';
import { Course, Classe } from '@/lib/data';
import { useEffect } from 'react';

interface ModificationsAdminProps {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
}

export function ModificationsAdmin({ courses, setCourses, classes, setClasses }: ModificationsAdminProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [courseToDelete, setCourseToDelete] = useState<string>('');
  const [files, setFiles] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [errorDeleteFile, setErrorDeleteFile] = useState<string>('');
  const [successMessageDeleteFile, setSuccessMessageDeleteFile] = useState<string>('');
  const [deleteFiles, setDeleteFiles] = useState<boolean>(false);
  const [errorDeleteCourse, setErrorDeleteCourse] = useState<string>('');
  const [successMessageDeleteCourse, setSuccessMessageDeleteCourse] = useState<string>('');
  const [selectedClasseToDelete, setSelectedClasseToDelete] = useState<string>('');
  const [errorDeleteClasse, setErrorDeleteClasse] = useState<string>('');
  const [successMessageDeleteClasse, setSuccessMessageDeleteClasse] = useState<string>('');
  const [warningDeleteClasse, setWarningDeleteClasse] = useState<string>('');

  useEffect(() => {
    if (selectedCourse) {
      const updatedCourse = courses.find((course) => course.id === selectedCourse);
      if (updatedCourse) {
        setFiles(updatedCourse.activities.map((activity) => activity.fileUrl));
      }
    }
  }, [selectedCourse, courses]);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setErrorDeleteFile('');
    setSuccessMessageDeleteFile('');
    const course = courses.find(course => course.id === courseId);
    if (course) {
      const courseFiles = course.activities.map(activity => activity.fileUrl);
      setFiles(courseFiles);
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
      setSuccessMessageDeleteCourse('Cours supprimé avec succès.');
      setCourses(data.courses);
    } else {
      setErrorDeleteCourse('Erreur lors de la suppression du cours.'); 
      setSuccessMessageDeleteCourse('');
    }
  };

  const handleDeleteClasse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClasseToDelete) {
      setWarningDeleteClasse('Sélectionnez une classe à supprimer !');
      setErrorDeleteClasse('');
      setSuccessMessageDeleteClasse(''); // Reset success message
      return;
    }

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
      setWarningDeleteClasse(''); // Reset warning
      setErrorDeleteClasse('');
      setSuccessMessageDeleteClasse('Classe supprimée avec succès.');
      
      setClasses(data.classes);
      setCourses(data.courses);
    } else {
      const errorData = await res.json();
      if (res.status === 403 && errorData.error === 'La classe "Autre" ne peut pas être supprimée.') {
        setWarningDeleteClasse(errorData.error);
        setErrorDeleteClasse('');
        setSuccessMessageDeleteClasse('');
      } else {
        setWarningDeleteClasse(''); // Reset warning
        setErrorDeleteClasse(errorData.error || 'Erreur lors de la suppression de la classe.');
        setSuccessMessageDeleteClasse('');
      }
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleDeleteClasse} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Supprimer une classe</label>
          <Select value={selectedClasseToDelete} onValueChange={setSelectedClasseToDelete}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une classe à supprimer" />
            </SelectTrigger>
            <SelectContent>
              {classes.slice() // Crée une copie du tableau pour éviter de muter l'original
                .sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10)) // Trie les classes par ID
                .map((classe) => (
                  <SelectItem key={classe.id} value={classe.id}>
                    {classe.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        {errorDeleteClasse && <ErrorMessage message={errorDeleteClasse} />}
        {warningDeleteClasse && <WarningMessage message={warningDeleteClasse} />}
        {successMessageDeleteClasse && <SuccessMessage message={successMessageDeleteClasse} />}
        <Button type="submit" className="w-full">
          Supprimer la classe
        </Button>
      </form>

      <form onSubmit={handleDeleteCourse} className="space-y-6 mt-8">
        <div className="space-y-2">
          <label className="text-sm font-medium">Supprimer un cours</label>
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
        {errorDeleteCourse && <ErrorMessage message={errorDeleteCourse} />}
        {successMessageDeleteCourse && <SuccessMessage message={successMessageDeleteCourse} />}
        <Button type="submit" disabled={!courseToDelete} className="w-full">
          Supprimer le cours
        </Button>
      </form>

      <div className="space-y-6 mt-8">
        <div className="space-y-2">
          <label className="text-sm font-medium">Sélectionner un cours</label>
          <Select value={selectedCourse} onValueChange={handleCourseChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un cours" />
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

        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Fichiers associés</h3>
            <ul className="space-y-2">
              {files.map((fileUrl) => (
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
    </Card>
  );
}

