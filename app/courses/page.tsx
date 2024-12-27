"use client";

import { useState, useEffect } from "react";
import { CourseCard } from "@/components/courses/course-card";
import { Course, courses as initialCourses } from "@/lib/data";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedClasse, setSelectedClasse] = useState<string>("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch("/api/courses");
    const data = await res.json();
    setCourses(data.courses);
  };

  const classes = Array.from(new Set(initialCourses.map(course => course.classe)));

  const filteredCourses = selectedClasse
    ? courses.filter(course => course.classe === selectedClasse)
    : [];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Cours disponibles</h1>
      <div className="mb-4">
        <Select value={selectedClasse} onValueChange={setSelectedClasse}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une classe" />
          </SelectTrigger>
          <SelectContent>
            {classes.map(classe => (
              <SelectItem key={classe} value={classe}>
                {classe}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard key={`course-${course.id}`} course={course} />
        ))}
      </div>
    </div>
  );
}