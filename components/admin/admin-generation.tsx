import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React, { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Course, Classe } from '@/lib/data';
import {SuccessMessage, ErrorMessage, WarningMessage} from '@/components/message-display';

interface GenerationsAdminProps {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
}

export function GenerationsAdmin({ courses, setCourses, classes, setClasses }: GenerationsAdminProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [ActivityTitle, setActivityTitle] = useState<string>('');
  const [newCourseTitle, setNewCourseTitle] = useState<string>('');
  const [newCourseDescription, setNewCourseDescription] = useState<string>('');
  const [newCourseClasse, setNewCourseClasse] = useState<string>('');
  const [newClasse, setNewClasse] = useState<string>('');
  const [errorAddFile, setErrorAddFile] = useState<string>('');
  const [errorAddCourse, setErrorAddCourse] = useState<string>('');
  const [errorAddClasse, setErrorAddClasse] = useState<string>('');
  const [successMessageAddFile, setSuccessMessageAddFile] = useState<React.ReactNode>(null);
  const [successMessageAddCourse, setSuccessMessageAddCourse] = useState<string>('');
  const [successMessageAddClasse, setSuccessMessageAddClasse] = useState<string>('');
  const [warningAddClasse, setWarningAddClasse] = useState<string>('');
  const [warningAddFile, setWarningAddFile] = useState<string>('');
  const [warningAddCourse, setWarningAddCourse] = useState<string>('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const fetchData = async () => {
      const fetchRes = await fetch('/api/courses');
      const freshData = await fetchRes.json();
      setCourses(freshData.courses);
      setClasses(freshData.classes);
    };

    fetchData();
  }, [setCourses, setClasses]);

  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !file || !ActivityTitle) {
      setErrorAddFile('');
      setWarningAddFile('Sélectionnez un cours, un fichier et entrez le nom de l\'activité !');
      setSuccessMessageAddFile('');
      return;
    }

    const formData = new FormData();
    formData.append('courseId', selectedCourse);
    formData.append('file', file);
    formData.append('ActivityTitle', ActivityTitle);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setErrorAddFile('');
      setWarningAddFile('');
      setSuccessMessageAddFile(
        <>Fichier <span style={{ color: "red" }}>{data.fileName}</span> téléchargé avec succès.</>
      );
      
      const updatedCourses = courses.map(course =>
        course.id === selectedCourse ? { ...course, activities: [...course.activities, data.activity] } : course
      ) as Course[];
      setCourses(updatedCourses);
      resetForm(); // Reset form after successful upload
    } else {
      setErrorAddFile('Échec du téléchargement du fichier.');
      setWarningAddFile('');
      setSuccessMessageAddFile(''); // Reset success message
    }
  };

  const resetForm = () => {
    setSelectedCourse('');
    setActivityTitle('');
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseClasse) {
      setErrorAddCourse('');
      setWarningAddCourse('Entrez un titre de cours et sélectionnez une classe !');
      setSuccessMessageAddCourse('');
      return;
    }

    const selectedClasse = classes.find((classe: Classe) => classe.name === newCourseClasse);
    if (!selectedClasse) {
      setErrorAddCourse('Classe sélectionnée non valide.');
      setWarningAddCourse('');
      setSuccessMessageAddCourse('');
      return;
    }
    
    const res = await fetch('/api/addcourse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newCourseTitle,
        description: newCourseDescription,
        classe: newCourseClasse,
        theClasseId : selectedClasse.id
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setErrorAddCourse('');
      setWarningAddCourse('');
      setSuccessMessageAddCourse(`Cours "${newCourseTitle}" ajouté avec succès.`);

      setCourses(data.courses);
      setClasses(data.classes);
      setNewCourseTitle('');
      setNewCourseDescription('');
      setNewCourseClasse('');
    } else {
      setErrorAddCourse('Échec de l\'ajout du cours.');
      setWarningAddCourse('');
      setSuccessMessageAddCourse('');
    }
  };

  const handleAddClasse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClasse) {
      setErrorAddClasse('Entrez le nom de la nouvelle classe !');
      setWarningAddClasse(''); // Reset warning
      setSuccessMessageAddClasse('');
      return;
    }

    const res = await fetch('/api/addclasse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newClasse,
      }),
    });

    const data = await res.json();
    if (res.status === 200) {
      setClasses(data.classes);
      setNewClasse('');
      setErrorAddClasse('');
      setWarningAddClasse(''); // Reset warning
      setSuccessMessageAddClasse(`Classe "${newClasse}" ajoutée avec succès.`);
    } else if (res.status === 400) {
      setErrorAddClasse('');
      setWarningAddClasse(data.warning);
      setSuccessMessageAddClasse(''); // Reset success message
    } else {
      setErrorAddClasse('Échec de l\'ajout de la classe.');
      setWarningAddClasse(''); // Reset warning
      setSuccessMessageAddClasse(''); // Reset success message
    }
  };

  return (
    <>
    <Card title='Ajouter une nouvelle activité' defaultExpanded={true} className="p-4">
      <form onSubmit={handleAddFile} className="space-y-6">
        <div className="space-y-2">
          <Select value={selectedClassFilter} onValueChange={setSelectedClassFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une classe" />
            </SelectTrigger>
            <SelectContent>
              {classes && classes.map((classe) => (
                <SelectItem key={classe.id} value={classe.id}>
                  {classe.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
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
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom de l&apos;activité</label>
          <Input
            type="text"
            value={ActivityTitle}
            onChange={(e) => setActivityTitle(e.target.value)}
            placeholder="Entrez le nom de l'activité"
          />
        </div>
        <div className="space-y-2">
          <Input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        {warningAddFile && <WarningMessage message={warningAddFile} />}
        {errorAddFile && <ErrorMessage message={errorAddFile} />}
        {successMessageAddFile && <SuccessMessage message={successMessageAddFile} />}
        <Button type="submit" className="w-full">
          Télécharger
        </Button>
      </form>
      </Card>

      <Card title='Ajouter un nouveau cours' defaultExpanded={true} className="p-4 mt-4">
      <form onSubmit={handleAddCourse} className="space-y-6 mt-8">
        <div className="space-y-2">
          <Input
            type="text"
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
            placeholder="Entrez le titre du cours"
          />
          <Input
            type="text"
            value={newCourseDescription}
            onChange={(e) => setNewCourseDescription(e.target.value)}
            placeholder="Entrez la description du cours"
          />
          <Select value={newCourseClasse} onValueChange={setNewCourseClasse}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une classe" />
            </SelectTrigger>
            <SelectContent>
              {classes && Array.isArray(classes) ? (
                [...classes]
                  .sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10))
                  .map((classe) => (
                    <SelectItem key={classe.id} value={classe.name}>
                      {classe.name}
                    </SelectItem>
                  ))
              ) : (
                <SelectItem value="loading" disabled>
                  Chargement des classes...
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        {warningAddCourse && <WarningMessage message={warningAddCourse} />}
        {errorAddCourse && <ErrorMessage message={errorAddCourse} />}
        {successMessageAddCourse && <SuccessMessage message={successMessageAddCourse} />}
        <Button type="submit" className="w-full">
          Ajouter le cours
        </Button>
      </form>
      </Card>
      <Card className="p-6 mt-4" defaultExpanded={false}  title='Ajouter une nouvelle classe'>
      <form onSubmit={handleAddClasse} className="space-y-6 mt-8">
        <div className="space-y-2">
          <Input
            type="text"
            value={newClasse}
            onChange={(e) => setNewClasse(e.target.value)}
            placeholder="Entrez le nom de la nouvelle classe"
          />
        </div>
        {warningAddClasse && <WarningMessage message={warningAddClasse} />}
        {successMessageAddClasse && <SuccessMessage message={successMessageAddClasse} />}
        {errorAddClasse && <ErrorMessage message={errorAddClasse} />}
        <Button type="submit" className="w-full">
          Ajouter la classe
        </Button>
      </form>
    </Card>
    </>
  );
}