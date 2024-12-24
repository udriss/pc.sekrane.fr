"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Course } from "@/lib/data";
import { ActivityList } from "@/components/courses/activity-list";
import ActivityHeader from "@/components/courses/activity-header";

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    async function unwrapParams() {
      const unwrappedParams = await params;
      setCourseId(unwrappedParams.courseId);
    }
    unwrapParams();
  }, [params]);

  useEffect(() => {
    async function fetchCourse() {
      if (courseId) {
        const res = await fetch(`/api/courses/${courseId}`);
        if (res.status === 404) {
          notFound();
        } else {
          const data = await res.json();
          console.log("Fetched course data:", data.course); // Debugging line
          console.log("Course activities:", data.course.activities); // Debugging line
          setCourse(data.course);
        }
      }
    }
    fetchCourse();
  }, [courseId]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-[800px]">
        <ActivityHeader title={course.title} description={course.description} />
      </div>
      <div className="flex flex-col items-center justify-center">
        <ActivityList activities={course.activities} />
      </div>
      <div className="flex-grow flex justify-center items-start w-full">
        <div className="min-w-[800px]">
          <div className="mt-8">
            <label htmlFor="fileSelect" className="block mb-2">Choisir un fichier à prévisualiser</label>
            <select
              id="fileSelect"
              className="block w-full p-2 border rounded"
              onChange={(e) => {
                setSelectedFile(e.target.value);
              }}
            >
              <option value="">-- Sélectionner un fichier --</option>
              {course.activities && course.activities.map((activity) => (
                <option key={activity.pdfUrl} value={activity.pdfUrl}>{activity.title}</option>
              ))}
            </select>
          </div>
          {selectedFile && (
            <div className="mt-8 flex justify-center" style={{ height: '700px', width: '100%', overflowY: 'scroll' }}>
              <iframe
                src={selectedFile}
                style={{ width: '100%', height: '100%' }}
                frameBorder="0"
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}