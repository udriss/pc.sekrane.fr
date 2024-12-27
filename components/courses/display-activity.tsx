"use client";

import React, { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Course } from "@/lib/data";
import { ActivityList } from "@/components/courses/activity-list";
import ActivityHeader from "@/components/courses/activity-header";

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [selectedFileLeft, setSelectedFileLeft] = useState<string | null>(null);
  const [selectedFileRight, setSelectedFileRight] = useState<string | null>(null);
  const [showSideBySide, setShowSideBySide] = useState<boolean>(false);
  const [lastClickedType, setLastClickedType] = useState<string | null>(null); // Store last clicked type

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
          if (data && data.course) {
            setCourse(data.course);
          } else {
            console.error("Invalid course data:", data);
          }
        }
      }
    }
    fetchCourse();
  }, [courseId]);

  const handleSelectActivity = (fileUrl: string, type: string) => {
    if (type === 'ipynb') {
      setSelectedFileRight(fileUrl);
    } else {
      setSelectedFileLeft(fileUrl);
    }
    setLastClickedType(type);
  };

  const handleToggleSideBySide = (show: boolean) => {
    setShowSideBySide(show);
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col w-full max-w-[1400px] mx-auto">
      <div>
        <ActivityHeader title={course.title} description={course.description} />
      </div>

      <div className="grid grid-cols-4">
      <div className="flex flex-row p-4 col-span-3">
        <ActivityList 
          activities={course.activities} 
          onSelectActivity={handleSelectActivity} 
          onToggleSideBySide={handleToggleSideBySide} 
        />
      </div>


      <div className="flex flex-row col-span-1 justify-center items-center">
        <label className="checkboxSwitch">
          <input
            type="checkbox"
            checked={showSideBySide}
            onChange={(e) => setShowSideBySide(e.target.checked)}
          />
          <span className="checkboxSlider"></span>
        </label>
      </div>
      </div>     
      <div className="mt-8 flex justify-center" style={{ height: '700px', width: '100%', overflowY: 'scroll' }}>
        <div style={{ width: showSideBySide ? '50%' : !showSideBySide && lastClickedType !== 'ipynb' && selectedFileLeft ? '100%' : '0%', height: '100%', display: selectedFileLeft && (showSideBySide || lastClickedType !== 'ipynb') ? 'block' : 'none' }}>
          {selectedFileLeft && (
            <iframe src={selectedFileLeft} style={{ width: '100%', height: '100%' }} frameBorder="0"></iframe>
          )}
        </div>
        <div style={{ width: showSideBySide ? '50%' : !showSideBySide && lastClickedType === 'ipynb' && selectedFileRight ? '100%' : '0%', height: '100%', display: selectedFileRight && (showSideBySide || lastClickedType === 'ipynb') ? 'block' : 'none' }}>
          {selectedFileRight && (
            <iframe src={selectedFileRight} style={{ width: '100%', height: '100%' }} frameBorder="0"></iframe>
          )}
        </div>
      </div>
    </div>
  );
}

