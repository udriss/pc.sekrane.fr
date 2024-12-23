"use client";

import { useState } from "react";
import { Course } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface UploadFormProps {
  courses: Course[];
}

export function UploadForm({ courses }: UploadFormProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [newCourseTitle, setNewCourseTitle] = useState<string>("");
  const [newCourseDescription, setNewCourseDescription] = useState<string>("");
  const [courseToDelete, setCourseToDelete] = useState<string>("");
  const [deleteFiles, setDeleteFiles] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !file) {
      setError("Veuillez sélectionner un cours et un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("courseId", selectedCourse);
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Fichier téléchargé avec succès.");
    } else {
      setError("Échec du téléchargement du fichier.");
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle) {
      setError("Veuillez entrer un titre de cours.");
      return;
    }

    const res = await fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newCourseTitle,
        description: newCourseDescription,
      }),
    });

    if (res.ok) {
      alert("Cours ajouté avec succès.");
    } else {
      setError("Échec de l'ajout du cours.");
    }
  };

  const handleDeleteCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseToDelete) {
      setError("Veuillez sélectionner un cours à supprimer.");
      return;
    }

    const res = await fetch(`/api/courses/${courseToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deleteFiles,
      }),
    });

    if (res.ok) {
      alert("Cours supprimé avec succès.");
    } else {
      setError("Échec de la suppression du cours.");
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
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Sélectionner un fichier</label>
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={!selectedCourse || !file} className="w-full">
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
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={!newCourseTitle} className="w-full">
          Ajouter le cours
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
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Supprimer les fichiers associés</label>
          <Input
            type="checkbox"
            checked={deleteFiles}
            onChange={(e) => setDeleteFiles(e.target.checked)}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={!courseToDelete} className="w-full">
          Supprimer le cours
        </Button>
      </form>
    </Card>
  );
}