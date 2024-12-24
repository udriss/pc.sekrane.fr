import { Course } from "@/lib/data";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface UploadFormProps {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
}

export function UploadForm({ courses, setCourses }: UploadFormProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [ActivityTitle, setActivityTitle] = useState<string>("");
  const [newCourseTitle, setNewCourseTitle] = useState<string>("");
  const [newCourseDescription, setNewCourseDescription] = useState<string>("");
  const [courseToDelete, setCourseToDelete] = useState<string>("");
  const [deleteFiles, setDeleteFiles] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessageAddFile, setSuccessMessageAddFile] = useState<string>("");
  const [successMessageAddCourse, setSuccessMessageAddCourse] = useState<string>("");
  const [successMessageDeleteCourse, setSuccessMessageDeleteCourse] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !file || !ActivityTitle) {
      setError("Veuillez sélectionner un cours, un fichier et entrer le nom de l'activité.");
      return;
    }

    const formData = new FormData();
    formData.append("courseId", selectedCourse);
    formData.append("file", file);
    formData.append("ActivityTitle", ActivityTitle);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setSuccessMessageAddFile("Fichier téléchargé avec succès.");
      const updatedCourses = courses.map(course =>
        course.id === selectedCourse ? { ...course, activities: [...course.activities, data.activity] } : course
      ) as Course[];
      setCourses(updatedCourses);
      setActivityTitle(""); // Reset activity name
      setFile(null); // Reset file input
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

    const res = await fetch("/api/addcourse", {
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
      const data = await res.json();
      setSuccessMessageAddCourse("Cours ajouté avec succès.");
      setCourses(data.courses);
      setNewCourseTitle("");
      setNewCourseDescription("");
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

    const res = await fetch(`/api/deletecourse/${courseToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deleteFiles,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setSuccessMessageDeleteCourse("Cours supprimé avec succès.");
      setCourses(data.courses);
    } else {
      setError("Erreur lors de la suppression du cours.");
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
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {successMessageAddFile && <p className="text-sm text-green-500">{successMessageAddFile}</p>}
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
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {successMessageAddCourse && <p className="text-sm text-green-500">{successMessageAddCourse}</p>}
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
              {courses && courses.map((course) => (
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
        {successMessageDeleteCourse && <p className="text-sm text-green-500">{successMessageDeleteCourse}</p>}
        <Button type="submit" disabled={!courseToDelete} className="w-full">
          Supprimer le cours
        </Button>
      </form>
    </Card>
  );
}