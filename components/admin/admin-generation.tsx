import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
  const [successMessageAddFile, setSuccessMessageAddFile] = useState<string>('');
  const [successMessageAddFileName, setSuccessMessageAddFileName] = useState<string>('');
  const [successMessageAddCourse, setSuccessMessageAddCourse] = useState<string>('');
  const [successMessageAddClasse, setSuccessMessageAddClasse] = useState<string>('');
  const [warningAddClasse, setWarningAddClasse] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !file || !ActivityTitle) {
      setErrorAddFile('Sélectionnez un cours, un fichier et entrer le nom de l\'activité !');
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
      setSuccessMessageAddFileName(`${data.fileName}`);
      setSuccessMessageAddFile(`Fichier téléchargé avec succès avec le nom : `);
      const updatedCourses = courses.map(course =>
        course.id === selectedCourse ? { ...course, activities: [...course.activities, data.activity] } : course
      ) as Course[];
      setCourses(updatedCourses);
      resetForm(); // Reset form after successful upload
    } else {
      setErrorAddFile('Échec du téléchargement du fichier.');
      setSuccessMessageAddFile(''); // Reset success message
    }
  };

  const resetForm = () => {
    setSelectedCourse('');
    setActivityTitle('');
    setFile(null);
    setErrorAddFile('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseClasse) {
      setErrorAddCourse('Entrez un titre de cours et sélectionnez une classe !');
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
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setSuccessMessageAddCourse('Cours ajouté avec succès.');
      setCourses(data.courses);
      setNewCourseTitle('');
      setNewCourseDescription('');
      setNewCourseClasse('');
    } else {
      setErrorAddCourse('Échec de l\'ajout du cours.');
    }
  };

  const handleAddClasse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClasse) {
      setErrorAddClasse('Entrez le nom de la nouvelle classe !');
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
      setSuccessMessageAddClasse('Classe ajoutée avec succès.');
      setClasses(data.classes);
      setNewClasse('');
      setWarningAddClasse(''); // Reset warning
    } else if (res.status === 400) {
      setWarningAddClasse(data.warning);
      setSuccessMessageAddClasse(''); // Reset success message
    } else {
      setErrorAddClasse('Échec de l\'ajout de la classe.');
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Sélectionner un cours</label>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
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
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom de l'activité</label>
          <Input
            type="text"
            value={ActivityTitle}
            onChange={(e) => setActivityTitle(e.target.value)}
            placeholder="Entrez le nom de l'activité"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Sélectionner un fichier</label>
          <Input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        {errorAddFile && <ErrorMessage message={errorAddFile} />}
        {successMessageAddFile && 
        <> 
        <SuccessMessage message={successMessageAddFile} />
        <span className="text-sm text-green-500">{successMessageAddFileName}</span>
        </>}
        <Button type="submit" disabled={!selectedCourse || !file || !ActivityTitle} className="w-full">
          Télécharger
        </Button>
      </form>

      <form onSubmit={handleAddCourse} className="space-y-6 mt-8">
        <div className="space-y-2">
          <label className="text-sm font-medium">Ajouter un nouveau cours</label>
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
              {classes
              .slice() // Crée une copie du tableau pour éviter de muter l'original
              .sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10)) // Trie les classes par ID
              .map((classe) => (
                <SelectItem key={classe.id} value={classe.name}>
                  {classe.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errorAddCourse && <ErrorMessage message={errorAddCourse} />}
        {successMessageAddCourse && <SuccessMessage message={successMessageAddCourse} />}
        <Button type="submit" className="w-full">
          Ajouter le cours
        </Button>
      </form>

      <form onSubmit={handleAddClasse} className="space-y-6 mt-8">
        <div className="space-y-2">
          <label className="text-sm font-medium">Ajouter une nouvelle classe</label>
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
  );
}