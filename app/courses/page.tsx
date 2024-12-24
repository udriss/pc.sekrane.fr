"use client";

import { useState, useEffect } from "react";
import { CourseCard } from "@/components/course-card";
import { Course } from "@/lib/data";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch("/api/courses");
    const data = await res.json();
    setCourses(data.courses);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Cours disponibles</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={`course-${course.id}`} course={course} />
        ))}
      </div>
    </div>
  );
}